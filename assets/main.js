(function () {
  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // header state
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // mobile nav
  function setNav(open) {
    root.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setNav(!root.classList.contains('nav-open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 760) setNav(false); });

  // reveals
  var targets = document.querySelectorAll('.reveal, .rule');
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // contact form: return here after sending, then show the thank-you note
  var form = document.getElementById('contact-form');
  if (form) {
    var here = location.origin + location.pathname;
    form.querySelector('[name="_next"]').value = here + '#sent';
    if (location.hash === '#sent') {
      var done = document.getElementById('form-done');
      done.hidden = false;
      form.hidden = true;
      history.replaceState(null, '', here);
      done.scrollIntoView({ block: 'center' });
    }
  }

  // cursor parallax (pointer devices only)
  var movers = document.querySelectorAll('[data-depth]');
  if (movers.length && !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var tx = 0, ty = 0, x = 0, y = 0, raf = null;
    function tick() {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      movers.forEach(function (el) {
        var d = parseFloat(el.dataset.depth) || 0;
        el.style.translate = (x * d).toFixed(2) + 'px ' + (y * d * 0.75).toFixed(2) + 'px';
      });
      raf = (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) ? requestAnimationFrame(tick) : null;
    }
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }
})();
