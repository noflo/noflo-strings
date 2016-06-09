noflo = require("noflo")

exports.getComponent = ->
  c = new noflo.Component
  c.description = "filters an IP which is a string using a regex"

  c.inPorts.add 'in',
    datatype: 'string'
    description: 'String to filter'
  c.inPorts.add 'pattern',
    datatype: 'string'
    description: 'String representation of a regexp used as filter'
    control: true
    required: true
  c.outPorts.add 'out',
    datatype: 'string'
    description: 'String passing the filter'
  c.outPorts.add 'missed',
    datatype: 'string'
    description: 'String failing the filter'

  c.forwardBrackets =
    in: ['out', 'missed']

  c.process (input, output) ->
    return unless input.has 'in', 'pattern'
    data = input.getData 'in'
    return unless data

    regex = new RegExp input.getData 'pattern'

    unless typeof data is 'string'
      data = (data).toString()
    if regex? and data?.match?(regex)?
      output.sendDone
        out: data
      return
    output.sendDone
      missed: data
