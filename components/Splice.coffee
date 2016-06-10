noflo = require("noflo")
_ = require("underscore")

exports.getComponent = ->
  c = new noflo.Component
  c.description = "interlaces two arrays of string into a string"

  c.inPorts.add 'in',
    datatype: 'array'
    description: 'Array to interlace (2 consecutive IPs)'
  c.inPorts.add 'assoc',
    datatype: 'string'
    control: true
    default: ':'
  c.inPorts.add 'delim',
    datatype: 'string'
    control: true
    default: ','
  c.outPorts.add 'out',
    datatype: 'string'

  c.process (input, output) ->
    return unless input.has 'in'

    # Look into the buffer to see if we have two data packets
    port = c.inPorts.in
    buf = if input.scope then port.scopedBuffer[input.scope] else port.buffer
    data = buf.filter (ip) -> ip.type is 'data'
    return if data.length < 2
    strings = []
    until strings.length is 2
      packet = input.get 'in'
      continue unless packet.type is 'data'
      strings.push packet.data

    assoc = if input.has('assoc') then input.getData('assoc') else ':'
    delim = if input.has('delim') then input.getData('delim') else ','

    paired = _.zip strings[0], strings[1]
    strings = _.map(paired, ((pair) -> pair.join(assoc)))
    output.sendDone
      out: strings.join delim
