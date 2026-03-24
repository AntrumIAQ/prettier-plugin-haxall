process.env.PRETTIER_DEBUG = true;

import { printAxon, printTrio } from "./axon-formatter.js";
import { parseAxon, parseTrio, TrioSrc } from "./axon-parser.js";

import { builders } from "prettier/doc";
const pb = builders;

function locStart(node) {
  if (node._start === undefined) {
    return 0;
  }
  if (node._start === null) {
    return 0;
  }
  return node._start.filePos();
}

function locEnd(node) {
  if (node._end === undefined) {
    return 0;
  }
  if (node._end === null) {
    return 0;
  }
  if (node._type == "commentML") {
    return node._end.filePos() + 1;
  }
  return node._end.filePos();
}

const languages = [
  {
    extensions: [".trio"],
    name: "Trio",
    parsers: ["trio-parse"],
  },
  {
    extensions: [".axon"],
    name: "Axon",
    parsers: ["axon-parse"],
  },
];

const parsers = {
  "trio-parse": {
    parse: parseTrio,
    locStart: locStart,
    locEnd: locEnd,
    astFormat: "trio-ast",
  },
  "axon-parse": {
    parse: parseAxon,
    locStart: locStart,
    locEnd: locEnd,
    astFormat: "axon-ast",
  },
};
const ignoredKeys = new Set([
  "_expr",
  "_type",
  "_start",
  "_end",
  "_inParens",
  "_args_need_parens",
  "_break_if_group",
  "_group_id",
  "_arg_of_dotcall",
]);

function printComment(path, options) {
  let node = path.node;
  if (node._type == "commentSL") {
    let precedingSpaces = 0;
    if (node.placement == "remaining") {
      for (let index = node._start.filePos() - 1; index >= 0; --index) {
        let ch = options.originalText[index];
        if (ch != " ") break;
        precedingSpaces++;
      }
    }
    precedingSpaces = Math.max(0, precedingSpaces - 1);
    return [" ".repeat(precedingSpaces), "//", node.value];
  }
  if (node._type == "commentML") {
    if (node.value.includes("\n")) {
      const lines = node.value.split("\n").map((line) => line.trim());
      if (lines.length > 0 && lines[lines.length - 1].length == 0) lines.pop();
      if (lines.length > 0 && lines[0].length == 0) lines.shift();
      return ["/*", pb.indent([pb.hardline, pb.join(pb.hardline, lines)]), pb.hardline, "*/"];
    } else return ["/*", node.value, "*/"];
  }
  if (node._type == "blanklines") {
    return node.placement == "ownLine" ? "" : pb.hardline;
  }
  return "";
}

function isBlockComment(node) {
  return node._type == "commentML";
}

function canAttachComment(node) {
  return "_start" in node && node._start !== null;
}

function getVisitorKeys(node, nonTraversableKeys) {
  return Object.keys(node).filter((key) => !nonTraversableKeys.has(key) && !ignoredKeys.has(key));
}

const printers = {
  "trio-ast": {
    print: printTrio,
    embed: (path, options) => {
      if (path.node instanceof TrioSrc && path.node.src !== null) {
        return async (textToDoc) => await textToDoc(path.node.src, { parser: "axon-parse", trioline: path.node.line });
      }
    },
  },
  "axon-ast": {
    print: printAxon,
    printComment: printComment,
    isBlockComment: isBlockComment,
    canAttachComment: canAttachComment,
    getVisitorKeys: getVisitorKeys,
  },
};

export default {
  languages,
  parsers,
  printers,
};
