import { div, em, p, span, strong } from '@cycle/dom';
import constants from '../model/type/constants';
import { Line } from '../model/type/type';
import selectionRender from './selectionRender';

function toolbarView(state) {
  const { bold, italic } = state.get('attrs').toJS();
  return div(constants.TOOLBAR_CLASS, [
    div(`.toolbar-button.bold${bold ? '.active' : ''}`, 'B'),
    div(`.toolbar-button.italics${italic ? '.active' : ''}`, 'I')
  ]);
}

function cursorView(state, blink) {
  const { row, col } = state.get('cursor').toJS();
  const lines = state.get('lines');
  const line = lines.get(row, new Line());
  const advancers = line.get('advancers');

  const { fromRow, fromCol, toRow, toCol } = state.get('selection').toJS();
  const hasSelection = (fromRow < toRow) || fromCol < toCol;

  // const { b, i }    = state.get('attrs');
  // const widths      = state.get('widths');

  // const boldClass   = b ? '.bold' : '';
  // const italicClass = i ? '.italics' : '';
  // const cursorClasses = [
  //   `${constants.CURSOR_CLASS}`,
  //   `${blinkClass} ${boldClass} ${italicClass}`
  // ].join('');

  const blinkClass = blink ? '.blink-on' : '.blink-off';
  const cursorClasses = `${constants.CURSOR_CLASS} ${blinkClass}`;

  const display = hasSelection ? 'none' : 'inline';
  const left = advancers.get(col, 0);
  const top = row * constants.LINE_HEIGHT;
  const cursorStyle = `left: ${left}px; top: ${top}px; display: ${display};`;
  return div(cursorClasses, { attrs: { style: cursorStyle } }, '');
}

function lineblock(block) {
  const attrs = block.attrs;
  const { bold, italic } = attrs;
  if (bold && italic) { return strong([em(block.text)]); }
  else if (bold)      { return strong(block.text); }
  else if (italic)    { return em(block.text); }
  else                { return span(block.text); }
}

function linesView(lines) {
  return div('.lines', lines.toJS().map(line => {
    return p('.line', line.blocks.map(block => lineblock(block)));
  }));
}

function editor(state, blink) {
  return div(constants.EDITOR_CLASS, [
    selectionRender(state),
    linesView(state.get('lines')),
    cursorView(state, blink),
    p('.foo', JSON.stringify(state.get('selection').toJS())),
    p('.foo', JSON.stringify(state.get('cursor').toJS()))
  ]);
}

function view([state, blink]) {
  return (div(constants.ROOT_CLASS, { attrs: { tabindex: '1' } }, [
    toolbarView(state),
    editor(state, blink)
  ]));
}

export {
  cursorView,
  linesView,
  selectionRender,
  toolbarView,
  view
};
