noflo = require "noflo"
_ = require "underscore"

exports.getComponent = ->
  c = new noflo.Component
  c.description = "The inverse of 'Replace': fix the template and pass in
  an object of patterns and replacements."

  c.inPorts.add 'in',
    datatype: 'object'
  c.inPorts.add 'token',
    datatype: 'string'
  c.inPorts.add 'template',
    datatype: 'string'
    control: true
  # Default value for non-string input
  c.inPorts.add 'default',
    datatype: 'string'
    control: true
  c.outPorts.add 'out',
    datatype: 'string'

  c.process (input, output) ->
    return unless input.has 'template', 'in'

    template = input.getData 'template'
    return unless _.isString template

    defaults = if input.has('default') then input.getData('default') else ''

    inputPort = c.inPorts.in
    inputBuf = if input.scope then inputPort.scopedBuffer[input.scope] else inputPort.buffer
    inputData = inputBuf.filter (ip) -> ip.type is 'data'
    return unless inputData.length

    # Accept a map of replacements
    if _.isObject inputData[0].data
      data = input.get 'in'

      result = template
      for pattern, replacement of data.data
        pattern = new RegExp(pattern, "g")
        result = result.replace pattern, replacement

      # Send immediately
      output.sendDone
        out: result
      return

    # Also accept a series of IPs
    c.autoOrdering = false
    tokenPort = c.inPorts.token
    tokenBuf = if input.scope then tokenPort.scopedBuffer[input.scope] else tokenPort.buffer
    tokenData = tokenBuf.filter (ip) -> ip.type is 'data'
    # There must be tokens
    return unless tokenData.length
    return if inputData.length < tokenData.length

    strings = []
    tokens = []
    while strings.length < tokenData.length
      packet = input.get 'in'
      continue unless packet.type is 'data'
      strings.push packet.data
    while tokens.length < tokenData.length
      packet = input.get 'token'
      continue unless packet.type is 'data'
      tokens.push new RegExp packet.data, 'g'

    result = template
    for string in strings
      token = tokens.shift()
      replacement = if _.isString string then string else defaults
      result = result.replace token, replacement

    output.sendDone
      out: result
