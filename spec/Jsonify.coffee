noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'Jsonify component', ->
  c = null
  ins = null
  raw = null
  pretty = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/Jsonify', (err, instance) ->
      return done err if err
      c = instance
      ins = noflo.internalSocket.createSocket()
      c.inPorts.in.attach ins
      raw = noflo.internalSocket.createSocket()
      c.inPorts.raw.attach raw
      pretty = noflo.internalSocket.createSocket()
      c.inPorts.pretty.attach pretty
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe 'JSONifying an object', ->
    fixture = null
    beforeEach ->
      fixture =
        hello: 'World'
        foo: [1,2]

    describe 'with default settings', ->
      it 'should send the expected JSON string', (done) ->
        expected = [
          JSON.stringify fixture
        ]
        received = []

        out.on 'data', (data) ->
          received.push data
        out.on 'disconnect', ->
          chai.expect(received).to.eql expected
          done()

        ins.connect()
        ins.send fixture
        ins.disconnect()

    describe 'with pretty setting', ->
      it 'should send the expected JSON string', (done) ->
        expected = [
          JSON.stringify fixture, null, 4
        ]
        received = []

        out.on 'data', (data) ->
          received.push data
        out.on 'disconnect', ->
          chai.expect(received).to.eql expected
          done()

        pretty.send true
        ins.connect()
        ins.send fixture
        ins.disconnect()

  describe 'JSONifying a string', ->
    fixture = null
    beforeEach ->
      fixture = 'Hello World!'

    describe 'with default settings', ->
      it 'should send the expected JSON string', (done) ->
        expected = [
          JSON.stringify fixture
        ]
        received = []

        out.on 'data', (data) ->
          received.push data
        out.on 'disconnect', ->
          chai.expect(received).to.eql expected
          done()

        ins.connect()
        ins.send fixture
        ins.disconnect()

    describe 'with raw setting', ->
      it 'should send the expected JSON string', (done) ->
        expected = [
          fixture
        ]
        received = []

        out.on 'data', (data) ->
          received.push data
        out.on 'disconnect', ->
          chai.expect(received).to.eql expected
          done()

        raw.send true
        ins.connect()
        ins.send fixture
        ins.disconnect()
