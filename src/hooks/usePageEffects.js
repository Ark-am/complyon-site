import { useLayoutEffect } from 'react';

// Preserve the original scroll, section tracking, and reveal behavior.
export default function usePageEffects() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const hadJs = root.classList.contains('js');
    const snapshots = Array.from(document.querySelectorAll('#root *'), (element) => ({
      element,
      className: element.getAttribute('class'),
      style: element.getAttribute('style'),
      current: element.getAttribute('aria-current'),
    }));
    let spy, obs, scrollFrame, heroFrame;
    root.classList.add('js');

    /* ---------- depth: the bar earns its shadow once the page moves ---------- */
    var nav = document.querySelector('.nav');
    var ticking = false;
    function markScroll() {
      nav.classList.toggle('stuck', window.scrollY > 8);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; scrollFrame = window.requestAnimationFrame(markScroll); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    markScroll();

    /* ---------- which section you are reading ----------
       Each nav link points at a section; the one whose top sits in a band a
       fifth of the way down the viewport is the one you are in, and its
       underline stays drawn. */
    var linkFor = new Map();
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
      var section = document.getElementById(a.getAttribute('href').slice(1));
      if (section) { linkFor.set(section, a); }
    });

    if (linkFor.size && 'IntersectionObserver' in window) {
      var inBand = new Set();
      var sections = Array.from(linkFor.keys());

      var held = null;

      function markCurrent() {
        var current = sections.filter(function (s) { return inBand.has(s); })[0];
        /* Engagements has no nav link, so the band can come up empty mid-page.
           Hold the last section rather than blinking the underline off, and
           only clear it once the reader is back above the first section. */
        if (!current) {
          if (window.scrollY < sections[0].offsetTop - 120) { held = null; }
          current = held;
        }
        held = current;
        linkFor.forEach(function (a, s) {
          var here = s === current;
          a.classList.toggle('active', here);
          if (here) { a.setAttribute('aria-current', 'true'); }
          else { a.removeAttribute('aria-current'); }
        });
      }

      spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { inBand.add(en.target); } else { inBand.delete(en.target); }
        });
        markCurrent();
      }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });

      sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- motion ----------
       Everything arrives the same way: fade up 14px. What changes is the
       company it keeps — items that come into view together are staggered by
       position, so a three-across grid ripples left to right while the same
       grid stacked on a phone arrives one card at a time, as each is reached.
       Only transform and opacity move, so nothing here can shift the layout. */
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* section furniture the markup does not flag, added here rather than in
       the HTML so a visitor without JavaScript never sees a hidden element */
    ['.head-split', '.stats-grid', '.stats-note', '#faq .center', '.quote-band blockquote', '.quote-band .quote-cite']
      .forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) { el.classList.add('reveal'); });
      });

    /* A group hands its own .reveal to its children, which are then watched
       one by one: [container, child]. On a stacked layout that is what keeps
       a long grid from playing its whole sequence off screen. */
    var groups = [
      ['.svc-grid', '.svc'],
      ['.eng-grid', '.eng'],
      ['.stats-grid', '.stat'],
      ['.creds', 'span'],
      ['#clients .reveal', '.client-row'],
      ['#experience .reveal', '.tl-item'],
      ['.faq-list', 'details']
    ];

    groups.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (box) {
        var kids = box.querySelectorAll(g[1]);
        if (!kids.length) { return; }
        box.classList.remove('reveal');
        kids.forEach(function (el) { el.classList.add('r-item'); });
      });
    });

    var arrivals = document.querySelectorAll('.reveal, .r-item');

    function arrive(el, step) {
      el.style.setProperty('--i', step);
      el.classList.add('on');
    }

    if (reduce || !('IntersectionObserver' in window)) {
      arrivals.forEach(function (el) { arrive(el, 0); });
    } else {
      obs = new IntersectionObserver(function (entries) {
        /* everything in this batch crossed the line together: order it by
           row, then left to right, and cap the cascade at five steps */
        var here = entries.filter(function (en) { return en.isIntersecting; })
          .sort(function (a, b) {
            var top = a.boundingClientRect.top - b.boundingClientRect.top;
            return Math.abs(top) > 8 ? top : a.boundingClientRect.left - b.boundingClientRect.left;
          });

        var row = -1, col = 0, lastTop = null;
        here.forEach(function (en) {
          var top = en.boundingClientRect.top;
          if (lastTop === null || Math.abs(top - lastTop) > 8) { row += 1; col = 0; lastTop = top; }
          else { col += 1; }
          arrive(en.target, Math.min(row + col, 4));
          obs.unobserve(en.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      arrivals.forEach(function (el) { obs.observe(el); });
    }

    /* The hero is already on screen, so it arrives on load rather than on
       scroll — headline first, then the paragraph and the two buttons. */
    var heroParts = [document.querySelector('.hero h1'),
                     document.querySelector('.hero-body p'),
                     document.querySelector('.hero-actions')].filter(Boolean);
    if (!reduce) {
      heroParts.forEach(function (el, i) {
        el.classList.add('r-item');
        el.style.setProperty('--i', i);
      });
      heroFrame = window.requestAnimationFrame(function () {
        heroFrame = window.requestAnimationFrame(function () {
          heroParts.forEach(function (el) { el.classList.add('on'); });
        });
      });
    }

    // Also runs during React StrictMode checks and hot reloads.
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(heroFrame);
      spy?.disconnect();
      obs?.disconnect();
      if (!hadJs) root.classList.remove('js');
      snapshots.forEach(({ element, className, style, current }) => {
        for (const [name, value] of [['class', className], ['style', style], ['aria-current', current]]) {
          if (value === null) element.removeAttribute(name);
          else element.setAttribute(name, value);
        }
      });
    };
  }, []);
}
