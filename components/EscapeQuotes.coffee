noflo = require("noflo")
_ = require("underscore")

class EscapeQuotes extends noflo.Component

  description: "Escape all quotes in a string"

  constructor: ->
    @inPorts = new noflo.InPorts
      in:
        datatype: 'string'
        description: 'String to escape quotes from'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'
        description: 'Escaped string'

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      @outPorts.out.send data.replace /\"/g, "\\\""

    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new EscapeQuotes
