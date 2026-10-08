import { Component } from "@noflo/noflo";

/**
 * Sends a string when receiving a packet.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Send a string when receiving a packet",
    inPorts: {
      string: {
        datatype: "string",
        description: "String to send",
        control: true,
        required: true,
      },
      in: {
        datatype: "bang",
        description: "Send the string out",
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
    if (!input.hasData("string", "in")) {
      return;
    }
    input.getData("in");
    output.sendDone({ out: input.getData("string") });
  });

  return c;
}
