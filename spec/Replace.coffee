noflo = require 'noflo'
unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'Replace component', ->
  loader = null
  c = null
  ins = null
  pattern = null
  replacement = null
  out = null

  before ->
    loader = new noflo.ComponentLoader baseDir
  beforeEach (done) ->
    @timeout 4000
    loader.load 'strings/Replace', (err, instance) ->
      return done err if err
      c = instance
      ins = noflo.internalSocket.createSocket()
      pattern = noflo.internalSocket.createSocket()
      replacement = noflo.internalSocket.createSocket()
      c.inPorts.in.attach ins
      c.inPorts.pattern.attach pattern
      c.inPorts.replacement.attach replacement
      out = noflo.internalSocket.createSocket()
      c.outPorts.out.attach out
      done()
  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe 'when instantiated', ->
    it 'should have an input port', ->
      chai.expect(c.inPorts.in).to.be.an 'object'
      chai.expect(c.inPorts.pattern).to.be.an 'object'
      chai.expect(c.inPorts.replacement).to.be.an 'object'
    it 'should have an output port', ->
      chai.expect(c.outPorts.out).to.be.an 'object'

  describe 'replacement', ->
    it 'test no pattern no replacement', (done) ->
      packets = ['abc123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      ins.connect()
      ins.send 'abc123'
      ins.disconnect()

    it 'test no pattern', (done) ->
      packets = ['abc123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      replacement.send 'foo'

      ins.connect()
      ins.send 'abc123'
      ins.disconnect()

    it 'test simple replacement', (done) ->
      packets = ['xyz123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      pattern.send 'abc'
      replacement.send 'xyz'

      ins.connect()
      ins.send 'abc123'
      ins.disconnect()

    it 'test simple replacement with slashes', (done) ->
      packets = ["/abc/xyz/baz"]

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      pattern.send '/foo/bar/'
      replacement.send '/abc/xyz/'

      ins.connect()
      ins.send '/foo/bar/baz'
      ins.disconnect()

    it 'test no replacement', (done) ->
      packets = ['123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      pattern.send '[a-z]'

      ins.connect()
      ins.send 'abc123'
      ins.disconnect()

    it 'test replacement', (done) ->
      packets = ['xxx123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      pattern.send '[a-z]'
      replacement.send 'x'

      ins.connect()
      ins.send 'abc123'
      ins.disconnect()

    it 'test groups', (done) ->
      packets = ['g', 'xxx123']

      out.on 'begingroup', (group) ->
        chai.expect(packets.shift()).to.deep.equal group
      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      pattern.send '[a-z]'
      replacement.send 'x'

      ins.connect()
      ins.beginGroup 'g'
      ins.send 'abc123'
      ins.endGroup()
      ins.disconnect()
