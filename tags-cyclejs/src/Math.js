/**
 * @description Compute x modulo y (x mod y).
 * which unlike %, handles negative values of x
 * in the sensible way; following the mathematical
 * def. of mod (aka the 'floor modulus' in Java).
 * @param {Number} x x is any integer.
 * @param {Number} y y is a strictly positive integer
 * @see Java 8 Math.floorMod
 */
function mod(x, y) {
  return (x % y + y) % y;
}

export { mod };

