noflo = require 'noflo'
if typeof process is 'object' and process.title is 'node'
  chai = require 'chai' unless chai
  Filter = require '../components/Filter.coffee'
else
  Filter = require 'noflo-adapters/components/Filter.js'

describe 'Filter component', ->
  c = null
  ins = null
  pattern = null
  out = null

  beforeEach ->
    c = Filter.getComponent()
    ins = noflo.internalSocket.createSocket()
    pattern = noflo.internalSocket.createSocket()
    out = noflo.internalSocket.createSocket()
    c.inPorts.in.attach ins
    c.inPorts.pattern.attach pattern
    c.outPorts.out.attach out

  describe 'when instantiated', ->
    it 'should have an input port', ->
      chai.expect(c.inPorts.in).to.be.an 'object'
      chai.expect(c.inPorts.pattern).to.be.an 'object'
    it 'should have an output port', ->
      chai.expect(c.outPorts.out).to.be.an 'object'

  describe 'filter a string', ->
    it 'only get the unfiltered data IPs from a pattern and some input', (done) ->
      packets = ['abc', 'a24c']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      pattern.send 'a.+c'

      ins.connect()
      ins.send 'abc'
      ins.send 'a24c'
      ins.send '125c'
      ins.disconnect()
