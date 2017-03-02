noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Concatenate received strings with the given delimiter at the end of a stream'

  c.inPorts.add 'delimiter',
    datatype: 'string'
    description: 'String used to concatenate input strings'
    default: "\n"
    control: true
  c.inPorts.add 'in',
    datatype: 'string'
    description: 'Strings to concatenate (one per IP)'
  c.outPorts.add 'out',
    datatype: 'string'
    description: 'Concatenation of input strings'

  c.forwardBrackets = {}
  c.process (input, output) ->
    return unless input.hasStream 'in'
    stream = input.getStream 'in'

    brackets = []
    strings = []
    for packet in stream
      if packet.type is 'openBracket'
        brackets.push packet.data
        continue
      if packet.type is 'data'
        strings.push packet.data
        continue

    delimiter = if input.has('delimiter') then input.getData('delimiter') else "\n"
    for bracket in brackets
      output.send
        out: new noflo.IP 'openBracket', bracket
    output.send
      out: strings.join delimiter
    brackets.reverse()
    for bracket in brackets
      output.send
        out: new noflo.IP 'closeBracket', bracket
    output.done()
