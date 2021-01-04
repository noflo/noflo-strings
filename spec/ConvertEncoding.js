describe('ConvertEncoding component', () => {
  let c = null;
  let from = null;
  let to = null;
  let ins = null;
  let out = null;
  before(function () {
    if (noflo.isBrowser()) {
      this.skip();
      return Promise.resolve();
    }
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/ConvertEncoding')
      .then((instance) => {
        c = instance;
        from = noflo.internalSocket.createSocket();
        to = noflo.internalSocket.createSocket();
        ins = noflo.internalSocket.createSocket();
        c.inPorts.from.attach(from);
        c.inPorts.to.attach(to);
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

  describe('converting UTF-8 to Base64', () => it('should send the expected value', (done) => {
    const packets = ['SGVsbG8sIFdvcmxkIQ=='];

    out.on('data', (data) => chai.expect(packets.shift()).to.equal(data));
    out.on('disconnect', () => {
      chai.expect(packets.length).to.equal(0);
      done();
    });

    from.send('utf8');
    to.send('base64');
    ins.connect();
    ins.send('Hello, World!');
    ins.disconnect();
  }));

  describe('converting Base64 to UTF-8', () => it('should send the expected value', (done) => {
    const packets = ['Hello, World!'];

    out.on('data', (data) => chai.expect(packets.shift()).to.equal(data));
    out.on('disconnect', () => {
      chai.expect(packets.length).to.equal(0);
      done();
    });

    from.send('base64');
    to.send('utf8');
    ins.connect();
    ins.send('SGVsbG8sIFdvcmxkIQ==');
    ins.disconnect();
  }));
});
