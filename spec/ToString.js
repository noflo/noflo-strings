describe('ToString component', () => {
  let c = null;
  let ins = null;
  let out = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/ToString')
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

  describe('converting an object to String', () => {
    it('should produce default for normal object', (done) => {
      out.on('data', (data) => {
        chai.expect(data).to.be.a('string');
        chai.expect(data).to.equal('[object Object]');
        done();
      });

      ins.send({ foo: 'Bar' });
      ins.disconnect();
    });

    it('should use custom toString method', (done) => {
      out.on('data', (data) => {
        chai.expect(data).to.be.a('string');
        chai.expect(data).to.equal('I am fancy object');
        done();
      });

      ins.send({
        foo: 'Bar',
        toString() {
          return 'I am fancy object';
        },
      });
      ins.disconnect();
    });
  });
});
