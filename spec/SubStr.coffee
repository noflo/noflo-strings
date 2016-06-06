noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'SubStr component', ->
  c = null
  ins = null
  index = null
  limit = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/SubStr', (err, instance) ->
      return done err if err
      c = instance
      ins = noflo.internalSocket.createSocket()
      c.inPorts.in.attach ins
      index = noflo.internalSocket.createSocket()
      c.inPorts.index.attach index
      limit = noflo.internalSocket.createSocket()
      c.inPorts.limit.attach limit
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe 'producing a substring', ->
    it 'should send string as-is by default', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 'Hello World'
        done()

      ins.send 'Hello World'
      ins.disconnect()

    it 'should make a substring by given index', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 'ello World'
        done()

      index.send 1

      ins.send 'Hello World'
      ins.disconnect()

    it 'should make a substring by given index and limit', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 'ello'
        done()

      index.send 1
      limit.send 4

      ins.send 'Hello World'
      ins.disconnect()
