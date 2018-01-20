import xs from 'xstream';
import { Attrs, Block } from '../../src/model/type/type';
import { makeLetterDriver } from '../../src/driver/textwidth';

describe('letter driver', () => {
  it('should return width for letter x', (done) => {
    const letterDriver = makeLetterDriver();
    const letter$ = xs.of(new Block({ text: 'x' }));
    const Letter$ = letterDriver(letter$);
    Letter$.addListener({
      next: (x) => {
        expect(x).to.have.property('text').and.equal('x');
        expect(x).to.have.property('width').and.to.be.a('number');
        done();
      },
      error: (e) => { throw e; },
      complete: () => {}
    });
  });

  it('should return a greater width for bold letters', (done) => {
    const letterDriver = makeLetterDriver();
    const normal$ = xs.of(new Block({
      text: 't'
    }));
    const bold$ = xs.of(new Block({
      text: 't',
      attrs: new Attrs({ bold: true })
    }));
    const Normal$ = letterDriver(normal$);
    const Bold$   = letterDriver(bold$);
    const both$   = xs.combine(Normal$, Bold$).take(1);
    both$.addListener({
      next: (both) => {
        const [normal, bold] = both;
        const normalWidth = normal.width;
        const boldWidth = bold.width;
        expect(boldWidth).to.be.above(normalWidth);
        done();
      },
      error: (e) => { throw e; },
      complete: () => {}
    });
  });
});
