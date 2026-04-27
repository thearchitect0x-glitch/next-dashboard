import { NextResponse } from 'next/server';

let botState = { active: false };

export async function POST(request: Request) {
  const { action } = await request.json();
  
  if (action === 'start') {
    botState.active = true;
    return NextResponse.json({ success: true, status: 'started' });
  } else if (action === 'stop') {
    botState.active = false;
    return NextResponse.json({ success: true, status: 'stopped' });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET() {
  return NextResponse.json(botState);
}
