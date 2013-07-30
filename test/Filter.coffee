test = require "noflo-test"

test.component("strings/Filter").
  discuss("set a pattern to filter").
    send.data("pattern", "a.+c").
  discuss("send some input").
    send.connect("in").
      send.data("in", "abc").
      send.data("in", "a24c").
      send.data("in", "125c").
    send.disconnect("in").
  discuss("only get the unfiltered data IPs").
    receive.data("out", "abc").
    receive.data("out", "a24c").

export module
