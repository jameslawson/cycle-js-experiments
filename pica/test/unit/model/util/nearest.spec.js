import { List } from 'immutable';
import constants from '../../../../src/model/type/constants';
import { nearestRow, nearestCol } from '../../../../src/model/util/nearest';

describe('nearest rows and columns', () => {
  it('should return the first row for y <= 0', () => {
    expect(nearestRow(-20)).to.equal(0);
    expect(nearestRow(0)).to.equal(0);
  });

  it('should return the first row for 0 <= y < LINE_HEIGHT', () => {
    expect(nearestRow(0)).to.equal(0);
    expect(nearestRow(Math.floor(constants.LINE_HEIGHT / 2))).to.equal(0);
    expect(nearestRow(constants.LINE_HEIGHT - 1)).to.equal(0);
  });

  it('should return the second row for LINE_HEIGHT <= y < 2*LINE_HEIGHT', () => {
    expect(nearestRow(constants.LINE_HEIGHT)).to.equal(1);
    expect(nearestRow(1.5 * constants.LINE_HEIGHT)).to.equal(1);
    expect(nearestRow(2 * constants.LINE_HEIGHT - 1)).to.equal(1);
  });

  it('should return the first col for empty list of advancers', () => {
    // for any value of x
    expect(nearestCol(0, List.of())).to.equal(0);
    expect(nearestCol(-20, List.of())).to.equal(0);
    expect(nearestCol(471, List.of())).to.equal(0);
  });

  it('should return the left of two advancers for x <= midpoint', () => {
    // with two advancers of [0, 10], the midpoint is 5
    expect(nearestCol(0, List.of(0, 10))).to.equal(0);
    expect(nearestCol(2.5, List.of(0, 10))).to.equal(0);
    expect(nearestCol(5, List.of(0, 10))).to.equal(0);
  });

  it('should return the right of two advancers for x >= midpoint', () => {
    // with two advancers of [0, 10], the midpoint is 5
    expect(nearestCol(5.1, List.of(0, 10))).to.equal(1);
    expect(nearestCol(7.5, List.of(0, 10))).to.equal(1);
    expect(nearestCol(10, List.of(0, 10))).to.equal(1);
    expect(nearestCol(15, List.of(0, 10))).to.equal(1);
  });

  it('should return the nearest col for three advancers', () => {
    expect(nearestCol(25, List.of(0, 10, 20, 35))).to.equal(2);
  });
});
