import { split, merge } from '../util/block';
import { Cursor, SelectionRect } from '../type/type';

// -- | deletePrevChar(curr: State): State
// -- | Deletes character before the cursor
// -- | Then moves the cursor to the left by one
function deletePrevChar(curr) {
  const { row, col } = curr.get('cursor').toJS();
  return curr
    .update('lines', (lines) => {
      return lines.update(row, (line) => {
        return line
        .update('blocks', (blocks) => {
          const splits = split(blocks);
          return merge(splits.slice(0, col - 1).concat(splits.slice(col)));
        })
        .update('advancers', (advancers) => {
          // [1]: don't include col's advancer
          // [2]: get the width of the character being removed
          //      we need to subtract this off the advancers of
          //      all chars on the right of col
          const left = advancers.slice(0, col); // [1]
          const right = advancers.slice(col + 1);
          const width = advancers.get(col) - advancers.get(col - 1); // [2]
          return left.concat(right.map(r => r - width));
        });
      });
    })
    .update('cursor', (cursor) => {
      return cursor.update('col', (col) => col - 1);
    });
}

// -- | concatPrevLine(curr: State): State
// -- | Places the cursor at the end of the previous line
// -- | Then joins the current line to the previous.
function concatPrevLine(curr) {
  const { row } = curr.get('cursor').toJS();
  const prevLine = curr.get('lines').get(row - 1);
  const currLine = curr.get('lines').get(row);
  const nextCol = prevLine.get('advancers').size - 1;

  return curr
    .update('lines', (lines) => {
      return lines
        .update(row - 1, (line) => {
          return line
          .update('blocks', (blocks) => {
            const currBlocks = currLine.get('blocks');
            return merge(split(blocks).concat(split(currBlocks)));
          })
          .update('advancers', (advancers) => {
            const currAdvancers = currLine.get('advancers');
            const last = advancers.last();
            return advancers.concat(currAdvancers.rest().map(r => r + last));
          });
        })
        .delete(row);
    })
    .update('cursor', (cursor) => {
      return cursor
        .update('row', (row) => row - 1)
        .update('col', (__) => nextCol);
    });
}

function singleLineDeleteSelection(curr) {
  const { fromRow, fromCol, toCol } = curr.get('selection').toJS();
  return curr
    .set('cursor', new Cursor({ row: fromRow, col: fromCol }))
    .set('selection', new SelectionRect())
    .update('lines', (lines) => {
      return lines
        .update(fromRow, (line) => {
          return line
          .update('blocks', (blocks) => {
            const splitted = split(blocks);
            const before = splitted.slice(0, fromCol);
            const after = splitted.slice(toCol);
            return merge(before.concat(after));
          })
          .update('advancers', (advancers) => {
            const before = advancers.slice(0, fromCol);
            const after = advancers.slice(toCol);
            const diff = advancers.get(toCol) - advancers.get(fromCol);
            return before.concat(after.map(r => r - diff));
          });
        });
    });
}

function multiLineDeleteSelection(curr) {
  const { fromRow, toRow, fromCol, toCol } = curr.get('selection').toJS();
  return curr
    .set('cursor', new Cursor({ row: fromRow, col: fromCol }))
    .set('selection', new SelectionRect())
    .update('lines', (lines) => {
      return lines
        .update(fromRow, (line) => {
          return line
          .update('blocks', (blocks) => {
            const toRowBlocks = curr.get('lines').get(toRow).get('blocks');
            const before = split(blocks).slice(0, fromCol);
            const after = split(toRowBlocks).slice(toCol);
            return merge(before.concat(after));
          })
          .update('advancers', (advancers) => {
            const toRowAdvancers = curr.get('lines').get(toRow).get('advancers');
            const before = advancers.slice(0, fromCol);
            const after = toRowAdvancers.slice(toCol);
            const minus = toRowAdvancers.get(toCol);
            const plus = advancers.get(fromCol);
            return before.concat(after.map(r => r - minus + plus));
          });
        })
        .filter((line, index) => (index <= fromRow || index > toRow));
    });
}

// -- | deleteSelection(curr: State): State
// -- | Deletes all the characteres in the current selection
function deleteSelection(curr) {
  const { fromRow, toRow } = curr.get('selection').toJS();
  if (fromRow === toRow) { return singleLineDeleteSelection(curr); }
  else                   { return multiLineDeleteSelection(curr); }
}

// -- | deleteReducer(e: Event => (curr: State)): State
// -- | The reducer responsible for deletion
const deleteReducer = __ => curr => {
  const { row, col }  = curr.get('cursor').toJS();
  const { fromRow, toRow, toCol } = curr.get('selection').toJS();
  if (fromRow !== toRow || toRow !== toCol) { return deleteSelection(curr); }
  if (col <= 0 && row <= 0) { return curr; }
  if (col === 0 && row > 0) { return concatPrevLine(curr); }
  if (col > 0)              { return deletePrevChar(curr); }
  return curr;
};

export default deleteReducer;
