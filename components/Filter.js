/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require("noflo");

exports.getComponent = function() {
  const c = new noflo.Component;
  c.description = "filters an IP which is a string using a regex";

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to filter'
  }
  );
  c.inPorts.add('pattern', {
    datatype: 'string',
    description: 'String representation of a regexp used as filter',
    control: true,
    required: true
  }
  );
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'String passing the filter'
  }
  );
  c.outPorts.add('missed', {
    datatype: 'string',
    description: 'String failing the filter'
  }
  );

  c.forwardBrackets =
    {in: ['out', 'missed']};

  return c.process(function(input, output) {
    if (!input.has('in', 'pattern')) { return; }
    let data = input.getData('in');
    if (!data) { return; }

    const regex = new RegExp(input.getData('pattern'));

    if (typeof data !== 'string') {
      data = (data).toString();
    }
    if ((regex != null) && (__guardMethod__(data, 'match', o => o.match(regex)) != null)) {
      output.sendDone({
        out: data});
      return;
    }
    return output.sendDone({
      missed: data});
  });
};

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}