noflo = require 'noflo'

class CompileString extends noflo.Component

  constructor: ->
    @delimiter = "\n"
    @data = []
    @onGroupEnd = true

    @inPorts = new noflo.InPorts
      delimiter:
        datatype: 'string'
        description: 'String used to concatenate input strings'
      in:
        dataype: 'string'
        description: 'Strings to concatenate (one per IP)'
      ongroup:
        datatype: 'boolean'
        description: 'true to release the concatened strings
         when a endgroup event happens'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'
        description: 'Concatenation of input strings'

    @inPorts.delimiter.on 'data', (data) =>
      @delimiter = data

    @inPorts.in.on 'begingroup', (group) =>
      @outPorts.out.beginGroup group

    @inPorts.in.on 'data', (data) =>
      @data.push data

    @inPorts.in.on 'endgroup', =>
      @outPorts.out.send @data.join @delimiter if @data.length and @onGroupEnd
      @outPorts.out.endGroup()
      @data = []

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.send @data.join @delimiter if @data.length
      @data = []
      @outPorts.out.disconnect()

    @inPorts.ongroup.on "data", (data) =>
      @onGroupEnd = String(data) is 'true'

exports.getComponent = -> new CompileString
