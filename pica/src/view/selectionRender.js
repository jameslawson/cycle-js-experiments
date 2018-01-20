import { div, span } from '@cycle/dom';
import constants from '../model/type/constants';
import { List } from 'immutable';
import range from 'lodash.range';

function renderRow({ left, right, row }) {
  const top = row * constants.LINE_HEIGHT;
  const style = `left: ${left}px; top: ${top}px; width: ${right - left}px`;
  return span('.selection', { attrs: { style } });
}

function singleLineRender(state) {
  const lines = state.get('lines');
  const { fromRow, fromCol, toCol } = state.get('selection').toJS();
  const advancers = lines.get(fromRow).get('advancers');
  return List.of(renderRow({
    left: advancers.get(fromCol),
    right: advancers.get(toCol),
    row: fromRow
  }));
}

function multiLineRender(state) {
  const lines = state.get('lines');
  const { fromRow, fromCol, toRow, toCol } = state.get('selection').toJS();
  const fromAdvancers = lines.get(fromRow).get('advancers');
  const toAdvancers   = lines.get(toRow).get('advancers');

  return List.of(
    renderRow({
      left: fromAdvancers.get(fromCol),
      right: fromAdvancers.last(),
      row: fromRow
    }),
    ...range(fromRow + 1, toRow, 1).map(i => {
      const width = lines.get(i).get('advancers').last();
      return renderRow({
        left: 0,
        right: width,
        row: i
      });
    }),
    renderRow({
      left: 0,
      right: toAdvancers.get(toCol),
      row: toRow
    })
  );
}

function selectionRender(state) {
  const { fromRow, toRow } = state.get('selection').toJS();
  const isMultiline = (fromRow < toRow);

  const selections = (isMultiline)
    ? multiLineRender(state)
    : singleLineRender(state);
  return div('.selections', selections.toJS());
}

export default selectionRender;
