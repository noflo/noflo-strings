/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'JSONify all incoming, unless a raw flag is set to \
exclude data packets that are pure strings';

  c.inPorts.add('in', {
    datatype: 'object',
    description: 'Object to convert into a JSON representation',
  });
  c.inPorts.add('raw', {
    datatype: 'boolean',
    description: 'Whether to send strings as is',
    default: false,
    control: true,
  });
  c.inPorts.add('pretty', {
    datatype: 'boolean',
    description: 'Make JSON output pretty',
    default: false,
    control: true,
  });
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'JSON representation of the input object',
  });

  return c.process((input, output) => {
    if (!input.has('in')) { return; }
    const data = input.getData('in');
    if (!data) { return; }

    let raw = false;
    if (input.has('raw')) {
      raw = String(input.getData('raw')) === 'true';
    }
    let pretty = false;
    if (input.has('pretty')) {
      pretty = String(input.getData('pretty')) === 'true';
    }

    if (raw && (typeof data === 'string')) {
      output.sendDone({ out: data });
      return;
    }

    if (pretty) {
      output.sendDone({ out: JSON.stringify(data, null, 4) });
      return;
    }

    return output.sendDone({ out: JSON.stringify(data) });
  });
};
