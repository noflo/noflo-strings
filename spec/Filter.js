/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('Filter component', function() {
  let c = null;
  let pattern = null;
  let ins = null;
  let out = null;
  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Filter', function(err, instance) {
      if (err) { return done(err); }
      c = instance;
      pattern = noflo.internalSocket.createSocket();
      ins = noflo.internalSocket.createSocket();
      c.inPorts.pattern.attach(pattern);
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

  return describe('with a given pattern', () => it('should only send unfiltered data IPs', function(done) {
    const expected = [
      'abc',
      'a24c'
    ];
    out.on('data', function(data) {
      chai.expect(data).to.eql(expected.shift());
      if (expected.length) { return; }
      return done();
    });
    pattern.send('a.+c');
    ins.send('abc');
    ins.send('125c');
    ins.send('a24c');
    return ins.disconnect();
  }));
});
