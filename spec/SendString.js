describe('SendString component', () => {
  let c = null;
  let ins = null;
  let string = null;
  let out = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/SendString')
      .then((instance) => {
        c = instance;
        ins = noflo.internalSocket.createSocket();
        c.inPorts.in.attach(ins);
        string = noflo.internalSocket.createSocket();
        c.inPorts.string.attach(string);
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

  describe('when receiving a bang', () => it('should send the string out with banged brackets', (done) => {
    const expected = [
      '< a',
      'DATA Hello There',
      '>',
    ];
    const received = [];

    out.on('begingroup', (group) => received.push(`< ${group}`));
    out.on('data', (data) => received.push(`DATA ${data}`));
    out.on('endgroup', () => received.push('>'));
    out.on('disconnect', () => {
      chai.expect(received).to.eql(expected);
      done();
    });

    string.send('Hello There');
    ins.connect();
    ins.beginGroup('a');
    ins.send(true);
    ins.endGroup();
    ins.disconnect();
  }));
});
