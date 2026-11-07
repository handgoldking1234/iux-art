/* art.iux.kr ↔ IUX Cloud(studio.iux.kr)
   - 방문 통계: studio 관리자 > IUX ART > 통계 분석
   - 문의: studio 관리자 > IUX ART > 문의 관리 + art@iux.kr 알림 메일 */
(function () {
  if (!window.IUXCloud) return;
  IUXCloud.init({
    url: 'https://flrdiplgoeyuvffwxvhq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZscmRpcGxnb2V5dXZmZnd4dmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NTgzNTgsImV4cCI6MjEwODMzNDM1OH0.yNLMwIgvr-f-TwU3fAHuSEC5QjvPp9K3I2T1jkC5UQk',
    siteId: 'iux-art'
  });

  var LABEL = { prog: '프로그램', evtype: '행사 유형', people: '작가 수', date: '시작일', date_end: '종료일', time: '시간', place: '장소', org: '회사·단체', budget: '예산', photo_ok: '사진 홍보 동의' };
  var pick = function (d, re) { for (var k in d) if (re.test(k) && d[k]) return Array.isArray(d[k]) ? d[k].join(', ') : String(d[k]); return ''; };
  var PAGE = { 'quote.html': ['quote', '행사 견적 문의'], 'edu-apply.html': ['etc', '출장 강의 신청'], 'edu-qna.html': ['etc', '교육 문의'], 'product.html': ['etc', '주문제작 주문'] };

  /* common.js 의 폼 처리에서 호출 — 실패해도 화면 흐름은 막지 않음 */
  window.IUXArtSend = function (page, data) {
    var p = PAGE[page] || ['etc', '홈페이지 문의'];
    var extra = {}, lines = [];
    Object.keys(data).forEach(function (k) {
      if (/agree|^name$|_name$|tel|phone|mail|^msg$|_msg$|message|content|memo|_q$|website|hp_check/.test(k)) return;
      var v = Array.isArray(data[k]) ? data[k].join(', ') : data[k] === true ? '예' : String(data[k]);
      if (!v) return;
      extra[LABEL[k] || k] = v; lines.push((LABEL[k] || k) + ': ' + v);
    });
    var msg = pick(data, /^msg$|message|content|_msg$|_q$|memo/);
    return IUXCloud.sendInquiry({
      kind: p[0],
      subject: p[1] + (data.evtype ? ' · ' + data.evtype : ''),
      name: pick(data, /^name$|_name$/),
      phone: pick(data, /tel|phone/),
      email: pick(data, /mail/),
      company: data.org || '',
      types: [].concat(data.prog || []),
      schedule: data.date ? (data.date + (data.date_end && data.date_end !== data.date ? ' ~ ' + data.date_end : '') + (data.time ? ' ' + data.time : '')) : '',
      message: [msg, lines.join('\n')].filter(Boolean).join('\n\n'),
      ref: location.href,
      extra: extra
    });
  };
})();
