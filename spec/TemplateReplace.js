/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('TemplateReplace component', function() {
  let c = null;
  let template = null;
  let token = null;
  let ins = null;
  let out = null;
  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/TemplateReplace', function(err, instance) {
      if (err) { return done(err); }
      c = instance;
      template = noflo.internalSocket.createSocket();
      token = noflo.internalSocket.createSocket();
      ins = noflo.internalSocket.createSocket();
      c.inPorts.template.attach(template);
      c.inPorts.token.attach(token);
      c.inPorts.in.attach(ins);
      return done();
    });
  });
  beforeEach(function() {
    out = noflo.internalSocket.createSocket();
    return c.outPorts.out.attach(out);
  });
  afterEach(function() {
    c.outPorts.out.detach(out);
    return out = null;
  });

  describe('with an object containing patterns and replacements', () => it('should return a templated string', function(done) {
    out.on('data', function(data) {
      chai.expect(data).to.equal('I am a happy person.');
      return done();
    });
    template.send('I am a &adjective &noun.');
    ins.send({
      '&adjective': 'happy',
      '&noun': 'person'
    });
    return ins.disconnect();
  }));

  return describe('with a series of tokens', () => it('should return a templated string', function(done) {
    out.on('data', function(data) {
      chai.expect(data).to.equal('I am a happy person.');
      return done();
    });
    template.send('I am a &adjective &noun.');
    token.connect();
    token.send('&adjective');
    token.send('&noun');
    token.disconnect();
    ins.connect();
    ins.send('happy');
    ins.send('person');
    return ins.disconnect();
  }));
});
