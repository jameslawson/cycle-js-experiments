import { List } from 'immutable';
import { Block } from '../model/type/type';
import { merge, split } from '../model/util/block';

const WALKER_FILTER = NodeFilter.SHOW_TEXT
  | NodeFilter.SHOW_ELEMENT
  | NodeFilter.SHOW_COMMENT;

function normalParser(node) {
  const name = node.nodeName.toLowerCase();
  if (name === '#text') {
    return List.of(new Block({ text: node.nodeValue }));
  } else {
    return List.of();
  }
}

function treeReduce(root) {
  if (!root) { return null; }

  let blocks = List.of();
  const walker = document.createTreeWalker(root, WALKER_FILTER);

  for (let child = walker.firstChild(); child !== null; child = walker.nextSibling()) {
    const parsers = [normalParser]; // strong parser, italics parser
    for (let i = 0; i < parsers.length; i++) {
      const parser = parsers[i];
      blocks = blocks.concat(parser(child));
    }
    blocks = blocks.concat(treeReduce(child));
  }
  return blocks;
}

function htmlParse(html) {
  const root = document.createElement('div');
  root.innerHTML = html;
  return merge(split(treeReduce(root)));
}

export default htmlParse;
