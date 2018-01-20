import xs from 'xstream';
import { Block } from '../../src/model/type/type';
import { List } from 'immutable';
import { makePasteDriver } from '../../src/driver/paste';

// Most browsers do not support:
// - ClipboardEvent constructor
// - DataTransfer constructor
// https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/ClipboardEvent

function DataTransferFake() {
  const formats = {};

  this.types = [];
  this.files = [];
  this.getData = function(format) {
    return formats[format];
  };
  this.setData = function(format, data) {
    this.types.push(format);
    formats[format] = data;
  };
}

function ClipboardEventFake(type, { dataType, data }) {
  this.clipboardData = new DataTransferFake();
  this.clipboardData.setData(dataType, data);
}

describe('paste driver', () => {
  let elem;
  let container;

  beforeEach(() => {
    if (elem) { document.body.removeChild(elem); }
    elem = document.createElement('div');
    elem.className = 'pastecapture';
    elem.setAttribute('contenteditable', 'true');
    document.body.appendChild(elem);

    if (container) { document.body.removeChild(container); }
    container = document.createElement('div');
    container.className = 'carta';
    document.body.appendChild(container);
  });

  it('should paste "<p>hello world</p>"', (done) => {
    // simulate pasting content into the pastecapture
    elem.innerHTML = '<p>hello</p>';

    const event = new ClipboardEventFake('paste', {
      dataType: 'text/html',
      data: '<p>hello</p>'
    });
    const event$ = xs.of(event);
    const pasteDriver = makePasteDriver('.pastecapture');

    const paste$ = pasteDriver(event$);
    paste$.addListener({
      next: ({ blocks }) => {
        expect(blocks).to.equal(List.of(new Block({
          text: 'hello'
        })));
        done();
      },
      error: () => {},
      complete: () => {}
    });
  });

  it('should clear the working area afterwards', (done) => {
    elem.innerHTML = '<p>hello</p>';

    const event = new ClipboardEventFake('paste', {
      dataType: 'text/html',
      data: '<p>hello</p>'
    });
    const event$ = xs.of(event);
    const pasteDriver = makePasteDriver('.pastecapture');

    const paste$ = pasteDriver(event$);
    paste$.addListener({
      next: () => {
        expect(elem.innerHTML).to.be.oneOf(['', '<br>']);
        done();
      },
      error: () => {},
      complete: () => {}
    });
  });
});
