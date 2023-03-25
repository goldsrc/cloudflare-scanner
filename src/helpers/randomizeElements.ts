export function randomizeElements<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}
