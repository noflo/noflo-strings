import { Component } from "@noflo/noflo";

/**
 * Appends a string to the incoming value.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Append a string to the incoming value",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to append to",
        required: true,
      },
      append: {
        datatype: "string",
        description: "String to append",
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
    if (!input.hasData("in", "append")) {
      return;
    }
    const [value, append] = input.getData("in", "append");
    output.sendDone({
      out: `${value}${append}`,
    });
  });

  return c;
}
