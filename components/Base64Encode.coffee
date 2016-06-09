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

  brackets = {}
  scope = {}
  rawData = {}
  encodedData = {}

  c.forwardBrackets = {}
  c.autoOrdering = false

  c.process (input, output) ->
    return unless input.has 'in'
    data = input.get 'in'
    if data.type is 'openBracket'
      brackets[data.scope] = [] unless brackets[data.scope]
      brackets[data.scope].push data.data
    if data.type is 'closeBracket'
      brackets[data.scope].pop() if brackets[data.scope]
    if data.type is 'data'
      scope[data.scope] = if brackets[data.scope] then brackets[data.scope].slice(0) else []
      if not noflo.isBrowser() and data instanceof Buffer
        encodedData[data.scope] = '' unless encodedData[data.scope]
        encodedData[data.scope] += btoa data.data
      else
        rawData[data.scope] = '' unless rawData[data.scope]
        rawData[data.scope] += data.data

    if data.type in ['data', 'closeBracket'] and brackets[data.scope].length is 0

      for bracket in scope[data.scope]
        output.sendIP 'out', new noflo.IP 'openBracket', bracket

      if encodedData[data.scope]?.length
        output.send
          out: encodedData[data.scope]
        delete encodedData[data.scope]
        return
      else
        rawData[data.scope] = '' unless rawData[data.scope]
        output.send
          out: btoa rawData[data.scope]
        delete rawData[data.scope]

      for bracket in scope[data.scope]
        output.sendIP 'out', new noflo.IP 'closeBracket', bracket

      output.done()
    return

  c.shutdown = ->
    brackets = {}
    scope = {}
    rawData = {}
    encodedData = {}

  c
