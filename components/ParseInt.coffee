noflo = require "noflo"

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Parse a string to an integer'
  c.inPorts.add 'in',
    datatype: 'string'
    description: 'String to parse as int representation'
  c.inPorts.add 'base',
    datatype: 'number'
    description: 'Base used to parse the string representation'
    control: true
    default: 10
  c.outPorts.add 'out',
    datatype: 'number'
    description: 'Parsed number'

  c.process (input, output) ->
    return unless input.has 'in'
    data = input.getData 'in'

    base = if input.has('base') then input.getData('base') else 10

    output.sendDone
      out: parseInt data, base
