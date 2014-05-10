noflo = require 'noflo'
_ = require 'underscore'

class Jsonify extends noflo.Component

  description: "JSONify all incoming, unless a raw flag is set to
  exclude data packets that are pure strings"

  constructor: ->
    @raw = false
    @pretty = false

    @inPorts = new noflo.InPorts
      in:
        datatype: 'object'
        description: 'Object to convert into a JSON representation'
      raw:
        datatype: 'boolean'
        description: 'Whether to send strings as is'
      pretty:
        datatype: 'boolean'
        description: 'Make JSON output pretty'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'
        description: 'JSON representation of the input object'

    @inPorts.raw.on 'data', (raw) =>
      @raw = String(raw) is 'true'
    @inPorts.pretty.on 'data', (pretty) =>
      @pretty = String(pretty) is 'true'

    @inPorts.in.on 'begingroup', (group) =>
      @outPorts.out.beginGroup group

    @inPorts.in.on 'data', (data) =>
      if @raw and _.isString data
        @outPorts.out.send data
        return

      if @pretty
        @outPorts.out.send JSON.stringify data, null, 4
        return

      @outPorts.out.send JSON.stringify data

    @inPorts.in.on 'endgroup', (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

exports.getComponent = -> new Jsonify
