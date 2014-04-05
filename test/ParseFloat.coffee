test = require 'noflo-test'

test.component('strings/ParseFloat').
  discuss('try "42px"').
    send.connect('in').
      send.data('in', '42px').
    send.disconnect('in').
  discuss('receive 42').
    receive.data('out', 42).

  next().
  discuss('try "0.12345"').
    send.connect('in').
      send.data('in', '0.12345').
    send.disconnect('in').
  discuss('receive 0.12345').
    receive.data('out', 0.12345).

  next().
  discuss('try "qgpowqpo"').
    send.connect('in').
      send.data('in', 'qgpowqpo').
    send.disconnect('in').
  discuss('receive NaN').
    receive.data('out', NaN).

export module
