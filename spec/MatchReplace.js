/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('MatchReplace component', () => {
  let c = null;
  let match = null;
  let ins = null;
  let out = null;
  before(function (done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/MatchReplace', (err, instance) => {
      if (err) { return done(err); }
      c = instance;
      match = noflo.internalSocket.createSocket();
      ins = noflo.internalSocket.createSocket();
      c.inPorts.match.attach(match);
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

  return describe('with a given rule', () => it('should provide an array containing potential matches', (done) => {
    const expected = [
      'b4',
      'c5',
    ];
    out.on('data', (data) => {
      chai.expect(data).to.eql(expected.shift());
      if (expected.length) { return; }
      return done();
    });
    match.send({
      a1: 'a2',
      b3: 'b4',
    });
    ins.send('b3');
    ins.send('c5');
    return ins.disconnect();
  }));
});
