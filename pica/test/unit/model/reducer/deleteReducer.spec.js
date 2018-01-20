import { State } from '../../../../src/model/type/type';
import del from '../../../../src/model/reducer/deleteReducer';

describe('delete reducer', () => {
  it('should should identity the initial state', () => {
    expect(del()(new State())).to.equal(new State());
  });

  it('should delete first character when cursor at (0,1)', () => {
    const before = toState('x|');
    const after = toState('|');
    expect(del()(before)).to.equal(after);
  });

  it('should append the line to prev line when cursor at (row,0) for row > 0', () => {
    const before = toState('foo |bar');
    const after = toState('foo|bar');
    expect(del()(before)).to.equal(after);
  });

  it('should delete prev character when cursor at (row,col) for row > 0, col > 0', () => {
    const before = toState('foo ba|r');
    const after = toState('foo b|r');
    expect(del()(before)).to.equal(after);
  });

  it('should delete text in a one-line selection', () => {
    const before = toState('fo!OB!ar');
    const after = toState('fo|ar');
    expect(del()(before)).to.equal(after);
  });

  it('should delete text in a multi-line selection', () => {
    const before = toState('ab!CDEF GHIJKL MO!op');
    const after = toState('ab|op');
    expect(del()(before)).to.equal(after);
  });
});
