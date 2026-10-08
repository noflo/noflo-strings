import { Component } from "@noflo/noflo";

/**
 * Renders an ERB-style template (`<%= %>`, `<%- %>`, `<% %>`) against
 * the incoming data object.
 *
 * The template engine is inlined to keep the package dependency-free;
 * it follows the semantics of underscore's `_.template` with default
 * settings. Templates using underscore helpers inside `<% %>` code get
 * a small built-in subset (`each`, `map`, `filter`, `escape`).
 * @returns {import("@noflo/noflo").Component} The configured component
 */

// Underscore's default template settings
const ESCAPE = /<%-([\s\S]+?)%>/g;
const INTERPOLATE = /<%=([\s\S]+?)%>/g;
const EVALUATE = /<%([\s\S]+?)%>/g;
const ESCAPE_CHAR = /\\|'|\r|\n|\u2028|\u2029/g;
/** @type {Record<string, string>} */
const ESCAPES = {
  "'": "'",
  "\\": "\\",
  "\r": "r",
  "\n": "n",
  "\u2028": "u2028",
  "\u2029": "u2029",
};
/** @type {Record<string, string>} */
const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
  "/": "&#47;",
};

/**
 * @param {string} char
 * @returns {string}
 */
const escapeChar = /** @param {string} char */ (char) => `\\${ESCAPES[char]}`;

/**
 * @param {unknown} string
 * @returns {string}
 */
const escapeHtml = (string) =>
  String(string).replace(
    /[&<>"'`/]/g,
    /** @param {string} char */ (char) => HTML_ESCAPES[char],
  );

/**
 * Small underscore subset available to `<% %>` code inside templates.
 */
const templateHelpers = {
  /**
   * @param {any} obj
   * @param {(value: any, index: any, list: any) => void} iterator
   */
  each(obj, iterator) {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i += 1) iterator(obj[i], i, obj);
      return;
    }
    for (const key of Object.keys(obj ?? {})) iterator(obj[key], key, obj);
  },
  /**
   * @param {any} obj
   * @param {(value: any, index: any, list: any) => any} iterator
   * @returns {any[]}
   */
  map(obj, iterator) {
    /** @type {any[]} */
    const result = [];
    templateHelpers.each(obj, (value, index, list) =>
      result.push(iterator(value, index, list)),
    );
    return result;
  },
  /**
   * @param {any} obj
   * @param {(value: any, index: any, list: any) => boolean} predicate
   * @returns {any[]}
   */
  filter(obj, predicate) {
    /** @type {any[]} */
    const result = [];
    templateHelpers.each(obj, (value, index, list) => {
      if (predicate(value, index, list)) result.push(value);
    });
    return result;
  },
  escape: escapeHtml,
};

/**
 * @param {string} templateText
 * @returns {(data: Record<string, unknown>) => string}
 */
const compile = (templateText) => {
  const matcher = new RegExp(
    `${ESCAPE.source}|${INTERPOLATE.source}|${EVALUATE.source}|$`,
    "g",
  );
  let index = 0;
  let source = "__p+='";
  templateText.replace(
    matcher,
    (match, escapeExpr, interpolate, evaluate, offset) => {
      source += templateText
        .slice(index, offset)
        .replace(ESCAPE_CHAR, escapeChar);
      index = offset + match.length;
      if (escapeExpr != null) {
        source += `'+\n((__t=(${escapeExpr}))==null?'':escapeHtml(__t))+\n'`;
      } else if (interpolate != null) {
        source += `'+\n((__t=(${interpolate}))==null?'':__t)+\n'`;
      } else if (evaluate != null) {
        source += `';\n${evaluate}\n__p+='`;
      }
      return match;
    },
  );
  source += "';\n";
  // Data properties are in scope, mirroring underscore's default. The
  // generated function body is sloppy mode (Function constructor), so
  // the with-statement is allowed inside ESM sources
  source = `with(obj||{}){\n${source}\n}\n`;
  source = `var __t,__p='';var __j=Array.prototype.join;function print(){__p+=__j.call(arguments,'');}\n${source}return __p;\n`;
  const render = new Function("obj", "escapeHtml", "_", source);
  return (data) => render(data ?? {}, escapeHtml, templateHelpers);
};

export function getComponent() {
  const c = new Component({
    description:
      'StringTemplate renders an underscore-style template with the incoming data. Expects a data object on "in", and a template string on the "template" port. The result is sent to "out"',
    icon: "quote-right",
    inPorts: {
      in: {
        datatype: "object",
        description: "Object to render the template with",
        required: true,
      },
      template: {
        datatype: "string",
        description: "ERB-style template to render",
        control: true,
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "string",
        description: "Rendered template",
      },
      error: {
        datatype: "object",
        description: "Template evaluation errors",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in", "template")) {
      return;
    }
    const templateText = input.getData("template");
    const data = input.getData("in");
    let render;
    try {
      render = compile(templateText);
      output.sendDone({ out: render(data) });
    } catch (err) {
      output.done(err instanceof Error ? err : new Error(String(err)));
    }
  });

  return c;
}
