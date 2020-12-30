/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('Quote component', function() {
  let c = null;
  let ins = null;
  let out = null;
  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Quote', function(err, instance) {
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
  afterEach(() => c.outPorts.out.detach(out));

  return describe('receiving a string', () => it('should quote it', function(done) {

    out.on('data', function(data) {
      chai.expect(data).to.equal('\'Hello, World!\'');
      return done();
    });

    ins.connect();
    ins.send('Hello, World!');
    return ins.disconnect();
  }));
});
