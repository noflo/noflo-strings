noflo = require 'noflo'
if typeof process is 'object' and process.title is 'node'
  chai = require 'chai' unless chai
  Splice = require '../components/Splice.coffee'
else
  Splice = require 'noflo-adapters/components/Splice.js'

describe 'Splice component', ->
  c = null
  ins = null
  delim = null
  assoc = null
  out = null

  beforeEach ->
    c = Splice.getComponent()
    ins = noflo.internalSocket.createSocket()
    delim = noflo.internalSocket.createSocket()
    assoc = noflo.internalSocket.createSocket()
    out = noflo.internalSocket.createSocket()
    c.inPorts.in.attach ins
    c.inPorts.delim.attach delim
    c.inPorts.assoc.attach assoc
    c.outPorts.out.attach out

  describe 'when instantiated', ->
    it 'should have an input port', ->
      chai.expect(c.inPorts.in).to.be.an 'object'
      chai.expect(c.inPorts.delim).to.be.an 'object'
      chai.expect(c.inPorts.assoc).to.be.an 'object'
    it 'should have an output port', ->
      chai.expect(c.outPorts.out).to.be.an 'object'

  describe 'splicing', ->
    input1 = ["p", "q", "r"]
    input2 = ["x", "y", "z"]

    describe 'interlace two arrays of string into a string', ->
      it 'the two arrays are fused into a string', (done) ->
        packets = ['p:x,q:y,r:z']

        out.on 'data', (data) ->
          chai.expect(packets.shift()).to.deep.equal data
        out.on 'disconnect', ->
          chai.expect(packets.length).to.equal 0
          done()

        ins.connect()
        ins.send input1
        ins.send input2
        ins.disconnect()

    describe 'interlace the arrays with custom associator and delimiter', ->
      it 'interlace with custom assoc and delim', (done) ->
        packets = ['p=x|q=y|r=z']

        out.on 'data', (data) ->
          chai.expect(packets.shift()).to.deep.equal data
        out.on 'disconnect', ->
          chai.expect(packets.length).to.equal 0
          done()

        assoc.send '='
        delim.send '|'

        ins.connect()
        ins.send input1
        ins.send input2
        ins.disconnect()
