noflo = require 'noflo'
if typeof process is 'object' and process.title is 'node'
  chai = require 'chai' unless chai
  TemplateReplace = require '../components/TemplateReplace.coffee'
else
  TemplateReplace = require 'noflo-adapters/components/TemplateReplace.js'

describe 'TemplateReplace component', ->
  c = null
  ins = null
  template = null
  out = null

  beforeEach ->
    c = TemplateReplace.getComponent()
    ins = noflo.internalSocket.createSocket()
    template = noflo.internalSocket.createSocket()
    out = noflo.internalSocket.createSocket()
    c.inPorts.in.attach ins
    c.inPorts.template.attach template
    c.outPorts.out.attach out

  describe 'when instantiated', ->
    it 'should have an input port', ->
      chai.expect(c.inPorts.in).to.be.an 'object'
      chai.expect(c.inPorts.template).to.be.an 'object'
    it 'should have an output port', ->
      chai.expect(c.outPorts.out).to.be.an 'object'

  describe 'replacing by template', ->
    patterns =
      "&adjective": "happy"
      "&noun": "person"

    it 'pass in a template and an object containing patterns and replacements, out comes the new string', (done) ->
      packets = ['I am a happy person.']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      template.send 'I am a &adjective &noun.'

      ins.connect()
      ins.send patterns
      ins.disconnect()
