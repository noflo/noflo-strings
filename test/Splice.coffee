test = require "noflo-test"

input1 = ["p", "q", "r"]
input2 = ["x", "y", "z"]

test.component("strings/Splice").
  discuss("interlace two arrays of string into a string").
    send.connect("in").
      send.data("in", input1).
    send.disconnect("in").
    send.connect("in").
      send.data("in", input2).
    send.disconnect("in").
  discuss("the two arrays are fused into a string").
    receive.data("out", "p:x,q:y,r:z").

  next().
  discuss("interlace the arrays with custom associator and delimiter").
    send.connect("assoc").
      send.data("assoc", "=").
    send.disconnect("assoc").
    send.connect("delim").
      send.data("delim", "|").
    send.disconnect("delim").
  discuss("send in the content").
    send.connect("in").
      send.data("in", input1).
    send.disconnect("in").
    send.connect("in").
      send.data("in", input2).
    send.disconnect("in").
  discuss("interlace with custom assoc and delim").
    receive.data("out", "p=x|q=y|r=z").

export module
