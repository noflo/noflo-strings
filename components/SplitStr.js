import { Component } from "@noflo/noflo";

/**
 * Splits the incoming string on a delimiter, emitting one packet per
 * part. Delimiters in `/regex/` form are treated as regular expressions.
 *
 * This is the migration protocol's worked example (§6.2): fan-out with
 * awaited sends for edge backpressure.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description:
      "The SplitStr component receives a string in the in port, splits it by string specified in the delimiter port, and send each part as a separate packet to the out port",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to split",
        required: true,
      },
      delimiter: {
        datatype: "string",
        description: "Delimiter used to split",
        control: true,
        default: "\n",
      },
    },
    outPorts: {
      out: {
        datatype: "string",
        description:
          "Split off elements from the input string (one element per IP)",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in")) {
      return;
    }
    const delimiter = input.hasData("delimiter")
      ? input.getData("delimiter")
      : "\n";
    let splitter = delimiter;
    if (
      delimiter.length > 1 &&
      delimiter.startsWith("/") &&
      delimiter.endsWith("/")
    ) {
      // Handle regular expressions and not simply a slash
      splitter = new RegExp(delimiter.slice(1, -1));
    }
    const data = input.getData("in");
    const sendAll = async () => {
      for (const string of data.split(splitter)) {
        await output.send({ out: string });
      }
      output.done();
    };
    sendAll().catch((err) => output.done(err));
  });

  return c;
}
