describe('Filter component', () => {
  let c = null;
  let pattern = null;
  let ins = null;
  let out = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Filter')
      .then((instance) => {
        c = instance;
        pattern = noflo.internalSocket.createSocket();
        ins = noflo.internalSocket.createSocket();
        c.inPorts.pattern.attach(pattern);
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

  describe('with a given pattern', () => it('should only send unfiltered data IPs', (done) => {
    const expected = [
      'abc',
      'a24c',
    ];
    out.on('data', (data) => {
      chai.expect(data).to.eql(expected.shift());
      if (expected.length) { return; }
      done();
    });
    pattern.send('a.+c');
    ins.send('abc');
    ins.send('125c');
    ins.send('a24c');
    ins.disconnect();
  }));
});
