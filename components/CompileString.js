/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require('noflo');

exports.getComponent = function() {
  const c = new noflo.Component;
  c.description = 'Concatenate received strings with the given delimiter at the end of a stream';

  c.inPorts.add('delimiter', {
    datatype: 'string',
    description: 'String used to concatenate input strings',
    default: "\n",
    control: true
  }
  );
  c.inPorts.add('in', {
    datatype: 'string',
    description: 'Strings to concatenate (one per IP)'
  }
  );
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'Concatenation of input strings'
  }
  );

  c.forwardBrackets = {};
  return c.process(function(input, output) {
    let bracket;
    if (!input.hasStream('in')) { return; }
    const stream = input.getStream('in');

    const brackets = [];
    const strings = [];
    for (let packet of Array.from(stream)) {
      if (packet.type === 'openBracket') {
        brackets.push(packet.data);
        continue;
      }
      if (packet.type === 'data') {
        strings.push(packet.data);
        continue;
      }
    }

    const delimiter = input.has('delimiter') ? input.getData('delimiter') : "\n";
    for (bracket of Array.from(brackets)) {
      output.send({
        out: new noflo.IP('openBracket', bracket)});
    }
    output.send({
      out: strings.join(delimiter)});
    brackets.reverse();
    for (bracket of Array.from(brackets)) {
      output.send({
        out: new noflo.IP('closeBracket', bracket)});
    }
    return output.done();
  });
};
