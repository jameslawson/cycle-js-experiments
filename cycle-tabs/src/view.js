import { h1, div, ul, li } from '@cycle/dom';

const _css = cssprops => ({ attributes: { style: cssprops.join(";") }});

const left = (displacement) => `left: ${displacement}px`;
const width = (trackSize) => `width: ${trackSize}px`;
const leftClass = (left) => `.left ${left ? '.disabled' : ''}`;
const rightClass = (right) => `.right ${right ? '.disabled' : ''}`;

function view({model, Size}) {

  const vtree$ = model.map(({displacement, leftDisabled, rightDisabled, trackWidth}) =>
    div('.container', [
      h1('Carousel Example'),
      div('.carousel-viewport', [
        div(leftClass(leftDisabled), ''),
        div(rightClass(rightDisabled), ''),
        ul('.carousel-track', _css([left(displacement), width(trackWidth)]), [
          li('.item', 'item1'),
          li('.item', 'item2'),
          li('.item', 'item3'),
          li('.item', 'item4'),
          li('.item', 'item5'),
          li('.item', 'item6')
        ])
      ])
    ])
  );

  return vtree$;

}

module.exports = view;
