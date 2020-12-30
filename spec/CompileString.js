/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('CompileString component', function() {
  let c = null;
  let ins = null;
  let delim = null;
  let out = null;

  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/CompileString', function(err, instance) {
      if (err) { return done(err); }
      c = instance;
      ins = noflo.internalSocket.createSocket();
      delim = noflo.internalSocket.createSocket();
      c.inPorts.in.attach(ins);
      c.inPorts.delimiter.attach(delim);
      return done();
    });
  });

  beforeEach(function() {
    out = noflo.internalSocket.createSocket();
    return c.outPorts.out.attach(out);
  });
  afterEach(function() {
    c.outPorts.out.detach(out);
    return out = null;
  });

  describe('when instantiated', function() {
    it('should have an input port', function() {
      chai.expect(c.inPorts.in).to.be.an('object');
      return chai.expect(c.inPorts.delimiter).to.be.an('object');
    });
    return it('should have an output port', () => chai.expect(c.outPorts.out).to.be.an('object'));
  });

  return describe('compiling a string', function() {
    it('single string should be returned as-is', function(done) {
      const packets = ['foo'];

      out.on('data', data => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', function() {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      ins.connect();
      ins.send('foo');
      return ins.disconnect();
    });

    it('two strings should be returned together', function(done) {
      const packets = ['foobar'];

      out.on('data', data => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', function() {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      delim.send('');

      ins.connect();
      ins.beginGroup(1);
      ins.send('foo');
      ins.send('bar');
      ins.endGroup();
      return ins.disconnect();
    });

    return it('delimiter should be between the strings', function(done) {
      const packets = ['foo-bar'];

      out.on('data', data => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', function() {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      delim.send('-');

      ins.connect();
      ins.beginGroup(2);
      ins.send('foo');
      ins.send('bar');
      ins.endGroup();
      return ins.disconnect();
    });
  });
});
