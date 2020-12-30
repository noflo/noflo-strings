/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const noflo = require("noflo");

const sift3 = function(s1, s2) {
  let lcs, offset1, offset2;
  if ((s1 == null) || (s1.length === 0)) {
    if ((s2 == null) || (s2.length === 0)) {
      return 0;
    } else {
      return s2.length;
    }
  }
  if ((s2 == null) || (s2.length === 0)) { return s1.length; }
  let c = (offset1 = (offset2 = (lcs = 0)));
  const maxOffset = 5;
  while (((c + offset1) < s1.length) && ((c + offset2) < s2.length)) {
    if (s1[c + offset1] === s2[c + offset2]) {
      lcs++;
    } else {
      var i;
      offset1 = (offset2 = (i = 0));

      while (i < maxOffset) {
        if (((c + i) < s1.length) && (s1[c + i] === s2[c])) {
          offset1 = i;
          break;
        }
        if (((c + i) < s2.length) && (s1[c] === s2[c + i])) {
          offset2 = i;
          break;
        }
        i++;
      }
    }
    c++;
  }
  return ((s1.length + s2.length) / 2) - lcs;
};

exports.getComponent = function() {
  const c = new noflo.Component;
  c.description = "Compare distance between two strings using Sift3 algorithm";

  c.inPorts.add('string1',
    {datatype: 'string'});
  c.inPorts.add('string2',
    {datatype: 'string'});

  c.outPorts.add('out',
    {datatype: 'number'});

  c.forwardBrackets =
    {string2: ['out']};

  return c.process(function(input, output) {
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

    return output.sendDone({
      out: sift3(s1.data, s2.data)});
  });
};
