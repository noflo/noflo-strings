/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('SubStr component', function() {
  let c = null;
  let ins = null;
  let index = null;
  let limit = null;
  let out = null;
  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/SubStr', function(err, instance) {
      if (err) { return done(err); }
      c = instance;
      ins = noflo.internalSocket.createSocket();
      c.inPorts.in.attach(ins);
      index = noflo.internalSocket.createSocket();
      c.inPorts.index.attach(index);
      limit = noflo.internalSocket.createSocket();
      c.inPorts.limit.attach(limit);
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

  return describe('producing a substring', function() {
    it('should send string as-is by default', function(done) {
      out.on('data', function(data) {
        chai.expect(data).to.equal('Hello World');
        return done();
      });

      ins.send('Hello World');
      return ins.disconnect();
    });

    it('should make a substring by given index', function(done) {
      out.on('data', function(data) {
        chai.expect(data).to.equal('ello World');
        return done();
      });

      index.send(1);

      ins.send('Hello World');
      return ins.disconnect();
    });

    return it('should make a substring by given index and limit', function(done) {
      out.on('data', function(data) {
        chai.expect(data).to.equal('ello');
        return done();
      });

      index.send(1);
      limit.send(4);

      ins.send('Hello World');
      return ins.disconnect();
    });
  });
});
