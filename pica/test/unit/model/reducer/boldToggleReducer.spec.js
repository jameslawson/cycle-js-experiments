import { Attrs, State } from '../../../../src/model/type/type';
import boldToggle from '../../../../src/model/reducer/boldToggleReducer';

describe('bold toggle reducer', () => {
  const bold = new Attrs({ bold: true });

  it('should toggle bold from off -> on', () => {
    expect(boldToggle()(new State())).to.equal(new State({ attrs: bold }));
  });

  it('should toggle bold from off -> on', () => {
    expect(boldToggle()(new State({ attrs: bold }))).to.equal(new State());
  });
});
