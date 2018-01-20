import { List, Record } from 'immutable';

const Attrs  = Record({ bold: false, italic: false });
const Block  = Record({ text: '', attrs: new Attrs() });
const Line   = Record({ advancers: List.of(0), blocks: List.of() });
const Cursor = Record({ row: 0, col: 0 });
const SelectionRect = Record({ fromRow: 0, fromCol: 0, toRow: 0, toCol: 0 });

const State = Record({
  attrs: new Attrs(),
  cursor: new Cursor(),
  lines: List.of(new Line()),
  selection: new SelectionRect()
});

export {
  Attrs,
  Block,
  Cursor,
  Line,
  SelectionRect,
  State
};
