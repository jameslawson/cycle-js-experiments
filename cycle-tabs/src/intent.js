function intent({DOM}) {
  const left$ = DOM.select('.left').events('click');
  const right$ = DOM.select('.right').events('click');
  return { left$, right$ };
}

module.exports = intent;
