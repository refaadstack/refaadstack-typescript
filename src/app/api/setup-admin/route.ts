import { NextRequest } from 'next/server';

export async function GET() {
  return new Response('Disabled', { status: 404 });
}

export async function POST() {
  return new Response('Disabled', { status: 404 });
}
