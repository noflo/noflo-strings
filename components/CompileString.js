const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Concatenate received strings with the given delimiter at the end of a stream';

  c.inPorts.add('delimiter', {
    datatype: 'string',
    description: 'String used to concatenate input strings',
    default: '\n',
    control: true,
  });
  c.inPorts.add('in', {
    datatype: 'string',
    description: 'Strings to concatenate (one per IP)',
  });
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'Concatenation of input strings',
  });

  c.forwardBrackets = {};
  return c.process((input, output) => {
    if (!input.hasStream('in')) { return; }
    const stream = input.getStream('in');

    const brackets = [];
    const strings = [];
    stream.forEach((packet) => {
      if (packet.type === 'openBracket') {
        brackets.push(packet.data);
        return;
      }
      if (packet.type === 'data') {
        strings.push(packet.data);
      }
    });

    const delimiter = input.has('delimiter') ? input.getData('delimiter') : '\n';
    brackets.forEach((bracket) => {
      output.send({ out: new noflo.IP('openBracket', bracket) });
    });
    output.send({ out: strings.join(delimiter) });
    brackets.reverse();
    brackets.forEach((bracket) => {
      output.send({ out: new noflo.IP('closeBracket', bracket) });
    });
    output.done();
  });
};
