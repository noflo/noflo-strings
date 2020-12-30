describe('Quote component', () => {
  let c = null;
  let ins = null;
  let out = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Quote')
      .then((instance) => {
        c = instance;
        ins = noflo.internalSocket.createSocket();
        c.inPorts.in.attach(ins);
      });
  });
  beforeEach(() => {
    out = noflo.internalSocket.createSocket();
    c.outPorts.out.attach(out);
  });
  afterEach(() => c.outPorts.out.detach(out));

  describe('receiving a string', () => it('should quote it', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal('\'Hello, World!\'');
      done();
    });

    ins.connect();
    ins.send('Hello, World!');
    ins.disconnect();
  }));
});
