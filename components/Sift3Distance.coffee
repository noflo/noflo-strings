noflo = require("noflo")

class Sift3Distance extends noflo.Component

  description: "Compare distance between two strings using Sift3 algorithm"

  constructor: ->
    @s1 = ''
    @s2 = ''

    @inPorts =
      string1: new noflo.Port 'string'
      string2: new noflo.Port 'string'
    @outPorts =
      out: new noflo.Port 'number'

    @inPorts.string1.on "data", (data) =>
      @s1 = data

    @inPorts.string2.on "data", (data) =>
      @s2 = data
      @outPorts.out.send @sift3 @s1, @s2

  sift3: (s1, s2) ->
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

exports.getComponent = -> new Sift3Distance