import { Observable } from 'rx';

function notBetween(first, second) {
  return source => Observable.merge(
    source.takeUntil(first),
    first.flatMapLatest(() => source.skipUntil(second))
  );
}

function intent(DOM) {
  // handle main interactions
  const textboxInput$ = DOM.select('.field').events('input');

  // handle keyboard
  const BACKSPACE_KEYCODE = 8;
  const UP_KEYCODE = 38;
  const DOWN_KEYCODE = 40;
  const ENTER_KEYCODE = 13;
  const keyup$ = DOM.select('.field').events('keydown');
  const keydown$ = DOM.select('.field').events('keydown');
  const backspacePressed$ = keyup$.filter(({keyCode}) => keyCode == BACKSPACE_KEYCODE);
  const enterPressed$ = keyup$.filter(({keyCode}) => keyCode == ENTER_KEYCODE);
  const upPressed$ = keyup$.filter(({keyCode}) => keyCode == UP_KEYCODE);
  const downPressed$ = keyup$.filter(({keyCode}) => keyCode == DOWN_KEYCODE);
  const upOrDownPressed$ = Observable.merge(upPressed$, downPressed$);

  // handle highlight
  const upDownDelta$ = keydown$.map(({keyCode}) => {
    if (keyCode === UP_KEYCODE) return -1;
    if (keyCode === DOWN_KEYCODE) return +1;
    return 0;
  }).filter(delta => delta !== 0)

  // handle focus
  const containerClick$ = DOM.select('.container').events('click');

  // handle blurs
  const inputBlur$ = DOM.select('.field').events('blur');

  const resultHover$ = DOM.select('.results__item').events('mouseenter');
  const resultMouseDown$ = DOM.select('.results__item').events('mousedown');
  const resultMouseUp$ = DOM.select('.results__item').events('mouseup');
  const clickResult$ = DOM.select('.results__item').events('click');
  const resultClick$ = resultMouseDown$.flatMapLatest(down =>
      up.filter(down => down.target === up.target));

  const inputBlurToElsewhere$ = inputBlur$.let(notBetween(resultMouseDown$, resultMouseUp$))
                                          .let(notBetween(keydown$, keyup$));

  return {
    backspacePressed$,
    clickResult$,
    containerClick$,
    enterPressed$,
    inputBlurToElsewhere$,
    resultHover$,
    textboxInput$,
    upDownDelta$,
    upOrDownPressed$
  };
}

export default intent;
