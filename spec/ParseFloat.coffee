noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '..'
else
  baseDir = 'noflo-strings'

describe 'ParseFloat component', ->
  c = null
  ins = null
  out = null
  before (done) ->
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/ParseFloat', (err, instance) ->
      return done err if err
      c = instance
      ins = noflo.internalSocket.createSocket()
      out = noflo.internalSocket.createSocket()
      c.inPorts.in.attach ins
      c.outPorts.out.attach out
      done()

  describe 'with 42px', ->
    it 'should return 42', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 42
        done()
      ins.send '42px'
  describe 'with "0.12345"', ->
    it 'should return 0.12345', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 0.12345
        done()
      ins.send '0.12345'
  describe 'with qgpowqpo', ->
    it 'should return NaN', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.eql NaN
        done()
      ins.send 'qgpowqpo'
