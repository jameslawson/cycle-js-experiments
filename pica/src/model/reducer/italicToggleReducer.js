// -- | italicToggleReducer(e: Event) => (curr: State => State)
// -- | The reducer responsible for toggling italic on/off
const italicToggleReducer = (_ => curr => {
  return curr.update('attrs', (attrs) => {
    return attrs.update('italic', (italic) => {
      return !italic;
    });
  });
});

export default italicToggleReducer;
