import { List } from 'immutable';
import blockAdvancers from './blockAdvancers';

function sizeFromDOM(block) {
  return {
    text: block.get('text'),
    width: blockAdvancers(List.of(block)).last()
  };
}

function makeLetterDriver() {
  function LetterDriver(letter$) {
    return letter$.map(t => sizeFromDOM(t));
  }
  return LetterDriver;
}

export { makeLetterDriver };
