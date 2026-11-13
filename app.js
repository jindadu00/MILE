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

  const hero = document.getElementById('hero-video');
  const heroButton = document.getElementById('hero-toggle');
  const heroSources = [...hero.querySelectorAll('source')];
  const failedHeroSources = new Set();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  let heroIsVisible = false;
  let heroLoaded = false;
  let userChoice = 'auto';
  let autoplayBlocked = false;
  let playPending = false;
  let requestVersion = 0;

  function paintHeroControl() {
    const playing = !hero.paused && !hero.ended;
    const label = playing ? 'Pause excerpt' : playPending ? 'Cancel playback' : 'Play excerpt';
    const icon = playing ? 'Ⅱ' : playPending ? '×' : '▶';
    heroButton.replaceChildren(document.createTextNode(`${label} `));
    const symbol = document.createElement('span');
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = icon;
    heroButton.append(symbol);
    heroButton.setAttribute('aria-label', `${label} of MILE system operation`);
    heroButton.setAttribute('aria-pressed', String(playing));
  }

  function wantsHeroPlayback() {
    if (document.hidden || !heroIsVisible || userChoice === 'pause') return false;
    if (userChoice === 'play') return true;
    return !reducedMotion.matches && !connection?.saveData && !autoplayBlocked;
  }

  function reconcileHero() {
    if (!wantsHeroPlayback()) {
      requestVersion += 1;
      playPending = false;
      hero.pause();
      paintHeroControl();
      return;
    }
    if (playPending || !hero.paused) return;
    if (!heroLoaded) {
      failedHeroSources.clear();
      heroSources.forEach((source) => { source.src = source.dataset.src; });
      heroLoaded = true;
      hero.load();
    }
    hero.muted = true;
    const version = ++requestVersion;
    playPending = true;
    paintHeroControl();
    const request = hero.play();
    if (request && typeof request.then === 'function') {
      request.then(() => {
        if (version !== requestVersion) return;
        playPending = false;
        if (!wantsHeroPlayback()) hero.pause();
        paintHeroControl();
      }).catch(() => {
        if (version !== requestVersion) return;
        playPending = false;
        autoplayBlocked = true;
        // A rejected play request must leave a usable play button, not a pause icon.
        hero.pause();
        paintHeroControl();
      });
    } else {
      playPending = false;
      paintHeroControl();
    }
  }

  heroButton.addEventListener('click', () => {
    if (!hero.paused || playPending) {
      userChoice = 'pause';
    } else {
      userChoice = 'play';
      autoplayBlocked = false;
      // A button activation is explicit permission to play, including reduced-motion mode.
      heroIsVisible = true;
      if (hero.error || failedHeroSources.size === heroSources.length) {
        failedHeroSources.clear();
        hero.load();
      }
    }
    reconcileHero();
  });
  hero.addEventListener('play', paintHeroControl);
  hero.addEventListener('pause', paintHeroControl);
  hero.addEventListener('ended', paintHeroControl);
  const showHeroError = () => {
    requestVersion += 1;
    playPending = false;
    autoplayBlocked = true;
    hero.pause();
    paintHeroControl();
    heroButton.title = 'Video unavailable. Retry, or use the full-film links below.';
  };
  hero.addEventListener('error', showHeroError);
  heroSources.forEach((source) => {
    source.addEventListener('error', () => {
      failedHeroSources.add(source);
      if (failedHeroSources.size === heroSources.length) showHeroError();
    });
  });
  hero.addEventListener('loadstart', () => { failedHeroSources.clear(); });
  hero.addEventListener('loadeddata', () => {
    failedHeroSources.clear();
    heroButton.removeAttribute('title');
  });

  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      heroIsVisible = entries[0].isIntersecting;
      reconcileHero();
    }, { threshold: 0.05 });
    heroObserver.observe(hero);
  }
  // Without IntersectionObserver the poster and manual play control remain usable.
  document.addEventListener('visibilitychange', reconcileHero);
  const onPreferenceChange = () => reconcileHero();
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onPreferenceChange);
  else if (reducedMotion.addListener) reducedMotion.addListener(onPreferenceChange);
  connection?.addEventListener?.('change', onPreferenceChange);
  paintHeroControl();

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
