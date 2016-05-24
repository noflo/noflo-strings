noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '../'
else
  baseDir = 'noflo-strings'

describe 'Sift3Distance component', ->
  c = null
  string1 = null
  string2 = null
  out = null
  before (done) ->
    @timeout 4000
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/Sift3Distance', (err, instance) ->
      return done err if err
      c = instance
      string1 = noflo.internalSocket.createSocket()
      string2 = noflo.internalSocket.createSocket()
      c.inPorts.string1.attach string1
      c.inPorts.string2.attach string2
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
  afterEach ->
    c.outPorts.out.detach out
    out = null

  describe.skip 'with blank string 1', ->
    it 'should return distance 0', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 0
        done()
      string1.send ''
      string2.send 'Alpha BC'
  describe 'with equal strings', ->
    it 'should return distance 0', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 0
        done()
      string1.send 'Cloud Monkey, Hippy'
      string2.send 'Cloud Monkey, Hippy'
  describe 'with ABC and ACC', ->
    it 'should return distance 2', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 2
        done()
      string1.send 'ABC'
      string2.send 'ACC'
  describe.skip 'with Singapore and Singaporea', ->
    it 'should return distance 1.5', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 1.5
        done()
      string1.send 'Singapore'
      string2.send 'Singaporea'
