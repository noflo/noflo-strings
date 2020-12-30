/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require("noflo");

exports.getComponent = function() {
  const c = new noflo.Component;
  c.description = "quote the incoming string IPs";

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to put quote around'
  }
  );
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'Quoted input string'
  }
  );

  return c.process(function(input, output) {
    const data = input.getData('in');
    if (!data) { return; }
    return output.sendDone({
      out: `'${data}'`});
  });
};
