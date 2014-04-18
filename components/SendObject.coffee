noflo = require 'noflo'

class SendObject extends noflo.Component

  description: "convert strings to object"

  constructor: ->
    @inPorts =
      in: new noflo.Port 'string'
    @outPorts =
      out: new noflo.Port 'object'

    @inPorts.in.on 'begingroup', (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send JSON.parse(data)

    @inPorts.in.on 'endgroup', (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

exports.getComponent = -> new SendObject
