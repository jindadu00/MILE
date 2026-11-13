/* MILE project page. All media is served alongside this file. */
(() => {
  'use strict';

  const films = {
    overview: {
      number: 1,
      title: 'MILE system operation and data collection',
      description: 'Putting on the exoskeleton, teleoperation, and multimodal demonstration collection.'
    },
    precision: {
      number: 2,
      title: 'Encoder precision evaluation',
      description: 'Encoder measurements compared with motion capture, with and without an external magnetic perturbation. Original playback-speed annotations are retained.'
    },
    'in-hand': {
      number: 3,
      title: 'Autonomous in-hand manipulation',
      description: 'ACT-Tac policy rollouts for cap unscrewing, cube rotation, and toy rotation.'
    },
    'arm-hand': {
      number: 4,
      title: 'Autonomous arm-hand manipulation',
      description: 'ACT-Tac policy rollouts for fixed-bottle cap unscrewing and sequential potato-chip pick-and-place.'
    }
  };

  const tabs = [...document.querySelectorAll('[data-demo]')];
  const demo = document.getElementById('demo-video');
  const panel = document.getElementById('demo-panel');
  const demoSources = [...demo.querySelectorAll('source')];
  const demoPlayer = demo.closest('.demo-player');
  const failedDemoSources = new Set();
  const videoError = document.getElementById('video-error');
  videoError.setAttribute('role', 'status');
  let selectedFilm = 'overview';

  function selectFilm(tab) {
    const key = tab.dataset.demo;
    if (!films[key] || key === selectedFilm) return;
    selectedFilm = key;
    const film = films[key];
    demo.pause();
    failedDemoSources.clear();
    videoError.hidden = true;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    document.getElementById('demo-label').textContent = `SUPPLEMENTARY VIDEO ${film.number}`;
    document.getElementById('demo-title').textContent = film.title;
    document.getElementById('demo-description').textContent = film.description;
    document.getElementById('demo-download').href = `assets/${key}.mp4`;
    demo.setAttribute('aria-label', film.title);
    demo.poster = `assets/${key}.jpg`;
    demoPlayer.dataset.shape = key === 'precision' ? 'portrait' : key === 'arm-hand' ? 'square' : 'landscape';
    demoSources.forEach((source) => {
      source.src = `assets/${key}.${source.dataset.format}`;
    });
    // Changing films never starts audio. The native play control remains in charge.
    demo.load();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectFilm(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight': next = (index + 1) % tabs.length; break;
        case 'ArrowUp':
        case 'ArrowLeft': next = (index - 1 + tabs.length) % tabs.length; break;
        case 'Home': next = 0; break;
        case 'End': next = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      selectFilm(tabs[next]);
      tabs[next].focus();
    });
  });
  document.querySelectorAll('[data-show-demo]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const tab = tabs.find((item) => item.dataset.demo === link.dataset.showDemo);
      if (!tab) return;
      event.preventDefault();
      selectFilm(tab);
      document.getElementById('demonstrations').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      tab.focus({ preventScroll: true });
    });
  });
  const showDemoError = () => { videoError.hidden = false; };
  demo.addEventListener('error', showDemoError);
  demoSources.forEach((source) => {
    source.addEventListener('error', () => {
      failedDemoSources.add(source);
      // An unsupported format is not a failed film: let the next source load.
      if (failedDemoSources.size === demoSources.length) showDemoError();
    });
  });
  demo.addEventListener('loadstart', () => {
    failedDemoSources.clear();
    videoError.hidden = true;
  });
  demo.addEventListener('loadeddata', () => {
    failedDemoSources.clear();
    videoError.hidden = true;
  });

  const copyButton = document.getElementById('copy-citation');
  const citation = document.getElementById('bibtex');
  const copyStatus = document.getElementById('copy-status');
  let copyResetTimer;
  copyButton.addEventListener('click', async () => {
    clearTimeout(copyResetTimer);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(citation.textContent.trim());
      copyButton.textContent = 'Copied';
      copyStatus.textContent = 'Citation copied to the clipboard.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(citation);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyButton.textContent = 'Selected — press Ctrl/Cmd+C';
      copyStatus.textContent = 'Clipboard access is unavailable. The citation is selected. Press Control C or Command C to copy it.';
    }
    copyResetTimer = setTimeout(() => { copyButton.textContent = 'Copy citation'; }, 5000);
  });

  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
    const targets = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const visibleSections = new Set();
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target.id);
        else visibleSections.delete(entry.target.id);
      });
      const active = targets.find((section) => visibleSections.has(section.id));
      navLinks.forEach((link) => {
        const current = Boolean(active && link.getAttribute('href') === `#${active.id}`);
        link.classList.toggle('active', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    targets.forEach((section) => navObserver.observe(section));
  }
})();
