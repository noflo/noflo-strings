noflo = require 'noflo'
if typeof process is 'object' and process.title is 'node'
  chai = require 'chai' unless chai
  Base64Encode = require '../components/Base64Encode.coffee'
else
  Base64Encode = require 'noflo-adapters/components/Base64Encode.js'

describe 'Base64Encode component', ->
  c = null
  ins = null
  out = null

  beforeEach ->
    c = Base64Encode.getComponent()
    ins = noflo.internalSocket.createSocket()
    out = noflo.internalSocket.createSocket()
    c.inPorts.in.attach ins
    c.outPorts.out.attach out

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
      ins.send 'Hello, '
      ins.send 'World'
      ins.send '!'
      ins.disconnect()

    it 'test encoding a buffer', (done) ->
      packets = ['SGVsbG8sIFdvcmxkIQ==']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      ins.connect()
      ins.send new Buffer 'Hello, World!'
      ins.disconnect()
