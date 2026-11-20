(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = window.gsap && window.ScrollTrigger;
  document.documentElement.classList.remove('no-js');

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    lenis ? lenis.scrollTo(el, { offset: -20 }) : el.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- Header ---------- */
  const header = document.querySelector('.header');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('is-hidden', y > 400 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const burger = document.querySelector('.burger');
  burger && burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  /* ---------- Swatches (upholstery tint) ---------- */
  document.querySelectorAll('.swatch').forEach(s => s.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(x => x.classList.remove('is-on'));
    s.classList.add('is-on');
    const tint = document.querySelector('.uph__tint');
    const name = document.querySelector('[data-swatch-name]');
    if (name) name.textContent = s.dataset.name;
    if (!tint) return;
    if (s.dataset.color === 'none') { tint.style.opacity = 0; return; }
    tint.style.background = s.dataset.color;
    tint.style.opacity = .78;
  }));

  /* ---------- Form ---------- */
  const form = document.querySelector('.form');
  form && form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelector('.form__ok').style.display = 'block';
    form.querySelector('.submit').style.display = 'none';
  });

  if (!hasGsap || reduce) {
    document.querySelectorAll('.loader').forEach(l => l.remove());
    document.querySelectorAll('.manifesto__text .w').forEach(w => w.style.color = 'inherit');
    document.querySelectorAll('.astep')[0]?.classList.add('is-on');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Split manifesto into words ---------- */
  const mani = document.querySelector('.manifesto__text');
  if (mani) {
    mani.innerHTML = mani.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    const words = mani.querySelectorAll('.w');
    ScrollTrigger.create({
      trigger: mani, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: self => {
        const n = Math.round(self.progress * words.length);
        words.forEach((w, i) => w.style.color = i < n ? 'var(--ink)' : '');
      }
    });
  }

  /* ---------- Intro ---------- */
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const loader = document.querySelector('.loader');
  if (loader) {
    tl.to('.loader__logo', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.inOut' })
      .to('.loader__bar', { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 0)
      .to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '+=.15')
      .set(loader, { display: 'none' });
  }
  tl.from('.hero .line-mask > span, .sub-hero .line-mask > span', { yPercent: 110, duration: 1.4, stagger: .08 }, loader ? '-=.55' : 0)
    .fromTo('.header', { opacity: 0 }, { opacity: 1, duration: 1.2, clearProps: 'opacity' }, '<.2')
    .from('.hero__aside, .sub-hero .lead', { y: 30, opacity: 0, duration: 1.2 }, '<.1');

  /* ---------- Hero media: inset → full bleed ---------- */
  const hm = document.querySelector('.hero__media');
  if (hm) {
    gsap.fromTo(hm, { clipPath: 'inset(0% 3.4vw 0% 3.4vw round 18px)' }, {
      clipPath: 'inset(0% 0vw 0% 0vw round 0px)', ease: 'none',
      scrollTrigger: { trigger: hm, start: 'top 85%', end: 'top 10%', scrub: true }
    });
    gsap.from(hm, { y: 120, opacity: 0, duration: 1.6, ease: 'expo.out', delay: loader ? 1.9 : .3 });
  }

  /* ---------- Parallax inside frames ---------- */
  document.querySelectorAll('[data-parallax] img').forEach(img => {
    gsap.fromTo(img, { yPercent: -5 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  const qi = document.querySelector('.quote__img');
  if (qi) gsap.fromTo(qi, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.quote', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- Reveals ---------- */
  gsap.utils.toArray('.rv').forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  gsap.utils.toArray('[data-stagger]').forEach(group => {
    gsap.from(group.children, { y: 60, opacity: 0, duration: 1.3, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: group, start: 'top 85%' } });
  });
  gsap.utils.toArray('.split-lines').forEach(el => {
    gsap.from(el.querySelectorAll('.line-mask > span'), { yPercent: 110, duration: 1.3, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  /* Draw outline icons */
  gsap.utils.toArray('.step svg').forEach(svg => {
    const paths = svg.querySelectorAll('path,rect,circle,line,polyline');
    paths.forEach(p => { const l = p.getTotalLength ? p.getTotalLength() : 400; p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
    gsap.to(paths, { strokeDashoffset: 0, duration: 2, stagger: .08, ease: 'power2.inOut', scrollTrigger: { trigger: svg, start: 'top 85%' } });
  });

  /* ---------- Anatomy scroll story ---------- */
  const ana = document.querySelector('.anatomy');
  if (ana) {
    const steps = ana.querySelectorAll('.astep');
    const hots = ana.querySelectorAll('.hot');
    const bars = ana.querySelectorAll('.anatomy__progress b');
    const frame = ana.querySelector('.anatomy__frame');
    const vis = ana.querySelector('.anatomy__visual');
    const views = [...steps].map(s => ({ s: +s.dataset.s, x: +s.dataset.x, y: +s.dataset.y }));
    hots.forEach((h, k) => { h.style.left = views[k].x + '%'; h.style.top = views[k].y + '%'; });
    const RATIO = 2000 / 1506;
    let fw = 0, fh = 0, vw = 0, vh = 0;
    const fit = () => {
      vw = vis.clientWidth; vh = vis.clientHeight;
      fw = Math.max(vw, vh * RATIO); fh = fw / RATIO;
      frame.style.width = fw + 'px'; frame.style.height = fh + 'px';
      frame.style.left = (vw - fw) / 2 + 'px'; frame.style.top = (vh - fh) / 2 + 'px';
    };
    fit();
    addEventListener('resize', () => { fit(); if (cur > -1) { const c = cur; cur = -1; set(c, true); } });
    const clamp = (v, a) => Math.max(-a, Math.min(a, v));
    let cur = -1;
    const set = (i, instant) => {
      if (i === cur) return; cur = i;
      steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
      hots.forEach((h, k) => h.classList.toggle('is-on', k === i));
      fit();
      const v = views[i];
      // move the hotspot toward the centre of the visual, without exposing edges
      const maxX = (fw * v.s - vw) / 2, maxY = (fh * v.s - vh) / 2;
      const x = clamp(-(v.x / 100 - .5) * fw * v.s, maxX);
      const y = clamp(-(v.y / 100 - .5) * fh * v.s, maxY);
      gsap.to(frame, { scale: v.s, x, y, duration: instant ? 0 : 1.6, ease: 'expo.out' });
    };
    set(0, true);
    ScrollTrigger.create({
      trigger: ana, start: 'top top', end: 'bottom bottom',
      onUpdate: self => {
        const p = self.progress * steps.length;
        const i = Math.min(steps.length - 1, Math.floor(p));
        bars.forEach((b, k) => gsap.set(b, { scaleX: Math.max(0, Math.min(1, p - k)) }));
        set(i);
      }
    });
  }

  addEventListener('load', () => { ScrollTrigger.refresh(); });
})();
