import { NextRequest, NextResponse } from 'next/server';

const COSMOS_BASE  = 'https://api.cosmos.tn/api/v1';
const COSMOS_TOKEN = process.env.COSMOS_API_TOKEN!;

/**
 * GET /api/cosmos/labels?barcode=xxx&format=pdf|html
 * Proxies the Cosmos label endpoint, injecting the Bearer token server-side.
 */
export async function GET(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get('barcode');
  const format  = req.nextUrl.searchParams.get('format') ?? 'html';

  if (!barcode) {
    return NextResponse.json({ ok: false, error: 'barcode is required' }, { status: 400 });
  }

  const cosmosUrl = `${COSMOS_BASE}/labels?barcode=${barcode}&format=${format}`;

  const res = await fetch(cosmosUrl, {
    headers: {
      'Authorization': `Bearer ${COSMOS_TOKEN}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    return new NextResponse(err, { status: res.status });
  }

  // Stream the response back with the correct Content-Type
  const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
  const body        = await res.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // For PDF: trigger browser download dialog
      ...(format === 'pdf' && {
        'Content-Disposition': `attachment; filename="etiquette-${barcode}.pdf"`,
      }),
    },
  });
}
