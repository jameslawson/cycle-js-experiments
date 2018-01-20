import xs from 'xstream';
import { run } from '@cycle/xstream-run';

import constants from './model/type/constants';
import { Block } from './model/type/type';
import intent    from './intent/intent';
import model     from './model/model';
import { view }  from './view/view';

import { makeDOMDriver }            from '@cycle/dom';
import { makeLetterDriver }         from './driver/textwidth';
import { makeFocusDriver }          from './driver/focus';
import { makePreventDefaultDriver } from './driver/preventdefault';
import { makePasteDriver }          from './driver/paste';

function main({ DOM, Letter$, Paste }) {
  // intent, model, view
  const intention = intent({ DOM, Letter$, Paste });
  const { blink$, state$ } = model({ intent: intention });
  const vtree$ = xs.combine(state$, blink$).map(view);

  // prepare export
  const editor$ = DOM.select(constants.EDITOR_CLASS).elements().map(([x]) => x);
  const letter$ = state$.map(state => intention.letter$.map(ch => {
    return new Block({ attrs: state.get('attrs'), text: ch });
  })).flatten();
  const toolbar$ = xs.merge(intention.bold$, intention.italic$);

  // export
  return {
    DOM: vtree$,
    Focus: xs.combine(editor$, toolbar$).map(([editor]) => editor),
    Letter$: letter$,
    Paste: intention.paste$,
    PreventDefault: xs.merge(
      intention.backspace$,
      intention.space$,
      intention.up$,
      intention.down$
    )
  };
}

const elem = document.createElement('div');
elem.className = 'pastecapture';
elem.setAttribute('contenteditable', 'true');
document.body.appendChild(elem);

document.addEventListener('DOMContentLoaded', () => {
  run(main, {
    DOM: makeDOMDriver('#app'),
    Letter$: makeLetterDriver(),
    PreventDefault: makePreventDefaultDriver(),
    Focus: makeFocusDriver(),
    Paste: makePasteDriver('.pastecapture')
  });
});
