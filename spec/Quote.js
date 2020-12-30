/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('Quote component', () => {
  let c = null;
  let ins = null;
  let out = null;
  before(function (done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Quote', (err, instance) => {
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
  afterEach(() => c.outPorts.out.detach(out));

  return describe('receiving a string', () => it('should quote it', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal('\'Hello, World!\'');
      return done();
    });

    ins.connect();
    ins.send('Hello, World!');
    return ins.disconnect();
  }));
});
