noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'SendJson component', ->
  c = null
  ins = null
  json = null
  out = null
  error = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/SendJson', (err, instance) ->
      return done err if err
      c = instance
      ins = noflo.internalSocket.createSocket()
      c.inPorts.in.attach ins
      json = noflo.internalSocket.createSocket()
      c.inPorts.json.attach json
      c.start done
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
    error = noflo.internalSocket.createSocket()
    c.outPorts.error.attach error
  afterEach ->
    c.outPorts.out.detach out
    out = null
    c.outPorts.error.detach error
    error = null

  describe 'when receiving a bang and valid JSON', ->
    it 'should send the parsed JSON out with banged brackets', (done) ->
      expected = [
        '< a'
        'DATA [1,2,3]'
        '>'
      ]
      received = []

      error.on 'data', done
      out.on 'begingroup', (group) ->
        received.push "< #{group}"
      out.on 'data', (data) ->
        received.push "DATA #{JSON.stringify(data)}"
      out.on 'endgroup', ->
        received.push '>'
      out.on 'disconnect', ->
        chai.expect(received).to.eql expected
        done()

      json.send '[1,2,3]'
      ins.connect()
      ins.beginGroup 'a'
      ins.send true
      ins.endGroup()
      ins.disconnect()

  describe 'when receiving a bang and invalid JSON', ->
    it 'should send the error out with banged brackets', (done) ->
      expected = [
        '< a'
        'DATA'
        '>'
      ]
      received = []

      out.on 'ip', (ip) ->
        done new Error "Received unexpected #{ip.type} #{ip.data}"
      error.on 'begingroup', (group) ->
        received.push "< #{group}"
      error.on 'data', (data) ->
        received.push "DATA"
      error.on 'endgroup', ->
        received.push '>'
      error.on 'disconnect', ->
        chai.expect(received).to.eql expected
        done()

      json.send '{1,2,3]'
      ins.connect()
      ins.beginGroup 'a'
      ins.send true
      ins.endGroup()
      ins.disconnect()
