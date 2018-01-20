import _ from 'lodash';
import combineLatestObj from 'rx-combine-latest-obj';
import { Observable } from 'rx';

// constrain the track so that it is in the viewport
// let: T = width of track
//      V = width of viewport
//      x = displacement of track
// assume: T > V
// then:
//            -T+V <= x <= 0
// is the constraint that guarantees track is in viewport


function model({intent, Size}) {

  const left$ = intent.left$;
  const right$ = intent.right$;
  const bs$ = Size.boundaries$;
  const T$ = Size.track$;


  const V$ = Size.viewport$;
  const max$ = Observable.combineLatest(T$, V$, (T, V) => -T+V);

  const leftReducer$ = left$.withLatestFrom(bs$, (left, bs) => x => {
    const nextleft = _.chain(bs)
      .reject(b => b <= x) // ignore boundaries to the right
      .min().value();      // pick the boundary closest to the left of x
    const nextx = (nextleft == undefined) ? x : nextleft; // [3]
    return nextx;
  });

  const rightReducer$ = right$.withLatestFrom(bs$, max$, (right, bs, max) => x => {
    const nextright = _.chain(_.union(bs, [max]))
      .reject(b => b >= x)    // ignore boundaries to the left
      .reject(b => b < max)   // ignore boundaries that would move carousel too far
      .max().value();         // pick the boundary closest to the right of x
    const nextx = (nextright == undefined) ? x : nextright;
    return nextx;
  });

  const reducers$ = Observable.merge(leftReducer$, rightReducer$);
  const initialState = 0;
  const displacement$ = Observable.just(initialState)
    .merge(reducers$)
    .scan((state, reducer) => reducer(state))
    .startWith(0);

  // [1]: not important what these values, just need
  //      to give _some_ initial value so a cycle is formed
  const leftDisabled$ = displacement$.map(x => x >= 0)
    .startWith(true); // [1]
  const rightDisabled$ = displacement$.combineLatest(max$, (x, max) => x <= max)
    .startWith(true); // [1]


  const trackWidth$ = T$.startWith(0);
  const state$ = combineLatestObj({
    displacement$,
    leftDisabled$,
    rightDisabled$,
    trackWidth$
  });

  return state$;

}

module.exports = model;
