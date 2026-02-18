const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionEls = document.querySelectorAll('section[id]');
const revealElements = document.querySelectorAll('.reveal');
const typedRole = document.getElementById('typed-role');
const commandToggle = document.getElementById('command-toggle');
const scrollProgress = document.querySelector('.scroll-progress');
const spotlight = document.querySelector('.spotlight');
const yearEl = document.getElementById('year');
const breakdownButtons = document.querySelectorAll('.toggle-breakdown');
const terminalForm = document.getElementById('terminal-form');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const commandPalette = document.getElementById('command-palette');
const paletteInput = document.getElementById('palette-input');
const paletteList = document.getElementById('palette-list');
const paletteButtons = paletteList ? Array.from(paletteList.querySelectorAll('button[data-action]')) : [];
const skillChips = document.querySelectorAll('.skill-chip[data-project-ref]');
const catCursor = document.getElementById('cat-cursor');
const nameLetters = document.querySelectorAll('.hero-name .name-letter');
const scrollActors = document.querySelectorAll('.hero-copy, .hero-console, .project-entry, .stack-group, .contact-form, .contact-side');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointerIsFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const sectionAnchorMap = {
  hero: 'home',
  projects: 'projects',
  skills: 'skills',
  contact: 'contact'
};

if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

revealElements.forEach((el) => {
  el.style.transitionDelay = '0ms';
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.04, rootMargin: '0px 0px -8% 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));
revealElements.forEach((el) => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.92) {
    el.classList.add('visible');
  }
});

const roleWords = [
  'Coding enthusiast',
  'Learning software development',
  'Building skills through projects'
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function runTypeCycle() {
  if (!typedRole || reduceMotion) {
    if (typedRole) typedRole.textContent = `"${roleWords[0]}"`;
    return;
  }

  const word = roleWords[roleIndex];

  if (!deleting) {
    charIndex += 1;
    typedRole.textContent = `"${word.slice(0, charIndex)}"`;
    if (charIndex === word.length) {
      deleting = true;
      setTimeout(runTypeCycle, 1400);
      return;
    }
    setTimeout(runTypeCycle, 55);
    return;
  }

  charIndex -= 1;
  typedRole.textContent = `"${word.slice(0, charIndex)}"`;

  if (charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roleWords.length;
  }

  setTimeout(runTypeCycle, 34);
}

runTypeCycle();

function setActiveSection(id) {
  const anchorTarget = sectionAnchorMap[id] || id;
  navAnchors.forEach((anchor) => {
    anchor.classList.toggle('active', anchor.getAttribute('href') === `#${anchorTarget}`);
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      setActiveSection(entry.target.id);
    });
  },
  { threshold: 0.3, rootMargin: '0px 0px -20% 0px' }
);

sectionEls.forEach((el) => sectionObserver.observe(el));
scrollActors.forEach((el) => el.classList.add('scroll-actor'));

function scrollToSection(id) {
  const target = id === 'home' ? document.getElementById('home') : document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function terminalWrite(text) {
  if (!terminalOutput) return;
  const line = document.createElement('p');
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function runCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return;

  terminalWrite(`> ${cmd}`);

  if (cmd === 'help') {
    terminalWrite('commands: whoami, projects, analysis, skills, contact, zen, clear');
    return;
  }

  if (cmd === 'whoami') {
    terminalWrite('const profile = {');
    terminalWrite('  name: "Maahirah Sidhiqah",');
    terminalWrite('  title: "Aspiring Software Developer | Diploma in IT Graduate",');
    terminalWrite('  skills: ["JavaScript", "Python", "React"],');
    terminalWrite('  quickLearner: true,');
    terminalWrite('  hardWorker: true,');
    terminalWrite('  openToWork: true');
    terminalWrite('}');
    return;
  }

  if (cmd === 'analysis') {
    scrollToSection('project-analysis');
    terminalWrite('navigating to #project-analysis');
    return;
  }

  if (cmd === 'projects' || cmd === 'skills' || cmd === 'contact' || cmd === 'home') {
    scrollToSection(cmd);
    terminalWrite(`navigating to #${cmd}`);
    return;
  }

  if (cmd === 'zen') {
    body.classList.toggle('zen-mode');
    terminalWrite(`zen mode ${body.classList.contains('zen-mode') ? 'enabled' : 'disabled'}`);
    return;
  }

  if (cmd === 'clear') {
    if (terminalOutput) terminalOutput.innerHTML = '';
    return;
  }

  terminalWrite('unknown command. type `help`.');
}

if (terminalForm && terminalInput) {
  terminalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = terminalInput.value;
    runCommand(value);
    terminalInput.value = '';
  });
}

function openPalette() {
  if (!commandPalette) return;
  commandPalette.hidden = false;
  if (paletteInput) {
    paletteInput.value = '';
    paletteInput.focus();
  }
  filterPaletteActions('');
}

function closePalette() {
  if (!commandPalette) return;
  commandPalette.hidden = true;
}

function executeAction(action) {
  if (action === 'zen') {
    body.classList.toggle('zen-mode');
  } else if (action === 'terminal-help') {
    runCommand('help');
  } else {
    scrollToSection(action);
  }

  closePalette();
}

let paletteActiveIndex = -1;

function getVisiblePaletteButtons() {
  return paletteButtons.filter((button) => !button.hidden);
}

function setPaletteActive(index) {
  const visibleButtons = getVisiblePaletteButtons();
  visibleButtons.forEach((button) => button.classList.remove('active'));

  if (visibleButtons.length === 0) {
    paletteActiveIndex = -1;
    return;
  }

  paletteActiveIndex = Math.max(0, Math.min(index, visibleButtons.length - 1));
  visibleButtons[paletteActiveIndex].classList.add('active');
}

function filterPaletteActions(query) {
  const normalized = query.trim().toLowerCase();
  paletteButtons.forEach((button) => {
    const label = button.textContent?.toLowerCase() || '';
    const action = button.getAttribute('data-action')?.toLowerCase() || '';
    const visible = !normalized || label.includes(normalized) || action.includes(normalized);
    button.hidden = !visible;
    button.classList.remove('active');
  });

  setPaletteActive(0);
}

if (commandToggle) {
  commandToggle.addEventListener('click', openPalette);
}

if (paletteList) {
  paletteList.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const action = target.getAttribute('data-action');
    if (!action) return;
    executeAction(action);
  });
}

if (commandPalette) {
  commandPalette.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.hasAttribute('data-close-palette')) {
      closePalette();
    }
  });
}

if (paletteInput) {
  paletteInput.addEventListener('input', () => {
    filterPaletteActions(paletteInput.value);
  });

  paletteInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setPaletteActive(paletteActiveIndex + 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setPaletteActive(paletteActiveIndex - 1);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closePalette();
      return;
    }

    if (event.key !== 'Enter') return;
    event.preventDefault();

    const visibleButtons = getVisiblePaletteButtons();
    if (paletteActiveIndex >= 0 && visibleButtons[paletteActiveIndex]) {
      const action = visibleButtons[paletteActiveIndex].getAttribute('data-action');
      if (action) {
        executeAction(action);
        return;
      }
    }

    const command = paletteInput.value.trim().toLowerCase();
    if (!command) return;

    const knownAction = ['home', 'projects', 'project-wdp', 'project-tracker', 'project-analysis', 'skills', 'contact', 'zen', 'terminal-help'].includes(command)
      ? command
      : null;

    if (knownAction) {
      executeAction(knownAction);
      return;
    }

    runCommand(command);
    closePalette();
  });
}

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openPalette();
    return;
  }

  if (event.key === 'Escape') {
    closePalette();
  }
});

function openPanel(panel) {
  panel.hidden = false;
  const fullHeight = panel.scrollHeight;
  panel.animate(
    [
      { height: '0px', opacity: 0, transform: 'translateY(-6px)' },
      { height: `${fullHeight}px`, opacity: 1, transform: 'translateY(0)' }
    ],
    { duration: reduceMotion ? 1 : 240, easing: 'ease-out', fill: 'forwards' }
  );
}

function closePanel(panel) {
  const startHeight = panel.scrollHeight;
  const animation = panel.animate(
    [
      { height: `${startHeight}px`, opacity: 1, transform: 'translateY(0)' },
      { height: '0px', opacity: 0, transform: 'translateY(-6px)' }
    ],
    { duration: reduceMotion ? 1 : 200, easing: 'ease-in', fill: 'forwards' }
  );

  animation.onfinish = () => {
    panel.hidden = true;
  };
}

breakdownButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const panelId = button.getAttribute('data-target');
    if (!panelId) return;

    const panel = document.getElementById(panelId);
    if (!panel) return;

    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      closePanel(panel);
      button.setAttribute('aria-expanded', 'false');
      return;
    }

    openPanel(panel);
    button.setAttribute('aria-expanded', 'true');
  });
});

skillChips.forEach((chip) => {
  const projectId = chip.getAttribute('data-project-ref');
  if (!projectId) return;

  const project = document.getElementById(projectId);
  if (!project) return;

  const setLinked = (state) => {
    chip.classList.toggle('linked', state);
    project.classList.toggle('linked-highlight', state);
  };

  chip.addEventListener('mouseenter', () => setLinked(true));
  chip.addEventListener('mouseleave', () => setLinked(false));
  chip.addEventListener('focus', () => setLinked(true));
  chip.addEventListener('blur', () => setLinked(false));
  chip.addEventListener('click', () => {
    project.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    setLinked(true);
    setTimeout(() => setLinked(false), 1200);
  });
});

const updateScrollProgress = () => {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scrollProgress.style.width = `${percent}%`;

  const now = performance.now();
  const deltaY = Math.abs(scrollTop - lastScrollTop);
  const deltaT = Math.max(now - lastScrollTime, 16);
  const velocity = Math.min(deltaY / deltaT, 2.4);
  const glow = 12 + velocity * 22;
  scrollProgress.style.boxShadow = `0 0 ${glow.toFixed(1)}px rgba(71, 244, 255, 0.62)`;
  lastScrollTop = scrollTop;
  lastScrollTime = now;

  if (scrollTop < 140) {
    setActiveSection('hero');
  }
};

const updateScrollExperience = () => {
  if (reduceMotion) return;

  const viewportHeight = window.innerHeight || 1;
  const viewportMid = viewportHeight * 0.5;

  scrollActors.forEach((el) => {
    if (el.classList.contains('reveal') && !el.classList.contains('visible')) return;

    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height * 0.5;
    const normalizedDistance = Math.min(Math.abs(center - viewportMid) / (viewportHeight * 0.9), 1);

    const yShift = (viewportMid - center) * 0.035;
    const scale = 1 - normalizedDistance * 0.035;
    const opacity = 1 - normalizedDistance * 0.22;

    el.style.transform = `translate3d(0, ${yShift.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
    el.style.opacity = opacity.toFixed(3);
  });

  const scrollMax = document.documentElement.scrollHeight - viewportHeight;
  const scrollRatio = scrollMax > 0 ? window.scrollY / scrollMax : 0;
  body.style.setProperty('--scroll-shift', `${(scrollRatio * 140).toFixed(2)}px`);
};

let scrollFrame = 0;
let lastScrollTop = window.scrollY;
let lastScrollTime = performance.now();
const runScrollFrame = () => {
  scrollFrame = 0;
  updateScrollProgress();
  updateScrollExperience();
};

const onScroll = () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(runScrollFrame);
};

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
runScrollFrame();

if (pointerIsFine && !reduceMotion && spotlight) {
  document.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    spotlight.style.setProperty('--spot-x', `${x}%`);
    spotlight.style.setProperty('--spot-y', `${y}%`);
  });
}

if (pointerIsFine && nameLetters.length > 0) {
  nameLetters.forEach((letter) => {
    letter.addEventListener('mousemove', (event) => {
      const rect = letter.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;

      const moveX = relX * 12;
      const moveY = relY * 12;
      const rotate = relX * 12;

      letter.classList.add('is-active');
      letter.style.setProperty('--nx', `${moveX.toFixed(2)}px`);
      letter.style.setProperty('--ny', `${moveY.toFixed(2)}px`);
      letter.style.setProperty('--nr', `${rotate.toFixed(2)}deg`);
    });

    letter.addEventListener('mouseleave', () => {
      letter.classList.remove('is-active');
      letter.style.setProperty('--nx', '0px');
      letter.style.setProperty('--ny', '0px');
      letter.style.setProperty('--nr', '0deg');
    });
  });
}

if (pointerIsFine && !reduceMotion && catCursor) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let catX = mouseX;
  let catY = mouseY;
  let prevX = mouseX;
  let prevY = mouseY;
  let lastMoveAt = performance.now();
  let nextIdleSwitchAt = 0;
  let currentState = 'sit';

  body.classList.add('cat-active');

  const pickIdleState = () => {
    const idleStates = ['sit', 'sleep', 'purr', 'lick'];
    return idleStates[Math.floor(Math.random() * idleStates.length)];
  };

  const setCatState = (state) => {
    if (state === currentState) return;
    currentState = state;
    catCursor.setAttribute('data-state', state);
  };

  const updateCat = () => {
    const now = performance.now();
    const dx = mouseX - prevX;
    const dy = mouseY - prevY;
    const speed = Math.hypot(dx, dy);
    const moving = speed > 0.45;

    catX += (mouseX - catX) * 0.22;
    catY += (mouseY - catY) * 0.22;

    catCursor.style.transform = `translate3d(${(catX + 12).toFixed(2)}px, ${(catY + 12).toFixed(2)}px, 0)`;

    if (moving) {
      lastMoveAt = now;
      nextIdleSwitchAt = now + 1800 + Math.random() * 1400;
      setCatState('walk');
    } else {
      const idleFor = now - lastMoveAt;
      if (idleFor > 800) {
        if (now >= nextIdleSwitchAt) {
          setCatState(pickIdleState());
          nextIdleSwitchAt = now + 1800 + Math.random() * 2200;
        } else if (currentState === 'walk') {
          setCatState('sit');
        }
      }
    }

    prevX = mouseX;
    prevY = mouseY;
    requestAnimationFrame(updateCat);
  };

  requestAnimationFrame(updateCat);

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });
}

