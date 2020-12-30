const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Parse a JSON string';

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'JSON description to parse',
  });
  c.outPorts.add('out', {
    datatype: 'object',
    description: 'Parsed object',
  });
  c.outPorts.add('error',
    { datatype: 'object' });

  return c.process((input, output) => {
    let result;
    if (!input.has('in')) { return; }
    const data = input.getData('in');
    if (!data) { return; }

    try {
      result = JSON.parse(data);
    } catch (e) {
      output.sendDone(e);
      return;
    }

    output.sendDone({ out: result });
  });
};
