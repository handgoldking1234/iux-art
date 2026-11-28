/* 예약 실행 (vercel.json 의 crons): 게시 시각이 지난 글을 자동 채널에 올림.
   Vercel 이 CRON_SECRET 환경 변수를 Authorization 헤더로 붙여 호출합니다. 값이 없으면 실행하지 않습니다. */
import { NextResponse } from 'next/server';
import { ensureReady } from '@/lib/boot';
import { shareDue } from '@/lib/share';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: '권한이 없어요.' }, { status: 401 });
  try {
    await ensureReady();
    const done = await shareDue();
    return NextResponse.json({ ok: true, shared: done.length, done });
  } catch (e: any) {
    console.error('cron story', e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
