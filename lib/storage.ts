/** Moves a value saved under an old key to its new key once, then removes the old key. */
export function migrateKey(storage: Storage, oldKey: string, newKey: string) {
  try {
    const old = storage.getItem(oldKey);
    if (old === null) return;
    if (storage.getItem(newKey) === null) storage.setItem(newKey, old);
    storage.removeItem(oldKey);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); nothing to migrate then.
  }
}
