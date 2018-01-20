import { SelectionRect } from '../type/type';
import { merge, split } from '../util/block';

function emboldenSingleRow(curr) {
  const { fromRow, fromCol, toCol } = curr.get('selection').toJS();

  return curr
    .set('selection', new SelectionRect())
    .update('lines', (lines) => {
      return lines.update(fromRow, (line) => {
        return line
        .update('blocks', (blocks) => {
          const splitted = split(blocks);
          const before = splitted.slice(0, fromCol);
          const after = splitted.slice(toCol);
          // TODO: check if everthing in splitted.slice(fromCol, toCol)
          // have attrs of bold = true. If is is indeed the case,
          // update all these blocks to have bold = false
          const embolden = splitted.slice(fromCol, toCol).map(block => {
            return block.setIn(['attrs', 'bold'], true);
          });
          return merge(before.concat(embolden).concat(after));
        })
        .update('advancers', (advancers) => {
          // TODO: work out how to find the new advancers
          // this is non-trivial in the sense that it requires
          // a DOM side-effect to work out the width of the new bold text
          return advancers;
        });
      });
    });
}

function emboldenSelection(curr) {
  const { fromRow, toRow } = curr.get('selection').toJS();
  if (fromRow === toRow) { return emboldenSingleRow(curr); }
  return curr;
}

const boldSelectReducer = __ => curr => {
  const { fromRow, fromCol, toRow, toCol } = curr.get('selection').toJS();
  const hasSelection = (fromRow < toRow) || fromCol < toCol;
  if (hasSelection) {
    return emboldenSelection(curr);
  } else {
    return curr;
  }
};

export default boldSelectReducer;
