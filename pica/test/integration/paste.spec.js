import { List } from 'immutable';
import { Block } from '../../src/model/type/type';
import fromDiagram from 'xstream/extra/fromDiagram';
import model from '../../src/model/model';

describe('[integration] - pasting', () => {
  it('should paste "hello" on a single line', (done) => {
    const Paste = fromDiagram('---P|', {
      values: {
        P: {
          blocks: List.of(new Block({ text: 'hello' })),
          advancers: List.of(0, 5, 10, 12, 14, 20)
        }
      }
    });
    const intent = { Paste };
    const { state$ } = model({ intent });
    state$.last().addListener({
      next: (state) => {
        expect(state).to.equal(toState('hello|', List.of(
          List.of(0, 5, 10, 12, 14, 20),
        )));
        done();
      },
      error: (e) => { throw e; },
      complete: () => {}
    });
  });
});
