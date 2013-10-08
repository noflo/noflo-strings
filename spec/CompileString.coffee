noflo = require 'noflo'
unless noflo.isBrowser()
  chai = require 'chai' unless chai
  CompileString = require '../components/CompileString.coffee'
else
  CompileString = require 'noflo-strings/components/CompileString.js'

describe 'CompileString component', ->
  c = null
  ins = null
  delim = null
  out = null

  beforeEach ->
    c = CompileString.getComponent()
    ins = noflo.internalSocket.createSocket()
    delim = noflo.internalSocket.createSocket()
    out = noflo.internalSocket.createSocket()
    c.inPorts.in.attach ins
    c.inPorts.delimiter.attach delim
    c.outPorts.out.attach out

  describe 'when instantiated', ->
    it 'should have an input port', ->
      chai.expect(c.inPorts.in).to.be.an 'object'
      chai.expect(c.inPorts.delimiter).to.be.an 'object'
    it 'should have an output port', ->
      chai.expect(c.outPorts.out).to.be.an 'object'

  describe 'compiling a string', ->
    it 'single string should be returned as-is', (done) ->
      packets = ['foo']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      ins.connect()
      ins.send 'foo'
      ins.disconnect()

    it 'two strings should be returned together', (done) ->
      packets = ['foobar']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      delim.send ''

      ins.connect()
      ins.send 'foo'
      ins.send 'bar'
      ins.disconnect()

    it 'delimiter should be between the strings', (done) ->
      packets = ['foo-bar']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      delim.send '-'

      ins.connect()
      ins.send 'foo'
      ins.send 'bar'
      ins.disconnect()
