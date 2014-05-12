noflo = require 'noflo'

# @runtime noflo-nodejs

class ConvertEncoding extends noflo.Component
  description: 'Convert a string or a buffer from one encoding to another.
    Default from UTF-8 to Base64'

  constructor: ->
    # From this encoding...
    @from = 'utf8'
    # To this encoding
    @to = 'base64'
    # The work-in-progress string
    @wip = ''

    @inPorts = new noflo.InPorts
      in:
        datatype: 'all'
        description: 'Buffer or string to be converted'
      from:
        datatype: 'string'
        description: 'Input encoding'
      to:
        datatype: 'string'
        description: 'Output encoding'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'
        description: 'Converted string'

    @inPorts.from.on 'data', (@from) =>
    @inPorts.to.on 'data', (@to) =>

    @inPorts.in.on 'connect', =>
      @wip = ''

    @inPorts.in.on 'data', (data) =>
      if data instanceof Buffer
        @wip += data.toString @from
      else if typeof data is 'string'
        @wip += new Buffer(data, @from).toString()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.send new Buffer(@wip).toString @to
      @outPorts.out.disconnect()

exports.getComponent = -> new ConvertEncoding
