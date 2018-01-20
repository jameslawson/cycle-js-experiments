import clamp from 'lodash.clamp';
import { nearestCol } from '../util/nearest';
import { Cursor } from '../type/type';

// -- | upDownReducer(delta: number) => ((curr: State) => State)
// -- | The reducer responsible for moving the cursor up/down.
const upDownReducer = (delta => curr => {
  const { row, col }  = curr.get('cursor').toJS();

  const maxRow = curr.get('lines').size - 1;
  const nextRow = clamp(row + delta, 0, maxRow);

  const nextRowAdvancers = curr.get('lines').get(nextRow).get('advancers');
  const currAdvancer = curr.get('lines').get(row).get('advancers').get(col);
  const nextCol = nearestCol(currAdvancer, nextRowAdvancers);

  return curr.set('cursor', new Cursor({ row: nextRow, col: nextCol }));
});

export default upDownReducer;
