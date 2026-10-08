import { Component } from "@noflo/noflo";

/**
 * Parses a JSON string into a JavaScript value.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Parse JSON to an object",
    inPorts: {
      in: {
        datatype: "string",
        description: "JSON source",
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "object",
      },
      error: {
        datatype: "object",
        description: "JSON parse errors",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in")) {
      return;
    }
    const data = input.getData("in");
    let result;
    try {
      result = JSON.parse(data);
    } catch (err) {
      output.done(err instanceof Error ? err : new Error(String(err)));
      return;
    }
    output.sendDone({ out: result });
  });

  return c;
}
