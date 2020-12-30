/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Parse a string to a float';
  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to parse as Float representation',
  });
  c.outPorts.add('out', {
    datatype: 'number',
    description: 'Parsed number',
  });

  return c.process((input, output) => {
    const data = input.getData('in');
    return output.sendDone({ out: parseFloat(data) });
  });
};
