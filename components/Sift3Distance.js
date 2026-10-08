import { Component } from "@noflo/noflo";

/**
 * Compares two strings using the Sift3 algorithm.
 *
 * The implementation is inlined (it is ~40 lines) to avoid depending on
 * the unmaintained `sift-string` package.
 *
 * Sift3: http://siderite.blogspot.com/2007/04/super-fast-and-accurate-string-distance.html
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Compare distance between two strings using Sift3 algorithm",
    inPorts: {
      string1: {
        datatype: "string",
        description: "First string to compare",
        required: true,
      },
      string2: {
        datatype: "string",
        description: "Second string to compare",
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "number",
      },
    },
  });

  c.forwardBrackets = { string2: ["out"] };

  /**
   * @param {string} s1
   * @param {string} s2
   * @returns {number}
   */
  const sift3 = (s1, s2) => {
    if (s1 === null || s1.length === 0) {
      if (s2 === null || s2.length === 0) {
        return 0;
      }
      return s2.length;
    }
    if (s2 === null || s2.length === 0) {
      return s1.length;
    }
    let c = 0;
    let offset1 = 0;
    let offset2 = 0;
    let lcs = 0;
    const maxOffset = 5;
    while (c + offset1 < s1.length && c + offset2 < s2.length) {
      if (s1.charAt(c + offset1) === s2.charAt(c + offset2)) {
        lcs += 1;
      } else {
        offset1 = 0;
        offset2 = 0;
        for (let i = 0; i < maxOffset; i += 1) {
          if (c + i < s1.length && s1.charAt(c + i) === s2.charAt(c)) {
            offset1 = i;
            break;
          }
          if (c + i < s2.length && s1.charAt(c) === s2.charAt(c + i)) {
            offset2 = i;
            break;
          }
        }
      }
      c += 1;
    }
    return (s1.length + s2.length) / 2 - lcs;
  };

  c.process((input, output) => {
    if (!input.hasData("string1", "string2")) {
      return;
    }
    const [s1, s2] = input.getData("string1", "string2");
    output.sendDone({ out: sift3(s1, s2) });
  });

  return c;
}
