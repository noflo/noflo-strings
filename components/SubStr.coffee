noflo = require 'noflo'

class SubStr extends noflo.Component
  constructor: ->
    @index = 0
    @limit = undefined

    @inPorts = new noflo.InPorts
      index:
        datatype: 'int'
        description: 'Index of the sub part '
      limit:
        datatype: 'int'
        description: 'Limit of the sub part'
      in:
        datatype: 'string'
        description: 'String to extract a sub part from'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'

    @inPorts.index.on 'data', (data) =>
      @index = data
    @inPorts.limit.on 'data', (data) =>
      @limit = data
    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send data.substr @index, @limit
    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

exports.getComponent = -> new SubStr
