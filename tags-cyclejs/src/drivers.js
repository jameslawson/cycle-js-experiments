import $ from 'jquery';

function makePreventDefaultDriver() {
  return ev$ => {
    ev$.subscribe(ev => {
      ev.preventDefault();
    });
  };
}

function makeSetFocusDriver() {
  return elem$ => {
    elem$.subscribe(elem => {
      elem.focus();
    });
  }
}

function makeCursorToEndOnFocusDriver() {
  return elem$ => {
    elem$.subscribe(elem => {
      elem.selectionStart = elem.selectionEnd = elem.value.length;
    });
  }
}


export { makePreventDefaultDriver,
         makeCursorToEndOnFocusDriver,
         makeSetFocusDriver };
