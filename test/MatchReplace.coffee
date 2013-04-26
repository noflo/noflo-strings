test = require "noflo-test"

test.component("strings/MatchReplace").
  discuss("provide an array containing potential matches").
    send.connect("match").
      send.data("match", { a1: "a2", b3: "b4" }).
    send.disconnect("match").
  discuss("give it a string").
    send.data("in", "b3").
    send.data("in", "c5").
  discuss("get the replacement").
    receive.data("out", "b4").
    receive.data("out", "c5").

export module
