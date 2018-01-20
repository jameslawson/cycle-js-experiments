import xs from 'xstream';
import { makePreventDefaultDriver } from '../../src/driver/preventdefault';

describe('prevent default driver', () => {
  it('should call preventDefault() on the event', (done) => {
    const fakeEvent = { preventDefault: () => {} };
    const spy = sinon.spy(fakeEvent, 'preventDefault');

    const event$ = xs.of(fakeEvent);
    const driver = makePreventDefaultDriver();
    const preventDefault$ = driver(event$);
    preventDefault$.addListener({
      next: () => {},
      error: done,
      complete: () => {
        expect(spy).to.have.been.called;
        done();
      }
    });
  });
});
