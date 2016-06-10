noflo = require("noflo")

exports.getComponent = ->
  c = new noflo.Component
  c.description = "toLowerCase on all incoming IPs (assuming they are strings)"

  c.inPorts.add 'in',
    datatype: 'string'
    description: 'Mixed-case string'
  c.outPorts.add 'out',
    datatype: 'string'
    description: 'All-lowercase string'

  c.process (input, output) ->
    data = input.getData 'in'
    return unless data

    output.sendDone
      out: data.toLowerCase()
