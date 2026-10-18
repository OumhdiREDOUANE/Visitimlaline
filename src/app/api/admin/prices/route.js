
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index.js';
import { getSessionUser } from '@/lib/auth/guards.js';

export const runtime = 'nodejs';

export async function PATCH(request) {
  try {
    // Check authentication and role.
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in.' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, type, price } = body;

    if (!['activity', 'pack'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid item type.' },
        { status: 400 }
      );
    }

    if (
      id === undefined ||
      id === null ||
      String(id).trim() === '' ||
      !Number.isSafeInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      return NextResponse.json(
        { error: 'Invalid item ID.' },
        { status: 400 }
      );
    }

    if (
      typeof price !== 'number' ||
      !Number.isFinite(price) ||
      price < 0 ||
      price > 100000000
    ) {
      return NextResponse.json(
        { error: 'Enter a valid price.' },
        { status: 400 }
      );
    }

    // Table names are selected from a fixed whitelist.
    const table = type === 'activity' ? 'activities' : 'packs';

    const result = db.prepare(`
      UPDATE ${table}
      SET price_from = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND active = 1
    `).run(price, Number(id));

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Item not found or inactive.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id: Number(id),
      type,
      price,
    });
  } catch (error) {
    console.error('Admin price update error:', error);

    return NextResponse.json(
      { error: 'An unexpected error occurred while saving the price.' },
      { status: 500 }
    );
  }
}
