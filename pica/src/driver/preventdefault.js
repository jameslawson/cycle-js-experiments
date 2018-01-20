function makePreventDefaultDriver() {
  function preventDefaultDriver(event$) {
    return event$.map(event => {
      event.preventDefault();
      return true;
    });
  }
  return preventDefaultDriver;
}

export { makePreventDefaultDriver };
