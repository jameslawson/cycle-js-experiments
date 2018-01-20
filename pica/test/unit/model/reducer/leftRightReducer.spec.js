import { State } from '../../../../src/model/type/type';
import leftRight from '../../../../src/model/reducer/leftRightReducer';

describe('left-right reducer', () => {
  it('should identity when moving left at (0,0)', () => {
    expect(leftRight(-1)(new State())).to.equal(new State());
  });

  it('should move left when cursor at (row,col) for col > 0', () => {
    // for all values of row
    const before = toState('ab|cd');
    const after = toState('a|bcd');
    expect(leftRight(-1)(before)).to.equal(after);
  });

  it('should move backwards to end of prev line when cursor at (row,0) for row>0', () => {
    const before = toState('abc |xyz');
    const after = toState('abc| xyz');
    expect(leftRight(-1)(before)).to.equal(after);
  });

  it('should move right when cursor at (row,col) for col < length of line', () => {
    const before = toState('a|bcd');
    const after = toState('ab|cd');
    expect(leftRight(+1)(before)).to.equal(after);
  });

  it('should move forwards to begigging of next line when col = length of line', () => {
    const before = toState('abc| xyz');
    const after = toState('abc |xyz');
    expect(leftRight(+1)(before)).to.equal(after);
  });

  it('should identity when moving right at (R, C)', () => {
    // where C denotes the index of the last column of the last row, R
    const state = toState('abc xyz|');
    expect(leftRight(+1)(state)).to.equal(state);
  });

  it('should be that moving left and moving right are mathematical inverses', () => {
    const before = toState('abc x|yz');
    const after = leftRight(-1)(leftRight(+1)(before));
    expect(before).to.equal(after);
  });
});
