import { List } from 'immutable';
import { Attrs, Block, Cursor, Line, State } from '../../src/model/type/type';
import fromDiagram from 'xstream/extra/fromDiagram';
import model from '../../src/model/model';

describe('[integration] - adding text', () => {
  it('should add "xyz" on a single line when "x", "y" and "z" are typed', (done) => {
    const Letter$ = fromDiagram('xyz|', {
      values: {
        x: { text: 'x', width: 5 },
        y: { text: 'y', width: 20 },
        z: { text: 'z', width: 50 }
      }
    });
    const intent = { Letter$ };
    const { state$ } = model({ intent });
    state$.last().addListener({
      next: (state) => {
        expect(state).to.equal(toState('xyz|', List.of(
          List.of(0, 5, 25, 75),
        )));
        done();
      },
      error: (e) => { throw e; },
      complete: () => {}
    });
  });

  it('should add "abc", "xyz" on two lines', (done) => {
    const Letter$ = fromDiagram('abc---xyz|', {
      values: {
        a: { text: 'a', width: 5 },
        b: { text: 'b', width: 20 },
        c: { text: 'c', width: 50 },
        x: { text: 'x', width: 5 },
        y: { text: 'y', width: 20 },
        z: { text: 'z', width: 50 }
      }
    });
    const return$ = fromDiagram('---r|');

    const intent = { Letter$, return$ };
    const { state$ } = model({ intent });
    state$.last().addListener({
      next: (state) => {
        expect(state).to.equal(toState('abc xyz|', List.of(
          List.of(0, 5, 25, 75),
          List.of(0, 5, 25, 75),
        )));
        done();
      },
      error: (e) => { throw e; },
      complete: () => {}
    });
  });

  it('should add normal "x" and bold "y"', (done) => {
    const Letter$ = fromDiagram('x----y|', {
      values: {
        x: { text: 'x', width: 5 },
        y: { text: 'y', width: 10 }
      }
    });
    const bold$ = fromDiagram('--b------b|');
    const intent = { Letter$, bold$ };
    const { state$ } = model({ intent });
    state$.last().addListener({
      next: (state) => {
        expect(state).to.equal(new State({
          cursor: new Cursor({ col: 2 }),
          lines: List.of(new Line({
            blocks: List.of(
              new Block({ text: 'x' }),
              new Block({ text: 'y', attrs: new Attrs({ bold: true }) })
            ),
            advancers: List.of(0, 5, 15)
          }))
        }));
        done();
      },
      error: (e) => { throw e; },
      complete: () => {}
    });
  });
});
