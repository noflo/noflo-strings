import { Component, IP } from "@noflo/noflo";

/**
 * Base64-encodes strings or buffers. Uses the Web-standard global
 * `btoa`; Buffer/Uint8Array values are converted with `toString()` first.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description:
      "This component receives strings or Buffers and sends them out Base64-encoded",
    inPorts: {
      in: {
        datatype: "all",
        description: "Buffer or string to encode",
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "string",
        description: "Encoded input",
      },
    },
  });

  c.forwardBrackets = {};

  c.process((input, output) => {
    if (!input.hasStream("in")) {
      return;
    }
    const stream = /** @type {import("@noflo/noflo").IP[]} */ (
      input.getStream("in")
    );
    const brackets = [];
    let string = "";
    for (const packet of stream) {
      if (packet.type === "openBracket") {
        brackets.push(packet.data);
        continue;
      }
      if (packet.type === "data") {
        if (packet.data instanceof Uint8Array) {
          string += Buffer.from(packet.data).toString("utf-8");
          continue;
        }
        string += packet.data;
      }
    }
    for (const bracket of brackets) {
      output.send({ out: new IP("openBracket", bracket) });
    }
    output.send({ out: btoa(string) });
    brackets.reverse();
    for (const bracket of brackets) {
      output.send({ out: new IP("closeBracket", bracket) });
    }
    output.done();
  });

  return c;
}
