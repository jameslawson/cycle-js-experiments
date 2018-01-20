import { Attrs, State } from '../../../../src/model/type/type';
import italicToggle from '../../../../src/model/reducer/italicToggleReducer';

describe('italic toggle reducer', () => {
  const italic = new Attrs({ italic: true });

  it('should toggle italic from off -> on', () => {
    expect(italicToggle()(new State())).to.equal(new State({ attrs: italic }));
  });

  it('should toggle italic from off -> on', () => {
    expect(italicToggle()(new State({ attrs: italic }))).to.equal(new State());
  });
});
