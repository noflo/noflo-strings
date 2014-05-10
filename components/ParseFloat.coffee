noflo = require "noflo"

class ParseFloat extends noflo.Component
  constructor: ->
    @inPorts = new noflo.InPorts
      in:
        datatype: 'string'
        description: 'String to parse as Float representation'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'number'
        description: 'Parsed number'

    @inPorts.in.on "begingroup", (group) =>
      return unless @outPorts.out.isAttached()
      @outPorts.out.beginGroup group
    @inPorts.in.on "data", (data) =>
      return unless @outPorts.out.isAttached()
      @outPorts.out.send(parseFloat(data))
    @inPorts.in.on "endgroup", =>
      return unless @outPorts.out.isAttached()
      @outPorts.out.endGroup()
    @inPorts.in.on "disconnect", =>
      return unless @outPorts.out.isAttached()
      @outPorts.out.disconnect()

exports.getComponent = -> new ParseFloat
