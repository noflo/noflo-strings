noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'ParseInt component', ->
  c = null
  base = null
  ins = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/ParseInt', (err, instance) ->
      return done err if err
      c = instance
      base = noflo.internalSocket.createSocket()
      ins = noflo.internalSocket.createSocket()
      c.inPorts.base.attach base
      c.inPorts.in.attach ins
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe 'with 42px', ->
    it 'should return 42', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 42
        done()
      ins.send '42px'
  describe 'with "0.12345"', ->
    it 'should return 0', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 0
        done()
      ins.send '0.12345'
  describe 'with qgpowqpo', ->
    it 'should return NaN', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.eql NaN
        done()
      ins.send 'qgpowqpo'
  describe 'with "0x42" in base 16', ->
    it 'should return 66', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.eql 66
        done()
      base.send 16
      ins.send '0x42'
  describe 'with "11" in base 16', ->
    it 'should return 17', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.eql 17
        done()
      base.send 16
      ins.send '11'
