/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require('noflo');

exports.getComponent = function() {
  const c = new noflo.Component;
  c.description = 'Produce a substring from a string';

  c.inPorts.add('index', {
    datatype: 'int',
    description: 'Index of the sub part ',
    control: true
  }
  );
  c.inPorts.add('limit', {
    datatype: 'int',
    description: 'Limit of the sub part',
    control: true
  }
  );
  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to extract a sub part from'
  }
  );
  c.outPorts.add('out',
    {datatype: 'string'});

  return c.process(function(input, output) {
    if (!input.has('in')) { return; }
    const data = input.get('in');
    if (data.type !== 'data') { return; }
    const index = input.has('index') ? input.getData('index') : 0;
    const limit = input.has('limit') ? input.getData('limit') : undefined;

    return output.sendDone({
      out: data.data.substr(index, limit)});
  });
};
