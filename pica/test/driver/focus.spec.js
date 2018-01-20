import xs from 'xstream';
import { makeFocusDriver } from '../../src/driver/focus';

describe('focus driver', () => {
  it('should call focus() on the element', (done) => {
    const fakeElement = { focus: () => {} };
    const spy = sinon.spy(fakeElement, 'focus');

    const elem$ = xs.of(fakeElement);
    const driver = makeFocusDriver();
    const focus$ = driver(elem$);
    focus$.addListener({
      next: () => {},
      error: (e) => { throw e; },
      complete: () => {
        expect(spy).to.have.been.called;
        done();
      }
    });
  });
});
