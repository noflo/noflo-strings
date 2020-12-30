/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Parse a JSON string';

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'JSON description to parse',
  });
  c.inPorts.add('try', {
    datatype: 'boolean',
    description: 'Deprecated',
  });
  c.outPorts.add('out', {
    datatype: 'object',
    description: 'Parsed object',
  });
  c.outPorts.add('error',
    { datatype: 'object' });

  c.inPorts.try.on('data', (data) => console.warn('ParseJson try port is deprecated'));

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

    return output.sendDone({ out: result });
  });
};
