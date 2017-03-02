noflo = require 'noflo'

unless noflo.isBrowser()
  btoa = require 'btoa'
else
  btoa = window.btoa

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'This component receives strings or Buffers and sends them out
  Base64-encoded'

  c.inPorts.add 'in',
    datatype: 'all'
    description: 'Buffer or string to encode'
  c.outPorts.add 'out',
    datatype: 'string'
    description: 'Encoded input'

  c.forwardBrackets = {}
  c.process (input, output) ->
    return unless input.hasStream 'in'
    stream = input.getStream 'in'

    brackets = []
    string = ''
    for packet in stream
      if packet.type is 'openBracket'
        brackets.push packet.data
        continue
      if packet.type is 'data'
        if not noflo.isBrowser() and packet.data instanceof Buffer
          string += packet.data.toString 'utf-8'
          continue
        string += packet.data
        continue

    for bracket in brackets
      output.send
        out: new noflo.IP 'openBracket', bracket
    output.send
      out: btoa string
    brackets.reverse()
    for bracket in brackets
      output.send
        out: new noflo.IP 'closeBracket', bracket
    output.done()
