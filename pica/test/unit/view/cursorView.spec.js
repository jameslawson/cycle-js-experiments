import { List } from 'immutable';
import { cursorView } from '../../../src/view/view';

describe('cursor view', () => {
  it('should position the cursor for initial state', () => {
    expect(cursorView(toState(''))).to.have.style({ top: '0px', left: '0px' });
  });

  it('should position the cursor horizontally', () => {
    const state = toState('Fo|o', List.of(List.of(0, 5, 15, 35)));
    expect(cursorView(state)).to.have.style({ top: '0px', left: '15px' });
  });

  it('should position the cursor vertically', () => {
    const advancers = List.of(
      List.of(0, 5, 15, 35),
      List.of(0, 7, 10, 15)
    );
    const state = toState('Foo |Bar', advancers);
    expect(cursorView(state)).to.have.style({ top: '16px', left: '0px' });
  });

  it('should show the cursor when there isn\'t a selection', () => {
    const state = toState('helloworld');
    expect(cursorView(state)).to.have.style({ display: 'inline' });
  });

  it('should hide the cursor when there is a selection', () => {
    const state = toState('hello!world!');
    expect(cursorView(state)).to.have.style({ display: 'none' });
  });
});
