noflo = require 'noflo'
unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'SplitStr component', ->
  c = null
  ins = null
  delimiter = null
  out = null

  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/SplitStr', (err, instance) ->
      return done err if err
      c = instance
      ins = noflo.internalSocket.createSocket()
      delimiter = noflo.internalSocket.createSocket()
      c.inPorts.in.attach ins
      c.inPorts.delimiter.attach delimiter
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out

  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe 'when instantiated', ->
    it 'should have an input port', ->
      chai.expect(c.inPorts.in).to.be.an 'object'
      chai.expect(c.inPorts.delimiter).to.be.an 'object'
    it 'should have an output port', ->
      chai.expect(c.outPorts.out).to.be.an 'object'

  describe 'splitting a string', ->
    it 'test split with default delimiteriter', (done) ->
      packets = ['abc', '123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
        done() unless packets.length

      ins.connect()
      ins.send 'abc\n123'
      ins.disconnect()

    it 'test split with string delimiteriter', (done) ->
      packets = ['abc', '123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
        done() unless packets.length

      delimiter.send ','

      ins.connect()
      ins.send 'abc,123'
      ins.disconnect()

    it 'test split with RegExp delimiteriter', (done) ->
      packets = ['abc', '123']

      out.on 'data', (data) ->
        chai.expect(packets.shift()).to.deep.equal data
        done() unless packets.length

      delimiter.send '/[\n]*[-]{3}[\n]/'

      ins.connect()
      ins.send 'abc\n---\n123'
      ins.disconnect()
