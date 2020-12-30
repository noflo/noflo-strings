const noflo = require('noflo');

let btoa;
if (!noflo.isBrowser()) {
  // eslint-disable-next-line global-require
  btoa = require('btoa');
} else {
  ({
    btoa,
  } = window);
}

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'This component receives strings or Buffers and sends them out Base64-encoded';

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
    if (!input.hasStream('in')) { return; }
    const stream = input.getStream('in');

    const brackets = [];
    let string = '';
    stream.forEach((packet) => {
      if (packet.type === 'openBracket') {
        brackets.push(packet.data);
        return;
      }
      if (packet.type === 'data') {
        if (!noflo.isBrowser() && packet.data instanceof Buffer) {
          string += packet.data.toString('utf-8');
          return;
        }
        string += packet.data;
      }
    });

    brackets.forEach((bracket) => {
      output.send({ out: new noflo.IP('openBracket', bracket) });
    });
    output.send({ out: btoa(string) });
    brackets.reverse();
    brackets.forEach((bracket) => {
      output.send({ out: new noflo.IP('closeBracket', bracket) });
    });
    output.done();
  });
};
