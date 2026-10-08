import { Buffer } from "node:buffer";

import { Component } from "@noflo/noflo";

/**
 * Converts a string or a buffer from one encoding to another. Defaults
 * to UTF-8 to Base64. Node-only by nature (Buffer and encodings).
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description:
      "Convert a string or a buffer from one encoding to another. Default from UTF-8 to Base64",
    inPorts: {
      in: {
        datatype: "all",
        description: "Buffer or string to be converted",
        required: true,
      },
      from: {
        datatype: "string",
        description: "Input encoding",
        default: "utf8",
        control: true,
      },
      to: {
        datatype: "string",
        description: "Output encoding",
        default: "base64",
        control: true,
      },
    },
    outPorts: {
      out: {
        datatype: "string",
        description: "Converted string",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in")) {
      return;
    }
    const from = input.hasData("from") ? input.getData("from") : "utf8";
    const to = input.hasData("to") ? input.getData("to") : "base64";
    const data = input.getData("in");

    let result = "";
    if (data instanceof Uint8Array) {
      result += Buffer.from(data).toString(/** @type {any} */ (from));
    } else if (typeof data === "string") {
      result += Buffer.from(data, /** @type {any} */ (from)).toString();
    }
    output.sendDone({
      out: Buffer.from(result).toString(/** @type {any} */ (to)),
    });
  });

  return c;
}
