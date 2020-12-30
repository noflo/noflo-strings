/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('ParseFloat component', () => {
  let c = null;
  let ins = null;
  let out = null;
  before(function (done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/ParseFloat', (err, instance) => {
      if (err) { return done(err); }
      c = instance;
      ins = noflo.internalSocket.createSocket();
      c.inPorts.in.attach(ins);
      return done();
    });
  });
  beforeEach(() => {
    out = noflo.internalSocket.createSocket();
    return c.outPorts.out.attach(out);
  });
  afterEach(() => {
    c.outPorts.out.detach(out);
    return out = null;
  });

  describe('with 42px', () => it('should return 42', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal(42);
      return done();
    });
    ins.send('42px');
    return ins.disconnect();
  }));
  describe('with "0.12345"', () => it('should return 0.12345', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal(0.12345);
      return done();
    });
    ins.send('0.12345');
    return ins.disconnect();
  }));
  return describe('with qgpowqpo', () => it('should return NaN', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.eql(NaN);
      return done();
    });
    ins.send('qgpowqpo');
    return ins.disconnect();
  }));
});
