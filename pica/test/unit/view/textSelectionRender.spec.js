import { List } from 'immutable';
import selectionRender from '../../../src/view/selectionRender';

describe('text selection render', () => {
  it('should draw a single line selection', () => {
    const state = toState('h!ell!o', List.of(List.of(0, 10, 20, 30, 40, 50)));
    const view = selectionRender(state);
    expect(view).to.have.children(1);
    expect(view).to.have.a.subtree.with.tag('span')
      .and.style({ left: '10px', top: '0px' }).inside;
  });

  it('should draw a multiline selection', () => {
    const line = List.of(0, 10, 20, 30, 40, 50);
    const advancers = List.of(line, line, line);
    const state = toState('he!llo world foo!', advancers);
    const view = selectionRender(state);
    expect(view).to.have.children(3);
    expect(view).to.have.a.subtree.with.tag('span')
      .and.style({ left: '20px', top: '0px', width: '30px' }).inside;
    expect(view).to.have.a.subtree.with.tag('span')
      .and.style({ left: '0px', top: '16px', width: '50px' }).inside;
    expect(view).to.have.a.subtree.with.tag('span')
      .and.style({ left: '0px', top: '32px', width: '30px' }).inside;
  });
});
