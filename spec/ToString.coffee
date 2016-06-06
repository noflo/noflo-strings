noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'ToString component', ->
  c = null
  ins = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/ToString', (err, instance) ->
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

  describe 'converting an object to String', ->
    it 'should produce default for normal object', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.be.a 'string'
        chai.expect(data).to.equal '[object Object]'
        done()

      ins.send
        foo: 'Bar'
      ins.disconnect()

    it 'should use custom toString method', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.be.a 'string'
        chai.expect(data).to.equal 'I am fancy object'
        done()

      ins.send
        foo: 'Bar'
        toString: ->
          'I am fancy object'
      ins.disconnect()
