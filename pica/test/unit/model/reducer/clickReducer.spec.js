import { List } from 'immutable';
import { Cursor, Line, State } from '../../../../src/model/type/type';
import constants from '../../../../src/model/type/constants';
import click from '../../../../src/model/reducer/clickReducer';

describe('click reducer', () => {
  it('should position the cursor for the initial state', () => {
    // for any x, y, the cursor should be positioned at (0,0)
    expect(click({ x: 0, y: 0 })(new State())).to.equal(new State());
    expect(click({ x: 873, y: 215 })(new State())).to.equal(new State());
    expect(click({ x: 103, y: 759 })(new State())).to.equal(new State());
    expect(click({ x: -352, y: -684 })(new State())).to.equal(new State());
  });

  it('should position the cursor horizontally', () => {
    const before = toState('adcd', List.of(List.of(0, 10, 20, 30, 40)));
    const after = before.set('cursor', new Cursor({ col: 2 }));
    expect(click({ x: 21, y: 0 })(before)).to.equal(after);
  });

  it('should position the cursor vertically', () => {
    const coords = { x: 0, y: 2 * constants.LINE_HEIGHT + 0.5 };
    const blank = new Line();
    const lines = List.of(blank, blank, blank, blank);
    const before = toState('    ', { lines });
    const after = before.set('cursor', new Cursor({ row: 2 }));
    expect(click(coords)(before)).to.equal(after);
  });
});
