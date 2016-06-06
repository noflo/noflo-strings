noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'EscapeQuotes component', ->
  c = null
  ins = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/EscapeQuotes', (err, instance) ->
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
    out = null

  describe 'receiving a string without quotes', ->
    it 'should send it as-is', (done) ->
      packets = ['Hello World']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      ins.connect()
      ins.send 'Hello World'
      ins.disconnect()

  describe 'escaping quotes in a string', ->
    it 'should send the expected value', (done) ->
      packets = ['Hello \\\"World\\\"']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      ins.connect()
      ins.send 'Hello "World"'
      ins.disconnect()
