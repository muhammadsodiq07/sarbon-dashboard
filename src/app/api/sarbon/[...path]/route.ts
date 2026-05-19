import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.sarbon.me/v1';
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_X_CLIENT_TOKEN ?? '';
const USER_TOKEN = process.env.NEXT_PUBLIC_X_USER_TOKEN ?? '';

async function proxy(req: NextRequest, segments: string[]) {
  const url = new URL(req.url);
  const targetUrl = `${API_BASE_URL}/${segments.join('/')}${url.search}`;
  const language = req.headers.get('x-language') ?? 'uz';

  const headers: Record<string, string> = {
    accept: '*/*',
    'X-Device-Type': 'web',
    'X-Language': language,
    'X-Client-Token': CLIENT_TOKEN,
    'X-User-Token': USER_TOKEN,
  };

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
    if (body) headers['content-type'] = 'application/json';
  }

  try {
    const response = await fetch(targetUrl, { method: req.method, headers, body, cache: 'no-store' });
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: { 'content-type': response.headers.get('content-type') ?? 'application/json' },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', code: 500, description: error instanceof Error ? error.message : 'Proxy error', data: null },
      { status: 500 }
    );
  }
}

type Ctx = { params: { path: string[] } };
export async function GET(req: NextRequest, { params }: Ctx) { return proxy(req, params.path); }
export async function POST(req: NextRequest, { params }: Ctx) { return proxy(req, params.path); }
export async function PUT(req: NextRequest, { params }: Ctx) { return proxy(req, params.path); }
export async function PATCH(req: NextRequest, { params }: Ctx) { return proxy(req, params.path); }
export async function DELETE(req: NextRequest, { params }: Ctx) { return proxy(req, params.path); }
