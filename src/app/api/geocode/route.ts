// app/api/geocode/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) {
    return NextResponse.json({ error: 'q parameter is required' }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    q
  )}&limit=5`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Nominatim responded ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Geocode proxy error:', err);
    return NextResponse.json({ error: 'Failed to fetch from Nominatim' }, { status: 500 });
  }
}
