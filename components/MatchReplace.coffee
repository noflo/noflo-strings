noflo = require "noflo"
_ = require "underscore"

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Replace string packets using a dictionary'

  c.inPorts.add 'in',
    datatype: 'string'
  c.inPorts.add 'match',
    datatype: 'object'
    description: 'Dictionary object with key matching
     the input object and value being the replacement item'
    control: true
    required: true
  c.outPorts.add 'out',
    datatype: 'string'

  c.process (input, output) ->
    return unless input.has 'in', 'match'
    match = input.getData 'match'
    return unless match
    return unless _.isObject match

    string = input.getData 'in'
    return unless string

    matches = {}
    matchKeys = []
    for fromMatch, toMatch of match
      matches[fromMatch.toString()] = toMatch.toString()
    matchKeys = _.keys matches

    matchKeyIndex = matchKeys.indexOf string.toString()

    if matchKeyIndex > -1
      string = matches[matchKeys[matchKeyIndex]]

    output.sendDone
      out: string
