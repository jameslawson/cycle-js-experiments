import { List } from 'immutable';
import { Cursor, State } from '../../../../src/model/type/type';
import upDown from '../../../../src/model/reducer/upDownReducer';

describe('up-down reducer', () => {
  it('should identity when moving in the initial state)', () => {
    expect(upDown(-1)(new State())).to.equal(new State());
    expect(upDown(+1)(new State())).to.equal(new State());
  });

  it('should identity when moving upwards at (0,0)', () => {
    expect(upDown(-1)(new State())).to.equal(new State());
  });

  it('should identity when moving downwards at (R,C)', () => {
    // where C denotes the index of the last column of the last row, R
    const state = toState('foo bar|');
    expect(upDown(+1)(state)).to.equal(state);
  });

  it('should move upwards for (row, 0) where row > 0', () => {
    // for all col
    const before = toState('foo |bar');
    const after  = toState('|foo bar');
    expect(upDown(-1)(before)).to.equal(after);
  });

  it('should move downwards for (row, 0) where row > 0', () => {
    // for all col
    const before = toState('|foo bar');
    const after  = toState('foo |bar');
    expect(upDown(+1)(before)).to.equal(after);
  });

  it('should go to the nearest column when moving downwards', () => {
    const advancers = List.of(
      List.of(0, 25, 50, 75, 100, 125),
      List.of(0, 50, 200, 500)
    );
    // cursor positioned at an advancer of 75 ...
    // ... then we move down (so `row` is incremented from 0 to 1)
    // ...75 puts us between 50 and 200, 50 is closest
    // ...hence `col` = 1
    const before = toState('Hel|lo Foo', advancers);
    const after = before.set('cursor', new Cursor({ row: 1, col: 1 }));
    expect(upDown(+1)(before)).to.equal(after);
  });
});
