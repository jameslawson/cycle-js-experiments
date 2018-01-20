import newLine from '../../../../src/model/reducer/newLineReducer';

describe('new line reducer', () => {
  it('should add a new line to the initial state', () => {
    const before = toState('|');
    const after = toState(' |');
    expect(newLine()(before)).to.equal(after);
  });

  it('should add a new line when cursor after some text', () => {
    const before = toState('foo|');
    const after = toState('foo |');
    expect(newLine()(before)).to.equal(after);
  });

  it('should split the line when cursor in middle of a line', () => {
    const before = toState('foo|bar');
    const after = toState('foo |bar');
    expect(newLine()(before)).to.equal(after);
  });

  it('should split the line when cursor in middle of a line', () => {
    const before = toState('f!OOBA!r');
    const after = toState('f |r');
    expect(newLine()(before)).to.equal(after);
  });
});
