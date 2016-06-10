noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
  c.description = "JSONify all incoming, unless a raw flag is set to
  exclude data packets that are pure strings"

  c.inPorts.add 'in',
    datatype: 'object'
    description: 'Object to convert into a JSON representation'
  c.inPorts.add 'raw',
    datatype: 'boolean'
    description: 'Whether to send strings as is'
    default: false
    control: true
  c.inPorts.add 'pretty',
    datatype: 'boolean'
    description: 'Make JSON output pretty'
    default: false
    control: true
  c.outPorts.add 'out',
    datatype: 'string'
    description: 'JSON representation of the input object'

  c.process (input, output) ->
    return unless input.has 'in'
    data = input.getData 'in'
    return unless data

    raw = false
    if input.has 'raw'
      raw = String(input.getData('raw')) is 'true'
    pretty = false
    if input.has 'pretty'
      pretty = String(input.getData('pretty')) is 'true'

    if raw and typeof data is 'string'
      output.sendDone
        out: data
      return

    if pretty
      output.sendDone
        out: JSON.stringify data, null, 4
      return

    output.sendDone
      out: JSON.stringify data
