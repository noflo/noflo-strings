/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('ParseInt component', function() {
  let c = null;
  let base = null;
  let ins = null;
  let out = null;
  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/ParseInt', function(err, instance) {
      if (err) { return done(err); }
      c = instance;
      base = noflo.internalSocket.createSocket();
      ins = noflo.internalSocket.createSocket();
      c.inPorts.base.attach(base);
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

  describe('with 42px', () => it('should return 42', function(done) {
    out.on('data', function(data) {
      chai.expect(data).to.equal(42);
      return done();
    });
    return ins.send('42px');
  }));
  describe('with "0.12345"', () => it('should return 0', function(done) {
    out.on('data', function(data) {
      chai.expect(data).to.equal(0);
      return done();
    });
    return ins.send('0.12345');
  }));
  describe('with qgpowqpo', () => it('should return NaN', function(done) {
    out.on('data', function(data) {
      chai.expect(data).to.eql(NaN);
      return done();
    });
    return ins.send('qgpowqpo');
  }));
  describe('with "0x42" in base 16', () => it('should return 66', function(done) {
    out.on('data', function(data) {
      chai.expect(data).to.eql(66);
      return done();
    });
    base.send(16);
    return ins.send('0x42');
  }));
  return describe('with "11" in base 16', () => it('should return 17', function(done) {
    out.on('data', function(data) {
      chai.expect(data).to.eql(17);
      return done();
    });
    base.send(16);
    return ins.send('11');
  }));
});
