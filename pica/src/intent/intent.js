import xs from 'xstream';
import constants from '../model/type/constants';
import keys from '../model/type/keys';

function intent({ DOM, Letter$, Paste }) {
  // mouse
  const paste$     = DOM.select('document').events('paste');
  const mousedown$ = DOM.select(constants.EDITOR_CLASS).events('mousedown');
  const mouseup$   = DOM.select(constants.EDITOR_CLASS).events('mouseup');
  const mousemove$ = DOM.select(constants.EDITOR_CLASS).events('mousemove');
  const bold$   = DOM.select('.bold').events('click');
  const italic$ = DOM.select('.italics').events('click');
  const click$  = mousedown$.map(e => ({
    x: e.pageX - 10,
    y: e.pageY - 10 - constants.TOOLBAR_HEIGHT
  }));

  // keyboard
  const keydown$   = DOM.select(constants.ROOT_CLASS).events('keydown');
  const keypress$  = DOM.select(constants.ROOT_CLASS).events('keypress');
  const left$      = keydown$.filter(({ keyCode }) => keyCode === keys.LEFT_KEYCODE);
  const right$     = keydown$.filter(({ keyCode }) => keyCode === keys.RIGHT_KEYCODE);
  const up$        = keydown$.filter(({ keyCode }) => keyCode === keys.UP_KEYCODE);
  const down$      = keydown$.filter(({ keyCode }) => keyCode === keys.DOWN_KEYCODE);
  const backspace$ = keydown$.filter(({ keyCode }) => keyCode === keys.BACKSPACE_KEYCODE);
  const return$    = keydown$.filter(({ keyCode }) => keyCode === keys.RETURN_KEY);
  const space$     = keydown$.filter(({ keyCode }) => keyCode === keys.SPACE_KEYCODE);

  const delta      = (ob1$, ob2$) => xs.merge(ob1$.map(_ => -1), ob2$.map(_ => +1));
  const upDown$    = delta(up$, down$);
  const leftRight$ = delta(left$, right$);
  const letter$    = xs.merge(
    keypress$.map(({ keyCode }) => String.fromCharCode(keyCode)),
    space$.map(__ => ' ')
  );

  return {
    Letter$,
    Paste,
    backspace$,
    bold$,
    click$,
    down$,
    italic$,
    leftRight$,
    letter$,
    mousedown$,
    mousemove$,
    mouseup$,
    paste$,
    return$,
    space$,
    up$,
    upDown$
  };
}

export default intent;
