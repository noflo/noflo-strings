noflo = require("noflo")

class LowerCaseString extends noflo.Component

  description: "toLowerCase on all incoming IPs (assuming they are strings)"

  constructor: ->
    @inPorts =
      in: new noflo.Port "string"
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      @outPorts.out.send data.toLowerCase()

    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new LowerCaseString
