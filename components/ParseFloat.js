const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Parse a string to a float';
  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to parse as Float representation',
  });
  c.outPorts.add('out', {
    datatype: 'number',
    description: 'Parsed number',
  });

  return c.process((input, output) => {
    const data = input.getData('in');
    output.sendDone({ out: parseFloat(data) });
  });
};
