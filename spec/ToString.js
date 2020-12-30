/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('ToString component', function() {
  let c = null;
  let ins = null;
  let out = null;
  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/ToString', function(err, instance) {
      if (err) { return done(err); }
      c = instance;
      ins = noflo.internalSocket.createSocket();
      c.inPorts.in.attach(ins);
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

  return describe('converting an object to String', function() {
    it('should produce default for normal object', function(done) {
      out.on('data', function(data) {
        chai.expect(data).to.be.a('string');
        chai.expect(data).to.equal('[object Object]');
        return done();
      });

      ins.send({
        foo: 'Bar'});
      return ins.disconnect();
    });

    return it('should use custom toString method', function(done) {
      out.on('data', function(data) {
        chai.expect(data).to.be.a('string');
        chai.expect(data).to.equal('I am fancy object');
        return done();
      });

      ins.send({
        foo: 'Bar',
        toString() {
          return 'I am fancy object';
        }
      });
      return ins.disconnect();
    });
  });
});
