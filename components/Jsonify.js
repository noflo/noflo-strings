import { Component } from "@noflo/noflo";

/**
 * Serializes incoming data to JSON, with options for raw strings and
 * pretty-printing.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Serialize a value to JSON",
    inPorts: {
      in: {
        datatype: "all",
        description: "Value to serialize",
        required: true,
      },
      raw: {
        datatype: "string",
        description: "Pass strings through without serializing (true/false)",
        control: true,
      },
      pretty: {
        datatype: "string",
        description: "Pretty-print with indentation (true/false)",
        control: true,
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
    const raw = input.hasData("raw")
      ? String(input.getData("raw")) === "true"
      : false;
    const pretty = input.hasData("pretty")
      ? String(input.getData("pretty")) === "true"
      : false;

    if (raw && typeof data === "string") {
      output.sendDone({ out: data });
      return;
    }
    if (pretty) {
      output.sendDone({ out: JSON.stringify(data, null, 4) });
      return;
    }
    output.sendDone({ out: JSON.stringify(data) });
  });

  return c;
}
