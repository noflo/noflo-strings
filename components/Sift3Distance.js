const noflo = require('noflo');
const sift3 = require('sift-string');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Compare distance between two strings using Sift3 algorithm';

  c.inPorts.add('string1',
    { datatype: 'string' });
  c.inPorts.add('string2',
    { datatype: 'string' });

  c.outPorts.add('out',
    { datatype: 'number' });

  c.forwardBrackets = { string2: ['out'] };

  return c.process((input, output) => {
    if (!input.has('string1', 'string2')) { return; }
    let s1 = input.get('string1');
    while (s1.type !== 'data') {
      s1 = input.get('string1');
    }
    if (s1.type !== 'data') { return; }

    let s2 = input.get('string2');
    while (s2.type !== 'data') {
      s2 = input.get('string2');
    }
    if (s2.type !== 'data') { return; }

    output.sendDone({ out: sift3(s1.data, s2.data) });
  });
};
