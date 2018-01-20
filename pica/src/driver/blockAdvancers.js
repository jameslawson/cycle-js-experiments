import { List } from 'immutable';

function blockAdvancers(blocks) {
  if (blocks.size === 0) { return List.of(0); }

  const elem = document.createElement('div');
  const textNode = document.createTextNode('');
  elem.appendChild(textNode);
  document.body.appendChild(elem);

  elem.style.position = 'absolute';
  elem.style.visibility = 'hidden';
  elem.style.height = 'auto';
  elem.style.width = 'auto';
  elem.style.whiteSpace = 'pre';
  elem.style.fontFamily = 'sans-serif';

  const advancers = [0];
  let total = 0;
  blocks.forEach((block) => {
    const text = block.get('text');
    const { bold, italic } = block.get('attrs').toJS();
    if (bold) { elem.style.fontWeight = 'bold'; }
    if (italic) { elem.style.fontStyle = 'italic'; }

    for (let i = 0; i < text.length; i++) {
      elem.innerHTML = text[i];
      const width = elem.getBoundingClientRect().width;
      total += width;
      advancers.push(total);
    }
  });

  elem.parentNode.removeChild(elem);
  return List.of(...advancers);
}

export default blockAdvancers;
