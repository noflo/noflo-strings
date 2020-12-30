/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let btoa;
const noflo = require('noflo');

if (!noflo.isBrowser()) {
  btoa = require('btoa');
} else {
  ({
    btoa,
  } = window);
}

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'This component receives strings or Buffers and sends them out \
Base64-encoded';

  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Buffer or string to encode',
  });
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'Encoded input',
  });

  c.forwardBrackets = {};
  return c.process((input, output) => {
    let bracket;
    if (!input.hasStream('in')) { return; }
    const stream = input.getStream('in');

    const brackets = [];
    let string = '';
    for (const packet of Array.from(stream)) {
      if (packet.type === 'openBracket') {
        brackets.push(packet.data);
        continue;
      }
      if (packet.type === 'data') {
        if (!noflo.isBrowser() && packet.data instanceof Buffer) {
          string += packet.data.toString('utf-8');
          continue;
        }
        string += packet.data;
        continue;
      }
    }

    for (bracket of Array.from(brackets)) {
      output.send({ out: new noflo.IP('openBracket', bracket) });
    }
    output.send({ out: btoa(string) });
    brackets.reverse();
    for (bracket of Array.from(brackets)) {
      output.send({ out: new noflo.IP('closeBracket', bracket) });
    }
    return output.done();
  });
};
