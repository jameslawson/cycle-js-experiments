import { merge, split } from './block';
import _ from 'lodash';
import { Block, Line, State } from '../type/type';
import { List, Record } from 'immutable';

// -- | Parse: Record
// -- | a record that represents the intermediate state
// -- | when parsing a toState string
const Parse = Record({ state: new State(), row: 0, col: 0 });

function setCursor(parse) {
  const row = parse.get('row');
  const col = parse.get('col');
  return parse
    .update('state', (state) => {
      return state.update('cursor', (cursor) => cursor.set('row', row).set('col', col));
    });
}

function setSelection(parse) {
  const row = parse.get('row');
  const col = parse.get('col');
  return parse
    .update('state', (state) => {
      return state.update('selection', (selection) => {
        const { fromRow, fromCol, toRow, toCol } = selection.toJS();
        const hasNoSelection = (fromRow === toRow) && fromCol === toCol;
        if (hasNoSelection) {
          return selection.set('fromRow', row).set('fromCol', col);
        } else {
          return selection.set('toRow', row).set('toCol', col);
        }
      });
    });
}

function appendChar(parse, ch, userAdvancers) {
  const row = parse.get('row');
  const col = parse.get('col');
  return parse
    .update('state', (state) => {
      return state.update('lines', (lines) => {
        return lines.update(row, (line) => {
          return line
          .update('blocks', (blocks) => {
            return merge(split(blocks).insert(col, new Block({ text: ch })));
          })
          .update('advancers', (advancers) => {
            const left = advancers.slice(0, col + 1);
            const advancer = userAdvancers.getIn([row, col + 1], left.last() + 1);
            return left.push(advancer);
          });
        });
      });
    })
  .update('col', (col) => col + 1);
}

function newLine(parse) {
  const row = parse.get('row');
  return parse
    .update('state', (state) => {
      return state.update('lines', (lines) => lines.insert(row + 1, new Line()));
    })
  .update('row', (row) => row + 1)
    .set('col', 0);
}

// -- | toState(str: string, advancers?: List(List(number))) => State
// -- | de-serializes the representation of the state.
// -- | parses a string an produces the equivalent state
// -- | as a record. record contains all the rich structure
function toState(str, advancers = List.of()) {
  const reducer = (curr, ch) => {
    if (ch === '|')      { return setCursor(curr); }
    else if (ch === ' ') { return newLine(curr); }
    else if (ch === '!') { return setSelection(curr); }
    else                 { return appendChar(curr, ch, advancers); }
  };
  const parse = _.reduce(str, reducer, new Parse());
  return parse.get('state');
}

export default toState;
