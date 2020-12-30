/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('StringTemplate component', () => {
  let c = null;
  let template = null;
  let ins = null;
  let out = null;
  before(function (done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/StringTemplate', (err, instance) => {
      if (err) { return done(err); }
      c = instance;
      template = noflo.internalSocket.createSocket();
      ins = noflo.internalSocket.createSocket();
      c.inPorts.template.attach(template);
      c.inPorts.in.attach(ins);
      return done();
    });
  });
  beforeEach(() => {
    out = noflo.internalSocket.createSocket();
    return c.outPorts.out.attach(out);
  });
  afterEach(() => {
    c.outPorts.out.detach(out);
    return out = null;
  });

  return describe('with a template', () => it('should return a string with the template applied', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal('Hello Foo');
      return done();
    });
    template.send('Hello <%= name %>');
    return ins.send({ name: 'Foo' });
  }));
});
