noflo = require "noflo"
_ = require "underscore"

class TemplateReplace extends noflo.Component

  description: "The inverse of 'Replace': fix the template and pass in
  an object of patterns and replacements."

  constructor: ->
    @template = null
    @default = ''

    @inPorts = new noflo.InPorts
      in:
        datatype: 'object'
      template:
        datatype: 'string'
      token:
        datatype: 'string'
      # Default value for non-string input
      default:
        datatype: 'string'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'

    @inPorts.default.on "data", (@default) =>

    @inPorts.template.on "data", (template) =>
      @template = template if _.isString template

    @inPorts.token.on "connect", =>
      @tokens = []
    @inPorts.token.on "data", (token) =>
      @tokens.push token

    @inPorts.in.on "connect", =>
      @output = @template or ""
      @tokenPos = 0

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup group

    @inPorts.in.on "data", (data) =>
      return unless @output?

      # Accept a map of replacements
      if _.isObject data
        for pattern, replacement of data
          pattern = new RegExp(pattern, "g")
          @output = @output.replace pattern, replacement

        # Send immediately
        @outPorts.out.send @output

        # Clean up
        delete @output
        return

      # There must be tokens
      return unless @tokens?

      # Also accept a series of IPs
      token = @tokens[@tokenPos++]
      pattern = new RegExp token, 'g'
      replacement = if _.isString data then data else @default
      @output = @output.replace pattern, replacement

    @inPorts.in.on "endgroup", =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.send @output if @output?
      @outPorts.out.disconnect()

      # Clean up
      delete @output

exports.getComponent = -> new TemplateReplace
