import { List } from 'immutable';
import { Attrs, Block, SelectionRect } from '../../../../src/model/type/type';
import boldSelect from '../../../../src/model/reducer/boldSelectReducer';

describe('bold selection reducer', () => {
  it('should embolden a single-line selection of text', () => {
    const before = toState('fo!OBA!r');
    const after = before.setIn(['lines', '0', 'blocks'], List.of(
      new Block({ text: 'fo' }),
      new Block({ text: 'OBA', attrs: new Attrs({ bold: true }) }),
      new Block({ text: 'r' })
    )).set('selection', new SelectionRect());
    expect(boldSelect()(before)).to.equal(after);
  });
});
