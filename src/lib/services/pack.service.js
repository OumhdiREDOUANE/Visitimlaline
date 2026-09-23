import { getAllPacks } from '../db/packs';

function parseJsonField(value, fallback = []) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function formatPack(pack) {
  if (!pack) {
    return null;
  }

  return {
    ...pack,
    includes: parseJsonField(pack.includes),
    active: Boolean(pack.active),
  };
}

export function getPacks() {
  const packs = getAllPacks();

  return packs.map(formatPack);
}