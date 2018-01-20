import binarySearch from './binarySearch';
import constants from '../type/constants';
import clamp from 'lodash.clamp';

// -- | nearestRow(y: number, R?: number): number
// -- | Finds the row nearest to y-coordinate of `y`
// -- | when `R` rows are laid out one by one, top-to-bottom
// -- | with the origin positioned at the top-left
// -- | If R is not provided, assume there are infinitely many rows stacked
function nearestRow(y, R) {
  const max = R || Infinity;
  return clamp(Math.floor(y / constants.LINE_HEIGHT), 0, max - 1);
}

// -- | nearestCol(y: number, advs: List<number>): number
// -- | Finds the column nearest to x-coordinate of `x`
// -- | when `R` rows are laid out one by one, top-to-bottom
// -- | with the origin positioned at the top-left
function nearestCol(x, advs) {
  // [1]: Use a binary search to find
  //      the biggest advancer in `advs` that is smaller than x
  //
  // [2]: Work out which side of the character
  //      is nearest to x. if the right is nearer (ldiff > rdiff)
  //      return `right`, otherwise (ldiff <= rdiff) return `left`
  //
  //            <- width of character -->
  //            -------------------------
  //            |                       |
  //            |                       |
  //            -------------------------
  //
  //            |---ldiff---|---rdiff---|
  //     0 -----|-----------|-----------|------------>   (x-axis)
  //        advs[before]    x       advs[after]
  //

  const before = binarySearch(advs, x); // [1]
  const after = before + 1;

  let index;
  if (after < advs.size) { // [2]
    const ldiff = x - advs.get(before);
    const hdiff = advs.get(after) - x;
    index = (ldiff <= hdiff) ? before : after;
  } else {
    index = before;
  }
  return index;
}

export {
  nearestRow,
  nearestCol
};
