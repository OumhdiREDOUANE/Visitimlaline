
'use client';

import { useRef, useState } from 'react';

export function InlinePriceEditor({
  id,
  type,
  title,
  initialPrice,
}) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(initialPrice ?? ''));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  function cancelEdit() {
    setPrice(String(initialPrice ?? ''));
    setEditing(false);
    setMessage('');
  }

  async function savePrice() {
    const value = Number(price);

    if (
      price.trim() === '' ||
      !Number.isFinite(value) ||
      value < 0
    ) {
      setMessage('Enter a valid price.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/prices', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          type,
          price: value,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to save price.');
      }

      setPrice(String(result.price));
      setEditing(false);
      setMessage('Saved successfully.');
      window.location.reload();
    } catch (error) {
      setMessage(error.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setPrice(String(initialPrice ?? ''));
            setEditing(true);
            setMessage('');
          }}
          className="rounded-lg px-3 py-2 font-semibold transition hover:bg-terra/10"
          title={`Edit price for ${title}`}
        >
          {Number(initialPrice).toLocaleString('fr-MA')} MAD
          <span className="ml-2 text-xs text-muted">✎</span>
        </button>

        {message && (
          <span role="status" className="text-xs text-muted">
            {message}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-w-64 flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="number"
          min="0"
          step="0.01"
          value={price}
          disabled={saving}
          onChange={(event) => setPrice(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              savePrice();
            }

            if (event.key === 'Escape') {
              cancelEdit();
            }
          }}
          autoFocus
          aria-label={`Price for ${title}`}
          className="w-32 rounded-lg border border-ink/20 bg-transparent px-3 py-2 outline-none focus:border-terra"
        />

        <span className="text-xs text-muted">MAD</span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={savePrice}
          className="rounded-lg bg-terra px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={cancelEdit}
          className="rounded-lg border border-ink/15 px-3 py-2 text-xs font-bold disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      {message && (
        <p role="status" className="text-xs text-muted">
          {message}
        </p>
      )}
    </div>
  );
}
