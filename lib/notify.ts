/* 관리자 화면에서 '보내기'로 남긴 알림 기록 중 메일 채널을 실제 메일로 발송 */
import { layout, sendMail } from './mail';
import { State } from './state';

const site = () => (process.env.SITE_URL || '').replace(/\/$/, '');

type Copy = { title: string; lines: string[]; link?: { href: string; label: string } };
const COPY: Record<string, (job: any, note: string) => Copy> = {
  '공고 알림': (j, n) => ({ title: '새 행사 공고가 올라왔어요', lines: [j ? `${j.title}` : n, j ? `${j.start}${j.end !== j.start ? ' ~ ' + j.end : ''} · ${j.time || ''} · ${j.region}` : '', j?.mode === 'fcfs' ? '선착순 모집이에요. 서둘러 신청해 주세요.' : '신청하시면 운영자가 확인 후 선정 결과를 알려드려요.'], link: { href: '/artist/index.html', label: '공고 보고 신청하기' } }),
  '선정 안내': (j) => ({ title: '행사에 선정되셨어요', lines: [j ? j.title : '', j ? `${j.start} · ${j.time || ''} · ${j.place || j.region}` : '', '일정과 준비물을 작가 포털에서 확인해 주세요.'], link: { href: '/artist/index.html', label: '내 일정 보기' } }),
  '미선정 안내': (j) => ({ title: '이번 행사는 함께하지 못하게 됐어요', lines: [j ? j.title : '', '신청해 주셔서 감사합니다. 다음 공고도 바로 알려드릴게요.'] }),
  '정산 정보 요청': () => ({ title: '정산 정보를 등록해 주세요', lines: ['행사비를 지급하려면 주민등록번호(또는 사업자등록번호)와 계좌 정보가 필요해요.', '작가 포털 > 정산 정보에서 등록하면 보류된 정산이 지급 대기로 바뀌어요.'], link: { href: '/artist/index.html', label: '정산 정보 등록하기' } }),
  '작가 승인': () => ({ title: 'IUX ART 작가 등록이 승인됐어요', lines: ['이제 기술·지역에 맞는 행사 공고를 받아 보실 수 있어요.'], link: { href: '/artist/index.html', label: '작가 포털 열기' } }),
  '정산 완료': (_j, n) => ({ title: '정산금이 입금됐어요', lines: [n, '자세한 내역은 작가 포털 > 정산에서 볼 수 있어요.'], link: { href: '/artist/index.html', label: '정산 내역 보기' } }),
  '현장 후기 요청': (j) => ({ title: '현장 후기를 올려 주세요', lines: [j ? j.title : '', '행사 사진과 분위기를 간단히 남겨 주시면 고객 리포트와 홈페이지 후기에 쓰여요.'], link: { href: '/artist/index.html', label: '현장 후기 올리기' } }),
};

export async function mailForLogs(logs: any[], s: State) {
  const out: any[] = [];
  for (const l of logs) {
    if (l.ch !== 'email') continue;
    const job = s.jobs.find((j: any) => j.id === l.jid);
    if (l.type === '결과 리포트') {
      const r = s.reports?.[l.jid];
      if (!r?.email) continue;
      const html = layout(`${job?.title || ''} 행사 결과 리포트`, [`${r.to || ''} 안녕하세요.`, r.intro || '', '현장 사진과 작가 기록을 정리한 리포트를 보내드려요. 리포트는 90일 동안 열람할 수 있어요.'], { href: `${site()}/report.html?r=${r.token}`, label: '결과 리포트 보기' });
      out.push(await sendMail(r.email, `[IUX ART] ${job?.title || ''} 행사 결과 리포트`, html));
      continue;
    }
    const mk = COPY[l.type] || ((_j: any, n: string): Copy => ({ title: l.type, lines: [n] }));
    for (const aid of l.to || []) {
      const a = s.artists.find((x: any) => x.id === aid);
      if (!a?.email || a.mail === false) continue;
      const c = mk(job, l.note || '');
      const link = c.link ? { href: site() + c.link.href, label: c.link.label } : undefined;
      out.push(await sendMail(a.email, `[IUX ART] ${c.title}`, layout(`${a.name} 작가님, ${c.title}`, c.lines.filter(Boolean), link)));
    }
  }
  return out;
}
