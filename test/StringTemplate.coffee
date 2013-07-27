test = require 'noflo-test'

test.component('strings/StringTemplate').
  discuss('set a template').
    send.data('template', 'Hello <%= name %>').
  discuss('send an object').
    send.data('in', name: 'Foo').
    send.disconnect('in').
  discuss('receive results').
    receive.data('out', 'Hello Foo').
    receive.disconnect('out').

export module
