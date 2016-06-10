noflo = require 'noflo'
_ = require 'underscore'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Produce a string from input data with a given template'

  c.inPorts.add 'template',
    datatype: 'string'
    description: 'Templating string'
    control: true
    required: true
  c.inPorts.add 'in',
    datatype: 'object'
    description: 'Object containing key/value set used to run the template'
  c.outPorts.add 'out',
    datatype: 'string'

  c.process (input, output) ->
    return unless input.has 'in', 'template'

    data = input.get 'in'
    return unless data.type is 'data'

    template = _.template input.getData 'template'
    output.sendDone
      out: template data.data
