noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'ParseJson component', ->
  c = null
  ins = null
  out = null
  err = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/ParseJson', (err, instance) ->
      return done err if err
      c = instance
      ins = noflo.internalSocket.createSocket()
      c.inPorts.in.attach ins
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
    err = noflo.internalSocket.createSocket()
    c.outPorts.error.attach err
  afterEach ->
    c.outPorts.out.detach out
    out = null
    c.outPorts.error.detach err
    err = null

  describe 'with valid JSON object', ->
    it 'should parse it', (done) ->
      fixture =
        hello: 'World'
        foo: [1, 2]

      out.on 'data', (data) ->
        chai.expect(data).to.eql fixture
        done()

      ins.send JSON.stringify fixture
      ins.disconnect()

  describe 'with invalid JSON', ->
    it 'should produce an error', (done) ->
      err.on 'data', (data) ->
        chai.expect(data).to.be.an 'error'
        done()

      ins.send '{"foo":1}}'
      ins.disconnect()
