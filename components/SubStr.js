import { Component } from "@noflo/noflo";

/**
 * Returns a substring of the incoming string, starting at `index` and
 * up to `limit` characters long.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Return a substring",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to get a substring of",
        required: true,
      },
      index: {
        datatype: "int",
        description: "Start index of the substring",
        default: 0,
        control: true,
      },
      limit: {
        datatype: "int",
        description: "Maximum length of the substring",
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
    const index = input.hasData("index") ? input.getData("index") : 0;
    const limit = input.hasData("limit") ? input.getData("limit") : undefined;
    output.sendDone({
      out: data.slice(index, limit === undefined ? undefined : index + limit),
    });
  });

  return c;
}
