import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as noflo from "@noflo/noflo";

import { getComponent as getBase64 } from "../components/Base64Encode.js";
import { getComponent as getCompile } from "../components/CompileString.js";
import { getComponent as getSplice } from "../components/Splice.js";
import { getComponent as getSplitStr } from "../components/SplitStr.js";
import { getComponent as getStringTemplate } from "../components/StringTemplate.js";
import { getComponent as getTemplateReplace } from "../components/TemplateReplace.js";

/**
 * Waits for the next IP on a socket matching the predicate.
 * @param {import("@noflo/noflo").internalSocket.InternalSocket} socket
 * @param {(ip: import("@noflo/noflo").IP) => boolean} predicate
 * @returns {Promise<import("@noflo/noflo").IP>}
 */
const waitUntil = (socket, predicate) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Timed out waiting for IP"));
    }, 2000);
    /** @param {CustomEvent} event */
    const listener = (event) => {
      const ip = event.detail;
      if (predicate(ip)) {
        cleanup();
        resolve(ip);
      }
    };
    const cleanup = () => {
      clearTimeout(timer);
      socket.removeEventListener("ip", listener);
    };
    socket.addEventListener("ip", listener);
  });

/** @param {import("@noflo/noflo").internalSocket.InternalSocket} socket */
const collect = (socket) => {
  /** @type {import("@noflo/noflo").IP[]} */
  const ips = [];
  socket.addEventListener(
    "ip",
    /** @param {CustomEvent} event */ (event) => {
      ips.push(event.detail);
    },
  );
  return ips;
};

describe("Base64Encode component", () => {
  it("reproduces the stream grouping and encodes buffered values", async () => {
    const c = getBase64();
    const inSocket = noflo.internalSocket.createSocket();
    const outSocket = noflo.internalSocket.createSocket();
    c.inPorts.in.attach(inSocket);
    c.outPorts.out.attach(outSocket);
    const outIps = collect(outSocket);
    try {
      const done = waitUntil(outSocket, (ip) => ip.type === "closeBracket");
      inSocket.post(new noflo.IP("openBracket", "files"));
      inSocket.post(new noflo.IP("data", Buffer.from("hello")));
      inSocket.post(new noflo.IP("closeBracket", "files"));
      await done;
      assert.deepEqual(
        outIps.map((ip) => [ip.type, ip.data]),
        [
          ["openBracket", "files"],
          ["data", btoa("hello")],
          ["closeBracket", "files"],
        ],
      );
    } finally {
      await c.shutdown();
    }
  });
});

describe("CompileString component", () => {
  it("joins a bracketed stream of strings", async () => {
    const c = getCompile();
    const inSocket = noflo.internalSocket.createSocket();
    const outSocket = noflo.internalSocket.createSocket();
    c.inPorts.in.attach(inSocket);
    c.outPorts.out.attach(outSocket);
    const outIps = collect(outSocket);
    try {
      const done = waitUntil(outSocket, (ip) => ip.type === "closeBracket");
      inSocket.post(new noflo.IP("openBracket", "list"));
      inSocket.post(new noflo.IP("data", "one"));
      inSocket.post(new noflo.IP("data", "two"));
      inSocket.post(new noflo.IP("closeBracket", "list"));
      await done;
      assert.deepEqual(
        outIps.map((ip) => [ip.type, ip.data]),
        [
          ["openBracket", "list"],
          ["data", "one\ntwo"],
          ["closeBracket", "list"],
        ],
      );
    } finally {
      await c.shutdown();
    }
  });
});

describe("SplitStr component", () => {
  it("emits one packet per split part with backpressure", async () => {
    const c = getSplitStr();
    const inSocket = noflo.internalSocket.createSocket();
    const delimiterSocket = noflo.internalSocket.createSocket();
    const outSocket = noflo.internalSocket.createSocket();
    c.inPorts.in.attach(inSocket);
    c.inPorts.delimiter.attach(delimiterSocket);
    c.outPorts.out.attach(outSocket);
    const outIps = collect(outSocket);
    try {
      const done = waitUntil(
        outSocket,
        (ip) => ip.type === "data" && ip.data === "c",
      );
      delimiterSocket.post(new noflo.IP("data", ","));
      inSocket.post(new noflo.IP("data", "a,b,c"));
      await done;
      // fbp-spec can only assert the last packet of a fan-out; here we
      // assert the full sequence
      assert.deepEqual(
        outIps.filter((ip) => ip.type === "data").map((ip) => ip.data),
        ["a", "b", "c"],
      );
    } finally {
      await c.shutdown();
    }
  });
});

describe("Splice component", () => {
  it("interlaces two arrays element-wise", async () => {
    const c = getSplice();
    const inSocket = noflo.internalSocket.createSocket();
    const outSocket = noflo.internalSocket.createSocket();
    c.inPorts.in.attach(inSocket);
    c.outPorts.out.attach(outSocket);
    try {
      const outIp = waitUntil(outSocket, (ip) => ip.type === "data");
      inSocket.post(new noflo.IP("data", ["a", "b"]));
      inSocket.post(new noflo.IP("data", ["1", "2"]));
      const ip = await outIp;
      assert.equal(ip.data, "a:1,b:2");
    } finally {
      await c.shutdown();
    }
  });
});

describe("StringTemplate component", () => {
  it("supports evaluate blocks with the print helper and helpers subset", async () => {
    const c = getStringTemplate();
    const inSocket = noflo.internalSocket.createSocket();
    const templateSocket = noflo.internalSocket.createSocket();
    const outSocket = noflo.internalSocket.createSocket();
    c.inPorts.in.attach(inSocket);
    c.inPorts.template.attach(templateSocket);
    c.outPorts.out.attach(outSocket);
    try {
      templateSocket.post(
        new noflo.IP(
          "data",
          "<% _.each(items, function(item) { print(item, ';'); }) %>",
        ),
      );
      const outIp = waitUntil(outSocket, (ip) => ip.type === "data");
      inSocket.post(new noflo.IP("data", { items: ["a", "b"] }));
      const ip = await outIp;
      assert.equal(ip.data, "a;b;");
    } finally {
      await c.shutdown();
    }
  });

  it("routes template evaluation errors to the error port", async () => {
    const c = getStringTemplate();
    const inSocket = noflo.internalSocket.createSocket();
    const templateSocket = noflo.internalSocket.createSocket();
    const errorSocket = noflo.internalSocket.createSocket();
    c.inPorts.in.attach(inSocket);
    c.inPorts.template.attach(templateSocket);
    c.outPorts.error.attach(errorSocket);
    try {
      templateSocket.post(
        new noflo.IP("data", "<% throw new Error('boom') %>"),
      );
      const errorIp = waitUntil(
        errorSocket,
        (ip) => ip.type === "data" || ip.type === "error",
      );
      inSocket.post(new noflo.IP("data", {}));
      const ip = await errorIp;
      assert.match(ip.data.message, /boom/);
    } finally {
      await c.shutdown();
    }
  });
});

describe("TemplateReplace component", () => {
  it("replaces tokens from a token stream with matching strings", async () => {
    const c = getTemplateReplace();
    const inSocket = noflo.internalSocket.createSocket();
    const tokenSocket = noflo.internalSocket.createSocket();
    const templateSocket = noflo.internalSocket.createSocket();
    const outSocket = noflo.internalSocket.createSocket();
    c.inPorts.in.attach(inSocket);
    c.inPorts.token.attach(tokenSocket);
    c.inPorts.template.attach(templateSocket);
    c.outPorts.out.attach(outSocket);
    try {
      templateSocket.post(new noflo.IP("data", "Hello %name% and %other%"));
      tokenSocket.post(new noflo.IP("data", "%name%"));
      tokenSocket.post(new noflo.IP("data", "%other%"));
      const outIp = waitUntil(outSocket, (ip) => ip.type === "data");
      // Two in values are needed; the first arrives with the template
      inSocket.post(new noflo.IP("data", "world"));
      inSocket.post(new noflo.IP("data", "NoFlo"));
      const ip = await outIp;
      assert.equal(ip.data, "Hello world and NoFlo");
    } finally {
      await c.shutdown();
    }
  });
});
