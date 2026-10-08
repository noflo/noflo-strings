import { Component } from "@noflo/noflo";

/**
 * Interlaces two arrays (or strings) into a string: the values are
 * zipped element-wise, pairs joined with `assoc`, and pairs joined
 * with `delim`.
 *
 * The 1.x internals (`port.scopedBuffer`) are replaced by the 2.x
 * `InPort.getBuffer(scope)`.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "interlaces two arrays of string into a string",
    inPorts: {
      in: {
        datatype: "all",
        description: "Two consecutive packets with arrays to interlace",
        required: true,
      },
      assoc: {
        datatype: "string",
        description: "String to join array elements with",
        control: true,
        default: ":",
      },
      delim: {
        datatype: "string",
        description: "String to join the pairs with",
        control: true,
        default: ",",
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
    // Look into the buffer to see if we have two data packets
    const buffer = c.inPorts.in.getBuffer(input.scope);
    const buffered = buffer.filter(
      /** @param {import("@noflo/noflo").IP} ip */ (ip) => ip.type === "data",
    );
    if (buffered.length < 2) {
      return;
    }
    const strings = [];
    while (strings.length !== 2) {
      const packet = /** @type {import("@noflo/noflo").IP} */ (input.get("in"));
      if (packet.type === "data") {
        strings.push(packet.data);
      }
    }
    const assoc = input.hasData("assoc") ? input.getData("assoc") : ":";
    const delim = input.hasData("delim") ? input.getData("delim") : ",";

    // Zip the two values element-wise, joining each pair with `assoc`
    // (mirrors `_.zip`: shorter inputs are padded, joined as empty strings)
    const first = /** @type {ArrayLike<unknown>} */ (strings[0]);
    const second = /** @type {ArrayLike<unknown>} */ (strings[1]);
    const length = Math.max(first.length, second.length);
    const pairs = [];
    for (let i = 0; i < length; i += 1) {
      pairs.push([first[i], second[i]]);
    }
    const joined = pairs.map((pair) =>
      pair.map((part) => part ?? "").join(assoc),
    );
    output.sendDone({ out: joined.join(delim) });
  });

  return c;
}
