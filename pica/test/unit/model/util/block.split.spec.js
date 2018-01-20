import { split } from '../../../../src/model/util/block';
import { Attrs, Block } from '../../../../src/model/type/type';
import { List } from 'immutable';
const f = split;
const bold = new Attrs({ bold: true });

describe('blocks splitting', () => {
  it('should identity the empty list', () => {
    const input = List.of();
    const output = f(input);
    expect(output).to.equal(input);
  });

  it('should identity one block with regular "a"', () => {
    const input = List.of(new Block({ text: 'a' }));
    const output = f(input);
    expect(output).to.equal(input);
  });

  it('should split regular: "abc"', () => {
    const input = List.of(new Block({ text: 'abc' }));
    const output = f(input);
    expect(output).to.equal(List.of(
      new Block({ text: 'a' }),
      new Block({ text: 'b' }),
      new Block({ text: 'c' })
    ));
  });

  it('should split bold: "abc"; regular: "xyz"', () => {
    const input = List.of(
      new Block({ text: 'abc', attrs: bold }),
      new Block({ text: 'xyz' })
    );
    const output = f(input);
    expect(output).to.equal(List.of(
      new Block({ text: 'a', attrs: bold }),
      new Block({ text: 'b', attrs: bold }),
      new Block({ text: 'c', attrs: bold }),
      new Block({ text: 'x' }),
      new Block({ text: 'y' }),
      new Block({ text: 'z' })
    ));
  });

  it('should split regular: "ab"; bold: "pq"; regular: "xy"', () => {
    const input = List.of(
      new Block({ text: 'ab' }),
      new Block({ text: 'pq', attrs: bold }),
      new Block({ text: 'xy' })
    );
    const output = f(input);
    expect(output).to.equal(List.of(
      new Block({ text: 'a' }),
      new Block({ text: 'b' }),
      new Block({ text: 'p', attrs: bold }),
      new Block({ text: 'q', attrs: bold }),
      new Block({ text: 'x' }),
      new Block({ text: 'y' })
    ));
  });
});
