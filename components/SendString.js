/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Send a string when receiving a packet';

  c.inPorts.add('string', {
    datatype: 'string',
    description: 'String to send',
    control: true,
  });
  c.inPorts.add('in', {
    datatype: 'bang',
    description: 'Send the string out',
  });
  c.outPorts.add('out',
    { datatype: 'string' });

  return c.process((input, output) => {
    if (!input.has('string', 'in')) { return; }
    const data = input.getData('in');
    return output.sendDone({ out: input.getData('string') });
  });
};
