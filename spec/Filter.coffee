noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '..'
else
  baseDir = 'noflo-strings'

describe 'Filter component', ->
  c = null
  pattern = null
  ins = null
  out = null
  before (done) ->
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/Filter', (err, instance) ->
      return done err if err
      c = instance
      pattern = noflo.internalSocket.createSocket()
      ins = noflo.internalSocket.createSocket()
      out = noflo.internalSocket.createSocket()
      c.inPorts.pattern.attach pattern
      c.inPorts.in.attach ins
      c.outPorts.out.attach out
      done()

   describe 'with a given pattern', ->
     it 'should only send unfiltered data IPs', (done) ->
       expected = [
         'abc'
         'a24c'
       ]
       out.on 'data', (data) ->
         chai.expect(data).to.eql expected.shift()
         return if expected.length
         done()
       pattern.send 'a.+c'
       ins.send 'abc'
       ins.send '125c'
       ins.send 'a24c'
       ins.disconnect()
