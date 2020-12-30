/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Parse a string to an integer';
  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to parse as int representation',
  });
  c.inPorts.add('base', {
    datatype: 'number',
    description: 'Base used to parse the string representation',
    control: true,
    default: 10,
  });
  c.outPorts.add('out', {
    datatype: 'number',
    description: 'Parsed number',
  });

  return c.process((input, output) => {
    if (!input.has('in')) { return; }
    const data = input.getData('in');

    const base = input.has('base') ? input.getData('base') : 10;

    return output.sendDone({ out: parseInt(data, base) });
  });
};
