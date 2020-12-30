const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Escape all quotes in a string';

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to escape quotes from',
  });
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'Escaped string',
  });

  return c.process((input, output) => {
    const data = input.getData('in');
    output.sendDone({ out: data.replace(/"/g, '\\"') });
  });
};
