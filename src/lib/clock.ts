let current = () => new Date();

export function now() {
  return current();
}

export function setClock(next: () => Date) {
  current = next;
}

export function resetClock() {
  current = () => new Date();
}
