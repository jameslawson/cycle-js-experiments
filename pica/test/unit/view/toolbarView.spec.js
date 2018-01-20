import { toolbarView } from '../../../src/view/view';
import { Attrs, State } from '../../../src/model/type/type';

describe('toolbar view', () => {
  it('should have a bold button', () => {
    const view = toolbarView(toState(''));
    expect(view).to.have.a.subtree.with.class('bold').inside;
  });

  it('should have a italic button', () => {
    const view = toolbarView(toState(''));
    expect(view).to.have.a.subtree.with.tag('div').with.class('italics').inside;
  });
});

describe('toolbar view - bold button', () => {
  it('should have class "active" when current state is bold', () => {
    const view = toolbarView(new State({ attrs: new Attrs({ bold: true }) }));
    expect(view).to.have.a.subtree.with.classes(['bold', 'active']).inside;
  });
});

describe('toolbar view - italic button', () => {
  it('should have class "active" when current state is italic', () => {
    const view = toolbarView(new State({ attrs: new Attrs({ italic: true }) }));
    expect(view).to.have.a.subtree.with.classes(['italics', 'active']).inside;
  });
});
