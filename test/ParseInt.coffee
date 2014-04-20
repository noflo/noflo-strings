test = require 'noflo-test'

test.component('strings/ParseInt').
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
  discuss('receive 0').
    receive.data('out', 0).

  next().
  discuss('try "qgpowqpo"').
    send.connect('in').
      send.data('in', 'qgpowqpo').
    send.disconnect('in').
  discuss('receive NaN').
    receive.data('out', NaN).

  next().
  discuss('try "0x42" base 16').
    send.connect('base').
      send.data('base', 16).
    send.disconnect('base').
    send.connect('in').
      send.data('in', '0x42').
    send.disconnect('in').
  discuss('receive 66').
    receive.data('out', 66).

  next().
  discuss('try "11" in base 16').
    send.connect('base').
      send.data('base', 16).
    send.disconnect('base').
    send.connect('in').
      send.data('in', '11').
    send.disconnect('in').
  discuss('receive 17').
    receive.data('out', 17).

export module
