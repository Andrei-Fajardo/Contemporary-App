import {
  goManuscriptNext,
  goManuscriptPrev,
  initManuscriptBook,
  resetManuscriptBook,
  resizeManuscriptBook,
} from './manuscript-book';

let listenersBound = false;

function getModal(): HTMLElement | null {
  return document.getElementById('manuscript-modal');
}

function getBook(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-manuscript-book]');
}

function openModal(): void {
  const modal = getModal();
  const book = getBook();
  if (!modal || !book) return;

  modal.removeAttribute('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (book.dataset.manuscriptBound !== 'true') {
    book.dataset.manuscriptBound = 'true';
    initManuscriptBook(book);
  } else {
    resetManuscriptBook(book);
    resizeManuscriptBook(book);
  }

  modal.querySelector<HTMLButtonElement>('.manuscript-modal__close')?.focus();
}

function closeModal(): void {
  const modal = getModal();
  if (!modal || modal.hasAttribute('hidden')) return;

  modal.setAttribute('hidden', '');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

export function initManuscriptModal(): void {
  if (listenersBound) return;
  listenersBound = true;

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-manuscript-open]')) {
      event.preventDefault();
      openModal();
      return;
    }
    if (target.closest('[data-manuscript-close]')) {
      event.preventDefault();
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    const modal = getModal();
    if (!modal || modal.hasAttribute('hidden')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    const book = getBook();
    if (!book) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goManuscriptPrev(book);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goManuscriptNext(book);
    }
  });
}

export function resetManuscriptModal(): void {
  listenersBound = false;
}
