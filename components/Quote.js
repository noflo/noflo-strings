import { Component } from "@noflo/noflo";

/**
 * Wraps the incoming string in single quotes.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Quote a string with single quotes",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to quote",
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
    if (!input.hasData("in")) {
      return;
    }
    const data = input.getData("in");
    output.sendDone({ out: `'${data}'` });
  });

  return c;
}
