function makeFocusDriver() {
  function FocusDriver(elem$) {
    return elem$.map(elem => {
      elem.focus();
      return true;
    });
  }
  return FocusDriver;
}

export { makeFocusDriver };
