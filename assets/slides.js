'use strict';
const slides = [...document.querySelectorAll('.slide')];
const jump = document.getElementById('jump');
const allSlides = document.getElementById('all-slides');
const notes = document.getElementById('notes');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const progress = document.getElementById('progress');
let current = 0;

slides.forEach((slide, index) => {
  const option = document.createElement('option');
  option.value = String(index);
  option.textContent = `${index + 1}. ${slide.querySelector('h1, h2').innerText.replace(/\s+/g, ' ')}`;
  jump.append(option);
});

function render(focusHeading = false) {
  document.body.classList.toggle('deck-mode', !allSlides.checked);
  slides.forEach((slide, index) => slide.classList.toggle('active', index === current));
  document.querySelectorAll('.speaker-notes').forEach(note => { note.hidden = !notes?.checked; });
  previous.disabled = current === 0;
  next.disabled = current === slides.length - 1;
  jump.value = String(current);
  progress.textContent = `${current + 1} / ${slides.length}`;
  if (focusHeading) {
    slides[current].querySelector('h1, h2').focus({ preventScroll: true });
    slides[current].scrollIntoView({ block: 'start' });
  }
}
function go(index, focusHeading = false) {
  current = Math.min(slides.length - 1, Math.max(0, index));
  history.replaceState(null, '', `#slide-${current + 1}`);
  render(focusHeading);
}
function readHash() {
  const match = location.hash.match(/^#slide-(\d+)$/);
  if (match) current = Math.min(slides.length - 1, Math.max(0, Number(match[1]) - 1));
  render();
}
previous.addEventListener('click', () => go(current - 1));
next.addEventListener('click', () => go(current + 1));
jump.addEventListener('change', () => go(Number(jump.value), true));
allSlides.addEventListener('change', () => render());
notes?.addEventListener('change', () => render());
document.getElementById('print').addEventListener('click', () => window.print());
window.addEventListener('hashchange', readHash);
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.target.closest('input, select, textarea, button, a, [contenteditable]')) return;
  if (allSlides.checked) return;
  const destinations = { ArrowRight: current + 1, PageDown: current + 1, ArrowLeft: current - 1, PageUp: current - 1, Home: 0, End: slides.length - 1 };
  if (Object.hasOwn(destinations, event.key)) {
    event.preventDefault();
    go(destinations[event.key], true);
  }
});
document.getElementById('controls').hidden = false;
readHash();
