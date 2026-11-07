/* 홈페이지 문의 접수: 원문 보관 + 행사 견적은 관리자 '견적 문의'로 등록 + 운영자 메일 */
import { handler, json, body } from '@/lib/http';
import { q, tx } from '@/lib/db';
import { loadState, writeState } from '@/lib/state';
import { layout, sendMail } from '@/lib/mail';
import { token } from '@/lib/crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PROG: [RegExp, string][] = [
  [/캐리커처/, 'caricature'], [/페이스/, 'facepainting'], [/캘리/, 'calligraphy'], [/타로/, 'tarot'], [/풍선|삐에로/, 'balloon'],
  [/헤나/, 'henna'], [/혁필/, 'hyukpil'], [/손마사지|네일/, 'handcare'], [/손금|관상/, 'palm'], [/커스텀/, 'custompaint'], [/비즈/, 'beads'],
];
const REGION: [RegExp, string][] = [
  [/서울/, '서울'], [/인천/, '인천'], [/(의정부|고양|일산|파주|양주|동두천|포천|남양주|구리|김포|연천|가평)/, '경기 북부'], [/경기|수원|성남|용인|안양|부천|화성|평택|안산|시흥|광명|하남|오산|이천|군포|의왕|과천|안성|여주|광주시/, '경기 남부'],
  [/강원|춘천|원주|강릉|속초/, '강원'], [/충청|충북|충남|대전|세종|청주|천안|아산/, '충청·대전'], [/전라|전북|전남|광주|전주|여수|순천|목포/, '전라·광주'],
  [/경상|경북|경남|대구|포항|구미|창원|김해|진주|경주/, '경상·대구'], [/부산|울산/, '부산·울산'], [/제주/, '제주'],
];
const s1 = (v: any, n = 200) => (Array.isArray(v) ? v.join(', ') : String(v ?? '')).slice(0, n);
const kst = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');
const PAGES: Record<string, string> = { 'quote.html': '행사 견적 문의', 'edu-apply.html': '출장 강의 신청', 'edu-qna.html': '교육 문의', 'product.html': '주문제작 주문' };

export const POST = handler(null, async (req) => {
  const b = await body(req, 200_000);
  const page = s1(b.page, 60), d = b.data && typeof b.data === 'object' ? b.data : {};
  if (d.website || d.hp_check) return json({ ok: true }); // 스팸 방지용 숨은 칸
  const kind = PAGES[page] || '홈페이지 문의';
  await q('insert into iuxart.inquiries (kind, data) values ($1, $2::jsonb)', [kind, JSON.stringify({ page, form: s1(b.form, 40), data: d, ua: s1(req.headers.get('user-agent'), 200) })]);

  let quoteId = '';
  if (page === 'quote.html') {
    const progs: string[] = [].concat(d.prog || []);
    const skill = progs.map((p) => PROG.find(([re]) => re.test(p))?.[1]).find(Boolean) || 'caricature';
    const place = s1(d.place);
    const region = REGION.find(([re]) => re.test(place))?.[1] || '서울';
    quoteId = 'q' + token(6);
    const quote = {
      id: quoteId, at: kst(), client: s1(d.org || d.name, 60) || '이름 없음', skill, start: s1(d.date, 10), end: s1(d.date_end || d.date, 10), time: s1(d.time, 40), place, region,
      need: Math.max(1, Math.min(50, Number(d.people) || 1)), photoOk: d.photo_ok === true || d.photo_ok === 'on',
      color: progs.some((p) => /컬러/.test(p)), progs, evtype: s1(d.evtype, 40), name: s1(d.name, 30), tel: s1(d.tel, 20), email: s1(d.mail, 120),
      memo: [progs.length > 1 ? '프로그램: ' + progs.join(', ') : '', s1(d.evtype, 40), s1(d.msg, 1000)].filter(Boolean).join(' · '),
    };
    await tx(async (t) => { const s = await loadState(t); s.quotes.unshift(quote); await writeState(t, s); });
  }

  // studio 문의함(IUX Cloud)에 들어갔으면 알림 메일은 IUX Cloud가 이미 보냄 → 중복 발송 안 함
  if (process.env.ADMIN_EMAIL && b.cloud !== true) {
    const site = (process.env.SITE_URL || '').replace(/\/$/, '');
    const lines = Object.entries(d).filter(([k]) => !/agree/.test(k)).map(([k, v]) => `${k}: ${s1(v, 500)}`);
    await sendMail(process.env.ADMIN_EMAIL, `[IUX ART] ${kind} · ${s1(d.org || d.name || d.qw_title || '', 40)}`, layout(`새 ${kind}`, lines, quoteId ? { href: `${site}/admin/jobs.html#new-${quoteId}`, label: '공고로 전환하기' } : undefined)).catch(() => {});
  }
  return json({ ok: true });
});
