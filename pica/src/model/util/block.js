import { List } from 'immutable';
import { Block } from '../type/type';

function merge(xs) {
  return xs.reduce((acc, curr) => {
    // [1]: begin the first run
    // [2]: extend the current run
    // [3]: end current run, start a brand new run
    if (acc.isEmpty()) {
      return acc.push(curr); // [1]
    } else {
      const last = acc.last();
      if (last.get('attrs').equals(curr.get('attrs'))) {
        return acc.butLast().push(new Block({
          text: last.get('text') + curr.get('text'),
          attrs: curr.get('attrs')
        }));
      } else {
        return acc.push(curr);
      }
    }
  }, List.of());
}

const split = (xs) => xs.flatMap(block => {
  return List.of(...block.get('text').split('')).map(chr => {
    return new Block({ text: chr, attrs: block.get('attrs') });
  });
});

export { merge, split };
