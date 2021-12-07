const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const prettier = require('prettier');

module.exports = function (content) {
  function createElement(document, type, className = '') {
    return Object.assign(document.createElement(type), { className });
  }

  function getNotes(el) {
    function findNotes(el) {
      const notes = [];
      for (let node of el.childNodes) {
        node.nodeType === 8 // Node.COMMENT_NODE
          ? notes.push(node)
          : notes.push.apply(notes, findNotes(node));
      }
      return notes;
    }
    return findNotes(el).flatMap(({ nodeValue }) =>
      nodeValue.trim().split('\n').filter(Boolean)
    );
  }

  const DOM = new JSDOM(content);
  const { document } = DOM.window;

  const body = document.querySelector('body');
  const newBody = body.innerHTML
    .replaceAll('<hr>', '</div><div>')
    .replaceAll('<p><img', '<img')
    .replaceAll('></p>', '>');
  body.innerHTML = `<div>${newBody}</div>`;

  // do some conversion for print mode

  if (this.outputPath.includes('/print.html')) {
    const slideDivs = [...document.querySelectorAll('div')];
    for (let sc of slideDivs) {
      let subContainer = body.appendChild(
        createElement(document, 'div', 'sub-container')
      );
      let sbc = subContainer.appendChild(createElement(document, 'div', ''));
      sbc.appendChild(sc);
      sbc.style.cssText = sc.dataset.bodyStyle || '';
      sc.style.display = 'flex';
      let notesUl = subContainer.appendChild(
        createElement(document, 'ul', 'notes-list')
      );
      for (let note of getNotes(sc)) {
        let li = notesUl.appendChild(createElement(document, 'li'));
        li.innerHTML = note;
      }
    }
  }

  // do some conversion for slide mode
  else if (
    this.outputPath.includes('/index.html') &&
    !this.outputPath.includes('dist/index.html')
  ) {
    const slideDivs = [...document.querySelectorAll('div')];
    for (let slideDiv of slideDivs) {
      if (
        slideDiv.childElementCount === 1 &&
        slideDiv.children[0].tagName === 'IMG'
      ) {
        const child = slideDiv.children[0];
        slideDiv.style.backgroundImage = `url(${child.src})`;
        child.remove();
      } else {
        const slideContainer = createElement(document, 'div', 'slideContainer');
        slideContainer.append(...slideDiv.childNodes);
        slideDiv.appendChild(slideContainer);
      }
    }
  }

  return prettier.format(
    `<!doctype html>${document.documentElement.outerHTML}`,
    {
      parser: 'html',
    }
  );
};
