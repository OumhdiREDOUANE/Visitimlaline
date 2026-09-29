/**
 * Isomorphic translator: usable from server components and from the client
 * provider. `t('a.b.c')` resolves a dotted path inside the active dictionary,
 * interpolates `{placeholders}` and falls back gracefully.
 */

export function createTranslator(dictionary) {
  return function translate(key, vars, fallback) {
    const value = resolve(dictionary, key);

    if (typeof value === 'string') {
      return interpolate(value, vars);
    }

    if (typeof fallback === 'string') {
      return interpolate(fallback, vars);
    }

    return key;
  };
}

export function resolve(dictionary, key) {
  return String(key)
    .split('.')
    .reduce(
      (node, part) =>
        node && typeof node === 'object' ? node[part] : undefined,
      dictionary
    );
}

export function interpolate(template, vars) {
  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  );
}
