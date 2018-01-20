import { nearestRow, nearestCol } from '../util/nearest';
import { Cursor } from '../type/type';

const clickReducer = ({ x, y }) => curr => {
  const lines = curr.get('lines');
  const row = nearestRow(y, lines.size);
  const col = nearestCol(x, lines.get(row).get('advancers'));

  return curr.set('cursor', new Cursor({ row: row, col: col }));
};

export default clickReducer;
