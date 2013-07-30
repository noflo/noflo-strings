noflo = require 'noflo'
if typeof process is 'object' and process.title is 'node'
  chai = require 'chai' unless chai
  MatchReplace = require '../components/MatchReplace.coffee'
else
  MatchReplace = require 'noflo-adapters/components/MatchReplace.js'

describe 'MatchReplace component', ->
  c = null
  ins = null
  match = null
  out = null

  beforeEach ->
    c = MatchReplace.getComponent()
    ins = noflo.internalSocket.createSocket()
    match = noflo.internalSocket.createSocket()
    out = noflo.internalSocket.createSocket()
    c.inPorts.in.attach ins
    c.inPorts.match.attach match
    c.outPorts.out.attach out

  describe 'when instantiated', ->
    it 'should have an input port', ->
      chai.expect(c.inPorts.in).to.be.an 'object'
      chai.expect(c.inPorts.match).to.be.an 'object'
    it 'should have an output port', ->
      chai.expect(c.outPorts.out).to.be.an 'object'

  describe 'provided an array containing potential matches', ->
    it 'get the replacement given a string', (done) ->
      packets = ['b4', 'c5']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      match.send { a1: "a2", b3: "b4" }

      ins.connect()
      ins.send 'b3'
      ins.send 'c5'
      ins.disconnect()
