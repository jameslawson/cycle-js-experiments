import { fromJS } from 'immutable';
import { merge, split } from '../util/block';
import { Block } from '../type/type';
import deleteReducer from './deleteReducer';

function insertText({ text, width }, curr) {
  if (text === '\r') { return curr; }
  if (text === '\n') { return curr; }

  const { row, col } = fromJS(curr.get('cursor'));
  const attrs = curr.get('attrs');

  return curr
  .update('lines', (lines) => {
    return lines.update(row, (line) => {
      return line
      .update('blocks', (blocks) => {
        return merge(split(blocks).insert(col, new Block({ text: text, attrs: attrs })));
      })
      .update('advancers', (advancers) => {
        const left = advancers.slice(0, col + 1);
        const right = advancers.slice(col + 1);
        const advancer = left.last() + width;
        return left.push(advancer).concat(right.map(x => x + width));
      });
    });
  })
  .update('cursor', (cursor) => {
    return cursor.update('col', (c) => c + 1);
  });
}

// -- | insertReducer(__ => (curr: State)): State
// -- | The reducer responsible for inserting text
const insertReducer = textInfo => curr => {
  const { fromRow, toRow, toCol } = curr.get('selection').toJS();
  if (fromRow !== toRow || toRow !== toCol) {
    return insertText(textInfo, deleteReducer()(curr));
  } else {
    return insertText(textInfo, curr);
  }
};

export default insertReducer;
