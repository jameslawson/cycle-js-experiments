import isFinite from 'lodash.isfinite';

const ERR = 'Binary Search Failed:';
const KEY_ERR = `${ERR} key is not finite primitive number`;
const MID_ERR = `${ERR} ls contains an item that is not a finite primitive number`;

// -- | binarySearch(ls: List, key:T): number
// -- | finds the largest l in `ls` that is less or equal to `key`
function binarySearch(ls, key) {
  if (!isFinite(key)) { throw Error(KEY_ERR); }
  let l = 0;
  let r = ls.size;
  let mid = Math.floor((l + r) / 2);
  while (r - l > 1) {
    if (!isFinite(ls.get(mid))) { throw Error(MID_ERR); }
    if (ls.get(mid) < key)   { l = mid; }
    if (ls.get(mid) > key)   { r = mid; }
    if (ls.get(mid) === key) { l = mid; }
    mid = Math.floor((l + r) / 2);
  }
  return mid;
}

export default binarySearch;
