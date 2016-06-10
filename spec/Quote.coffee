noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'Quote component', ->
  c = null
  ins = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/Quote', (err, instance) ->
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

  describe 'receiving a string', ->
    it 'should quote it', (done) ->

      out.on 'data', (data) ->
        chai.expect(data).to.equal '\'Hello, World!\''
        done()

      ins.connect()
      ins.send 'Hello, World!'
      ins.disconnect()
