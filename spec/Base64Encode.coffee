noflo = require 'noflo'
unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'Base64Encode component', ->
  c = null
  ins = null
  out = null

  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/Base64Encode', (err, instance) ->
      return done err if err
      c = instance
      ins = noflo.internalSocket.createSocket()
      c.inPorts.in.attach ins
      done()

  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out

  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe 'when instantiated', ->
    it 'should have an input port', ->
      chai.expect(c.inPorts.in).to.be.an 'object'
    it 'should have an output port', ->
      chai.expect(c.outPorts.out).to.be.an 'object'

  describe 'encoding', ->
    it 'test encoding a string', (done) ->
      packets = ['SGVsbG8sIFdvcmxkIQ==']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      ins.connect()
      ins.send 'Hello, World!'
      ins.disconnect()

    it 'test encoding set of strings', (done) ->
      packets = ['SGVsbG8sIFdvcmxkIQ==']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      ins.connect()
      ins.beginGroup 'stream'
      ins.send 'Hello, '
      ins.send 'World'
      ins.send '!'
      ins.endGroup()
      ins.disconnect()

    it 'test encoding a buffer', (done) ->
      return done() if noflo.isBrowser()
      packets = ['SGVsbG8sIFdvcmxkIQ==']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      ins.connect()
      ins.send new Buffer 'Hello, World!'
      ins.disconnect()
