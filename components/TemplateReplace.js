import { Component } from "@noflo/noflo";

/**
 * The inverse of Replace: fix the template and pass in an object of
 * patterns and replacements, or a token stream with matching strings.
 *
 * 2.x conversion notes: 1.x `port.scopedBuffer` internals are replaced
 * by `InPort.getBuffer(scope)`, `autoOrdering` is set once at
 * construction, and underscore type checks are native. All `hasData`
 * precondition checks (including the buffered token count) run before
 * any `getData` call — reading a port while an activation is still
 * waiting for more data prevents that activation from ever re-invoking.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description:
      "The inverse of Replace: fix the template and pass in an object of patterns and replacements",
    inPorts: {
      in: {
        datatype: "all",
        description:
          "Map of replacements, or replacement strings matching the tokens",
        required: true,
      },
      token: {
        datatype: "string",
        description: "Regexp tokens to replace, in the stream mode",
      },
      template: {
        datatype: "string",
        description: "Template to fill in",
        control: true,
        required: true,
      },
      default: {
        datatype: "string",
        description: "Default value for non-string replacements",
        control: true,
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

  c.autoOrdering = false;

  /**
   * @param {import("@noflo/noflo").IP} ip
   * @returns {boolean}
   */
  const isData = (ip) => ip.type === "data";

  c.process((input, output) => {
    // Preconditions first: every hasData check runs before any getData
    if (!input.hasData("template", "in")) {
      return;
    }

    const inputBuffer = c.inPorts.in.getBuffer(input.scope);
    const inputData = inputBuffer.filter(isData);
    if (!inputData.length) {
      return;
    }

    const tokenBuffer = c.inPorts.token.getBuffer(input.scope);
    const tokenData = tokenBuffer.filter(isData);

    // Decide the mode from the buffered data before reading anything
    const first = inputData[0].data;
    const isMap = first !== null && typeof first === "object";
    const isStream = !isMap && tokenData.length > 0;
    if (isStream && inputData.length < tokenData.length) {
      return;
    }
    if (!isMap && !isStream) {
      return;
    }

    // Firing pattern confirmed; only now read the values
    const template = input.getData("template");
    if (typeof template !== "string") {
      return;
    }
    const defaults = input.hasData("default") ? input.getData("default") : "";

    if (isMap) {
      const data = input.getData("in");
      let result = template;
      for (const pattern of Object.keys(data)) {
        let regex;
        try {
          regex = new RegExp(pattern, "g");
        } catch (err) {
          output.done(err instanceof Error ? err : new Error(String(err)));
          return;
        }
        result = result.replace(regex, data[pattern]);
      }
      output.sendDone({ out: result });
      return;
    }

    // Stream mode: replacement strings matching the tokens
    const strings = [];
    const tokens = [];
    while (strings.length < tokenData.length) {
      const packet = /** @type {import("@noflo/noflo").IP} */ (input.get("in"));
      if (packet.type === "data") {
        strings.push(packet.data);
      }
    }
    while (tokens.length < tokenData.length) {
      const packet = /** @type {import("@noflo/noflo").IP} */ (
        input.get("token")
      );
      if (packet.type === "data") {
        try {
          tokens.push(new RegExp(packet.data, "g"));
        } catch (err) {
          output.done(err instanceof Error ? err : new Error(String(err)));
          return;
        }
      }
    }

    let result = template;
    for (const string of strings) {
      const token = tokens.shift();
      if (token === undefined) {
        break;
      }
      const replacement = typeof string === "string" ? string : defaults;
      result = result.replace(token, replacement);
    }
    output.sendDone({ out: result });
  });

  return c;
}
