describe('EscapeQuotes component', () => {
  let c = null;
  let ins = null;
  let out = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/EscapeQuotes')
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

  describe('receiving a string without quotes', () => it('should send it as-is', (done) => {
    const packets = ['Hello World'];

    out.on('data', (data) => chai.expect(packets.shift()).to.equal(data));
    out.on('disconnect', () => {
      chai.expect(packets.length).to.equal(0);
      done();
    });

    ins.connect();
    ins.send('Hello World');
    ins.disconnect();
  }));

  describe('escaping quotes in a string', () => it('should send the expected value', (done) => {
    const packets = ['Hello \\"World\\"'];

    out.on('data', (data) => chai.expect(packets.shift()).to.equal(data));
    out.on('disconnect', () => {
      chai.expect(packets.length).to.equal(0);
      done();
    });

    ins.connect();
    ins.send('Hello "World"');
    ins.disconnect();
  }));
});
