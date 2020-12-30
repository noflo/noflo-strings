/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('EscapeQuotes component', function() {
  let c = null;
  let ins = null;
  let out = null;
  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/EscapeQuotes', function(err, instance) {
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

  describe('receiving a string without quotes', () => it('should send it as-is', function(done) {
    const packets = ['Hello World'];

    out.on('data', data => chai.expect(packets.shift()).to.equal(data));
    out.on('disconnect', function() {
      chai.expect(packets.length).to.equal(0);
      return done();
    });

    ins.connect();
    ins.send('Hello World');
    return ins.disconnect();
  }));

  return describe('escaping quotes in a string', () => it('should send the expected value', function(done) {
    const packets = ['Hello \\\"World\\\"'];

    out.on('data', data => chai.expect(packets.shift()).to.equal(data));
    out.on('disconnect', function() {
      chai.expect(packets.length).to.equal(0);
      return done();
    });

    ins.connect();
    ins.send('Hello "World"');
    return ins.disconnect();
  }));
});
