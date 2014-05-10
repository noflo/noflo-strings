noflo = require "noflo"

class ParseInt extends noflo.Component
  constructor: ->
    @inPorts = new noflo.InPorts
      in:
        datatype: 'string'
        description: 'Strings to parse as an integer representation'
      base:
        datatype: 'number'
        description: 'Base used to parse the string representation'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'number'
        description: 'Parsed number'

    @base = 10

    @inPorts.base.on "data", (base) =>
      @base = base

    @inPorts.in.on "begingroup", (group) =>
      return unless @outPorts.out.isAttached()
      @outPorts.out.beginGroup group
    @inPorts.in.on "data", (data) =>
      return unless @outPorts.out.isAttached()
      @outPorts.out.send(parseInt(data, @base))
    @inPorts.in.on "endgroup", =>
      return unless @outPorts.out.isAttached()
      @outPorts.out.endGroup()
    @inPorts.in.on "disconnect", =>
      return unless @outPorts.out.isAttached()
      @outPorts.out.disconnect()

exports.getComponent = -> new ParseInt
