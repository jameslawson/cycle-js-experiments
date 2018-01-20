import { List } from 'immutable';
import search from '../../../../src/model/util/binarySearch';

describe('binary search', () => {
  it('should return 0 when searching the empty list', () => {
    expect(search(List.of(), 1)).to.equal(0);
  });

  it('should return 0 when successfully finding in a singleton', () => {
    expect(search(List.of(1), 1)).to.equal(0);
  });

  it('should return 0 when failing to find in a singleton', () => {
    expect(search(List.of(1), -1)).to.equal(0);
  });

  it('should return index of largest number less or equal to search key', () => {
    expect(search(List.of(1, 5, 10), 7)).to.equal(1);
    expect(search(List.of(1, 5, 10), 5)).to.equal(1);
    expect(search(List.of(1, 5, 10), 4)).to.equal(0);
  });

  it('should return index of last element when search key an upper bound', () => {
    expect(search(List.of(1, 5, 10), 10)).to.equal(2);
    expect(search(List.of(1, 5, 10), 11)).to.equal(2);
  });

  it('should return index of first element when search key is a lower bound', () => {
    expect(search(List.of(1, 5, 10), -1)).to.equal(0);
    expect(search(List.of(1, 5, 10), 0)).to.equal(0);
  });

  it('should throw an error when key is not finite primitive number', () => {
    const err = /key is not finite primitive/;
    expect(() => { search(List.of(1, 5, 10), NaN); }).to.throw(err);
    expect(() => { search(List.of(1, 5, 10), Infinity); }).to.throw(err);
    expect(() => { search(List.of(1, 5, 10), null); }).to.throw(err);
  });

  it('should throw an error when list contains a non-finite primitive number', () => {
    // and said item is encounted (involved in a comparison) during the binary search
    const err = /item that is not a finite primitive/;
    expect(() => { search(List.of(NaN, NaN), 1); }).to.throw(err);
    expect(() => { search(List.of(1, NaN, 10), 5); }).to.throw(err);
  });
});
