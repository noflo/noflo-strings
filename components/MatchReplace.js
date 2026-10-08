import { Component } from "@noflo/noflo";

/**
 * Replaces string packets using a dictionary.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Replace string packets using a dictionary",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to match against the dictionary keys",
        required: true,
      },
      match: {
        datatype: "object",
        description:
          "Dictionary object with key matching the input object and value being the replacement item",
        control: true,
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "string",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in", "match")) {
      return;
    }
    const match = input.getData("match");
    if (match === null || typeof match !== "object") {
      return;
    }
    const string = input.getData("in");

    /** @type {Record<string, string>} */
    const matches = {};
    for (const fromMatch of Object.keys(match)) {
      matches[fromMatch.toString()] = match[fromMatch].toString();
    }
    const matchKeys = Object.keys(matches);

    const matchKeyIndex = matchKeys.indexOf(string.toString());
    if (matchKeyIndex > -1) {
      output.sendDone({ out: matches[matchKeys[matchKeyIndex]] });
      return;
    }
    output.sendDone({ out: string });
  });

  return c;
}
