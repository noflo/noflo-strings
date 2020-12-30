describe('Base64Encode component', () => {
  let c = null;
  let ins = null;
  let out = null;

  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Base64Encode')
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

  describe('when instantiated', () => {
    it('should have an input port', () => chai.expect(c.inPorts.in).to.be.an('object'));
    it('should have an output port', () => chai.expect(c.outPorts.out).to.be.an('object'));
  });

  describe('encoding', () => {
    it('test encoding a string', (done) => {
      const packets = ['SGVsbG8sIFdvcmxkIQ=='];

      out.on('data', (data) => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', () => {
        chai.expect(packets.length).to.equal(0);
        done();
      });

      ins.connect();
      ins.send('Hello, World!');
      ins.disconnect();
    });

    it('test encoding set of strings', (done) => {
      const packets = ['SGVsbG8sIFdvcmxkIQ=='];

      out.on('data', (data) => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', () => {
        chai.expect(packets.length).to.equal(0);
        done();
      });

      ins.connect();
      ins.beginGroup('stream');
      ins.send('Hello, ');
      ins.send('World');
      ins.send('!');
      ins.endGroup();
      ins.disconnect();
    });

    it('test encoding a buffer', (done) => {
      if (noflo.isBrowser()) {
        done();
        return;
      }
      const packets = ['SGVsbG8sIFdvcmxkIQ=='];

      out.on('data', (data) => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', () => {
        chai.expect(packets.length).to.equal(0);
        done();
      });

      ins.connect();
      ins.send(Buffer.from('Hello, World!'));
      ins.disconnect();
    });
  });
});
