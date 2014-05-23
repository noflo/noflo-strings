noflo = require 'noflo'

class SendString extends noflo.Component
  constructor: ->
    @data =
      string: null
      group: []
    @groups = []
    @inPorts = new noflo.InPorts
      string:
        datatype: 'string'
      in:
        datatype: 'bang'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'

    @inPorts.string.on 'data', (data) =>
      @data.string = data

    @inPorts.in.on 'begingroup', (group) =>
      @groups.push group

    @inPorts.in.on 'data', (data) =>
      return if @data.string is null
      @data.group = @groups.slice 0
      @sendString @data

    @inPorts.in.on 'endgroup', (group) =>
      @groups.pop()
    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

  sendString: (data) ->
    for group in data.group
      @outPorts.out.beginGroup group
    @outPorts.out.send data.string
    for group in data.group
      @outPorts.out.endGroup()


exports.getComponent = -> new SendString
