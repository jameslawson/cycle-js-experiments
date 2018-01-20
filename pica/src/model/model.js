import xs from 'xstream';
import constants from './type/constants';
import { State } from './type/type';
import flattenConcurrently from 'xstream/extra/flattenConcurrently';
import delay from 'xstream/extra/delay';

import insertReducer       from './reducer/insertReducer';
import insertManyReducer   from './reducer/insertManyReducer';
import deleteReducer       from './reducer/deleteReducer';
import newLineReducer      from './reducer/newLineReducer';
import clickReducer        from './reducer/clickReducer';
import leftRightReducer    from './reducer/leftRightReducer';
import upDownReducer       from './reducer/upDownReducer';
import boldToggleReducer   from './reducer/boldToggleReducer';
import italicToggleReducer from './reducer/italicToggleReducer';
import addSelectionReducer from './reducer/addSelectionReducer';
import removeSelectionReducer from './reducer/removeSelectionReducer';
import boldSelectReducer from './reducer/boldSelectReducer';

function model({ intent: {
    Letter$ = xs.of(),
    Paste = xs.of(),
    backspace$ = xs.of(),
    bold$ = xs.of(),
    click$ = xs.of(),
    // down$ = xs.of(),
    italic$ = xs.of(),
    leftRight$ = xs.of(),
    // letter$ = xs.of(),
    mousedown$ = xs.of(),
    mousemove$ = xs.of(),
    mouseup$ = xs.of(),
    // paste$ = xs.of(),
    return$ = xs.of(),
    // space$ = xs.of(),
    // up$ = xs.of(),
    upDown$ = xs.of()
  } }) {
  const mousedrag$ = mousedown$.map((md) => {
    const startX = md.pageX - 10;
    const startY = md.pageY - 10 - 25;
    return mousemove$.map((mm) => {
      mm.preventDefault();
      return {
        fromX: startX,
        fromY: startY,
        toX: mm.pageX - 10,
        toY: mm.pageY - 10 - 25
      };
    }).endWhen(mouseup$);
  }).compose(flattenConcurrently);

  const insertReducer$       = Letter$.map(insertReducer);
  const deleteReducer$       = backspace$.map(deleteReducer);
  const newLineReducer$      = return$.map(newLineReducer);
  const clickReducer$        = click$.map(clickReducer);
  const leftRightReducer$    = leftRight$.map(leftRightReducer);
  const upDownReducer$       = upDown$.map(upDownReducer);
  const boldToggleReducer$   = bold$.map(boldToggleReducer);
  const italicToggleReducer$ = italic$.map(italicToggleReducer);
  const addSelectionReducer$ = mousedrag$.map(addSelectionReducer);
  const removeSelectionReducer$ = click$.map(removeSelectionReducer);
  const boldSelectReducer$   = bold$.map(boldSelectReducer);
  const pasteReducer$        = Paste.map(insertManyReducer);

  const reducers$ = xs.merge(
    insertReducer$,
    pasteReducer$,
    deleteReducer$,
    newLineReducer$,
    clickReducer$,
    leftRightReducer$,
    upDownReducer$,
    boldToggleReducer$,
    italicToggleReducer$,
    addSelectionReducer$,
    removeSelectionReducer$,
    boldSelectReducer$
  );

  const state$ = xs.of(new State())
    .map(state => reducers$.fold((acc, reducer) => reducer(acc), state))
    .flatten();

  const blink$ = reducers$.map(__ => {
    const onAfterDelay$ = xs.of(true).compose(delay(constants.BLINK_DELAY));
    return xs.merge(xs.of(false), onAfterDelay$);
  })
  .flatten()
  .startWith(true);

  return {
    blink$,
    reducers$,
    state$
  };
}

export default model;
