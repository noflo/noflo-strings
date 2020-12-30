describe('ParseJson component', () => {
  let c = null;
  let ins = null;
  let out = null;
  let err = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/ParseJson')
      .then((instance) => {
        c = instance;
        ins = noflo.internalSocket.createSocket();
        c.inPorts.in.attach(ins);
      });
  });
  beforeEach(() => {
    out = noflo.internalSocket.createSocket();
    c.outPorts.out.attach(out);
    err = noflo.internalSocket.createSocket();
    c.outPorts.error.attach(err);
  });
  afterEach(() => {
    c.outPorts.out.detach(out);
    out = null;
    c.outPorts.error.detach(err);
    err = null;
  });

  describe('with valid JSON object', () => it('should parse it', (done) => {
    const fixture = {
      hello: 'World',
      foo: [1, 2],
    };

    out.on('data', (data) => {
      chai.expect(data).to.eql(fixture);
      done();
    });

    ins.send(JSON.stringify(fixture));
    ins.disconnect();
  }));

  describe('with invalid JSON', () => it('should produce an error', (done) => {
    err.on('data', (data) => {
      chai.expect(data).to.be.an('error');
      done();
    });

    ins.send('{"foo":1}}');
    ins.disconnect();
  }));
});
