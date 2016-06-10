noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'TemplateReplace component', ->
  c = null
  template = null
  token = null
  ins = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/TemplateReplace', (err, instance) ->
      return done err if err
      c = instance
      template = noflo.internalSocket.createSocket()
      token = noflo.internalSocket.createSocket()
      ins = noflo.internalSocket.createSocket()
      c.inPorts.template.attach template
      c.inPorts.token.attach token
      c.inPorts.in.attach ins
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe 'with an object containing patterns and replacements', ->
    it 'should return a templated string', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 'I am a happy person.'
        done()
      template.send 'I am a &adjective &noun.'
      ins.send
        '&adjective': 'happy'
        '&noun': 'person'
      ins.disconnect()

  describe 'with a series of tokens', ->
    it 'should return a templated string', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 'I am a happy person.'
        done()
      template.send 'I am a &adjective &noun.'
      token.connect()
      token.send '&adjective'
      token.send '&noun'
      token.disconnect()
      ins.connect()
      ins.send 'happy'
      ins.send 'person'
      ins.disconnect()
