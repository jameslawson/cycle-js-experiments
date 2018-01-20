import _ from 'lodash';
import $ from 'jquery';
import { Observable } from 'rx';
import Cycle from '@cycle/core';
import { makeDOMDriver, h1, div, input, p, ul, li } from '@cycle/dom';
import combineLatestObj from 'rx-combine-latest-obj';

const CLASS_NAME = 'textbox';

function makeValidatorFor(input$) {
    return function({test, id}) {
        const test$ = input$.map(test).distinctUntilChanged();
        const valid$ = test$.filter(x => x === true);
        const invalid$ = test$.filter(x => x === false);
        const change$ = Observable.merge(valid$, invalid$).skip(1);
        const madeValid$ = change$.filter(x => x === true);
        const madeInvalid$ = change$.filter(x => x === false);
        const addReducer$ = madeValid$
            .map(x => id)
            .map(x => errors => _.union(errors, [x]));
        const removeReducer$ = madeInvalid$
            .map(x => id)
            .map(x => errors => _.without(errors, x));
        const reducers$ = Observable.merge(addReducer$, removeReducer$);
        return reducers$;
    }
}

function validationError$(...errors) {
  /// reduction
  const initialState = [];
  const reducers$ = Observable.merge(...errors);
  const reduction$ = reducers$.startWith(initialState)
    .scan((state, reducer) => reducer(state)).skip(1).startWith([]);
  reduction$.subscribe(function(x) { console.log(x); });
  return reduction$;
}

const messages = {
  'short': {
    shortMessage: 'This is too short',
    longMessage: 'Foo names have 4-6 characters'
  },
  'long': {
    shortMessage: 'This is too long',
    longMessage: 'Foo names have 4-6 characters'
  },
  'waylong': {
    shortMessage: 'This is way too long',
    longMessage: 'Foo names have 4-6 characters'
  },
  'regex': {
    shortMessage: 'This has a special character',
    longMessage: 'Foo names cannot have the letter s'
  }
};

function errorMessage(errors) {
  if (errors.length === 0) return;
  else return div('.error', [
      p('.error__heading', messages[_.last(errors)].shortMessage),
      p('.error__description', messages[_.last(errors)].longMessage)
  ]);
}

function main({DOM}) {

    const input$ = DOM.select(`.${CLASS_NAME}`)
        .events('input')
        .map(ev => ev.target.value)
        .startWith('');

    const makeValidator = makeValidatorFor(input$);
    const tooShort$ = makeValidator({ test: x => x.length <= 3, id: 'short' });
    const tooLong$ = makeValidator({ test: x => x.length > 7, id: 'long' });
    const wayTooLong$ = makeValidator({ test: x => x.length > 10, id: 'waylong' });
    const regex$ = makeValidator({ test: x => /s/.test(x), id: 'regex' });
    const errors$ = validationError$(tooShort$, tooLong$, wayTooLong$, regex$);

    const state$ = combineLatestObj({input$, errors$});
    const vtree$ = state$.map(({val, errors}) => {
        return div([
            h1('Testing'),
            div(errorMessage(errors)),
            input({ className: CLASS_NAME, attributes: { type: 'text' }})
        ]);
    });
    return { DOM: vtree$ };
}

$(document).ready(function() {
    Cycle.run(main, { DOM: makeDOMDriver('#app') });
});
