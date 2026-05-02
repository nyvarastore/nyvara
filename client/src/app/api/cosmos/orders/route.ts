import { NextRequest, NextResponse } from 'next/server';

const COSMOS_BASE  = 'https://api.cosmos.tn/api/v1';
const COSMOS_TOKEN = process.env.COSMOS_API_TOKEN!;

/** Valid Tunisian cities accepted by Cosmos API */
export const COSMOS_CITIES = [
  'Ariana', 'Ben Arous', 'Manouba', 'Tunis', 'Sfax', 'Kairouan',
  'Gafsa', 'Gabes', 'Bizerte', 'Beja', 'Jendouba', 'Kasserine',
  'Kebili', 'Kef', 'Mahdia', 'Medenine', 'Monastir', 'Nabeul',
  'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Zaghouan',
] as const;

export type CosmosCity = typeof COSMOS_CITIES[number];

/** Try to match a free-text city to a valid Cosmos city */
export function matchCity(input: string): CosmosCity {
  const normalized = input.trim().toLowerCase();
  const match = COSMOS_CITIES.find(c => c.toLowerCase() === normalized);
  // fallback: search for partial match, else default to Tunis
  if (match) return match;
  const partial = COSMOS_CITIES.find(c => c.toLowerCase().includes(normalized) || normalized.includes(c.toLowerCase()));
  return partial ?? 'Tunis';
}

// ─── POST /api/cosmos/orders ─────────────────────────────────────────────────
// Creates a delivery order in the Cosmos system
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Map Nyvara order fields → Cosmos fields
    const cosmosPayload = {
      name:          body.customer_name,
      phone:         body.phone,
      address:       body.address || body.city,
      city:          matchCity(body.city),
      totalAmount:   Number(body.total_price ?? 0),
      quantity:      Number(body.quantity ?? 1),
      content:       body.content || 'Lunettes de soleil Nyvara',
      note:          body.note ?? undefined,
      source:        'nyvara',
      options: {
        allowToOpen: true,
        isFragile:   false,
      },
    };

    const res = await fetch(`${COSMOS_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COSMOS_TOKEN}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(cosmosPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Cosmos] Create order error:', data);
      return NextResponse.json({ ok: false, error: data }, { status: res.status });
    }

    return NextResponse.json({ ok: true, data: data.data });
  } catch (err) {
    console.error('[Cosmos] Unexpected error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ─── GET /api/cosmos/orders?barcode=xxx ──────────────────────────────────────
// Fetches delivery status for one or more orders
export async function GET(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get('barcode');

  try {
    const url = barcode
      ? `${COSMOS_BASE}/orders?barcode=${barcode}`
      : `${COSMOS_BASE}/orders?page=1&limit=100`;

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${COSMOS_TOKEN}`,
        'Content-Type':  'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: res.status });
    return NextResponse.json({ ok: true, data: data.data });
  } catch (err) {
    console.error('[Cosmos] Get orders error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE /api/cosmos/orders?barcode=xxx ───────────────────────────────────
// Deletes a pending delivery order
export async function DELETE(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get('barcode');
  if (!barcode) return NextResponse.json({ ok: false, error: 'barcode required' }, { status: 400 });

  try {
    const res = await fetch(`${COSMOS_BASE}/orders?barcode=${barcode}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${COSMOS_TOKEN}` },
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: res.status });
    return NextResponse.json({ ok: true, message: data.message });
  } catch (err) {
    console.error('[Cosmos] Delete order error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
