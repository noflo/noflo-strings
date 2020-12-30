/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require("noflo");
const _ = require("underscore");

exports.getComponent = function() {
  const c = new noflo.Component;
  c.description = `The inverse of 'Replace': fix the template and pass in \
an object of patterns and replacements.`;

  c.inPorts.add('in',
    {datatype: 'object'});
  c.inPorts.add('token',
    {datatype: 'string'});
  c.inPorts.add('template', {
    datatype: 'string',
    control: true
  }
  );
  // Default value for non-string input
  c.inPorts.add('default', {
    datatype: 'string',
    control: true
  }
  );
  c.outPorts.add('out',
    {datatype: 'string'});

  return c.process(function(input, output) {
    let data, packet, replacement, result;
    if (!input.has('template', 'in')) { return; }

    const template = input.getData('template');
    if (!_.isString(template)) { return; }

    const defaults = input.has('default') ? input.getData('default') : '';

    const inputPort = c.inPorts.in;
    const inputBuf = input.scope ? inputPort.scopedBuffer[input.scope] : inputPort.buffer;
    const inputData = inputBuf.filter(ip => ip.type === 'data');
    if (!inputData.length) { return; }

    // Accept a map of replacements
    if (_.isObject(inputData[0].data)) {
      data = input.get('in');

      result = template;
      for (let pattern in data.data) {
        replacement = data.data[pattern];
        pattern = new RegExp(pattern, "g");
        result = result.replace(pattern, replacement);
      }

      // Send immediately
      output.sendDone({
        out: result});
      return;
    }

    // Also accept a series of IPs
    c.autoOrdering = false;
    const tokenPort = c.inPorts.token;
    const tokenBuf = input.scope ? tokenPort.scopedBuffer[input.scope] : tokenPort.buffer;
    const tokenData = tokenBuf.filter(ip => ip.type === 'data');
    // There must be tokens
    if (!tokenData.length) { return; }
    if (inputData.length < tokenData.length) { return; }

    const strings = [];
    const tokens = [];
    while (strings.length < tokenData.length) {
      packet = input.get('in');
      if (packet.type !== 'data') { continue; }
      strings.push(packet.data);
    }
    while (tokens.length < tokenData.length) {
      packet = input.get('token');
      if (packet.type !== 'data') { continue; }
      tokens.push(new RegExp(packet.data, 'g'));
    }

    result = template;
    for (let string of Array.from(strings)) {
      const token = tokens.shift();
      replacement = _.isString(string) ? string : defaults;
      result = result.replace(token, replacement);
    }

    return output.sendDone({
      out: result});
  });
};
