noflo = require "noflo"

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Parse a string to a float'
  c.inPorts.add 'in',
    datatype: 'string'
    description: 'String to parse as Float representation'
  c.outPorts.add 'out',
    datatype: 'number'
    description: 'Parsed number'

  c.process (input, output) ->
    data = input.getData 'in'
    output.sendDone
      out: parseFloat data
