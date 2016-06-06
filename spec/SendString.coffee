noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'SendString component', ->
  c = null
  ins = null
  string = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/SendString', (err, instance) ->
      return done err if err
      c = instance
      ins = noflo.internalSocket.createSocket()
      c.inPorts.in.attach ins
      string = noflo.internalSocket.createSocket()
      c.inPorts.string.attach string
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe 'when receiving a bang', ->
    it 'should send the string out with banged brackets', (done) ->
      expected = [
        '< a'
        'DATA Hello There'
        '>'
      ]
      received = []

      out.on 'begingroup', (group) ->
        received.push "< #{group}"
      out.on 'data', (data) ->
        received.push "DATA #{data}"
      out.on 'endgroup', ->
        received.push '>'
      out.on 'disconnect', ->
        chai.expect(received).to.eql expected
        done()

      string.send 'Hello There'
      ins.connect()
      ins.beginGroup 'a'
      ins.send true
      ins.endGroup()
      ins.disconnect()
