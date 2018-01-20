import { List } from 'immutable';
import { merge, split } from '../util/block';
import deleteReducer from './deleteReducer';

function insertText({ blocks, advancers }, curr) {
  if (blocks.equals(List.of())) { return curr; }

  const { row, col } = curr.get('cursor').toJS();

  return curr
  .update('lines', (lines) => {
    return lines.update(row, (line) => {
      return line
      .update('blocks', (bs) => {
        const splitbs = split(bs);
        const splitted = splitbs.slice(0, col)
          .concat(split(blocks))
          .concat(splitbs.slice(col));
        return merge(splitted);
      })
      .update('advancers', (advs) => {
        const left = advs.slice(0, col + 1);
        const right = advs.slice(col + 1);
        return left
          .concat(advancers.rest().map(x => x + left.last()))
          .concat(right.map(x => x + advancers.last()));
      });
    });
  })
  .update('cursor', (cursor) => {
    return cursor.update('col', (c) => {
      const total = split(blocks).size;
      return c + total;
    });
  });
}

// -- | insertManyReducer(__ => (curr: State)): State
// -- | The reducer responsible for many characters at once
const insertManyReducer = textInfo => curr => {
  const { fromRow, toRow, toCol } = curr.get('selection').toJS();
  if (fromRow !== toRow || toRow !== toCol) {
    return insertText(textInfo, deleteReducer()(curr));
  } else {
    return insertText(textInfo, curr);
  }
};

export default insertManyReducer;
