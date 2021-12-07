function parseHash() {
  return parseInt(window.location.hash.substring(1), 10);
}

function findNotes(el) {
  const notes = [];
  for (let node of el.childNodes) {
    node.nodeType === Node.COMMENT_NODE
      ? notes.push(node)
      : notes.push.apply(notes, findNotes(node));
  }
  return notes.map(({ nodeValue = '' }) => nodeValue.trim());
}

addEventListener('load', () => {
  let slideDivs = Array.from(document.querySelectorAll('body > div'));

  slideDivs = slideDivs.map((slide, _i) => {
    slide.setAttribute('tabindex', 0);
    slide.classList.add('slide');
    return Object.assign(slide, { _notes: findNotes(slide), _i });
  });

  let { body } = document;

  let little = {
    current: -1,
    mode: 'talk',
    length: slideDivs.length,
    forward,
    reverse,
    go,
  };
  window.little = little;

  function forward() {
    go(little.current + 1);
  }

  function reverse() {
    go(little.current - 1);
  }

  function go(n, force) {
    n = Math.max(0, Math.min(little.length - 1, n));
    if (!force && little.current === n) {
      return;
    }

    little.current = n;

    let sc = slideDivs[n];
    let slideDiv = sc.firstChild;

    if (sc._notes.length) {
      console.group(n);
      for (let note of sc._notes) {
        const consoleFormat =
          'padding:5px;font-family:serif;font-size:18px;line-height:150%;';
        console.log('%c%s', consoleFormat, note);
      }
      console.groupEnd();
    }

    for (let slide of slideDivs) {
      slide.style.display = slide._i === n ? '' : 'none';
    }

    onResize();
    if (window.location.hash !== n) {
      window.location.hash = n;
    }
  }

  function resizeTo(slideDiv, width, height) {
    let slideContainer = slideDiv.querySelector('.slideContainer');
    if (slideContainer) {
      let padding = Math.min(width * 0.04);
      let fontSize = height;

      slideDiv.style.width = `${width}px`;
      slideDiv.style.height = `${height}px`;
      slideContainer.style.padding = `${padding}px`;

      for (let step of [100, 50, 10, 2]) {
        for (; fontSize > 0; fontSize -= step) {
          slideDiv.style.fontSize = `${fontSize}px`;
          if (
            slideDiv.scrollWidth <= width &&
            slideDiv.offsetHeight <= height &&
            Array.from(slideDiv.querySelectorAll('div')).every(
              (elem) =>
                elem.scrollWidth <= elem.clientWidth &&
                elem.scrollHeight <= elem.clientHeight
            )
          ) {
            break;
          }
        }
        fontSize += step;
      }
      slideDiv.style.width = null;
      slideDiv.style.height = null;
    }
  }

  function onTalk(i) {
    if (little.mode === 'talk') {
      return;
    }
    little.mode = 'talk';
    go(i, true);
  }

  function onClick(e) {
    if (little.mode !== 'talk') {
      return;
    }
    if (e.target.tagName !== 'A') {
      go((little.current + 1) % little.length);
    }
  }

  function onKeyDown(e) {
    if (little.mode === 'talk') {
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        return reverse();
      }
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
        return forward();
      }
    }
  }

  function onResize() {
    if (little.mode !== 'talk') {
      return;
    }
    let { clientWidth: width, clientHeight: height } = document.documentElement;

    resizeTo(slideDivs[little.current], width, height);
  }

  function onTouchStart(e) {
    if (little.mode !== 'talk') {
      return;
    }
    let { pageX: startingPageX } = e.changedTouches[0];
    document.addEventListener(
      'touchend',
      (e2) => {
        let distanceTraveled = e2.changedTouches[0].pageX - startingPageX;
        // Don't navigate if the person didn't swipe by fewer than 4 pixels
        if (Math.abs(distanceTraveled) < 4) {
          return;
        }
        distanceTraveled < 0 ? forward() : reverse();
      },
      { once: true }
    );
  }

  function onHashChange() {
    if (little.mode === 'talk') {
      go(parseHash());
    }
  }

  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('touchstart', onTouchStart);
  addEventListener('hashchange', onHashChange);
  addEventListener('resize', onResize);

  go(parseHash() || little.current);
});
