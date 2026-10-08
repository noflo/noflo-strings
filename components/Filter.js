import { Component } from "@noflo/noflo";

/**
 * Filters strings passing a regular expression; failing strings go to
 * the `missed` port.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "filters an IP which is a string using a regex",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to filter",
        required: true,
      },
      pattern: {
        datatype: "string",
        description: "String representation of a regexp used as filter",
        control: true,
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "string",
        description: "String passing the filter",
      },
      missed: {
        datatype: "string",
        description: "String failing the filter",
      },
      error: {
        datatype: "object",
        description: "Invalid regular expression errors",
      },
    },
  });

  c.forwardBrackets = { in: ["out", "missed"] };

  c.process((input, output) => {
    if (!input.hasData("in", "pattern")) {
      return;
    }
    const data = input.getData("in");
    let regex;
    try {
      regex = new RegExp(input.getData("pattern"));
    } catch (err) {
      output.done(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    const string = typeof data === "string" ? data : String(data);
    if (regex != null && string.match(regex)) {
      output.sendDone({ out: string });
      return;
    }
    output.sendDone({ missed: string });
  });

  return c;
}
