import { nearestCol, nearestRow } from '../util/nearest';
import { SelectionRect } from '../type/type';

// -- | addSelectionReducer(rect: number) => ((curr: State) => State)
// -- | The reducer responsible for adding text selections
// -- | via rectangular mousedrags
const addSelectionReducer = ({ fromX, fromY, toX, toY }) => curr => {
  const lines = curr.get('lines');
  const fromRow = nearestRow(fromY, lines.size);
  const fromCol = nearestCol(fromX, lines.get(fromRow).get('advancers'));
  const toRow = nearestRow(toY, lines.size);
  const toCol = nearestCol(toX, lines.get(toRow).get('advancers'));

  // normalize: for backwards selections we swap what is "from" which what is "to"
  const isBackwards = (fromRow > toRow || (fromRow === toRow && toCol < fromCol));
  const [fromRowNorm, toRowNorm] = (isBackwards) ? [toRow, fromRow] : [fromRow, toRow];
  const [fromColNorm, toColNorm] = (isBackwards) ? [toCol, fromCol] : [fromCol, toCol];

  return curr.set('selection', new SelectionRect({
    fromRow: fromRowNorm,
    fromCol: fromColNorm,
    toRow: toRowNorm,
    toCol: toColNorm
  }));
};

export default addSelectionReducer;
