noflo = require("noflo")
_ = require("underscore")

class Quote extends noflo.Component

  description: "quote the incoming string IPs"

  constructor: ->
    @inPorts = new noflo.InPorts
      in:
        datatype: 'string'
        description: 'String to put quote around'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'
        description: 'Quoted input string'

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      @outPorts.out.send("'#{data}'")

    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new Quote
