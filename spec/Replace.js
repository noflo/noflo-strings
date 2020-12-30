/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('Replace component', function() {
  let loader = null;
  let c = null;
  let ins = null;
  let pattern = null;
  let replacement = null;
  let out = null;

  before(() => loader = new noflo.ComponentLoader(baseDir));
  beforeEach(function(done) {
    this.timeout(4000);
    return loader.load('strings/Replace', function(err, instance) {
      if (err) { return done(err); }
      c = instance;
      ins = noflo.internalSocket.createSocket();
      pattern = noflo.internalSocket.createSocket();
      replacement = noflo.internalSocket.createSocket();
      c.inPorts.in.attach(ins);
      c.inPorts.pattern.attach(pattern);
      c.inPorts.replacement.attach(replacement);
      out = noflo.internalSocket.createSocket();
      c.outPorts.out.attach(out);
      return done();
    });
  });
  afterEach(function() {
    c.outPorts.out.detach(out);
    return out = null;
  });

  describe('when instantiated', function() {
    it('should have an input port', function() {
      chai.expect(c.inPorts.in).to.be.an('object');
      chai.expect(c.inPorts.pattern).to.be.an('object');
      return chai.expect(c.inPorts.replacement).to.be.an('object');
    });
    return it('should have an output port', () => chai.expect(c.outPorts.out).to.be.an('object'));
  });

  return describe('replacement', function() {
    it('test no pattern no replacement', function(done) {
      const packets = ['abc123'];

      out.on('data', data => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', function() {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      ins.connect();
      ins.send('abc123');
      return ins.disconnect();
    });

    it('test no pattern', function(done) {
      const packets = ['abc123'];

      out.on('data', data => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', function() {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      replacement.send('foo');

      ins.connect();
      ins.send('abc123');
      return ins.disconnect();
    });

    it('test simple replacement', function(done) {
      const packets = ['xyz123'];

      out.on('data', data => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', function() {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      pattern.send('abc');
      replacement.send('xyz');

      ins.connect();
      ins.send('abc123');
      return ins.disconnect();
    });

    it('test simple replacement with slashes', function(done) {
      const packets = ["/abc/xyz/baz"];

      out.on('data', data => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', function() {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      pattern.send('/foo/bar/');
      replacement.send('/abc/xyz/');

      ins.connect();
      ins.send('/foo/bar/baz');
      return ins.disconnect();
    });

    it('test no replacement', function(done) {
      const packets = ['123'];

      out.on('data', data => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', function() {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      pattern.send('[a-z]');

      ins.connect();
      ins.send('abc123');
      return ins.disconnect();
    });

    it('test replacement', function(done) {
      const packets = ['xxx123'];

      out.on('data', data => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', function() {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      pattern.send('[a-z]');
      replacement.send('x');

      ins.connect();
      ins.send('abc123');
      return ins.disconnect();
    });

    return it('test groups', function(done) {
      const packets = ['g', 'xxx123'];

      out.on('begingroup', group => chai.expect(packets.shift()).to.deep.equal(group));
      out.on('data', data => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', function() {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      pattern.send('[a-z]');
      replacement.send('x');

      ins.connect();
      ins.beginGroup('g');
      ins.send('abc123');
      ins.endGroup();
      return ins.disconnect();
    });
  });
});
