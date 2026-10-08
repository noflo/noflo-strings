import { Component } from "@noflo/noflo";

/**
 * Replaces all occurrences of a pattern in the incoming string.
 *
 * This is the migration protocol's worked example (§6.1): dead-branch
 * removal, error routing for invalid regexps, `hasData` guards.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description:
      "Given a fixed pattern and its replacement, replace all occurrences in the incoming string",
    inPorts: {
      in: {
        datatype: "string",
        description: "String to replace pattern in",
        required: true,
      },
      pattern: {
        datatype: "string",
        description: "Pattern to replace",
        control: true,
      },
      replacement: {
        datatype: "string",
        description: "Replacement for the pattern",
        control: true,
        default: "",
      },
    },
    outPorts: {
      out: {
        datatype: "string",
      },
      error: {
        datatype: "object",
        description: "Invalid regular expression errors",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in")) {
      return;
    }
    const data = input.getData("in");
    if (!input.hasData("pattern")) {
      // No pattern received: pass through unchanged
      output.sendDone({ out: data });
      return;
    }
    const replacement = input.hasData("replacement")
      ? input.getData("replacement").replace("\\\\n", "\n")
      : "";
    let regex;
    try {
      regex = new RegExp(input.getData("pattern"), "g");
    } catch (err) {
      output.done(err instanceof Error ? err : new Error(String(err)));
      return;
    }
    output.sendDone({ out: data.replace(regex, replacement) });
  });

  return c;
}
