noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
  c.description = ' The SplitStr component receives a string in the in port,
    splits it by string specified in the delimiter port, and send each part as
    a separate packet to the out port'

  c.inPorts.add 'in',
    datatype: 'string'
    description: 'String to split'
  c.inPorts.add 'delimiter',
    datatype: 'string'
    description: 'Delimiter used to split'
    control: true
    default: "\n"
  c.outPorts.add 'out',
    datatype: 'string'
    description: 'Split off elements from the input
     string (one element per IP)'

  c.process (input, output) ->
    return unless input.hasData 'in'

    delimiter = if input.has('delimiter') then input.getData('delimiter') else "\n"
    first = delimiter.substr 0, 1
    last = delimiter.substr delimiter.length - 1, 1
    if first is '/' and last is '/' and delimiter.length > 1
      # Handle regular expressions and not simply a slash
      delimiter = new RegExp delimiter.substr 1, delimiter.length - 2

    data = input.getData 'in'
    strings = data.split delimiter
    for string in strings
      output.send
        out: string
    output.done()
