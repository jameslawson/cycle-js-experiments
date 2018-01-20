import { List } from 'immutable';
import { SelectionRect } from '../../../../src/model/type/type';
import constants from '../../../../src/model/type/constants';
import select from '../../../../src/model/reducer/addSelectionReducer';

describe('add selection reducer', () => {
  it('should select a single character', () => {
    const rect = { fromX: 0, fromY: 0, toX: 10, toY: constants.LINE_HEIGHT };
    const before = toState('a', List.of(List.of(0, 10)));
    const after = before.set('selection', new SelectionRect({ toCol: 1 }));
    expect(select(rect)(before)).to.equal(after);
  });

  it('should select a several characters on a line', () => {
    const rect = { fromX: 0, fromY: 0, toX: 35, toY: constants.LINE_HEIGHT };
    const before = toState('Hello', List.of(List.of(0, 10, 20, 30, 40, 50)));
    const after = before.set('selection', new SelectionRect({ toCol: 3 }));
    expect(select(rect)(before)).to.equal(after);
  });

  it('should select a several characters across many lines', () => {
    const rect = { fromX: 25, fromY: 0, toX: 35, toY: 2 * constants.LINE_HEIGHT };
    const advancers = List.of(0, 10, 20, 30, 40);
    const before = toState('Hello World', List.of(advancers, advancers));
    const after = before.set('selection', new SelectionRect({
      fromRow: 0,
      fromCol: 2,
      toRow: 1,
      toCol: 3
    }));
    expect(select(rect)(before)).to.equal(after);
  });

  it('should handle backwards selection across many lines', () => {
    const rect = { fromX: 2 * constants.LINE_HEIGHT, fromY: 35, toX: 25, toY: 0 };
    const advancers = List.of(0, 10, 20, 30, 40, 50);
    const before = toState('Hello World', List.of(advancers, advancers));
    const after = before.set('selection', new SelectionRect({
      fromRow: 0,
      fromCol: 2,
      toRow: 1,
      toCol: 3
    }));
    expect(select(rect)(before)).to.equal(after);
  });
});
