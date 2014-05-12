noflo = require 'noflo'

unless noflo.isBrowser()
  btoa = require 'btoa'
else
  btoa = window.btoa

class Base64Encode extends noflo.Component
  description: 'This component receives strings or Buffers and sends them out
  Base64-encoded'

  constructor: ->
    @data = null
    @encodedData = ''

    # This component has only two ports: an input port
    # and an output port.
    @inPorts = new noflo.InPorts
      in:
        datatype: 'all'
        description: 'Buffer or string to encode'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'
        description: 'Encoded input'

    # Initialize an empty string for receiving data
    # when we get a connection
    @inPorts.in.on 'connect', =>
      @data = ''

    # Process each incoming IP
    @inPorts.in.on 'data', (data) =>
      # In case of Buffers we can just encode them
      # immediately
      if not noflo.isBrowser() and data instanceof Buffer
        @encodedData += btoa data
        return
      # In case of strings we just append to the
      # existing and encode later
      @data += data

    # On disconnection we send out all the encoded
    # data
    @inPorts.in.on 'disconnect', =>
      @outPorts.out.send @encodeData()
      @outPorts.out.disconnect()
      @data = null
      @encodedData = ''

  encodeData: ->
    # In case of Buffers we already have encoded data
    # available
    return @encodedData unless @encodedData is ''
    # In case of strings we need to encode the data
    # first
    return btoa @data

exports.getComponent = -> new Base64Encode
