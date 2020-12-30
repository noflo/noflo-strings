const noflo = require('noflo');
const _ = require('underscore');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'interlaces two arrays of string into a string';

  c.inPorts.add('in', {
    datatype: 'array',
    description: 'Array to interlace (2 consecutive IPs)',
  });
  c.inPorts.add('assoc', {
    datatype: 'string',
    control: true,
    default: ':',
  });
  c.inPorts.add('delim', {
    datatype: 'string',
    control: true,
    default: ',',
  });
  c.outPorts.add('out',
    { datatype: 'string' });

  return c.process((input, output) => {
    if (!input.has('in')) { return; }

    // Look into the buffer to see if we have two data packets
    const port = c.inPorts.in;
    const buf = input.scope ? port.scopedBuffer[input.scope] : port.buffer;
    const data = buf.filter((ip) => ip.type === 'data');
    if (data.length < 2) { return; }
    let strings = [];
    while (strings.length !== 2) {
      const packet = input.get('in');
      if (packet.type === 'data') {
        strings.push(packet.data);
      }
    }

    const assoc = input.has('assoc') ? input.getData('assoc') : ':';
    const delim = input.has('delim') ? input.getData('delim') : ',';

    const paired = _.zip(strings[0], strings[1]);
    strings = _.map(paired, ((pair) => pair.join(assoc)));
    output.sendDone({ out: strings.join(delim) });
  });
};
