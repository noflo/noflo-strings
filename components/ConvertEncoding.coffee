noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Convert a string or a buffer from one encoding to another.
    Default from UTF-8 to Base64'

  c.inPorts.add 'in',
    datatype: 'all'
    description: 'Buffer or string to be converted'
  c.inPorts.add 'from',
    datatype: 'string'
    description: 'Input encoding'
    default: 'utf8'
    control: true
  c.inPorts.add 'to',
    datatype: 'string'
    description: 'Output encoding'
    default: 'base64'
    control: true
  c.outPorts.add 'out',
    datatype: 'string'
    description: 'Converted string'

  c.process (input, output) ->
    return unless input.has 'in'

    from = if input.has('from') then input.getData('from') else 'utf8'
    to = if input.has('to') then input.getData('to') else 'base64'

    data = input.get 'in'
    return unless data.type is 'data'

    result = ''
    if data.data instanceof Buffer
      result += data.data.toString from
    else if typeof data.data is 'string'
      result += new Buffer(data.data, from).toString()

    output.sendDone
      out: new Buffer(result).toString to
