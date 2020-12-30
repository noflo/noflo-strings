const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Convert the input into a string using toString()';

  c.inPorts.add('in',
    { datatype: 'all' });

  c.outPorts.add('out',
    { datatype: 'string' });

  return c.process((input, output) => {
    const data = input.getData('in');
    output.sendDone({ out: data.toString() });
  });
};
