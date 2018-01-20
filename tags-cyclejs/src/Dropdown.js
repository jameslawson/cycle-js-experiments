import { Observable } from 'rx';
import { div, span, input, p } from '@cycle/dom';

function Dropdown({DOM, props$})
{
  const initialValue$ = props$.map(props => props.initial).first();
  const vtree$ = initialValue$
    .map(value => div('.dropdown', [ p('hello'), p(value) ]));

  return {
    DOM: vtree$,
  };
}

export default Dropdown;
