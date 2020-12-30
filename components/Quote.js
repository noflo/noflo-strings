const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'quote the incoming string IPs';

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to put quote around',
  });
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'Quoted input string',
  });

  return c.process((input, output) => {
    const data = input.getData('in');
    if (!data) { return; }
    output.sendDone({ out: `'${data}'` });
  });
};
