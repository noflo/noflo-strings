/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('ParseJson component', function() {
  let c = null;
  let ins = null;
  let out = null;
  let err = null;
  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/ParseJson', function(err, instance) {
      if (err) { return done(err); }
      c = instance;
      ins = noflo.internalSocket.createSocket();
      c.inPorts.in.attach(ins);
      return done();
    });
  });
  beforeEach(function() {
    out = noflo.internalSocket.createSocket();
    c.outPorts.out.attach(out);
    err = noflo.internalSocket.createSocket();
    return c.outPorts.error.attach(err);
  });
  afterEach(function() {
    c.outPorts.out.detach(out);
    out = null;
    c.outPorts.error.detach(err);
    return err = null;
  });

  describe('with valid JSON object', () => it('should parse it', function(done) {
    const fixture = {
      hello: 'World',
      foo: [1, 2]
    };

    out.on('data', function(data) {
      chai.expect(data).to.eql(fixture);
      return done();
    });

    ins.send(JSON.stringify(fixture));
    return ins.disconnect();
  }));

  return describe('with invalid JSON', () => it('should produce an error', function(done) {
    err.on('data', function(data) {
      chai.expect(data).to.be.an('error');
      return done();
    });

    ins.send('{"foo":1}}');
    return ins.disconnect();
  }));
});
