export function cloneDefaultState(defaultState) {
  return structuredClone(defaultState);
}

export function loadState(storageKey, defaultState) {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return cloneDefaultState(defaultState);

  try {
    const parsed = JSON.parse(saved);
    const merged = cloneDefaultState(defaultState);
    Object.assign(merged, parsed);
    merged.settings = { ...defaultState.settings, ...(parsed.settings || {}) };
    merged.settings.notifications = {
      ...defaultState.settings.notifications,
      ...((parsed.settings || {}).notifications || {})
    };
    merged.filters = { ...defaultState.filters, ...(parsed.filters || {}) };
    merged.auth = { ...defaultState.auth, ...(parsed.auth || {}) };
    return merged;
  } catch {
    return cloneDefaultState(defaultState);
  }
}

export function saveState(storageKey, state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}
