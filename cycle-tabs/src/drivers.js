import { Observable } from 'rx';
import $ from 'jquery';

/**
 * [1]: get the width of each item
 * [2]: compute the cumulative width
 */
function getBoundaries() {
  const widths = $('.carousel-track').find('.item').map(function() {
    return -$(this).outerWidth(true);
  }).get(); // [1]

  const offsets = _.chain(widths).reduce((acc, curr) => {
    acc.push(_.last(acc) + curr);
    return acc;
  }, [0]).value(); // [2]

  return offsets;
}

const getViewportWidth = () => $('.carousel-viewport').width();

function makeSizeDriver() {

  function SizeDriver(resize$) {
    const boundaries$ = Observable.create(observer => {
      resize$.subscribe(ev => observer.onNext(getBoundaries()))
    }).first();
    return {
      boundaries$,
      track$: boundaries$.map(bs => -_.last(bs)),
      viewport$: Observable.create(observer => {
        resize$.subscribe(ev => observer.onNext(getViewportWidth()))
      })
    };
  }

  return SizeDriver;
}

module.exports = { makeSizeDriver };
