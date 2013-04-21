noflo = require("noflo")
_ = require("underscore")

class TryParseJson extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port()
    @outPorts =
      out: new noflo.Port()

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      if _.isObject(data)
        for key, value of data
          try
            data[key] = JSON.parse(value)
          catch e

      @outPorts.out.send(data)

    @inPorts.in.on "endgroup", =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new TryParseJson
