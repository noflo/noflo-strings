const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Given a fixed pattern and its replacement, replace all occurrences in the incoming template.';

  c.inPorts.add('in', {
    datatype: 'string',
    description: 'String to replace pattern in',
  });
  c.inPorts.add('pattern', {
    datatype: 'string',
    description: 'Pattern to replace',
    control: true,
  });
  c.inPorts.add('replacement', {
    datatype: 'string',
    description: 'Replacement for the pattern',
    control: true,
  });
  c.outPorts.add('out',
    { datatype: 'string' });

  return c.process((input, output) => {
    let pattern;
    if (!input.has('in')) { return; }

    if (input.has('pattern')) {
      pattern = new RegExp(input.getData('pattern'), 'g');
    }
    let replacement = '';
    if (input.has('replacement')) {
      replacement = input.getData('replacement').replace('\\\\n', '\n');
    }

    const data = input.getData('in');
    if (!data) { return; }
    if (!pattern) {
      output.sendDone({ out: data });
      return;
    }
    output.sendDone({ out: `${data}`.replace(pattern, replacement) });
  });
};
