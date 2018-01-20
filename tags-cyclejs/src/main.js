import $ from 'jquery';
import { Observable } from 'rx';

import Cycle from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { makePreventDefaultDriver,
         makeSetFocusDriver,
         makeCursorToEndOnFocusDriver } from './drivers';

import intent from './intent';
import model from './model';
import view from './view';

import isolate from '@cycle/isolate';
import Dropdown from './Dropdown';

function main({DOM, HTTP})
{
  const i = intent(DOM);
  const m = model(i, DOM, HTTP);

  const textbox$ = DOM.select('.field').observable.flatMap(x => x);
  const focusNeeded = [
    i.containerClick$, // whenever you click on the component (anywhere)
    i.clickResult$,    // click on a result
    m.state$           // whenever you get wanted result
                       // whenever you move up or down in results
  ];
  const focus$ = Observable.merge(...focusNeeded)
    .withLatestFrom(textbox$, (_, t) => t);

  return {
    DOM: view(m),
    HTTP: m.request$.debounce(750),
    PreventDefault: i.upOrDownPressed$,
    SetFocus: focus$,
    CursorToEnd: focus$
  };
}

$(document).ready(function() {
  Cycle.run(main, {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    PreventDefault: makePreventDefaultDriver(),
    SetFocus: makeSetFocusDriver(),
    CursorToEnd: makeCursorToEndOnFocusDriver()
  });
});
