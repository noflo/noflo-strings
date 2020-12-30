const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'toLowerCase on all incoming IPs (assuming they are strings)';

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'Mixed-case string',
  });
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'All-lowercase string',
  });

  return c.process((input, output) => {
    const data = input.getData('in');
    if (!data) { return; }

    output.sendDone({ out: data.toLowerCase() });
  });
};
