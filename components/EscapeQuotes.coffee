noflo = require("noflo")

exports.getComponent = ->
  c = new noflo.Component
  c.description = "Escape all quotes in a string"

  c.inPorts.add 'in',
    datatype: 'string'
    description: 'String to escape quotes from'
  c.outPorts.add 'out',
    datatype: 'string'
    description: 'Escaped string'

  c.process (input, output) ->
    data = input.get 'in'
    return unless data.type is 'data'

    output.sendDone
      out: data.data.replace /\"/g, "\\\""
