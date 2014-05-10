noflo = require 'noflo'
_ = require 'underscore'

class StringTemplate extends noflo.Component
  constructor: ->
    @template = null
    @inPorts = new noflo.InPorts
      template:
        datatype: 'string'
        description: 'Templating string'
      in:
        datatype: 'object'
        description: 'Object containing key/value set used to run the template'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'

    @inPorts.template.on 'data', (data) =>
      @template = _.template data

    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send @template data
    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

exports.getComponent = -> new StringTemplate
