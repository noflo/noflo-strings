import { Component } from "@noflo/noflo";

/**
 * Lowercases the incoming string.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Convert the case of a string to lowercase",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to convert",
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
    output.sendDone({ out: data.toLowerCase() });
  });

  return c;
}
