noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'ConvertEncoding component', ->
  c = null
  from = null
  to = null
  ins = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/ConvertEncoding', (err, instance) ->
      return done err if err
      c = instance
      from = noflo.internalSocket.createSocket()
      to = noflo.internalSocket.createSocket()
      ins = noflo.internalSocket.createSocket()
      c.inPorts.from.attach from
      c.inPorts.to.attach to
      c.inPorts.in.attach ins
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe 'converting UTF-8 to Base64', ->
    it 'should send the expected value', (done) ->
      packets = ['SGVsbG8sIFdvcmxkIQ==']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      from.send 'utf8'
      to.send 'base64'
      ins.connect()
      ins.send 'Hello, World!'
      ins.disconnect()

  describe 'converting Base64 to UTF-8', ->
    it 'should send the expected value', (done) ->
      packets = ['Hello, World!']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.equal data
      out.on 'disconnect', ->
        chai.expect(packets.length).to.equal 0
        done()

      from.send 'base64'
      to.send 'utf8'
      ins.connect()
      ins.send 'SGVsbG8sIFdvcmxkIQ=='
      ins.disconnect()
