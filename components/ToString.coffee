noflo = require 'noflo'

exports.getComponent = () ->
  c = new noflo.Component
  c.description = 'Convert the input into a string using toString()'

  c.inPorts.add 'in',
    datatype: 'all'

  c.outPorts.add 'out',
    datatype: 'string'

  noflo.helpers.MapComponent c, (data, groups, out) ->
    out.send data.toString()

  c
