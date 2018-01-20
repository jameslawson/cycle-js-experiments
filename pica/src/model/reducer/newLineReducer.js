import { merge, split } from '../util/block';
import { Line } from '../type/type';
import { List } from 'immutable';
import deleteReducer from './deleteReducer';

function addNewLine(curr) {
  const { row, col }   = curr.get('cursor').toJS();
  const currLine     = curr.get('lines').get(row);
  const lastAdvancer = currLine.get('advancers').get(col);

  return curr
    .update('lines', (lines) => {
      return lines
        .update(row, (line) => {
          return line
            .update('advancers', (advancers) => advancers.slice(0, col + 1))
            .update('blocks', (blocks) => merge(split(blocks).slice(0, col)));
        })
        .insert(row + 1, new Line({
          advancers: List.of(0)
            .concat(currLine.get('advancers')
            .slice(col + 1)
            .map(r => r - lastAdvancer)),
          blocks: merge(split(currLine.get('blocks')).slice(col))
        }));
    })
    .update('cursor', (cursor) => {
      return cursor
        .update('row', (row) => row + 1)
        .update('col', (__) => 0);
    });
}

// -- | newLineReducer(__ => (curr: State)): State
// -- | The reducer responsible for creating new lines
const newLineReducer = __ => curr => {
  const { fromRow, toRow, toCol }   = curr.get('selection').toJS();
  if (fromRow !== toRow || toRow !== toCol) {
    return addNewLine(deleteReducer()(curr));
  } else {
    return addNewLine(curr);
  }
};

export default newLineReducer;
