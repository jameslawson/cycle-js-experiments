import _ from 'lodash';
import { List } from 'immutable';
import isNumber from 'lodash.isnumber';

const CONTROL_CHARS = List.of(..._.range(0, 32))
  .merge(List.of(127));

function normalize(e) {
  const which = e.which;
  const keycode = e.keyCode;
  const charcode = e.charCode;
  if (!isNumber(which)) { return keycode; }
  else if (isNumber(which) && which !== 0 && charcode !== 0) { return e.which; }
  else { return 0; }
}

function keycodeNormal(e) {
  const keycode = normalize(e);
  if (_.includes(CONTROL_CHARS.toJS(), keycode)) { return 0; }
  else { return keycode; }
}

export { keycodeNormal };
