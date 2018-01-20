import { Block } from '../../src/model/type/type';
import { List } from 'immutable';
import htmlParse from '../../src/driver/htmlParse';

describe('html parser', () => {
  it('should parse a paragraph', () => {
    const html = '<p>foo</p>';
    const blocks = List.of(new Block({ text: 'foo' }));
    expect(htmlParse(html)).to.equal(blocks);
  });

  it('should parse many paragraphs', () => {
    const html = '<p>foo1</p><p>foo2</p><p>foo3</p>';
    const blocks = List.of(new Block({ text: 'foo1foo2foo3' }));
    expect(htmlParse(html)).to.equal(blocks);
  });
});
