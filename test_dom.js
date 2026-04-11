const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><div id="preview"><a href="#">Click</a></div>`);
const preview = dom.window.document.getElementById("preview");
const targetNode = preview.querySelector("a");
const allNodes = Array.from(preview.querySelectorAll(targetNode.tagName));
console.log(allNodes.indexOf(targetNode));
