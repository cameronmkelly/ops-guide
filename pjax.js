/* pjax.js — intercept sidebar link clicks, swap only .page-content + .page-header */
(function () {
  'use strict';

  /* Normalize static sidebar nav links to absolute URLs on first load so they
     remain valid after history.pushState changes the document's base URL */
  document.addEventListener('DOMContentLoaded', function () {
    var sb = document.getElementById('sidebar');
    if (!sb) return;
    sb.querySelectorAll('a.nav-link, a.nav-sub').forEach(function (a) {
      a.href = a.href; // read resolved absolute URL, write back to attribute
    });
  });

  function loadPage(url, push) {
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var newHeader = doc.querySelector('.page-header');
        var newContent = doc.querySelector('.page-content');
        var curHeader  = document.querySelector('.page-header');
        var curContent = document.querySelector('.page-content');

        if (!newContent) { location.href = url; return; }

        document.title = doc.title;

        if (newHeader && curHeader) {
          curHeader.innerHTML = newHeader.innerHTML;
        }

        swapContent(curContent, newContent, url);

        if (push) {
          history.pushState({ url: url }, '', url);
        }

        updateActiveLink(url);

        // Re-wire the per-page favourite button and refresh its state
        if (window._nav) {
          var fb = document.getElementById('favBtn');
          if (fb) fb.addEventListener('click', window._nav.toggleFav);
          window._nav.updateFavBtn();
        }

        // Scroll the main content area to the top
        var main = document.querySelector('.main');
        if (main) main.scrollTop = 0;

        // Close mobile sidebar if it was open
        var sidebar  = document.getElementById('sidebar');
        var overlay  = document.getElementById('mobileOverlay');
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
      })
      .catch(function () { location.href = url; });
  }

  /* Replace target element's children with source's children.
     <script> tags are recreated so the browser executes them.
     Relative links/images are resolved against the source page's URL. */
  function swapContent(target, source, baseUrl) {
    while (target.firstChild) target.removeChild(target.firstChild);

    Array.from(source.childNodes).forEach(function (node) {
      if (node.nodeName === 'SCRIPT') {
        var s = document.createElement('script');
        Array.from(node.attributes).forEach(function (a) {
          s.setAttribute(a.name, a.value);
        });
        s.textContent = node.textContent;
        target.appendChild(s);
      } else {
        target.appendChild(document.importNode(node, true));
      }
    });

    // Fix up relative links and images in the swapped content
    var base = new URL(baseUrl, location.href);
    target.querySelectorAll('a[href]').forEach(function (a) {
      try { a.href = new URL(a.getAttribute('href'), base).href; } catch (e) {}
    });
    target.querySelectorAll('img[src]').forEach(function (img) {
      try { img.src = new URL(img.getAttribute('src'), base).href; } catch (e) {}
    });
  }

  function updateActiveLink(url) {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.querySelectorAll('a.nav-link, a.nav-sub').forEach(function (a) {
      a.classList.toggle('active', a.href === url);
    });
  }

  // Intercept sidebar link clicks only
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link || !link.href) return;
    if (link.target === '_blank') return;
    if (link.hostname !== location.hostname) return;

    var sidebar = document.getElementById('sidebar');
    if (!sidebar || !sidebar.contains(link)) return;

    // Same page — let default scroll/hash behaviour happen
    if (link.href.split('#')[0] === location.href.split('#')[0]) return;

    e.preventDefault();
    loadPage(link.href, true);
  });

  // Handle browser back / forward
  window.addEventListener('popstate', function () {
    loadPage(location.href, false);
  });

}());
