import { SelectionRect } from '../type/type';

// -- | removeSelectionReducer(rect: Rect) => ((curr: State) => State)
// -- | The reducer responsible for removing text selections
const removeSelectionReducer = __ => curr => {
  return curr.set('selection', new SelectionRect());
};

export default removeSelectionReducer;
