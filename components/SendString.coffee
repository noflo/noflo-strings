noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Send a string when receiving a packet'

  c.inPorts.add 'string',
    datatype: 'string'
    description: 'String to send'
    control: true
  c.inPorts.add 'in',
    datatype: 'bang'
    description: 'Send the string out'
  c.outPorts.add 'out',
    datatype: 'string'

  c.process (input, output) ->
    return unless input.has 'string', 'in'
    data = input.getData 'in'
    output.sendDone
      out: input.getData 'string'
