/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('Sift3Distance component', () => {
  let c = null;
  let string1 = null;
  let string2 = null;
  let out = null;
  before(function (done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Sift3Distance', (err, instance) => {
      if (err) { return done(err); }
      c = instance;
      string1 = noflo.internalSocket.createSocket();
      string2 = noflo.internalSocket.createSocket();
      c.inPorts.string1.attach(string1);
      c.inPorts.string2.attach(string2);
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

  describe.skip('with blank string 1', () => it('should return distance 0', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal(0);
      return done();
    });
    string1.send('');
    return string2.send('Alpha BC');
  }));
  describe('with equal strings', () => it('should return distance 0', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal(0);
      return done();
    });
    string1.send('Cloud Monkey, Hippy');
    return string2.send('Cloud Monkey, Hippy');
  }));
  describe('with ABC and ACC', () => it('should return distance 2', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal(2);
      return done();
    });
    string1.send('ABC');
    return string2.send('ACC');
  }));
  return describe.skip('with Singapore and Singaporea', () => it('should return distance 1.5', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.equal(1.5);
      return done();
    });
    string1.send('Singapore');
    return string2.send('Singaporea');
  }));
});
