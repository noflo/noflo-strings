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

  brackets = {}
  strings = {}
  c.process (input, output) ->
    # Force auto-ordering to be off for this one
    c.autoOrdering = false

    return unless input.has 'in'
    data = input.get 'in'
    if data.type is 'openBracket'
      brackets[data.scope] = [] unless brackets[data.scope]
      brackets[data.scope].push data.data
    if data.type is 'closeBracket'
      return unless brackets[data.scope]
      bracketId = brackets[data.scope].join ':'
      if strings[data.scope]?[bracketId]
        delimiter = if input.has('delimiter') then input.getData('delimiter') else "\n"

        for bracket in brackets[data.scope]
          output.sendIP 'out', new noflo.IP 'openBracket', bracket

        output.send
          out: strings[data.scope][bracketId].join delimiter

        for bracket in brackets[data.scope]
          output.sendIP 'out', new noflo.IP 'closeBracket', bracket

        delete strings[data.scope][bracketId]
        output.done()
      brackets[data.scope].pop() if brackets[data.scope]
    if data.type is 'data'
      return unless brackets[data.scope]
      bracketId = brackets[data.scope].join ':'
      strings[data.scope] = {} unless strings[data.scope]
      strings[data.scope][bracketId] = [] unless strings[data.scope][bracketId]
      strings[data.scope][bracketId].push data.data

  c.shutdown = ->
    strings = {}
    brackets = {}

  c
