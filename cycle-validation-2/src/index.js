import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import { run } from '@cycle/run';
import { makeDOMDriver, h1, div, input, p, ul, li } from '@cycle/dom';
import flatten from 'lodash.flatten';
import union from 'lodash.union';
import without from 'lodash.without';
import first from 'lodash.first';
import zip from 'lodash.zip';
import './index.scss';

function blurValidate(elem, rules) {
  const focus$ = elem.events('focus');
  const blur$ = elem.events('blur');
  const allInput$ = elem.events('input').map(e => e.target.value);

  const inputAfterBlur$ = allInput$.compose(onlyAfter(blur$));
  const firstBlursInput$ = xs.combine(blur$, allInput$).map(([_, i]) => i).take(1);
  const input$ = xs.merge(inputAfterBlur$, firstBlursInput$);

  const activated$ = input$.fold((acc, x) => {
    const ruleNames = Object.keys(rules);
    const ruleValues = ruleNames.map(name => rules[name](x));
    const rulePairs = zip(ruleNames, ruleValues);
    const active = rulePairs.filter(([__, val]) => val === true).map(first);
    const inactive = rulePairs.filter(([__, val]) => val === false).map(first);
    const withActiveWithoutInactive = union(without(acc, ...inactive), active);
    return withActiveWithoutInactive;
  }, []);

  const allInactiveForLastBlur$ = blur$
    .compose(sampleCombine(activated$))
    .map(([__, activated]) => activated.length === 0);

  const validationState$ = xs.combine(activated$, allInactiveForLastBlur$)
    .map(([activated, allInactiveForLastBlur, value]) => ({ activated, allInactiveForLastBlur }))
    .startWith({ activated: [], allInactiveForLastBlur: null });

  const state$ = xs.combine(allInput$, validationState$)
    .map(([input, validationState]) => Object.assign({}, { value: input }, validationState))
    .startWith({ value: '', activated: [], allInactiveForLastBlur: null });

  return state$;
}

function onlyAfter(x) {
  return source => x.mapTo(source).flatten();
}

function main({ DOM }) {
  const elem = DOM.select(`#foo`);
  const input$ = elem.events('input');
  const error$ = blurValidate(elem, {
    required: x => x.length === 0,
    short:    x => x.length <= 3,
    waylong:  x => x.length > 10,
    long:     x => x.length > 7,
    no_s:     x => /s/.test(x),
  });

  error$.addListener({
    next: arr => console.log('state = ', arr),
    error: err => console.error(err)
  });


  const vtree$ = error$.map(({ allInactiveForLastBlur, activated, value }) => {
    const noneActivated = activated.length === 0;
    const someActivated = activated.length > 0;
    const VALID_CLASS = (allInactiveForLastBlur && noneActivated) ? '.foo--valid' : '';
    const INVALID_CLASS = (someActivated) ? '.foo--invalid' : '';
    return div([
      h1('Testing'),
      p(JSON.stringify({ allInactiveForLastBlur, activated, value })),
      input(`#foo${VALID_CLASS}${INVALID_CLASS}`, { attrs: { type: 'text' }, props: { value }})
    ]);
  });


  return { DOM: vtree$ };
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
