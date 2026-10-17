import { Component } from "@noflo/noflo";

/**
 * The inverse of Replace: fix the template and pass in an object of
 * patterns and replacements, or a bracket-framed token stream with
 * matching strings.
 *
 * The stream mode's token stream is a framed stream: the tokens arrive
 * inside an openBracket/closeBracket pair, and the render fires when the
 * frame completes. The cross-connection arrival order between the token
 * stream and the replacement strings is not guaranteed — the engine
 * delivers independent connections independently, and no component may
 * depend on the interleave. A bare (unframed) token IP is a complete
 * single-token stream on its own, so an unframed stream cannot express
 * "more tokens are coming"; the frame is what makes the wait
 * order-independent (work document #47: activation results are functions
 * of the buffered state alone).
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
        description:
          "Regexp tokens to replace, as one bracket-framed stream (the frame marks the token list complete)",
      },
      template: {
        datatype: "string",
        description: "Template to fill in",
        control: true,
        // Standing configuration: readable from scoped activations
        scoped: false,
        required: true,
      },
      default: {
        datatype: "string",
        description: "Default value for non-string replacements",
        control: true,
        // Standing configuration: readable from scoped activations
        scoped: false,
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

    // Stream mode requires the token stream to be framed: the render
    // fires when the frame completes, never on the string count alone —
    // a bare token IP is a complete single-token stream, so an unframed
    // buffer cannot express "more tokens are coming" and pairing on it
    // would depend on the cross-connection arrival interleave (work
    // document #47: no arrival-order guarantee across connections).
    // The framing-aware hasStream validator counts the first complete
    // framed stream's tokens non-consumingly, so the string count is
    // checked before anything is consumed
    let framedTokenCount = 0;
    const framedComplete = input.hasStream(
      "token",
      /**
       * @param {import("@noflo/noflo").IP} ip
       * @param {string[]=} brackets - The framing stack at the walk
       *   position; a bare data IP walks with an empty stack, and plain
       *   has-style walks pass none
       */
      (ip, brackets) => {
        if (!brackets?.length) {
          // Bare tokens do not participate in stream mode: each is a
          // complete single-token stream of its own
          return false;
        }
        framedTokenCount += 1;
        return true;
      },
    );

    // Decide the mode from the buffered data before reading anything
    const first = inputData[0].data;
    const isMap = first !== null && typeof first === "object";
    const isStream = !isMap && framedComplete;
    if (!isMap && !isStream) {
      return;
    }
    if (isStream && inputData.length < framedTokenCount) {
      // One string per framed token; a later string arrival re-fires
      // the process and completes the render
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

    // Stream mode: the framed token stream completes the pairing. The
    // stream read consumes the frame together with its tokens; the
    // replacement strings pair positionally by count, so the render
    // waits for one string per token — under the one-firing rule a
    // later string arrival re-fires the process and completes the
    // render regardless of which connection delivered first
    const tokenStream = /** @type {import("@noflo/noflo").IP[]} */ (
      input.getStream("token")
    );
    /** @type {RegExp[]} */
    const tokens = [];
    let streamDepth = 0;
    for (const packet of tokenStream ?? []) {
      if (packet.type === "openBracket") {
        streamDepth += 1;
        continue;
      }
      if (packet.type === "closeBracket") {
        streamDepth -= 1;
        continue;
      }
      if (packet.type === "data" && streamDepth > 0) {
        try {
          tokens.push(new RegExp(packet.data, "g"));
        } catch (err) {
          output.done(err instanceof Error ? err : new Error(String(err)));
          return;
        }
      }
    }
    const strings = [];
    while (strings.length < tokens.length) {
      const packet = /** @type {import("@noflo/noflo").IP} */ (input.get("in"));
      if (packet.type === "data") {
        strings.push(packet.data);
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
