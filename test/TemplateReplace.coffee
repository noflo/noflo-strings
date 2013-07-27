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

export module
