test = require "noflo-test"

patterns =
  "&adjective": "happy"
  "&noun": "person"

test.component("strings/TemplateReplace").
  discuss("pass in a template").
    send.data("template", "I am a &adjective &noun.").
  discuss("pass in an object containing patterns and replacements").
    send.data("in", patterns).
  discuss("out comes the new string").
    receive.data("out", "I am a happy person.").

  next().
  discuss("pass in a template").
    send.data("template", "I am a &adjective &noun.").
  discuss("pass in a series of a tokens").
    send.connect("token").
    send.data("token", "&adjective").
    send.data("token", "&noun").
  discuss("pass in a series of a values in the same order").
    send.connect("in").
    send.data("in", "happy").
    send.data("in", "person").
    send.disconnect("in").
  discuss("out comes the new string").
    receive.data("out", "I am a happy person.").

export module
