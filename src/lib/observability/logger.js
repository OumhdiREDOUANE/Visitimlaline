/**
 * Asynchronous structured logger (server side only).
 *
 * - Levels: debug | info | warn | error (env: LOG_LEVEL)
 * - Transport: one JSON object per line on stdout (>= warn goes to stderr)
 * - Never throws, never writes files, never touches the database
 * - Dispatch happens on a microtask so a log call cannot block the response
 */

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

const SECRET_KEYS = new Set([
  'access_code',
  'authorization',
  'cookie',
  'password',
  'password_hash',
  'telegram_bot_token',
  'telegram_chat_id',
  'token',
  'token_hash',
]);

const MAX_DEPTH = 2;
const MAX_VALUE_LENGTH = 2048;
const REDACTED = '[redacted]';

function resolveThreshold() {
  const fallback =
    process.env.NODE_ENV === 'production' ? 'info' : 'debug';

  const raw = String(
    process.env.LOG_LEVEL || fallback
  ).toLowerCase();

  return LEVELS[raw] ?? LEVELS[fallback];
}

function isSecretKey(key) {
  return SECRET_KEYS.has(String(key).toLowerCase());
}

function redact(value, depth = 0) {
  if (value === null || value === undefined) {
    return value ?? null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      ...(value.status ? { status: value.status } : {}),
    };
  }

  if (typeof value !== 'object') {
    return typeof value === 'string' && value.length > MAX_VALUE_LENGTH
      ? `${value.slice(0, MAX_VALUE_LENGTH)}…[truncated]`
      : value;
  }

  if (depth >= MAX_DEPTH) {
    return Array.isArray(value) ? `[array:${value.length}]` : '[object]';
  }

  if (Array.isArray(value)) {
    return value.map((item) => redact(item, depth + 1));
  }

  const output = {};

  for (const [key, item] of Object.entries(value)) {
    output[key] = isSecretKey(key)
      ? REDACTED
      : redact(item, depth + 1);
  }

  return output;
}

function write(level, message, context) {
  const record = {
    ts: new Date().toISOString(),
    level,
    msg: String(message),
    ...(context ? redact(context) : {}),
  };

  let line;

  try {
    line = `${JSON.stringify(record)}\n`;
  } catch {
    line = `${JSON.stringify({
      ts: record.ts,
      level: 'error',
      msg: 'log serialization failed',
    })}\n`;
  }

  try {
    if (LEVELS[level] >= LEVELS.warn) {
      process.stderr.write(line);
    } else {
      process.stdout.write(line);
    }
  } catch {
    // A failing log sink must never break a request.
  }
}

function emit(level, message, context) {
  if (LEVELS[level] < resolveThreshold()) {
    return;
  }

  queueMicrotask(() => {
    write(level, message, context);
  });
}

export const logger = {
  debug: (message, context) => emit('debug', message, context),
  info: (message, context) => emit('info', message, context),
  warn: (message, context) => emit('warn', message, context),
  error: (message, context) => emit('error', message, context),
};

export const __testing = {
  LEVELS,
  redact,
  resolveThreshold,
};
