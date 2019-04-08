import { List } from 'immutable';
import fromDiagram from 'xstream/extra/fromDiagram';

describe('BlurValidator', () => {

  const expectDiagram = makeExpectDigram(makeValidator, { i, b, e, v })

  it('should show error when typing invalid input and blurring', () => {
    expectDiagram([
      '----i---------|',
      '----------b---|',
      '              ',
      '----------e---|'
    ]);
  });

  it('should show error when typing valid, blurring, focusing, then typing invalid', () => {
    expectDiagram([
      '----v--------i---|',
      '------b----------|',
      '----------f------|',
      '                 ',
      '-------------e---|'
    ]);
  });

  it('should NOT show an error initially even though the input is invalid', () => {
    expectDiagram([
      '----v--------i---|',
      '------b----------|',
      '----------f------|',
      '                 ',
      '-------------e---|'
    ]);
  });

  it('should, when multiple errors are applicable, only show the error for the rule that was broken first', () => {
    expectDiagram([
      '----i1-----------i2-----|',
      '-------b------------b---|',
      '---------f--------------|',
      '                        ',
      '-------------e----------|' // <--- error for the first rule that is broken is shown
    ]);
  });

});
