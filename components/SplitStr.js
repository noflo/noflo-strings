const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'The SplitStr component receives a string in the in port, splits it by string specified in the delimiter port, and send each part as a separate packet to the out port';

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to split',
  });
  c.inPorts.add('delimiter', {
    datatype: 'string',
    description: 'Delimiter used to split',
    control: true,
    default: '\n',
  });
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'Split off elements from the input string (one element per IP)',
  });

  return c.process((input, output) => {
    if (!input.hasData('in')) { return; }

    let delimiter = input.has('delimiter') ? input.getData('delimiter') : '\n';
    const first = delimiter.substr(0, 1);
    const last = delimiter.substr(delimiter.length - 1, 1);
    if ((first === '/') && (last === '/') && (delimiter.length > 1)) {
      // Handle regular expressions and not simply a slash
      delimiter = new RegExp(delimiter.substr(1, delimiter.length - 2));
    }

    const data = input.getData('in');
    const strings = data.split(delimiter);
    strings.forEach((string) => {
      output.send({ out: string });
    });
    output.done();
  });
};
