const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Send a string when receiving a packet';

  c.inPorts.add('string', {
    datatype: 'string',
    description: 'String to send',
    control: true,
  });
  c.inPorts.add('in', {
    datatype: 'bang',
    description: 'Send the string out',
  });
  c.outPorts.add('out',
    { datatype: 'string' });

  return c.process((input, output) => {
    if (!input.has('string', 'in')) { return; }
    input.getData('in');
    output.sendDone({ out: input.getData('string') });
  });
};
