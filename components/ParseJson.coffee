noflo = require "noflo"
_ = require "underscore"

class ParseJson extends noflo.Component
  constructor: ->
    @try = true

    @inPorts =
      in: new noflo.Port()
      try: new noflo.Port()
    @outPorts =
      out: new noflo.Port()

    @inPorts.in.on "data", (data) =>
      @try = false if data is "false"

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup group

    @inPorts.in.on "data", (data) =>
      try
        data = JSON.parse data
      catch e
        data = JSON.parse data unless @try

      @outPorts.out.send data

    @inPorts.in.on "endgroup", =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new ParseJson
