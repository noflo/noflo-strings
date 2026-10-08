import { Component } from "@noflo/noflo";

/**
 * Parses a string to a float.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Parses a string to a float",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to parse",
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "number",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in")) {
      return;
    }
    const data = input.getData("in");
    output.sendDone({ out: Number.parseFloat(data) });
  });

  return c;
}
