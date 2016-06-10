noflo = require "noflo"

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Parse a JSON string'

  c.inPorts.add 'in',
    datatype: 'string'
    description: 'JSON description to parse'
  c.inPorts.add 'try',
    datatype: 'boolean'
    description: 'Deprecated'
  c.outPorts.add 'out',
    datatype: 'object'
    description: 'Parsed object'
  c.outPorts.add 'error',
    datatype: 'object'

  c.inPorts.try.on 'data', (data) ->
    console.warn 'ParseJson try port is deprecated'

  c.process (input, output) ->
    return unless input.has 'in'
    data = input.getData 'in'
    return unless data

    try
      result = JSON.parse data
    catch e
      output.sendDone e
      return

    output.sendDone
      out: result
