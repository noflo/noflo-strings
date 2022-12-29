const noflo = require('noflo');
exports.getComponent = () => {
  const c = new noflo.Component();
  c.inPorts.add('in', {
    datatype: 'string',
  });
  c.inPorts.add('append', {
    datatype: 'string',
    control: true,
  });
  c.outPorts.add('out', {
    datatype: 'string',
  });
  return c.process((input, output) => {
    if (!input.hasData('in', 'append')) {
      return;
    }
    const [value, append] = input.getData('in', 'append');
    output.sendDone({
      out: `${value}${append}`,
    });
  });
};
