import { Cursor } from '../type/type';

// -- | leftRightReducer(delta: number => (curr: State)): State
// -- | The reducer responsible for moving the cursor left/right

function moveForward(curr) {
  const { row, col } = curr.get('cursor').toJS();
  const currLine = curr.get('lines').get(row);
  const maxRow = curr.get('lines').size - 1;
  const maxCol = currLine.get('advancers').size - 1;

  if (col < maxCol) {
    return curr.set('cursor', new Cursor({ row: row, col: col + 1 }));
  } else if (row === maxRow) {
    return curr;
  } else {
    return curr.set('cursor', new Cursor({ row: row + 1, col: 0 }));
  }
}

function moveBackward(curr) {
  const { row, col } = curr.get('cursor').toJS();

  if (col === 0) {
    if (row === 0) { return curr; }
    else {
      const prevLine = curr.get('lines').get(row - 1);
      const prevMaxCol = prevLine.get('advancers').size - 1;
      return curr.set('cursor', new Cursor({ row: row - 1, col: prevMaxCol }));
    }
  } else {
    return curr.set('cursor', new Cursor({ row: row, col: col - 1 }));
  }
}

const leftRightReducer = delta => curr => {
  if (delta === -1) { return moveBackward(curr); }
  if (delta === 1)  { return moveForward(curr); }
  return curr;
};

export default leftRightReducer;
