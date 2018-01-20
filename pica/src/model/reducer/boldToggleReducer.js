// -- | boldToggleReducer(e: Event) => (curr: State => State)
// -- | The reducer responsible for toggling bold on/off
const boldToggleReducer = (_ => curr => {
  return curr.update('attrs', (attrs) => {
    return attrs.update('bold', (bold) => {
      return !bold;
    });
  });
});

export default boldToggleReducer;
