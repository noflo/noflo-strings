/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require("noflo");

exports.getComponent = function() {
  const c = new noflo.Component;
  c.description = "toLowerCase on all incoming IPs (assuming they are strings)";

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'Mixed-case string'
  }
  );
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'All-lowercase string'
  }
  );

  return c.process(function(input, output) {
    const data = input.getData('in');
    if (!data) { return; }

    return output.sendDone({
      out: data.toLowerCase()});
  });
};
