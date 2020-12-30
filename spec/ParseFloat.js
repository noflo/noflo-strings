describe('ParseFloat component', () => {
  let c = null;
  let ins = null;
  let out = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/ParseFloat')
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
  afterEach(() => {
    c.outPorts.out.detach(out);
    out = null;
  });

  describe('with 42px', () => it('should return 42', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal(42);
      done();
    });
    ins.send('42px');
    ins.disconnect();
  }));
  describe('with "0.12345"', () => it('should return 0.12345', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal(0.12345);
      done();
    });
    ins.send('0.12345');
    ins.disconnect();
  }));
  describe('with qgpowqpo', () => it('should return NaN', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.eql(NaN);
      done();
    });
    ins.send('qgpowqpo');
    ins.disconnect();
  }));
});
