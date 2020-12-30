/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('Base64Encode component', () => {
  let c = null;
  let ins = null;
  let out = null;

  before(function (done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Base64Encode', (err, instance) => {
      if (err) { return done(err); }
      c = instance;
      ins = noflo.internalSocket.createSocket();
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

  describe('when instantiated', () => {
    it('should have an input port', () => chai.expect(c.inPorts.in).to.be.an('object'));
    return it('should have an output port', () => chai.expect(c.outPorts.out).to.be.an('object'));
  });

  return describe('encoding', () => {
    it('test encoding a string', (done) => {
      const packets = ['SGVsbG8sIFdvcmxkIQ=='];

      out.on('data', (data) => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', () => {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      ins.connect();
      ins.send('Hello, World!');
      return ins.disconnect();
    });

    it('test encoding set of strings', (done) => {
      const packets = ['SGVsbG8sIFdvcmxkIQ=='];

      out.on('data', (data) => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', () => {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      ins.connect();
      ins.beginGroup('stream');
      ins.send('Hello, ');
      ins.send('World');
      ins.send('!');
      ins.endGroup();
      return ins.disconnect();
    });

    return it('test encoding a buffer', (done) => {
      if (noflo.isBrowser()) { return done(); }
      const packets = ['SGVsbG8sIFdvcmxkIQ=='];

      out.on('data', (data) => chai.expect(packets.shift()).to.deep.equal(data));
      out.on('disconnect', () => {
        chai.expect(packets.length).to.equal(0);
        return done();
      });

      ins.connect();
      ins.send(new Buffer('Hello, World!'));
      return ins.disconnect();
    });
  });
});
