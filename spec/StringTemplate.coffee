noflo = require 'noflo'

unless noflo.isBrowser()
  chai = require 'chai'
  path = require 'path'
  baseDir = path.resolve __dirname, '..'
else
  baseDir = 'noflo-strings'

describe 'StringTemplate component', ->
  c = null
  template = null
  ins = null
  out = null
  before (done) ->
    loader = new noflo.ComponentLoader baseDir
    loader.load 'strings/StringTemplate', (err, instance) ->
      return done err if err
      c = instance
      template = noflo.internalSocket.createSocket()
      ins = noflo.internalSocket.createSocket()
      out = noflo.internalSocket.createSocket()
      c.inPorts.template.attach template
      c.inPorts.in.attach ins
      c.outPorts.out.attach out
      done()

  describe 'with a template', ->
    it 'should return a string with the template applied', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.equal 'Hello Foo'
        done()
      template.send 'Hello <%= name %>'
      ins.send
        name: 'Foo'
