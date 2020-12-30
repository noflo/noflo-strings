const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Convert a string or a buffer from one encoding to another. Default from UTF-8 to Base64';

  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Buffer or string to be converted',
  });
  c.inPorts.add('from', {
    datatype: 'string',
    description: 'Input encoding',
    default: 'utf8',
    control: true,
  });
  c.inPorts.add('to', {
    datatype: 'string',
    description: 'Output encoding',
    default: 'base64',
    control: true,
  });
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'Converted string',
  });

  return c.process((input, output) => {
    if (!input.has('in')) { return; }

    const from = input.has('from') ? input.getData('from') : 'utf8';
    const to = input.has('to') ? input.getData('to') : 'base64';

    const data = input.get('in');
    if (data.type !== 'data') { return; }

    let result = '';
    if (data.data instanceof Buffer) {
      result += data.data.toString(from);
    } else if (typeof data.data === 'string') {
      result += Buffer.from(data.data, from).toString();
    }

    output.sendDone({ out: Buffer.from(result).toString(to) });
  });
};
