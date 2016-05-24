test = require "noflo-test"

test.component("strings/Sift3Distance").
  discuss("String 1 is blank").
    send.data("string1", "").
    send.data("string2", "Alpha BC").
    discuss("Expected output distance = 0").
      receive.data("out", 0).
  
  next().

  discuss("Strings are equal").
    send.data("string1", "Cloud Monkey, Hippy").
    send.data("string2", "Cloud Monkey, Hippy").
    discuss("Expected output distance = 0").
      receive.data("out", 0).

  next().

  discuss("String 1 = ABC, String 2 = ACC").
    send.data("string1", "ABC").
    send.data("string2", "ACC").
    discuss("Expected output distance = 2").
    receive.data("out", 2).

  next().

  discuss("String 1 = ABC, String 2 = ACC").
    send.data("string1", "Singapore").
    send.data("string2", "singaporea").
    discuss("Expected output distance = 1.5").
    receive.data("out", 1.5).

export module
