import blockAdvancers from './blockAdvancers';
import htmlParse from './htmlParse';
import xs from 'xstream';
import { List } from 'immutable';

const MIME = {
  TEXT_HTML: 'text/html',
  TEXT_PLAIN: 'text/plain'
};

function makePasteDriver(selector) {
  // the "working area" assume it has already been created the
  // DOM and can be accessed via the provided `selector`
  const elem = document.querySelector(selector);

  function pasteDriver(paste$) {
    const stream = xs.create();

    paste$.addListener({
      next: e => {
        const hasData = (e.clipboardData && e.clipboardData.types.length > 0);
        const hasDataForType = t => List(e.clipboardData.types).includes(t);
        if (!hasData) { return; }

        if (hasDataForType(MIME.TEXT_HTML)) {
          // focus on working area to allow browser
          // to dump pasted html inside it
          elem.focus();

          // working area doesn't immediately receive the pasted
          // content. But, by the time we reach the next loop in the browser
          // event cycle, the content will be there, so wait until then
          // by using a setTimeout
          setTimeout(() => {
            const html = elem.innerHTML;
            elem.innerHTML = '';
            document.querySelector('.carta').focus();

            const blocks = htmlParse(html);
            const advancers = blockAdvancers(blocks);
            if (!blocks.equals(List.of())) {
              stream.shamefullySendNext({ blocks, advancers });
            }
          }, 1);
        }
      },
      error: e => { throw e; },
      complete: () => { }
    });
    return stream;
  }
  return pasteDriver;
}

export { makePasteDriver };
