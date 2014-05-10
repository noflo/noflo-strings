noflo = require("noflo")

class Filter extends noflo.Component

  description: "filters an IP which is a string using a regex"

  constructor: ->
    @regex = null

    @inPorts = new noflo.InPorts
      in:
        datatype: 'string'
        description: 'String to filter'
      pattern:
        datatype: 'string'
        description: 'String representation of a regexp used as filter'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'
        description: 'String passing the filter'
      missed:
        datatype: 'string'
        description: 'String failing the filter'

    @inPorts.pattern.on "data", (data) =>
      @regex = new RegExp(data)

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      unless typeof data is 'string'
        data = (data).toString()
      if @regex? and data?.match?(@regex)?
        @outPorts.out.send data
        return
      @outPorts.missed.send data if @outPorts.missed.isAttached()

    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()
      @outPorts.missed.disconnect() if @outPorts.missed.isAttached()

exports.getComponent = -> new Filter
