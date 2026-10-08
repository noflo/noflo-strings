import { Component } from "@noflo/noflo";

/**
 * Escapes all quotes in a string.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Escape all quotes in a string",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to escape quotes from",
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "string",
        description: "Escaped string",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in")) {
      return;
    }
    const data = input.getData("in");
    output.sendDone({ out: data.replace(/"/g, '\\"') });
  });

  return c;
}
