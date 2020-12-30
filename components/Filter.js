const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'filters an IP which is a string using a regex';

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to filter',
  });
  c.inPorts.add('pattern', {
    datatype: 'string',
    description: 'String representation of a regexp used as filter',
    control: true,
    required: true,
  });
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'String passing the filter',
  });
  c.outPorts.add('missed', {
    datatype: 'string',
    description: 'String failing the filter',
  });

  c.forwardBrackets = { in: ['out', 'missed'] };

  return c.process((input, output) => {
    if (!input.has('in', 'pattern')) { return; }
    let data = input.getData('in');
    if (!data) { return; }

    const regex = new RegExp(input.getData('pattern'));

    if (typeof data !== 'string') {
      data = (data).toString();
    }

    if ((regex != null) && (data.match && data.match(regex))) {
      output.sendDone({ out: data });
      return;
    }
    output.sendDone({ missed: data });
  });
};
