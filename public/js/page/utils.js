"use strict";

exports.toArray = function toArray(obj) {
  return Array.prototype.slice.apply(obj);
};

exports.domReady = new Promise(function(resolve) {
  function checkState() {
    if (document.readyState != 'loading') {
      resolve();
    }
  }
  document.addEventListener('readystatechange', checkState);
  checkState();
});

exports.strToEl = (function () {
  var tmpEl = document.createElement('div');
  return function (str) {
    var r;
    tmpEl.innerHTML = str;
    r = tmpEl.children[0];
    while (tmpEl.firstChild) {
      tmpEl.removeChild(tmpEl.firstChild);
    }
    return r;
  };
}());

function transitionClassFunc({removeClass = false}={}) {
  return function(el, className = 'active', transitionClass = 'transition') {
    if (removeClass) {
      if (!el.classList.contains(className)) return Promise.resolve();
    }
    else {
      if (el.classList.contains(className)) return Promise.resolve();
    }

    return new Promise(resolve => {
      var listener = event => {
        if (event.target != el) return;
        el.removeEventListener('webkitTransitionEnd', listener);
        el.removeEventListener('transitionend', listener);
        el.classList.remove(transitionClass);
        resolve();
      };

      el.classList.add(transitionClass);

      requestAnimationFrame(_ => {
        el.addEventListener('webkitTransitionEnd', listener);
        el.addEventListener('transitionend', listener);
        el.classList[removeClass ? 'remove' : 'add'](className);
      });
    });
  }
}

exports.transitionToClass = transitionClassFunc();
exports.transitionFromClass = transitionClassFunc({removeClass: true});

exports.closest = function(el, selector) {
  if (el.closest) {
    return el.closest(selector);
  }

  var matches = el.matches || el.msMatchesSelector;

  do {
    if (el.nodeType != 1) continue;
    if (matches.call(el, selector)) return el;
  } while (el = el.parentNode);

  return undefined;
};