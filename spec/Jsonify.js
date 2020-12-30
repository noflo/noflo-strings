/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe('Jsonify component', function() {
  let c = null;
  let ins = null;
  let raw = null;
  let pretty = null;
  let out = null;
  before(function(done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('strings/Jsonify', function(err, instance) {
      if (err) { return done(err); }
      c = instance;
      ins = noflo.internalSocket.createSocket();
      c.inPorts.in.attach(ins);
      raw = noflo.internalSocket.createSocket();
      c.inPorts.raw.attach(raw);
      pretty = noflo.internalSocket.createSocket();
      c.inPorts.pretty.attach(pretty);
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

  describe('JSONifying an object', function() {
    let fixture = null;
    beforeEach(() => fixture = {
      hello: 'World',
      foo: [1,2]
    });

    describe('with default settings', () => it('should send the expected JSON string', function(done) {
      const expected = [
        JSON.stringify(fixture)
      ];
      const received = [];

      out.on('data', data => received.push(data));
      out.on('disconnect', function() {
        chai.expect(received).to.eql(expected);
        return done();
      });

      ins.connect();
      ins.send(fixture);
      return ins.disconnect();
    }));

    return describe('with pretty setting', () => it('should send the expected JSON string', function(done) {
      const expected = [
        JSON.stringify(fixture, null, 4)
      ];
      const received = [];

      out.on('data', data => received.push(data));
      out.on('disconnect', function() {
        chai.expect(received).to.eql(expected);
        return done();
      });

      pretty.send(true);
      ins.connect();
      ins.send(fixture);
      return ins.disconnect();
    }));
  });

  return describe('JSONifying a string', function() {
    let fixture = null;
    beforeEach(() => fixture = 'Hello World!');

    describe('with default settings', () => it('should send the expected JSON string', function(done) {
      const expected = [
        JSON.stringify(fixture)
      ];
      const received = [];

      out.on('data', data => received.push(data));
      out.on('disconnect', function() {
        chai.expect(received).to.eql(expected);
        return done();
      });

      ins.connect();
      ins.send(fixture);
      return ins.disconnect();
    }));

    return describe('with raw setting', () => it('should send the expected JSON string', function(done) {
      const expected = [
        fixture
      ];
      const received = [];

      out.on('data', data => received.push(data));
      out.on('disconnect', function() {
        chai.expect(received).to.eql(expected);
        return done();
      });

      raw.send(true);
      ins.connect();
      ins.send(fixture);
      return ins.disconnect();
    }));
  });
});
