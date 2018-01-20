import { List } from 'immutable';
import { Attrs, Block, State } from '../../../../src/model/type/type';
import insert from '../../../../src/model/reducer/insertReducer';

describe('insert reducer', () => {
  it('should insert with no text', () => {
    const after = toState('x|', List.of(List.of(0, 20)));
    expect(insert({ text: 'x', width: 20 })(new State())).to.equal(after);
  });

  it('should insert at the beginning of some text', () => {
    const before = toState('Foo', List.of(List.of(0, 5, 15, 35)));
    const after = toState('x|Foo', List.of(List.of(0, 100, 105, 115, 135)));
    expect(insert({ text: 'x', width: 100 })(before)).to.equal(after);
  });

  it('should insert at the end of some text', () => {
    const before = toState('Foo|', List.of(List.of(0, 5, 15, 35)));
    const after = toState('Foox|', List.of(List.of(0, 5, 15, 35, 135)));
    expect(insert({ text: 'x', width: 100 })(before)).to.equal(after);
  });

  it('should insert a character in the middle of some text', () => {
    const before = toState('Fo|o', List.of(List.of(0, 5, 15, 35)));
    const after = toState('Fox|o', List.of(List.of(0, 5, 15, 115, 135)));
    expect(insert({ text: 'x', width: 100 })(before)).to.equal(after);
  });

  it('should ignore new line insertions', () => {
    const state = toState('Foo|', List.of(List.of(0, 5, 15, 35)));
    expect(insert({ text: '\r', width: 100 })(state)).to.equal(state);
    expect(insert({ text: '\n', width: 100 })(state)).to.equal(state);
  });

  it('should insert text with current attributes', () => {
    const boldItalic = new Attrs({ bold: true, italic: true });
    const before = new State({ attrs: boldItalic });
    const after = insert({ text: 'x', width: 100 })(before);
    expect(after.get('lines').get(0).get('blocks')).to.equal(
        List.of(new Block({ text: 'x', attrs: boldItalic })));
  });

  it('should replace selected text with insertion text', () => {
    const before = toState('f!OOBA!r');
    const after = toState('fu|r', List.of(List.of(0, 1, 101, 102)));
    expect(insert({ text: 'u', width: 100 })(before)).to.equal(after);
  });
});
