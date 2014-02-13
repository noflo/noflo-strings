noflo = require 'noflo'
_ = require 'underscore'

class Jsonify extends noflo.Component

  description: "JSONify all incoming, unless a raw flag is set to
  exclude data packets that are pure strings"

  constructor: ->
    @raw = false

    @inPorts =
      in: new noflo.Port 'object'
      raw: new noflo.Port 'boolean'
    @outPorts =
      out: new noflo.Port 'string'

    @inPorts.raw.on 'data', (raw) =>
      @raw = String(raw) is 'true'

    @inPorts.in.on 'begingroup', (group) =>
      @outPorts.out.beginGroup group

    @inPorts.in.on 'data', (data) =>
      if @raw and _.isString data
        @outPorts.out.send data
        return

      @outPorts.out.send JSON.stringify data

    @inPorts.in.on 'endgroup', (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

exports.getComponent = -> new Jsonify
