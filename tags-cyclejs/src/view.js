import { div, label, hr, input, p, ul, li } from '@cycle/dom';

function view(model)
{
  const textboxWidth = (query) => query.length * 8 + 10;
  const resultsHiddenStyle = (results) => `display: ${(results.length == 0) ? 'none' : 'block'};`;
  const resultsItemClass = ((index, highlightPos) => `.results__item ${(index == highlightPos) ? ' .results__item--highlighted' : ''}`);
  const vtree$ = model.state$.map(({ reduction, status, textboxValue }) =>
    div([
      label({ className: 'label' }, 'Tags:'),
      p('status:' + status),
      p('highlight:' + reduction.get('highlight')),
      div('.container', [
        ul('.tags', [
          li('.tags__item', 'Tags:'),
          reduction.get('tags').map((tag) => li('.tags__item .tag', tag.name)),
          li('.tags__item', input({ className: 'field', attributes: {
            style: 'width:' + textboxWidth(textboxValue) + 'px',
            type: 'text',
            value: textboxValue
          }}))
        ])
      ]),
      ul({ className: 'results', attributes: {
          style: resultsHiddenStyle(reduction.get('results'))
        }},
        reduction.get('results').map((result, index) =>
        li(resultsItemClass(index, reduction.get('highlight')), { attributes: { 'data-index': index } }, result.name)))
    ]));
  return vtree$;
}

export default view;
