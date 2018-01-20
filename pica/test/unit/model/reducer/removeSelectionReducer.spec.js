import { SelectionRect, State } from '../../../../src/model/type/type';
import removeSelect from '../../../../src/model/reducer/removeSelectionReducer';

describe('remove selection reducer', () => {
  it('should remove a selection', () => {
    const before = new State({
      selection: new SelectionRect({ fromRow: 10, toRow: 20, fromCol: 5, toCol: 12 })
    });
    expect(removeSelect()(before)).to.equal(new State());
  });
});
