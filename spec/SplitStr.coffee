noflo = require 'noflo'
unless noflo.isBrowser()
  chai = require 'chai' unless chai
  SplitStr = require '../components/SplitStr.coffee'
else
  SplitStr = require 'noflo-strings/components/SplitStr.js'

describe 'SplitStr component', ->
  c = null
  ins = null
  delimiter = null
  out = null

  beforeEach ->
    c = SplitStr.getComponent()
    ins = noflo.internalSocket.createSocket()
    delimiter = noflo.internalSocket.createSocket()
    out = noflo.internalSocket.createSocket()
    c.inPorts.in.attach ins
    c.inPorts.delimiter.attach delimiter
    c.outPorts.out.attach out

  describe 'when instantiated', ->
    it 'should have an input port', ->
      chai.expect(c.inPorts.in).to.be.an 'object'
      chai.expect(c.inPorts.delimiter).to.be.an 'object'
    it 'should have an output port', ->
      chai.expect(c.outPorts.out).to.be.an 'object'

  describe 'splitting a string', ->
    it 'test split with default delimiteriter', (done) ->
      packets = ['abc', '123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      ins.connect()
      ins.send 'abc\n123'
      ins.disconnect()

    it 'test split with string delimiteriter', (done) ->
      packets = ['abc', '123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      delimiter.send ','

      ins.connect()
      ins.send 'abc,123'
      ins.disconnect()

    it 'test split with RegExp delimiteriter', (done) ->
      packets = ['abc', '123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      delimiter.send '/[\n]*[-]{3}[\n]/'

      ins.connect()
      ins.send 'abc\n---\n123'
      ins.disconnect()
