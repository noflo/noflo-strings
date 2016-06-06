noflo = require("noflo")

exports.getComponent = ->
  c = new noflo.Component
  c.description = "quote the incoming string IPs"

  c.inPorts.add 'in',
    datatype: 'string'
    description: 'String to put quote around'
  c.outPorts.add 'out',
    datatype: 'string'
    description: 'Quoted input string'

  c.process (input, output) ->
    data = input.getData 'in'
    return unless data
    output.sendDone
      out: "'#{data}'"
