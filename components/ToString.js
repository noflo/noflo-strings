import { Component } from "@noflo/noflo";

/**
 * Converts the incoming value to a string.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Convert a value to a string",
    inPorts: {
      in: {
        datatype: "all",
        description: "Value to convert",
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
    output.sendDone({ out: data.toString() });
  });

  return c;
}
