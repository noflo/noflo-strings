/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require('noflo');

exports.getComponent = function() {
  const c = new noflo.Component;
  c.description = ` The SplitStr component receives a string in the in port, \
splits it by string specified in the delimiter port, and send each part as \
a separate packet to the out port`;

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to split'
  }
  );
  c.inPorts.add('delimiter', {
    datatype: 'string',
    description: 'Delimiter used to split',
    control: true,
    default: "\n"
  }
  );
  c.outPorts.add('out', {
    datatype: 'string',
    description: `Split off elements from the input \
string (one element per IP)`
  }
  );

  return c.process(function(input, output) {
    if (!input.hasData('in')) { return; }

    let delimiter = input.has('delimiter') ? input.getData('delimiter') : "\n";
    const first = delimiter.substr(0, 1);
    const last = delimiter.substr(delimiter.length - 1, 1);
    if ((first === '/') && (last === '/') && (delimiter.length > 1)) {
      // Handle regular expressions and not simply a slash
      delimiter = new RegExp(delimiter.substr(1, delimiter.length - 2));
    }

    const data = input.getData('in');
    const strings = data.split(delimiter);
    for (let string of Array.from(strings)) {
      output.send({
        out: string});
    }
    return output.done();
  });
};
