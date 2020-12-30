describe('Splice component', () => {
  let c = null;
  let assoc = null;
  let delim = null;
  let ins = null;
  let out = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Splice')
      .then((instance) => {
        c = instance;
        assoc = noflo.internalSocket.createSocket();
        delim = noflo.internalSocket.createSocket();
        ins = noflo.internalSocket.createSocket();
        c.inPorts.assoc.attach(assoc);
        c.inPorts.delim.attach(delim);
        c.inPorts.in.attach(ins);
      });
  });
  beforeEach(() => {
    out = noflo.internalSocket.createSocket();
    c.outPorts.out.attach(out);
  });
  afterEach(() => {
    c.outPorts.out.detach(out);
    out = null;
  });

  describe('interlacing two arrays of strings into a string', () => it('should return the correct string', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal('p:x,q:y,r:z');
      done();
    });

    ins.send(['p', 'q', 'r']);
    ins.send(['x', 'y', 'z']);
  }));

  describe('interlacing with custom associator and delimiter', () => it('should return the correct string', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal('p=x|q=y|r=z');
      done();
    });

    assoc.send('=');
    delim.send('|');

    ins.send(['p', 'q', 'r']);
    ins.send(['x', 'y', 'z']);
  }));
});
