noflo = require("noflo")
_ = require("underscore")

class SpliceString extends noflo.Component

  description: "interlaces two arrays of string into a string"

  constructor: ->
    @strings = null
    @groups = []
    @assoc = ":"
    @delim = ","

    @inPorts = new noflo.InPorts
      in:
        datatype: 'array'
        description: 'Array to interlace (2 consecutive IPs)'
      assoc:
        datatype: 'string'
      delim:
        datatype: 'string'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'

    @inPorts.assoc.on "data", (@assoc) =>
    @inPorts.delim.on "data", (@delim) =>

    @inPorts.in.on "begingroup", (group) =>
      @groups.push(group)

    @inPorts.in.on "data", (data) =>
      if @strings?
        paired = _.zip(@strings, data)
        strings = _.map(paired, ((pair) => pair.join(@assoc)))
        out = strings.join(@delim)
        groups = _.uniq(@groups)

        for group in groups
          @outPorts.out.beginGroup(group)

        @outPorts.out.send(out)

        for group in groups
          @outPorts.out.endGroup(group)

        @outPorts.out.disconnect()

        @groups = []
        @strings = null

      else
        @strings = data

exports.getComponent = -> new SpliceString
