import { Component } from "@noflo/noflo";

/**
 * Parses a string to an integer, in the given base.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Parses a string to an integer",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to parse",
        required: true,
      },
      base: {
        datatype: "int",
        description: "Base to parse the string in",
        default: 10,
        control: true,
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
    const base = input.hasData("base") ? input.getData("base") : 10;
    output.sendDone({ out: Number.parseInt(data, base) });
  });

  return c;
}
