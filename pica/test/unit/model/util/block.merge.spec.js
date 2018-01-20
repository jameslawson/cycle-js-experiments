import { merge } from '../../../../src/model/util/block';
import { Attrs, Block } from '../../../../src/model/type/type';
import { List } from 'immutable';
const f = merge;
const bold = new Attrs({ bold: true });

describe('blocks merging', () => {
  it('should merge an empty list of block', () => {
    const input = List.of();
    const output = f(input);
    expect(output).to.equal(input);
  });

  it('should merge a singleton block', () => {
    const input = List.of(new Block());
    const output = f(input);
    expect(output).to.equal(input);
  });

  it('should merge regular: ["a","b","c"]', () => {
    const input = List.of(
      new Block({ text: 'a' }),
      new Block({ text: 'b' }),
      new Block({ text: 'c' })
    );
    const output = f(input);
    expect(output).to.equal(List.of(new Block({ text: 'abc' })));
  });

  it('should merge bold: ["a","b","c"]; regular: ["x","y","z"]', () => {
    const input = List.of(
      new Block({ text: 'a', attrs: bold }),
      new Block({ text: 'b', attrs: bold }),
      new Block({ text: 'c', attrs: bold }),
      new Block({ text: 'x' }),
      new Block({ text: 'y' }),
      new Block({ text: 'z' })
    );
    const output = f(input);
    expect(output).to.equal(List.of(
      new Block({ text: 'abc', attrs: bold }),
      new Block({ text: 'xyz' })
    ));
  });

  it('should merge bold: ["a","b"]; regular: ["p","q"]; bold: ["x", "y"]', () => {
    const input = List.of(
      new Block({ text: 'a', attrs: bold }),
      new Block({ text: 'b', attrs: bold }),
      new Block({ text: 'p' }),
      new Block({ text: 'q' }),
      new Block({ text: 'x', attrs: bold }),
      new Block({ text: 'y', attrs: bold })
    );
    const output = f(input);
    expect(output).to.equal(List.of(
      new Block({ text: 'ab', attrs: bold }),
      new Block({ text: 'pq' }),
      new Block({ text: 'xy', attrs: bold })
    ));
  });
});
