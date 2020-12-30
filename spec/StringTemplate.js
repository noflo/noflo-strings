describe('StringTemplate component', () => {
  let c = null;
  let template = null;
  let ins = null;
  let out = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/StringTemplate')
      .then((instance) => {
        c = instance;
        template = noflo.internalSocket.createSocket();
        ins = noflo.internalSocket.createSocket();
        c.inPorts.template.attach(template);
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

  describe('with a template', () => it('should return a string with the template applied', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal('Hello Foo');
      done();
    });
    template.send('Hello <%= name %>');
    ins.send({ name: 'Foo' });
  }));
});
