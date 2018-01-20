import { keycodeNormal } from '../../../src/intent/keycode';

// non-control-keys
const A = 'A'.charCodeAt();

// control-keys
const BS = 8; // backspace

describe('extract keycodes for non-control keys for keypress event', () => {
  it('should extract the keycode for WebKit, Blink, IE9+', () => {
    // WekKit, Blink, IE9+, for "normal keys", put ASCII value inside `keyCode`,
    // leaving `which` and `charCode` as undefined
    expect(keycodeNormal({ keyCode: A, which: A, charCode: A })).to.equal(A);
  });

  it('should extract the keycode for Gecko (Firefox)', () => {
    // Gecko, for "normal keys", doesn't put ASCII value in `keyCode`,
    // but inside, puts it in `which` and in `charCode`
    expect(keycodeNormal({ keyCode: 0, which: A, charCode: A })).to.equal(A);
  });

  it('should extract the keycode for IE<9', () => {
    // IE<9, for "normal keys", puts ASCII value inside `keyCode`,
    // leaving `which` and `charCode` as undefined
    expect(keycodeNormal({
      keyCode: A
      // which: undefined,
      // charCode: undefined
    })).to.equal(A);
  });

  it('should extract the keycode for Opera', () => {
    expect(keycodeNormal({
      keyCode: A,
      which: A
      // charCode: undefined
    })).to.equal(A);
  });

  it('should ignore keycodes for WK<525', () => {
    expect(keycodeNormal({ keyCode: BS, which: BS, charCode: BS })).to.equal(0);
  });

  it('should ignore keycodes for control keys for Opera 10.5+', () => {
    expect(keycodeNormal({ keyCode: BS, which: 0, charCode: BS })).to.equal(0);
  });

  it('should ignore keycodes for control keys for Opera 9.5..10.5', () => {
    expect(keycodeNormal({ keyCode: BS, which: 0, charCode: BS })).to.equal(0);
  });
});
