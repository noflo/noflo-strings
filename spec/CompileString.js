describe('CompileString component', () => {
  let c = null;
  let ins = null;
  let delim = null;
  let out = null;

  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/CompileString')
      .then((instance) => {
        c = instance;
        ins = noflo.internalSocket.createSocket();
        delim = noflo.internalSocket.createSocket();
        c.inPorts.in.attach(ins);
        c.inPorts.delimiter.attach(delim);
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
    it('should have an input port', () => {
      chai.expect(c.inPorts.in).to.be.an('object');
      chai.expect(c.inPorts.delimiter).to.be.an('object');
    });
    it('should have an output port', () => chai.expect(c.outPorts.out).to.be.an('object'));
  });

  describe('compiling a string', () => {
    it('single string should be returned as-is', (done) => {
      const packets = ['foo'];

      out.on('data', (data) => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', () => {
        chai.expect(packets.length).to.equal(0);
        done();
      });

      ins.connect();
      ins.send('foo');
      ins.disconnect();
    });

    it('two strings should be returned together', (done) => {
      const packets = ['foobar'];

      out.on('data', (data) => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', () => {
        chai.expect(packets.length).to.equal(0);
        done();
      });

      delim.send('');

      ins.connect();
      ins.beginGroup(1);
      ins.send('foo');
      ins.send('bar');
      ins.endGroup();
      ins.disconnect();
    });

    it('delimiter should be between the strings', (done) => {
      const packets = ['foo-bar'];

      out.on('data', (data) => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', () => {
        chai.expect(packets.length).to.equal(0);
        done();
      });

      delim.send('-');

      ins.connect();
      ins.beginGroup(2);
      ins.send('foo');
      ins.send('bar');
      ins.endGroup();
      ins.disconnect();
    });
  });
});
