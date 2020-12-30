/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require('noflo');
const _ = require('underscore');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Produce a string from input data with a given template';

  c.inPorts.add('template', {
    datatype: 'string',
    description: 'Templating string',
    control: true,
    required: true,
  });
  c.inPorts.add('in', {
    datatype: 'object',
    description: 'Object containing key/value set used to run the template',
  });
  c.outPorts.add('out',
    { datatype: 'string' });

  return c.process((input, output) => {
    if (!input.has('in', 'template')) { return; }

    const data = input.get('in');
    if (data.type !== 'data') { return; }

    const template = _.template(input.getData('template'));
    return output.sendDone({ out: template(data.data) });
  });
};
