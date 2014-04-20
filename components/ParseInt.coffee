noflo = require "noflo"

class ParseInt extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'string'
      base: new noflo.Port 'number'
    @outPorts =
      out: new noflo.Port 'number'

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
