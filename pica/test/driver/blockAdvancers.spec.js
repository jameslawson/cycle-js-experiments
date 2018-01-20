import { Attrs, Block } from '../../src/model/type/type';
import { List } from 'immutable';
import f from '../../src/driver/blockAdvancers';

describe('block advancers', () => {
  const b = new Attrs({ bold: true });

  it('should return [0] for empty text', () => {
    const out = f(List.of(new Block({ text: '' })));
    expect(out).to.equal(List.of(0));
  });

  it('should output advancers for a line', () => {
    const out = f(List.of(new Block({ text: 'foo' })));
    expect(out).to.be.increasing.and.have.size(4);
  });

  it('should output advancers for bold text', () => {
    const out = f(List.of(new Block({ attrs: b, text: 'foo' })));
    expect(out).to.be.increasing.and.have.size(4);
  });

  it('should be that bold text is wider than normal text', () => {
    const normal = f(List.of(new Block({ text: 'foo' })));
    const bold   = f(List.of(new Block({ attrs: b, text: 'foo' })));
    const normalWidth = normal.last();
    const boldWidth   = bold.last();
    expect(boldWidth).to.be.above(normalWidth);
  });

  it('should be output advancers for mixture of both bold and normal text', () => {
    const out = f(List.of(
        new Block({ text: 'foo' }),
        new Block({ attrs: b, text: 'bar' })
    ));
    expect(out).to.be.increasing.and.have.size(7);
  });
});
