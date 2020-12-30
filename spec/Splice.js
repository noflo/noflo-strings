/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('Splice component', function() {
  let c = null;
  let assoc = null;
  let delim = null;
  let ins = null;
  let out = null;
  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Splice', function(err, instance) {
      if (err) { return done(err); }
      c = instance;
      assoc = noflo.internalSocket.createSocket();
      delim = noflo.internalSocket.createSocket();
      ins = noflo.internalSocket.createSocket();
      c.inPorts.assoc.attach(assoc);
      c.inPorts.delim.attach(delim);
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

  describe('interlacing two arrays of strings into a string', () => it('should return the correct string', function(done) {
    out.on('data', function(data) {
      chai.expect(data).to.equal('p:x,q:y,r:z');
      return done();
    });

    ins.send(['p','q','r']);
    return ins.send(['x','y','z']);
}));

  return describe('interlacing with custom associator and delimiter', () => it('should return the correct string', function(done) {
    out.on('data', function(data) {
      chai.expect(data).to.equal('p=x|q=y|r=z');
      return done();
    });

    assoc.send('=');
    delim.send('|');

    ins.send(['p','q','r']);
    return ins.send(['x','y','z']);
}));
});
