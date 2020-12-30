describe('TemplateReplace component', () => {
  let c = null;
  let template = null;
  let token = null;
  let ins = null;
  let out = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/TemplateReplace')
      .then((instance) => {
        c = instance;
        template = noflo.internalSocket.createSocket();
        token = noflo.internalSocket.createSocket();
        ins = noflo.internalSocket.createSocket();
        c.inPorts.template.attach(template);
        c.inPorts.token.attach(token);
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

  describe('with an object containing patterns and replacements', () => it('should return a templated string', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal('I am a happy person.');
      done();
    });
    template.send('I am a &adjective &noun.');
    ins.send({
      '&adjective': 'happy',
      '&noun': 'person',
    });
    ins.disconnect();
  }));

  describe('with a series of tokens', () => it('should return a templated string', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal('I am a happy person.');
      done();
    });
    template.send('I am a &adjective &noun.');
    token.connect();
    token.send('&adjective');
    token.send('&noun');
    token.disconnect();
    ins.connect();
    ins.send('happy');
    ins.send('person');
    ins.disconnect();
  }));
});
