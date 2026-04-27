import { NextResponse } from 'next/server';

export async function GET() {
  const bundle = Math.random() > 0.7 
    ? ['tx1abc...def', 'tx2ghi...jkl', 'tx3mno...pqr']
    : [];
  return NextResponse.json(bundle);
}
