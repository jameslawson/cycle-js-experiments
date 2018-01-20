import _ from 'lodash';
import { mod } from './Math';

import { Observable } from 'rx';
import Immutable from 'immutable';
import combineLatestObj from 'rx-combine-latest-obj';

const BASE_URL = 'https://api.github.com/search/repositories?q=';
const MAX_RESULTS_ITEMS = 10;
const MIN_QUERY_LENGTH = 3;


function model(intent, DOM, HTTP)
{
  // reading text from the textbox and making http request
  // getting the results back from http
  const textboxValue$ = intent.textboxInput$.map(ev => ev.target.value).startWith('');
  const request$ = textboxValue$
    .filter(query => query.length >= MIN_QUERY_LENGTH)
    .map(query => BASE_URL + encodeURI(query));
  const results$ = HTTP
    .flatMap(x => x)
    .map(res => _.take(res.body.items, MAX_RESULTS_ITEMS))
    .share()
    .startWith([]);

  // showing/hiding results
  // hiding the dropdown when user doesn't want to see resuls
  // loading status text
  const belowMinimumRequest$ = textboxValue$.filter(query => query.length < MIN_QUERY_LENGTH);
  const dropdownHidden$ = Observable.merge(
    Observable.merge(intent.inputBlurToElsewhere$, belowMinimumRequest$).map(() => true),
    request$.map(() => false)
  );

  const latestResults$ = dropdownHidden$.flatMapLatest(hide => {
    if (hide)  return Observable.just([]);
    if (!hide) return results$;
  });

  const status$ = dropdownHidden$.flatMapLatest(hide => {
    if (hide)  return Observable.just('loaded');
    if (!hide) return Observable.just('loading');
  }).merge(results$.map(() => 'loaded'));

  const populateResultsReducer$ = latestResults$.map(results => state => {
     return state.set('results', results)
                 .set('highlight', 0);
  });

  // adding of tags
  const clickResultIndex$ = intent.clickResult$.map(ev => parseInt(ev.target.dataset.index));
  const clickResultReducer$ = clickResultIndex$.map(index => state => {
     const results = state.get('results');
     const tags = state.get('tags');
     return state.set('tags', tags.concat(results[index]));
  });


  const _resultHoverByIndex$ = intent.resultHover$.map(ev => parseInt(ev.target.dataset.index));
  const hoverResultReducer$ = _resultHoverByIndex$.map(index => state => {
    const highlight = state.get('highlight');
    return state.set('highlight', index);
  });

  const highlightReducer$ = intent.upDownDelta$.map(delta => state => {
    const highlight = state.get('highlight');
    const results = state.get('results');

    const nextHighlight = mod(highlight+delta, results.length);
    return state.set('highlight', nextHighlight);
  });

  const pressEnterReducer$ = intent.enterPressed$.map(() => state => {
     const results = state.get('results');
     const highlight = state.get('highlight');
     const tags = state.get('tags');

     const nextTags = _.concat(tags, results[highlight]);
     const nextResults = _.filter(results, (val, index) => index != highlight);
     return state.set('tags', nextTags);
  });

  // deleting of tags
  const textboxIsEmpty$ = intent.textboxInput$.map(ev => ev.target.value.length == 0)
  const backspaceWhenTextboxIsEmpty$ = intent.backspacePressed$.pausable(textboxIsEmpty$);
  const deleteTagReducer$ = backspaceWhenTextboxIsEmpty$.map(() => state => {
     const tags = state.get('tags');
     return state.set('tags', _.dropRight(tags));
  });

  // maintaining a redux state
  const reducers$ = Observable.merge(
      populateResultsReducer$, // must be first in the merge
      clickResultReducer$,
      deleteTagReducer$,
      hoverResultReducer$,
      highlightReducer$,
      pressEnterReducer$
  );
  const reduction$ = Observable.just(Immutable.Map({
    results: [],
    tags: [],
    highlight: 0
  })).merge(reducers$)
     .scan((state, reducer) => reducer(state))
     .shareReplay(1);

  // export state
  const state$ = combineLatestObj({
    dropdownHidden$,
    reduction$,
    status$,
    textboxValue$
  });


  return { state$, request$ };
}

export default model;
