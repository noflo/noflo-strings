noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Produce a substring from a string'

  c.inPorts.add 'index',
    datatype: 'int'
    description: 'Index of the sub part '
    control: true
  c.inPorts.add 'limit',
    datatype: 'int'
    description: 'Limit of the sub part'
    control: true
  c.inPorts.add 'in',
    datatype: 'string'
    description: 'String to extract a sub part from'
  c.outPorts.add 'out',
    datatype: 'string'

  c.process (input, output) ->
    return unless input.has 'in'
    data = input.get 'in'
    return unless data.type is 'data'
    index = if input.has('index') then input.getData('index') else 0
    limit = if input.has('limit') then input.getData('limit') else undefined

    output.sendDone
      out: data.data.substr index, limit
