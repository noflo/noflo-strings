/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('SendString component', () => {
  let c = null;
  let ins = null;
  let string = null;
  let out = null;
  before(function (done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/SendString', (err, instance) => {
      if (err) { return done(err); }
      c = instance;
      ins = noflo.internalSocket.createSocket();
      c.inPorts.in.attach(ins);
      string = noflo.internalSocket.createSocket();
      c.inPorts.string.attach(string);
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

  return describe('when receiving a bang', () => it('should send the string out with banged brackets', (done) => {
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
      return done();
    });

    string.send('Hello There');
    ins.connect();
    ins.beginGroup('a');
    ins.send(true);
    ins.endGroup();
    return ins.disconnect();
  }));
});
