test = require "noflo-test"

input =
  a: 1
  b:
    c: 2
    d: [3, 4]

test.component("strings/Stringify").
  discuss("stringify a simple object").
    send.connect("in").
      send.data("in", input).
    send.disconnect("in").
  discuss("become a string using the default associator and delimitor").
    receive.data("out", "a:1,b:#{JSON.stringify(input.b)}").

  next().
  discuss("stringifies an object with configurable associator and delimiter").
    send.connect("assoc").
      send.data("assoc", "=").
    send.disconnect("assoc").
    send.connect("delim").
      send.data("delim", "|").
    send.disconnect("delim").
  discuss("send in the content").
    send.connect("in").
      send.data("in", input).
    send.disconnect("in").
  discuss("become a string using a custom associator and delimitor").
    receive.data("out", "a=1|b=#{JSON.stringify(input.b)}").

export module
