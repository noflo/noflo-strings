describe('Jsonify component', () => {
  let c = null;
  let ins = null;
  let raw = null;
  let pretty = null;
  let out = null;
  before(function () {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Jsonify')
      .then((instance) => {
        c = instance;
        ins = noflo.internalSocket.createSocket();
        c.inPorts.in.attach(ins);
        raw = noflo.internalSocket.createSocket();
        c.inPorts.raw.attach(raw);
        pretty = noflo.internalSocket.createSocket();
        c.inPorts.pretty.attach(pretty);
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

  describe('JSONifying an object', () => {
    let fixture = null;
    beforeEach(() => {
      fixture = {
        hello: 'World',
        foo: [1, 2],
      };
    });

    describe('with default settings', () => it('should send the expected JSON string', (done) => {
      const expected = [
        JSON.stringify(fixture),
      ];
      const received = [];

      out.on('data', (data) => received.push(data));
      out.on('disconnect', () => {
        chai.expect(received).to.eql(expected);
        done();
      });

      ins.connect();
      ins.send(fixture);
      ins.disconnect();
    }));

    describe('with pretty setting', () => it('should send the expected JSON string', (done) => {
      const expected = [
        JSON.stringify(fixture, null, 4),
      ];
      const received = [];

      out.on('data', (data) => received.push(data));
      out.on('disconnect', () => {
        chai.expect(received).to.eql(expected);
        done();
      });

      pretty.send(true);
      ins.connect();
      ins.send(fixture);
      ins.disconnect();
    }));
  });

  describe('JSONifying a string', () => {
    let fixture = null;
    beforeEach(() => {
      fixture = 'Hello World!';
    });

    describe('with default settings', () => it('should send the expected JSON string', (done) => {
      const expected = [
        JSON.stringify(fixture),
      ];
      const received = [];

      out.on('data', (data) => received.push(data));
      out.on('disconnect', () => {
        chai.expect(received).to.eql(expected);
        done();
      });

      ins.connect();
      ins.send(fixture);
      ins.disconnect();
    }));

    describe('with raw setting', () => it('should send the expected JSON string', (done) => {
      const expected = [
        fixture,
      ];
      const received = [];

      out.on('data', (data) => received.push(data));
      out.on('disconnect', () => {
        chai.expect(received).to.eql(expected);
        done();
      });

      raw.send(true);
      ins.connect();
      ins.send(fixture);
      ins.disconnect();
    }));
  });
});
