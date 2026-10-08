import { Component, IP } from "@noflo/noflo";

/**
 * Collects the strings of a bracketed stream and joins them with a
 * delimiter, reproducing the stream grouping on the output.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Compiles a stream of strings into a single string",
    icon: "compress",
    inPorts: {
      in: {
        datatype: "string",
        description: "Stream of strings to compile",
        required: true,
      },
      delimiter: {
        datatype: "string",
        description: "Delimiter to join the strings with",
        control: true,
        default: "\n",
      },
    },
    outPorts: {
      out: {
        datatype: "string",
        description: "The compiled string",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasStream("in")) {
      return;
    }
    const stream = /** @type {import("@noflo/noflo").IP[]} */ (
      input.getStream("in")
    );
    const brackets = [];
    const strings = [];
    for (const packet of stream) {
      if (packet.type === "openBracket") {
        brackets.push(packet.data);
        continue;
      }
      if (packet.type === "data") {
        strings.push(packet.data);
      }
    }
    const delimiter = input.hasData("delimiter")
      ? input.getData("delimiter")
      : "\n";
    for (const bracket of brackets) {
      output.send({ out: new IP("openBracket", bracket) });
    }
    output.send({ out: strings.join(delimiter) });
    brackets.reverse();
    for (const bracket of brackets) {
      output.send({ out: new IP("closeBracket", bracket) });
    }
    output.done();
  });

  return c;
}
