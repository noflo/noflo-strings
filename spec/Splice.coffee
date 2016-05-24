noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'Splice component', ->
  c = null
  assoc = null
  delim = null
  ins = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/Splice', (err, instance) ->
      return done err if err
      c = instance
      assoc = noflo.internalSocket.createSocket()
      delim = noflo.internalSocket.createSocket()
      ins = noflo.internalSocket.createSocket()
      c.inPorts.assoc.attach assoc
      c.inPorts.delim.attach delim
      c.inPorts.in.attach ins
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe 'interlacing two arrays of strings into a string', ->
    it 'should return the correct string', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 'p:x,q:y,r:z'
        done()

      ins.send ['p','q','r']
      ins.send ['x','y','z']

  describe 'interlacing with custom associator and delimiter', ->
    it 'should return the correct string', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 'p=x|q=y|r=z'
        done()

      assoc.send '='
      delim.send '|'

      ins.send ['p','q','r']
      ins.send ['x','y','z']
