import toState from '../../../../src/model/util/toState';
import {
  Block,
  Cursor,
  Line,
  SelectionRect,
  State
} from '../../../../src/model/type/type';
import { List } from 'immutable';

describe('toState test helper', () => {
  it('should parse an empty state', () => {
    expect(toState('')).to.equal(new State());
  });

  it('should parse four blank lines', () => {
    const blank = new Line();
    const lines = List.of(blank, blank, blank, blank);
    expect(toState('   ')).to.equal(new State({ lines }));
  });

  it('should parse an a line of text', () => {
    const advancers = List.of(0, 1, 2, 3, 4, 5, 6);
    const line = new Line({ blocks: List.of(new Block({ text: 'abcdef' })), advancers });
    expect(toState('abcdef')).to.equal(new State({ lines: List.of(line) }));
  });

  it('should parse two lines of text', () => {
    const advancers = List.of(0, 1, 2, 3);
    const first = new Line({ blocks: List.of(new Block({ text: 'abc' })), advancers });
    const second = new Line({ blocks: List.of(new Block({ text: 'def' })), advancers });
    expect(toState('abc def')).to.equal(new State({ lines: List.of(first, second) }));
  });

  it('should parse "|" to set the cursor position', () => {
    const advancers = List.of(0, 1, 2, 3, 4, 5, 6);
    expect(toState('abc|def')).to.equal(new State({
      cursor: new Cursor({ col: 3 }),
      lines: List.of(new Line({
        blocks: List.of(new Block({ text: 'abcdef' })),
        advancers: advancers
      }))
    }));
  });

  it('should parse "|" to set the cursor position for two lines', () => {
    const advancers = List.of(0, 1, 2, 3);
    const first = new Line({ blocks: List.of(new Block({ text: 'abc' })), advancers });
    const second = new Line({ blocks: List.of(new Block({ text: 'def' })), advancers });
    expect(toState('abc de|f')).to.equal(new State({
      cursor: new Cursor({ row: 1, col: 2 }),
      lines: List.of(first, second)
    }));
  });

  it('should parse "!" to change the selection', () => {
    const advancers = List.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    expect(toState('xxx!yyy!zzz')).to.equal(new State({
      selection: new SelectionRect({ fromCol: 3, toCol: 6 }),
      lines: List.of(new Line({
        blocks: List.of(new Block({ text: 'xxxyyyzzz' })),
        advancers: advancers
      }))
    }));
  });

  it('should parse "!" to change the selection for multiple lines', () => {
    const advancers = List.of(0, 1, 2, 3, 4);
    const lines = List.of(
        new Line({ blocks: List.of(new Block({ text: 'aaaa' })), advancers }),
        new Line({ blocks: List.of(new Block({ text: 'bbbb' })), advancers }),
        new Line({ blocks: List.of(new Block({ text: 'cccc' })), advancers }),
        new Line({ blocks: List.of(new Block({ text: 'dddd' })), advancers })
        );
    expect(toState('aaaa bb!bb cccc dddd!')).to.equal(new State({
      selection: new SelectionRect({ fromRow: 1, fromCol: 2, toRow: 3, toCol: 4 }),
      lines: lines
    }));
  });

  it('should allow you to specifiy advancers as an argument', () => {
    const advancers = List.of(List.of(0, 10, 20, 30));
    expect(toState('aaa', advancers)).to.equal(new State({
      lines: List.of(new Line({
        blocks: List.of(new Block({ text: 'aaa' })),
        advancers: List.of(0, 10, 20, 30)
      }))
    }));
  });

  it('should allow you to specifiy advancers as an argument for multiline', () => {
    const first = List.of(0, 10, 20, 30);
    const second = List.of(0, 10, 20, 30);
    const advancers = List.of(first, second);

    const firstLine = (new Line({
      blocks: List.of(new Block({ text: 'aaa' })),
      advancers: first
    }));
    const secondLine = (new Line({
      blocks: List.of(new Block({ text: 'bbb' })),
      advancers: second
    }));

    expect(toState('aaa bbb', advancers)).to.equal(new State({
      lines: List.of(firstLine, secondLine)
    }));
  });

  it('should use ones as widths when advancers are not specified', () => {
    expect(toState('aaa')).to.equal(new State({
      lines: List.of(new Line({
        blocks: List.of(new Block({ text: 'aaa' })),
        advancers: List.of(0, 1, 2, 3)
      }))
    }));
  });

  it('should use 1s as widths when advancers are not specified for second line', () => {
    const first = List.of(0, 10, 20, 30);
    const second = List.of(0, 1, 2, 3, 4, 5);

    const firstLine = (new Line({
      blocks: List.of(new Block({ text: 'aaa' })),
      advancers: first
    }));
    const secondLine = (new Line({
      blocks: List.of(new Block({ text: 'bbbbb' })),
      advancers: second
    }));

    expect(toState('aaa bbbbb', List.of(first))).to.equal(new State({
      lines: List.of(firstLine, secondLine)
    }));
  });
});
