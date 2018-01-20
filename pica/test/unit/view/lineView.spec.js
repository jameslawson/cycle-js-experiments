import { linesView } from '../../../src/view/view';
import { Attrs, Block, Line } from '../../../src/model/type/type';
import { List } from 'immutable';

describe('lines view', () => {
  const bold = new Attrs({ bold: true });
  const italic = new Attrs({ italic: true });
  const boldItalic = new Attrs({ bold: true, italic: true });

  it('should show a regular block', () => {
    const lines = toState('Foo').get('lines');
    const view = linesView(lines);
    expect(view).to.have.a.subtree.with.tag('span').with.text('Foo').inside;
  });

  it('should show a bold block', () => {
    const lines = List.of(new Line({
      advancers: List.of(0, 20),
      blocks: List.of(new Block({ text: 'Foo', attrs: bold }))
    }));
    const view = linesView(lines);
    expect(view).to.have.a.subtree.with.tag('strong').with.text('Foo').inside;
  });

  it('should show a italics block', () => {
    const lines = List.of(new Line({
      advancers: List.of(0, 20),
      blocks: List.of(new Block({ text: 'Foo', attrs: italic }))
    }));

    const view = linesView(lines);
    expect(view).to.have.a.subtree.with.tag('em').with.text('Foo').inside;
  });

  it('should show a bold italics block', () => {
    const lines = List.of(new Line({
      advancers: List.of(0, 20),
      blocks: List.of(new Block({ text: 'Foo', attrs: boldItalic }))
    }));

    const view = linesView(lines);
    expect(view).to.have.a.subtree.with.tag('strong').inside;
    expect(view).to.have.a.subtree.with.tag('em').with.text('Foo').inside;
  });

  it('should show a regular block followed by a bold block', () => {
    const lines = List.of(new Line({
      advancers: List.of(0, 20),
      blocks: List.of(
        new Block({ text: 'abc' }),
        new Block({ text: 'xyz', attrs: bold })
      )
    }));
    const view = linesView(lines);
    expect(view).to.have.a.subtree.with.tag('p').with.children(2).inside;
    expect(view).to.have.a.subtree.with.tag('span').with.text('abc').inside;
    expect(view).to.have.a.subtree.with.tag('strong').with.text('xyz').inside;
  });
});
