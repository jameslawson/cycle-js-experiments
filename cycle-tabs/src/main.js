import $ from 'jquery';
import { Observable } from 'rx';

import Cycle from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';

import intent from './intent';
import model from './model';
import view from './view';
import { makeSizeDriver } from './drivers';

function main({DOM, Size}) {
  const i = intent({DOM});
  const m = model({intent: i, Size});
  const v = view({model: m, Size});
  const resize$ = Observable.fromEvent(window, 'resize').debounce(100).startWith(null);
  return {
    DOM: v,
    Size: resize$
  };
}

$(document).ready(function() {
    Cycle.run(main, {
      DOM: makeDOMDriver('#app'),
      Size: makeSizeDriver()
    });
});
