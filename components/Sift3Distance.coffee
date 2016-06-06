noflo = require("noflo")

sift3 = (s1, s2) ->
  if not s1? or s1.length is 0
    if not s2? or s2.length is 0
      return 0
    else
      return s2.length
  return s1.length  if not s2? or s2.length is 0
  c = offset1 = offset2 = lcs = 0
  maxOffset = 5
  while (c + offset1 < s1.length) and (c + offset2 < s2.length)
    if s1[c + offset1] is s2[c + offset2]
      lcs++
    else
      offset1 = offset2 = i = 0

      while i < maxOffset
        if (c + i < s1.length) and (s1[c + i] is s2[c])
          offset1 = i
          break
        if (c + i < s2.length) and (s1[c] is s2[c + i])
          offset2 = i
          break
        i++
    c++
  (s1.length + s2.length) / 2 - lcs

exports.getComponent = ->
  c = new noflo.Component
  c.description = "Compare distance between two strings using Sift3 algorithm"

  c.inPorts.add 'string1',
    datatype: 'string'
  c.inPorts.add 'string2',
    datatype: 'string'

  c.outPorts.add 'out',
    datatype: 'number'

  c.forwardBrackets =
    string2: ['out']

  c.process (input, output) ->
    return unless input.has 'string1', 'string2'
    s1 = input.get 'string1'
    until s1.type is 'data'
      s1 = input.get 'string1'
    return unless s1.type is 'data'

    s2 = input.get 'string2'
    until s2.type is 'data'
      s2 = input.get 'string2'
    return unless s2.type is 'data'

    output.sendDone
      out: sift3 s1.data, s2.data
