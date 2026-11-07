/* IUX ART 관리자 — 페이지별 화면 (시안용 간단 스크립트) */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var I = IUX, db = function () { return I.db; }, E = I.esc;
  var page = document.body.dataset.page;

  /* ---------- 모바일 메뉴 ---------- */
  (function () {
    var side = $('#side'), btn = $('#sideBtn'); if (!btn) return;
    function set(o) { side.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); btn.setAttribute('aria-label', o ? '메뉴 닫기' : '메뉴 열기'); }
    btn.addEventListener('click', function () { set(!side.classList.contains('open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    matchMedia('(min-width:901px)').addEventListener('change', function (e) { if (e.matches) set(false); });
  })();

  /* ---------- 사이드바 숫자·초기화 ---------- */
  function sideCounts() {
    var d = db();
    var c = {
      jobs: d.jobs.filter(function (j) { return j.status === 'review'; }).length + d.quotes.length,
      artists: d.artists.filter(function (a) { return a.status === 'pending'; }).length,
      photos: (d.posts || []).filter(function (p) { return p.state === 'pending'; }).length,
      reports: reportsReady().length,
      settle: I.settlements().filter(function (r) { return r.state === 'due' || r.state === 'needinfo'; }).length
    };
    Object.keys(c).forEach(function (k) {
      var el = $('[data-cnt="' + k + '"]');
      if (el) { el.textContent = c[k]; el.hidden = !c[k]; }
    });
  }
  var rb = $('#resetDemo');
  if (rb) rb.addEventListener('click', function () {
    I.modal('<div class="mh"><h3>예시 데이터 초기화</h3><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div><p class="muted">이 브라우저에서 바꾼 공고·작가·정산 내용을 처음 상태로 되돌립니다.</p><div class="mf"><button class="btn btn-o" data-close>취소</button><button class="btn btn-k" id="doReset">초기화</button></div>',
      function (m, close) { I.icons(); $('#doReset', m).onclick = function () { I.reset(); close(); location.reload(); }; });
  });

  /* ---------- 공통 조각 ---------- */
  function appState(p, j) {
    if (p.s === 'selected') return '<span class="badge st-ok">선정</span>';
    if (p.s === 'rejected') return '<span class="badge st-done">미선정</span>';
    if (p.s === 'rest') return '<span class="badge st-rest">휴식 제외</span>';
    return '<span class="badge st-open">신청</span>';
  }
  function revCell(j, a) {
    var r = I.reviewOf(j.id, a.id);
    return r ? ' <button class="rv-chip" data-rev="' + j.id + ':' + a.id + '" title="평가 수정">' + I.stars(I.revAvg(r)) + '</button>'
             : ' <button class="btn btn-y btn-s" data-rev="' + j.id + ':' + a.id + '"><i data-lucide="star"></i>평가하기</button>';
  }
  /* 작가 평가 입력 (운영자 내부용) */
  function reviewModal(jid, aid, after) {
    var j = I.job(jid), a = I.artist(aid), r = I.reviewOf(jid, aid);
    var TAGS = ['손이 빠름', '작품 퀄리티 높음', '고객 반응 좋음', '아이들 응대 좋음', '준비물 완벽', '지각', '복장·용모 미흡', '자리 이탈', '고객 불만'];
    var starRow = function (c) {
      var v = r ? r.s[c[0]] : 0, h = '';
      for (var i = 5; i >= 1; i--) h += '<input type="radio" id="rv_' + c[0] + i + '" name="rv_' + c[0] + '" value="' + i + '"' + (v === i ? ' checked' : '') + ' required><label for="rv_' + c[0] + i + '" title="' + i + '점">★</label>';
      return '<div class="rv-row"><span>' + c[1] + '</span><div class="rate" role="radiogroup" aria-label="' + c[1] + '">' + h + '</div></div>';
    };
    I.modal('<div class="mh"><div class="prof">' + I.avatar(a) + '<div><h3>' + E(a.name) + ' 작가 평가</h3><p class="muted">' + E(j.title) + ' · ' + I.period(j) + '</p></div></div><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div>' +
      '<form class="form" id="rvF">' + I.CRIT.map(starRow).join('') +
      '<div class="fld"><span class="lb">재섭외</span><div class="togs">' + Object.keys(I.REHIRE).map(function (k) { return '<label class="tog"><input type="radio" name="rv_re" value="' + k + '"' + ((r ? r.rehire : 'yes') === k ? ' checked' : '') + '><span>' + I.REHIRE[k][0] + '</span></label>'; }).join('') + '</div></div>' +
      '<div class="fld"><span class="lb">현장 메모 태그</span><div class="togs">' + TAGS.map(function (t) { return '<label class="tog"><input type="checkbox" name="rv_tag" value="' + t + '"' + (r && r.tags.indexOf(t) > -1 ? ' checked' : '') + '><span>' + t + '</span></label>'; }).join('') + '</div></div>' +
      '<div class="fld"><label for="rv_note">내부 메모</label><textarea class="inp" id="rv_note" rows="3" placeholder="고객사 피드백, 다음 섭외 때 참고할 점">' + (r ? E(r.note) : '') + '</textarea><p class="help">평가와 메모는 운영자만 봅니다. 작가에게는 공개되지 않아요.</p></div>' +
      '<div class="mf">' + (r ? '<button type="button" class="btn btn-o" id="rvDel">평가 삭제</button>' : '') + '<button type="button" class="btn btn-o" data-close>취소</button><button class="btn btn-y" type="submit"><i data-lucide="check"></i>' + (r ? '평가 수정' : '평가 저장') + '</button></div></form>',
      function (m, close) {
        m.querySelector('.modal-card').classList.add('wide'); I.icons();
        var done = function (msg) { I.save(); close(); I.toast(msg); sideCounts(); document.dispatchEvent(new Event('iux-review')); if (after) after(); };
        $('#rvF', m).onsubmit = function (e) {
          e.preventDefault();
          if (!e.target.checkValidity()) { I.toast('네 항목 모두 별점을 골라 주세요.'); return; }
          var s = {}; I.CRIT.forEach(function (c) { s[c[0]] = +$('input[name=rv_' + c[0] + ']:checked', m).value; });
          var row = { job: jid, a: aid, at: I.stamp(), s: s, rehire: $('input[name=rv_re]:checked', m).value, tags: $$('input[name=rv_tag]:checked', m).map(function (x) { return x.value; }), note: $('#rv_note', m).value.trim() };
          db().reviews = (db().reviews || []).filter(function (x) { return !(x.job === jid && x.a === aid); }); db().reviews.push(row);
          done(a.name + ' 작가 평가를 저장했어요. 평점 ★ ' + I.rating(a));
        };
        var del = $('#rvDel', m);
        if (del) del.onclick = function () { db().reviews = db().reviews.filter(function (x) { return !(x.job === jid && x.a === aid); }); done('평가를 지웠어요.'); };
      });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('#jobDetail [data-rev]'); if (!b) return;
    var k = b.dataset.rev.split(':'); reviewModal(k[0], k[1]);
  });
  function jobMeta(j) {
    return I.period(j) + ' · ' + j.time + ' · ' + j.region;
  }
  function chTag(ch) { return ch === 'kakao' ? '<span class="ch-k">알림톡</span>' : '<span class="ch-e">메일</span>'; }

  /* =========================================================
     대시보드
     ========================================================= */
  function dashboard() {
    var d = db(), S = I.settlements();
    var open = d.jobs.filter(function (j) { return j.status === 'open'; });
    var review = d.jobs.filter(function (j) { return j.status === 'review'; });
    var month = I.today.slice(0, 7);
    var monthJobs = d.jobs.filter(function (j) { return !j.hidden && j.start.slice(0, 7) === month && (j.status === 'confirmed' || j.status === 'done'); });
    var active = d.artists.filter(function (a) { return a.status === 'active'; });
    var rest = active.filter(function (a) { return I.isRest(a.id); });
    var pend = d.artists.filter(function (a) { return a.status === 'pending'; });
    var due = S.filter(function (r) { return r.state === 'due'; });
    var dueSum = due.reduce(function (s, r) { return s + r.net; }, 0);
    var apps = open.reduce(function (s, j) { return s + j.apps.length; }, 0);

    $('#kpis').innerHTML =
      '<div class="card kpi"><p class="k"><i data-lucide="megaphone"></i>모집 중 공고</p><p class="v">' + open.length + '<small>건</small></p><p class="s">신청 ' + apps + '명 · 선정 대기 ' + review.length + '건</p></div>' +
      '<div class="card kpi"><p class="k"><i data-lucide="calendar-check"></i>이번 달 확정 행사</p><p class="v">' + monthJobs.length + '<small>건</small></p><p class="s">' + month.replace('-', '년 ') + '월</p></div>' +
      '<div class="card kpi"><p class="k"><i data-lucide="users"></i>활동 작가</p><p class="v">' + active.length + '<small>명</small></p><p class="s">휴식 대상 ' + rest.length + ' · 승인 대기 ' + pend.length + '</p></div>' +
      '<div class="card kpi hl"><p class="k"><i data-lucide="wallet"></i>지급 대기 정산</p><p class="v">' + I.man(dueSum) + '<small>원</small></p><p class="s">' + due.length + '건 · 실지급액 기준</p></div>';

    /* 처리할 일 */
    var todo = [];
    d.quotes.forEach(function (q) { todo.push(['y', 'inbox', '견적 문의 → 공고 전환', q.client + ' · ' + I.skill(q.skill).n + ' ' + q.need + '명', 'jobs.html#new-' + q.id]); });
    review.forEach(function (j) { todo.push(['y', 'user-check', '작가 선정 필요', j.title + ' · 신청 ' + j.apps.length + '명 / 모집 ' + j.need + '명', 'jobs.html#' + j.id]); });
    I.needReview().forEach(function (x) { todo.push(['b', 'star', '작가 평가', x.a.name + ' · ' + x.j.title, 'jobs.html#' + x.j.id]); });
    pend.forEach(function (a) { todo.push(['b', 'user-plus', '작가 등록 승인', a.name + ' · ' + a.skills.map(function (s) { return I.skill(s.k).n; }).join(', '), 'artists.html#' + a.id]); });
    if (due.length) todo.push(['g', 'wallet', '정산 지급', due.length + '건 · ' + I.won(dueSum), 'settlement.html']);
    I.needInfo().forEach(function (a) { todo.push(['r', 'id-card', '정산 정보 미등록', a.name + ' · ' + (a.tax === 'business' ? '사업자등록번호' : '주민등록번호') + ' 등록 전이라 지급 보류', 'artists.html#' + a.id]); });
    rest.forEach(function (a) { todo.push(['r', 'coffee', '휴식 대상 작가', a.name + ' · 연속 ' + I.streak(a.id) + '회 확정, 다음 공고 1회 제외', 'artists.html#' + a.id]); });
    $('#todo').innerHTML = todo.length ? todo.map(function (t) {
      return '<a class="li" href="' + t[4] + '"><span class="ic ' + t[0] + '"><i data-lucide="' + t[1] + '"></i></span><span class="t"><b>' + t[2] + '</b><small>' + E(t[3]) + '</small></span><i data-lucide="chevron-right" class="muted"></i></a>';
    }).join('') : '<div class="empty-s"><i data-lucide="check-circle-2"></i>처리할 일이 없어요.</div>';

    /* 월별 차트 (최근 6개월) */
    var months = [];
    var base = I.toDate(I.today); base.setDate(1);
    for (var i = 5; i >= 0; i--) { var m = new Date(base.getFullYear(), base.getMonth() - i, 1); months.push(m.getFullYear() + '-' + (m.getMonth() < 9 ? '0' : '') + (m.getMonth() + 1)); }
    var rev = months.map(function (m) { return d.jobs.filter(function (j) { return j.start.slice(0, 7) === m && (j.status === 'confirmed' || j.status === 'done'); }).reduce(function (s, j) { return s + j.fee; }, 0); });
    var pay = months.map(function (m) { return S.filter(function (r) { return r.job.start.slice(0, 7) === m; }).reduce(function (s, r) { return s + r.gross; }, 0); });
    var max = Math.max.apply(null, rev.concat(pay).concat([1]));
    $('#chart').innerHTML = '<div class="bars">' + months.map(function (m, k) {
      return '<div class="col"><span class="val">' + (rev[k] ? I.man(rev[k]) : '') + '</span><div class="stack" style="flex-direction:row;align-items:flex-end;gap:3px">' +
        '<div class="bar" style="height:' + (rev[k] / max * 100) + '%" title="매출 ' + I.won(rev[k]) + '"></div>' +
        '<div class="bar k" style="height:' + (pay[k] / max * 100) + '%" title="작가 지급 ' + I.won(pay[k]) + '"></div></div></div>';
    }).join('') + '</div><div class="bars-x">' + months.map(function (m) { return '<span>' + (+m.slice(5)) + '월</span>'; }).join('') + '</div>' +
      '<p class="legend"><span><i></i>업체 견적 매출</span><span><i class="k"></i>작가 지급액</span></p>';

    /* 최근 전송 */
    $('#logs').innerHTML = d.logs.slice(0, 6).map(function (l) {
      return '<div class="li"><span class="t"><b>' + E(l.type) + ' <small class="muted">· ' + E(l.note) + '</small></b><small>' + l.at + ' · ' + l.to.length + '명</small></span>' + chTag(l.ch) + '</div>';
    }).join('');

    /* 다가오는 행사 */
    var up = d.jobs.filter(function (j) { return j.status === 'confirmed'; }).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
    $('#upcoming').innerHTML = up.length ? up.map(function (j) {
      var sel = j.apps.filter(function (p) { return p.s === 'selected'; }).map(function (p) { return I.artist(p.a).name; }).join(', ');
      return '<a class="li" href="jobs.html#' + j.id + '"><span class="ic b"><i data-lucide="calendar"></i></span><span class="t"><b>' + E(j.title) + '</b><small>' + I.period(j) + ' · ' + E(sel) + '</small></span>' + I.badge(I.JOB_STATE, j.status) + '</a>';
    }).join('') : '<div class="empty-s">예정된 행사가 없어요.</div>';
  }

  /* =========================================================
     공고·섭외
     ========================================================= */
  function jobs() {
    var filter = 'all', cur = null;
    var FL = [['all', '전체'], ['open', '모집 중'], ['review', '선정 대기'], ['confirmed', '확정'], ['done', '완료']];

    function renderTabs() {
      var d = db();
      $('#jobTabs').innerHTML = FL.map(function (f) {
        var vis = d.jobs.filter(function (j) { return !j.hidden; });
        var n = f[0] === 'all' ? vis.length : vis.filter(function (j) { return j.status === f[0]; }).length;
        return '<button class="tab' + (filter === f[0] ? ' on' : '') + '" data-f="' + f[0] + '">' + f[1] + '<span class="n">' + n + '</span></button>';
      }).join('');
    }
    function renderList() {
      var d = db();
      var order = { review: 0, open: 1, confirmed: 2, done: 3 };
      var list = d.jobs.filter(function (j) { return !j.hidden && (filter === 'all' || j.status === filter); })
        .sort(function (a, b) { return order[a.status] - order[b.status] || (a.status === 'done' ? (a.start < b.start ? 1 : -1) : (a.start < b.start ? -1 : 1)); });
      $('#jobList').innerHTML = (d.quotes.length && (filter === 'all' || filter === 'open') ? d.quotes.map(function (q) {
        return '<button class="jc" data-q="' + q.id + '" style="border-style:dashed"><span class="row"><span class="badge st-review">견적 문의</span><small>' + q.at.slice(5) + '</small></span><b>' + E(q.client) + '</b><small>' + I.skill(q.skill).n + ' · ' + (q.start === q.end ? q.start : q.start + ' ~ ' + q.end) + ' · ' + q.need + '명</small></button>';
      }).join('') : '') + list.map(function (j) {
        var n = j.apps.length, sel = j.apps.filter(function (p) { return p.s === 'selected'; }).length;
        var pct = Math.min(100, (j.status === 'open' || j.status === 'review' ? n : sel) / j.need * 100);
        return '<button class="jc' + (cur === j.id ? ' on' : '') + '" data-j="' + j.id + '"><span class="row">' + I.badge(I.JOB_STATE, j.status) + '<small>' + I.skill(j.skill).n + '</small></span><b>' + E(j.title) + '</b><small>' + jobMeta(j) + '</small>' +
          '<span class="meter"><i style="width:' + pct + '%"></i></span><small>' + (j.status === 'open' || j.status === 'review' ? '신청 ' + n + '명 / 모집 ' + j.need + '명' : '선정 ' + sel + '명') + '</small></button>';
      }).join('');
    }

    document.addEventListener('iux-review', function () { renderDetail(); });
    function renderDetail() {
      var j = I.job(cur), box = $('#jobDetail');
      if (!j) { box.innerHTML = '<div class="card empty-s"><i data-lucide="mouse-pointer-click"></i>왼쪽에서 공고를 고르세요.</div>'; I.icons(); return; }
      var editable = j.status === 'open' || j.status === 'review';
      var apps = j.apps.slice().sort(function (a, b) { return a.at < b.at ? -1 : 1; });
      var dd = I.days(j.start, j.end), per = I.artistPay(j);
      var rows = apps.map(function (p, i) {
        var a = I.artist(p.a); if (!a) return '';
        var sk = a.skills.filter(function (s) { return s.k === j.skill; })[0];
        var rest = editable && I.isRest(a.id);
        return '<tr class="' + (rest ? 'rest' : '') + '">' +
          '<td class="c">' + (editable ? '<input type="checkbox" class="pk" value="' + a.id + '"' + (p.s === 'selected' ? ' checked' : '') + ' aria-label="' + E(a.name) + ' 선택">' : '') + '</td>' +
          '<td class="c"><span class="rank">' + (i + 1) + '</span></td>' +
          '<td><div class="who">' + I.avatar(a) + '<div><b>' + E(a.name) + '</b><small>만 ' + I.age(a.birth) + '세 · ★ ' + (I.rating(a) || '-') + '</small></div></div></td>' +
          '<td>' + (sk ? '<span class="chip">' + I.skill(j.skill).n + ' <b>' + I.years(sk.since) + '년차</b></span>' : '-') + '</td>' +
          '<td>' + a.regions.join(', ') + '</td>' +
          '<td class="r">' + I.count(a.id) + '회</td>' +
          '<td class="r">' + (I.streak(a.id) ? '<span class="' + (rest ? 'warn-t' : '') + '">' + I.streak(a.id) + '회</span>' : '-') + '</td>' +
          '<td class="num">' + p.at.slice(5) + '</td>' +
          '<td>' + (rest ? '<span class="badge st-rest">휴식 대상</span>' : appState(p, j)) + (j.status === 'done' && p.s === 'selected' ? revCell(j, a) : '') + '</td></tr>';
      }).join('');
      box.innerHTML = '<div class="card jd">' +
        '<div class="head"><div><p>' + I.badge(I.JOB_STATE, j.status) + ' <span class="chip">' + I.skill(j.skill).n + '</span> ' + (j.photoOk ? '<span class="badge st-ok">사진 홍보 동의</span>' : '<span class="badge st-done">사진 홍보 미동의</span>') + (I.postsOf(j.id).length ? ' <a class="chip" href="photos.html#' + j.id + '">현장 후기 ' + I.postsOf(j.id).length + '건</a>' : '') + (j.status === 'done' && I.postsOf(j.id).length ? ' <a class="chip" href="reports.html#' + j.id + '">결과 리포트 · ' + I.REPORT_STATE[I.reportOf(j.id).state === 'sent' ? 'sent' : 'draft'][0] + '</a>' : '') + '</p><h2 style="margin-top:8px">' + E(j.title) + '</h2><p class="muted" style="margin-top:2px">' + E(j.client) + ' · 공고 ' + j.posted + '</p></div>' +
        (editable ? '<div class="mode" role="group" aria-label="선정 방식"><button data-mode="fcfs" class="' + (j.mode === 'fcfs' ? 'on' : '') + '">선착순</button><button data-mode="pick" class="' + (j.mode === 'pick' ? 'on' : '') + '">직접 선택</button></div>' : '<span class="chip">' + (j.mode === 'fcfs' ? '선착순' : '직접 선택') + '</span>') + '</div>' +
        '<dl class="dl"><div><dt>행사 기간</dt><dd class="num">' + I.period(j) + ' (' + dd + '일)</dd></div><div><dt>진행 시간</dt><dd>' + j.time + ' · ' + j.hours + '시간</dd></div><div><dt>장소</dt><dd>' + E(j.place) + '</dd></div><div><dt>모집 마감</dt><dd class="num">' + j.deadline + '</dd></div>' +
        '<div><dt>섭외 작가</dt><dd>' + j.need + '명</dd></div><div><dt>작가 1인 지급</dt><dd class="num">' + I.won(per) + '</dd></div><div><dt>업체 견적</dt><dd class="num">' + I.won(j.fee) + '</dd></div><div><dt>예상 마진</dt><dd class="num">' + I.won(j.fee - per * j.need) + '</dd></div></dl>' +
        (editable ? '<div class="pickbar"><p class="sum">선택 <b id="pkN">0</b> / ' + j.need + '명</p><div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn btn-o btn-s" id="autoPick"><i data-lucide="zap"></i>' + (j.mode === 'fcfs' ? '선착순 자동 선정' : '추천 순 자동 선택') + '</button>' +
          '<button class="btn btn-o btn-s" id="noticeAgain"><i data-lucide="megaphone"></i>공고 다시 알리기</button>' +
          '<button class="btn btn-y btn-s" id="confirmPick"><i data-lucide="send"></i>확정하고 알림 보내기</button></div></div>' : '<p class="sec-t">신청·선정 작가</p>') +
        (apps.length ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="c" style="width:40px"></th><th class="c">순번</th><th>작가</th><th>기술·연차</th><th>지역</th><th class="r">총 참여</th><th class="r">연속</th><th>신청 시각</th><th>상태</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
          : '<div class="empty-s card" style="border-style:dashed"><i data-lucide="inbox"></i>아직 신청한 작가가 없어요.</div>') +
        (editable ? '<p class="note">· 순번은 신청 시각 순서입니다. 선착순은 순번대로 모집 인원만큼 자동 선택합니다.<br>· 최근 ' + db().settings.restWindow + '일 안에 연속 ' + db().settings.restCount + '회 이상 확정된 작가는 <b>휴식 대상</b>으로 표시되고 자동 선정에서 빠집니다. 직접 체크하면 확인 후 선정할 수 있어요.</p>' : '') +
        '</div>';
      I.icons();
      if (!editable) return;

      var upd = function () { $('#pkN').textContent = $$('.pk:checked', box).length; };
      $$('.pk', box).forEach(function (c) {
        c.addEventListener('change', function () {
          if (c.checked && I.isRest(c.value)) I.toast(I.artist(c.value).name + ' 작가는 휴식 대상이에요. 선정하면 연속 횟수가 이어집니다.');
          upd();
        });
      });
      upd();
      $$('[data-mode]', box).forEach(function (b) { b.onclick = function () { j.mode = b.dataset.mode; I.save(); renderDetail(); }; });
      $('#autoPick').onclick = function () {
        var ok = apps.filter(function (p) { return !I.isRest(p.a); });
        if (j.mode === 'pick') ok.sort(function (a, b) { return (I.rating(I.artist(b.a)) - I.rating(I.artist(a.a))) || (I.count(a.a) - I.count(b.a)); });
        var pick = ok.slice(0, j.need).map(function (p) { return p.a; });
        $$('.pk', box).forEach(function (c) { c.checked = pick.indexOf(c.value) > -1; });
        upd();
        I.toast(j.mode === 'fcfs' ? '신청 순서대로 ' + pick.length + '명을 선택했어요. (휴식 대상 제외)' : '평점이 높고 참여가 적은 순으로 ' + pick.length + '명을 선택했어요.');
      };
      $('#noticeAgain').onclick = function () {
        var to = I.targets(j).filter(function (id) { return !j.apps.some(function (p) { return p.a === id; }); });
        if (!to.length) { I.toast('추가로 알릴 작가가 없어요. (기술·지역 일치 작가 모두 신청함)'); return; }
        I.send('공고 알림', j.id, to, db().settings.channels, I.skill(j.skill).n + ' · ' + j.region);
        I.save(); I.toast('아직 신청하지 않은 ' + to.length + '명에게 공고를 다시 보냈어요.');
      };
      $('#confirmPick').onclick = function () {
        var picked = $$('.pk:checked', box).map(function (c) { return c.value; });
        if (!picked.length) { I.toast('선정할 작가를 먼저 선택해 주세요.'); return; }
        confirmModal(j, picked);
      };
    }

    function confirmModal(j, picked) {
      var others = j.apps.filter(function (p) { return picked.indexOf(p.a) < 0; }).map(function (p) { return p.a; });
      var a0 = I.artist(picked[0]);
      var per = I.artistPay(j);
      var msg = '[IUX ART] 행사 선정 안내\n\n' + a0.name + ' 작가님, 신청하신 행사에 선정되었습니다.\n\n■ 행사: ' + j.title + '\n■ 일정: ' + I.period(j) + ' ' + j.time + '\n■ 장소: ' + j.place + '\n■ 지급 예정: ' + I.won(per) + ' (세전)\n\n행사 시작 30분 전까지 도착 부탁드립니다.';
      var over = picked.length > j.need ? '<p class="demo" style="margin-top:12px"><i data-lucide="alert-triangle"></i>모집 인원(' + j.need + '명)보다 ' + (picked.length - j.need) + '명 많이 선택했어요.</p>' : '';
      var restSel = picked.filter(function (id) { return I.isRest(id); });
      var restW = restSel.length ? '<p class="demo" style="margin-top:12px"><i data-lucide="coffee"></i>휴식 대상 작가가 포함되어 있어요: ' + restSel.map(function (id) { return I.artist(id).name; }).join(', ') + '</p>' : '';
      I.modal('<div class="mh"><h3>선정 확정 · 알림 전송</h3><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div>' +
        '<p><b>' + E(j.title) + '</b></p><p class="muted">선정 ' + picked.length + '명: ' + picked.map(function (id) { return I.artist(id).name; }).join(', ') + (others.length ? ' · 미선정 ' + others.length + '명' : '') + '</p>' + over + restW +
        '<div class="grid g2" style="margin-top:16px"><div><p class="sec-t" style="margin-top:0">카카오 알림톡 미리보기</p><div class="kakao"><p class="from">IUX ART</p><div class="bub"><p class="bt">알림톡 도착</p><p class="bb">' + E(msg) + '</p><span class="bl">일정 확인하기</span></div></div></div>' +
        '<div><p class="sec-t" style="margin-top:0">보낼 알림</p><div class="form">' +
        '<label class="ck"><input type="checkbox" id="cK" checked>카카오 알림톡</label><label class="ck"><input type="checkbox" id="cE" checked>메일</label>' +
        '<label class="ck"><input type="checkbox" id="cR" ' + (others.length ? 'checked' : 'disabled') + '>미선정 작가에게도 결과 안내</label>' +
        '<label class="ck"><input type="checkbox" id="cD" checked>행사 전날 리마인드 예약</label></div>' +
        '<p class="note">확정하면 공고가 <b>확정</b> 상태로 바뀌고, 선정 작가의 정산이 <b>행사 후 정산</b>으로 자동 생성됩니다.' + (picked.some(function (id) { return !I.hasTaxInfo(I.artist(id)); }) ? '<br>정산 정보를 아직 등록하지 않은 작가(' + picked.filter(function (id) { return !I.hasTaxInfo(I.artist(id)); }).map(function (id) { return I.artist(id).name; }).join(', ') + ')에게는 <b>정산 정보 요청</b>도 함께 보냅니다.' : '') + '</p></div></div>' +
        '<div class="mf"><button class="btn btn-o" data-close>취소</button><button class="btn btn-y" id="doConfirm"><i data-lucide="send"></i>확정하고 보내기</button></div>',
        function (m, close) {
          m.querySelector('.modal-card').classList.add('wide'); I.icons();
          $('#doConfirm', m).onclick = function () {
            var ch = { kakao: $('#cK', m).checked, email: $('#cE', m).checked };
            j.apps.forEach(function (p) {
              if (picked.indexOf(p.a) > -1) p.s = 'selected';
              else p.s = I.isRest(p.a) ? 'rest' : 'rejected';
            });
            j.status = 'confirmed';
            var sent = I.send('선정 안내', j.id, picked, ch, j.title).reduce(function (s, r) { return s + r.to.length; }, 0);
            if ($('#cR', m).checked && others.length) sent += I.send('미선정 안내', j.id, others, ch, j.title).reduce(function (s, r) { return s + r.to.length; }, 0);
            var noInfo = picked.filter(function (id) { return !I.hasTaxInfo(I.artist(id)); });
            if (noInfo.length) sent += I.send('정산 정보 요청', j.id, noInfo, ch, '첫 정산 전 정산 정보 등록 안내').reduce(function (s, r) { return s + r.to.length; }, 0);
            if ($('#cD', m).checked) db().logs.unshift({ at: I.stamp(), ch: 'kakao', type: '리마인드 예약', jid: j.id, to: picked, note: '행사 전날 10:00 발송 예정' });
            I.save(); close(); sideCounts(); renderTabs(); renderList(); renderDetail();
            I.toast('확정했어요. 알림 ' + sent + '건을 보냈습니다. (시안: 실제 발송은 개발 단계에서 연결)');
          };
        });
    }

    /* 새 공고 (견적 문의 → 공고) */
    function newJob(qid) {
      var d = db(), q = qid ? d.quotes.filter(function (x) { return x.id === qid; })[0] : null;
      var opt = function (arr, v, key, lab) { return arr.map(function (o) { var k = key ? o[key] : o, l = lab ? o[lab] : o; return '<option value="' + E(k) + '"' + (k === v ? ' selected' : '') + '>' + E(l) + '</option>'; }).join(''); };
      var dl = new Date(); dl.setDate(dl.getDate() + 7);
      var dls = dl.getFullYear() + '-' + ('0' + (dl.getMonth() + 1)).slice(-2) + '-' + ('0' + dl.getDate()).slice(-2);
      I.modal('<div class="mh"><h3>' + (q ? '견적 문의 → 공고 등록' : '새 공고 등록') + '</h3><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div>' +
        (q ? '<p class="demo"><i data-lucide="inbox"></i>' + E(q.client) + ' 견적 문의 (' + q.at + ') · ' + E(q.memo) + '</p>' : '') +
        '<form class="form" id="nj">' +
        '<div class="f2"><div class="fld"><label for="nj_t">행사명<i>*</i></label><input class="inp" id="nj_t" required value="' + (q ? E(q.client.split(' ')[0] + ' ' + I.skill(q.skill).n + ' 행사') : '') + '"></div>' +
        '<div class="fld"><label for="nj_c">업체<i>*</i></label><input class="inp" id="nj_c" required value="' + (q ? E(q.client) : '') + '"></div></div>' +
        '<div class="f3"><div class="fld"><label for="nj_s">프로그램<i>*</i></label><select class="sel" id="nj_s">' + opt(d.skills, q ? q.skill : 'caricature', 'k', 'n') + '</select></div>' +
        '<div class="fld"><label for="nj_r">지역<i>*</i></label><select class="sel" id="nj_r">' + opt(d.regions, q ? q.region : '서울') + '</select></div>' +
        '<div class="fld"><label for="nj_n">섭외 작가 수<i>*</i></label><input class="inp" id="nj_n" type="number" min="1" required value="' + (q ? q.need : 1) + '"></div></div>' +
        '<div class="f3"><div class="fld"><label for="nj_d1">시작일<i>*</i></label><input class="inp" id="nj_d1" type="date" required value="' + (q ? q.start : '') + '"></div>' +
        '<div class="fld"><label for="nj_d2">종료일</label><input class="inp" id="nj_d2" type="date" value="' + (q ? q.end : '') + '"></div>' +
        '<div class="fld"><label for="nj_tm">진행 시간<i>*</i></label><input class="inp" id="nj_tm" required placeholder="14:00~17:00" value="' + (q ? q.time : '') + '"></div></div>' +
        '<div class="fld"><label for="nj_p">장소<i>*</i></label><input class="inp" id="nj_p" required value="' + (q ? E(q.place) : '') + '"></div>' +
        '<div class="f3"><div class="fld"><label for="nj_f">업체 견적 금액</label><input class="inp" id="nj_f" type="number" min="0" step="10000" placeholder="원"></div>' +
        '<div class="fld"><label for="nj_dl">모집 마감일<i>*</i></label><input class="inp" id="nj_dl" type="date" required value="' + dls + '"></div>' +
        '<div class="fld"><span class="lb">선정 방식</span><div class="togs"><label class="tog"><input type="radio" name="nj_m" value="fcfs"' + (d.settings.defaultMode === 'fcfs' ? ' checked' : '') + '><span>선착순</span></label><label class="tog"><input type="radio" name="nj_m" value="pick"' + (d.settings.defaultMode === 'pick' ? ' checked' : '') + '><span>직접 선택</span></label></div></div></div>' +
        '<div class="fld" id="nj_cw"><span class="lb">캐리커처 종류</span><div class="togs"><label class="tog"><input type="radio" name="nj_c" value="0" checked><span>포인트(흑백)</span></label><label class="tog"><input type="radio" name="nj_c" value="1"><span>컬러</span></label></div><p class="help">A5·A4 사이즈는 같은 가격이에요.</p></div>' +
        '<p class="note" id="nj_info"></p>' +
        '<label class="ck"><input type="checkbox" id="nj_ph"' + (q && q.photoOk ? ' checked' : '') + '>고객이 현장 사진 홈페이지·SNS 홍보 활용에 동의함' + (q ? ' <small class="muted">(견적 문의 때 ' + (q.photoOk ? '동의' : '미동의') + ')</small>' : '') + '</label>' +
        '<label class="ck"><input type="checkbox" id="nj_a" ' + (d.settings.autoNotice ? 'checked' : '') + '>등록하면 기술·지역이 맞는 작가에게 공고 알림 보내기 (알림톡·메일)</label>' +
        '<div class="mf" style="margin-top:6px"><button type="button" class="btn btn-o" data-close>취소</button><button class="btn btn-y" type="submit"><i data-lucide="megaphone"></i>공고 등록</button></div></form>',
        function (m, close) {
          m.querySelector('.modal-card').classList.add('wide'); I.icons();
          var info = function () {
            var sk = $('#nj_s', m).value, rg = $('#nj_r', m).value, n = +$('#nj_n', m).value || 1;
            var t = I.targets({ skill: sk, region: rg }), d1 = $('#nj_d1', m).value, d2 = $('#nj_d2', m).value || d1;
            var tm = ($('#nj_tm', m).value.match(/(\d+):(\d+)\s*~\s*(\d+):(\d+)/) || []);
            var h = tm.length ? ((+tm[3] * 60 + +tm[4]) - (+tm[1] * 60 + +tm[2])) / 60 : 3;
            var dd = d1 ? I.days(d1, d2) : 1, per = Math.round(I.unitPrice(sk, h) * dd * db().settings.share / 100 / 1000) * 1000;
            var col = sk === 'caricature' && $('input[name=nj_c]:checked', m).value === '1'; $('#nj_cw', m).hidden = sk !== 'caricature';
            var fee = +$('#nj_f', m).value || I.quoteFee(sk, h, n, dd, col); $('#nj_f', m).placeholder = I.won(I.quoteFee(sk, h, n, dd, col)) + ' (단가표 기준)';
            $('#nj_info', m).innerHTML = '알림 대상 작가 <b>' + t.length + '명</b> (' + I.skill(sk).n + ' · ' + rg + ') · 업체 견적 <b>' + I.won(fee) + '</b> · 작가 1인 <b>' + I.won(Math.round(fee / n * db().settings.share / 100 / 1000) * 1000) + '</b> (' + db().settings.share + '%) · 회사 몫 <b>' + I.won(fee - Math.round(fee / n * db().settings.share / 100 / 1000) * 1000 * n) + '</b>';
            return { h: h, per: per };
          };
          $$('input,select', m).forEach(function (el) { el.addEventListener('input', info); el.addEventListener('change', info); });
          info();
          $('#nj', m).onsubmit = function (e) {
            e.preventDefault();
            var r = info(), id = 'j' + (Date.now() % 1e6);
            var d1 = $('#nj_d1', m).value, d2 = $('#nj_d2', m).value || d1;
            if (d2 < d1) { I.toast('종료일이 시작일보다 빠릅니다.'); return; }
            var j = { id: id, title: $('#nj_t', m).value, client: $('#nj_c', m).value, skill: $('#nj_s', m).value, start: d1, end: d2, time: $('#nj_tm', m).value.replace(/\s/g, ''), hours: Math.max(1, Math.round(r.h * 10) / 10),
              place: $('#nj_p', m).value, region: $('#nj_r', m).value, need: +$('#nj_n', m).value || 1, mode: $('input[name=nj_m]:checked', m).value, status: 'open', posted: I.stamp(), deadline: $('#nj_dl', m).value + ' 18:00',
              color: $('#nj_s', m).value === 'caricature' && $('input[name=nj_c]:checked', m).value === '1', photoOk: $('#nj_ph', m).checked, fee: +$('#nj_f', m).value || I.quoteFee($('#nj_s', m).value, r.h, +$('#nj_n', m).value || 1, I.days(d1, d2), $('#nj_s', m).value === 'caricature' && $('input[name=nj_c]:checked', m).value === '1'), apps: [] };
            db().jobs.push(j);
            if (q) db().quotes = db().quotes.filter(function (x) { return x.id !== q.id; });
            var n = 0;
            if ($('#nj_a', m).checked) n = I.send('공고 알림', j.id, I.targets(j), db().settings.channels, I.skill(j.skill).n + ' · ' + j.region).reduce(function (s, x) { return s + x.to.length; }, 0);
            I.save(); close(); cur = id; filter = 'all'; location.hash = id; sideCounts(); renderTabs(); renderList(); renderDetail();
            I.toast('공고를 등록했어요.' + (n ? ' 작가 알림 ' + n + '건을 보냈습니다.' : ''));
          };
        });
    }

    function route() {
      var h = location.hash.slice(1);
      if (/^new-/.test(h)) { history.replaceState(null, '', location.pathname); newJob(h.slice(4)); return; }
      if (h && I.job(h)) cur = h;
      if (!cur) { var r = db().jobs.filter(function (j) { return j.status === 'review'; })[0] || db().jobs.filter(function (j) { return j.status === 'open'; })[0]; cur = r && r.id; }
      renderList(); renderDetail();
    }
    $('#jobTabs').addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (!b) return; filter = b.dataset.f; renderTabs(); renderList(); });
    $('#jobList').addEventListener('click', function (e) {
      var b = e.target.closest('[data-j]'), q = e.target.closest('[data-q]');
      if (q) { newJob(q.dataset.q); return; }
      if (!b) return; cur = b.dataset.j; history.replaceState(null, '', '#' + cur); renderList(); renderDetail();
      if (innerWidth < 900) $('#jobDetail').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#newJob').onclick = function () { newJob(null); };
    addEventListener('hashchange', route);
    renderTabs(); route();
  }

  /* =========================================================
     작가 관리
     ========================================================= */
  function artists() {
    var d = db(), st = { q: '', skill: '', region: '', status: '' };
    $('#fSkill').innerHTML = '<option value="">기술 전체</option>' + d.skills.map(function (s) { return '<option value="' + s.k + '">' + s.n + '</option>'; }).join('');
    $('#fRegion').innerHTML = '<option value="">지역 전체</option>' + d.regions.map(function (r) { return '<option>' + r + '</option>'; }).join('');

    document.addEventListener('iux-review', function () { render(); });
    function render() {
      var list = db().artists.filter(function (a) {
        if (st.q && (a.name + a.phone + a.email).indexOf(st.q) < 0) return false;
        if (st.skill && !a.skills.some(function (s) { return s.k === st.skill; })) return false;
        if (st.region && a.regions.indexOf(st.region) < 0) return false;
        if (st.status === 'rest') return a.status === 'active' && I.isRest(a.id);
        if (st.status && a.status !== st.status) return false;
        return true;
      }).sort(function (a, b) { return (a.status === 'pending' ? -1 : 0) - (b.status === 'pending' ? -1 : 0) || I.count(b.id) - I.count(a.id); });
      $('#artCount').textContent = list.length;
      $('#artBody').innerHTML = list.length ? list.map(function (a) {
        var rest = a.status === 'active' && I.isRest(a.id);
        var earn = I.settlements().filter(function (r) { return r.artist.id === a.id; }).reduce(function (s, r) { return s + r.gross; }, 0);
        return '<tr class="click ' + (a.status === 'pending' ? 'pend' : rest ? 'rest' : '') + '" data-a="' + a.id + '" tabindex="0">' +
          '<td><div class="who">' + I.avatar(a) + '<div><b>' + E(a.name) + '</b><small>' + E(a.phone) + '</small></div></div></td>' +
          '<td class="num">만 ' + I.age(a.birth) + '세</td>' +
          '<td><div class="chips">' + I.skillChips(a) + '</div></td>' +
          '<td>' + a.regions.map(E).join(', ') + '</td>' +
          '<td class="r">' + I.count(a.id) + '회</td>' +
          '<td class="r">' + (I.streak(a.id) ? '<span class="' + (rest ? 'warn-t' : '') + '">' + I.streak(a.id) + '회</span>' : '-') + '</td>' +
          '<td class="r">' + (earn ? I.won(earn) : '-') + '</td>' +
          '<td class="c">' + (I.rating(a) ? '★ ' + I.rating(a) + (I.reviewsOf(a.id).length ? ' <small class="muted">(' + I.reviewsOf(a.id).length + ')</small>' : '') : '-') + '</td>' +
          '<td>' + (rest ? '<span class="badge st-rest">휴식 대상</span>' : I.badge(I.ART_STATE, a.status)) + '</td></tr>';
      }).join('') : '<tr><td colspan="9"><div class="empty-s">조건에 맞는 작가가 없어요.</div></td></tr>';
      var pend = db().artists.filter(function (a) { return a.status === 'pending'; }).length;
      $('#pendNote').hidden = !pend;
      $('#pendN').textContent = pend;
    }

    function revBlock(a) {
      var R = I.reviewsOf(a.id), wait = I.needReview().filter(function (x) { return x.a.id === a.id; });
      var avg = function (k) { return R.length ? Math.round(R.reduce(function (s, r) { return s + r.s[k]; }, 0) / R.length * 10) / 10 : 0; };
      var re = { yes: 0, ok: 0, no: 0 }; R.forEach(function (r) { re[r.rehire]++; });
      return '<p class="sec-t"><i data-lucide="star"></i>운영자 평가 <small class="muted" style="font-weight:500">작가에게 공개되지 않아요</small></p>' +
        (R.length ? '<div class="rv-sum"><div class="big"><b>' + I.rating(a) + '</b>' + I.stars(I.rating(a)) + '<small>평가 ' + R.length + '건 · 재섭외 추천 ' + re.yes + ' · 보류 ' + re.no + '</small></div>' +
          '<div class="rv-bars">' + I.CRIT.map(function (c) { var v = avg(c[0]); return '<div class="hb"><span>' + c[1] + '</span><span class="tr"><i style="width:' + v / 5 * 100 + '%"></i></span><b>' + v + '</b></div>'; }).join('') + '</div></div>' +
          '<div class="list" style="margin-top:8px">' + R.map(function (r) { var j = I.job(r.job); return '<div class="li rv-li"><span class="t"><b>' + E(j ? j.title : '-') + '</b><small>' + (j ? I.period(j) : '') + ' · ' + I.stars(I.revAvg(r)) + ' ' + I.badge(I.REHIRE, r.rehire) + '</small>' + (r.tags.length ? '<small>' + r.tags.map(E).join(' · ') + '</small>' : '') + (r.note ? '<small class="memo">' + E(r.note) + '</small>' : '') + '</span><button class="btn btn-o btn-s" data-revp="' + r.job + '">수정</button></div>'; }).join('') + '</div>'
        : '<p class="muted">아직 평가가 없어요.</p>') +
        (wait.length ? '<div class="list" style="margin-top:8px">' + wait.map(function (x) { return '<div class="li"><span class="t"><b>' + E(x.j.title) + '</b><small>' + I.period(x.j) + ' · 평가 대기</small></span><button class="btn btn-y btn-s" data-revp="' + x.j.id + '"><i data-lucide="star"></i>평가하기</button></div>'; }).join('') + '</div>' : '');
    }
    function profile(id) {
      var a = I.artist(id); if (!a) return;
      var hist = I.history(a.id), S = I.settlements().filter(function (r) { return r.artist.id === a.id; });
      var paid = S.filter(function (r) { return r.state === 'paid'; }).reduce(function (s, r) { return s + r.net; }, 0);
      var due = S.filter(function (r) { return r.state !== 'paid'; }).reduce(function (s, r) { return s + r.net; }, 0);
      var rest = a.status === 'active' && I.isRest(a.id);
      I.modal('<div class="mh"><div class="prof">' + I.avatar(a, 'lg') + '<div><h3>' + E(a.name) + ' ' + (rest ? '<span class="badge st-rest">휴식 대상</span>' : I.badge(I.ART_STATE, a.status)) + '</h3><p class="muted">만 ' + I.age(a.birth) + '세 (' + a.birth.slice(0, 4) + '년생) · 가입 ' + a.joined + '</p></div></div><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div>' +
        '<div class="grid g4" style="gap:8px"><div class="card kpi" style="padding:12px"><p class="k">총 참여</p><p class="v" style="font-size:22px">' + I.count(a.id) + '<small>회</small></p></div><div class="card kpi" style="padding:12px"><p class="k">현재 연속</p><p class="v" style="font-size:22px">' + I.streak(a.id) + '<small>회</small></p></div><div class="card kpi" style="padding:12px"><p class="k">지급 완료</p><p class="v" style="font-size:18px">' + I.won(paid) + '</p></div><div class="card kpi" style="padding:12px"><p class="k">지급 예정</p><p class="v" style="font-size:18px">' + I.won(due) + '</p></div></div>' +
        '<p class="sec-t"><i data-lucide="sparkles"></i>기술·경력 <small class="muted" style="font-weight:500">시작 연도 기준, 해가 바뀌면 연차가 자동으로 올라가요</small></p><div class="chips">' + a.skills.map(function (s) { return '<span class="chip">' + I.skill(s.k).n + ' <b>' + I.years(s.since) + '년차</b> <span class="muted">(' + s.since + '~)</span></span>'; }).join('') + '</div>' +
        '<div class="grid g2" style="gap:8px;margin-top:6px"><div><p class="sec-t"><i data-lucide="map-pin"></i>활동 지역</p><p>' + a.regions.join(', ') + '</p></div><div><p class="sec-t"><i data-lucide="phone"></i>연락처</p><p class="num">' + E(a.phone) + ' · ' + E(a.email) + '</p><p class="muted" style="font-size:12px">알림톡 ' + (a.kakao ? '수신' : '거부') + ' · 메일 ' + (a.mail ? '수신' : '거부') + '</p></div></div>' +
        '<p class="sec-t"><i data-lucide="image"></i>포트폴리오</p><div class="port">' + (a.portfolio.length ? a.portfolio.map(function (p) { return '<img src="' + (p.indexOf('data:') === 0 ? p : '../images/' + p + '.jpg') + '" alt="' + E(a.name) + ' 포트폴리오">'; }).join('') : '<p class="empty">등록된 포트폴리오가 없어요.</p>') + '</div>' +
        '<p class="sec-t"><i data-lucide="quote"></i>소개</p><p>' + E(a.bio) + '</p>' +
        '<p class="sec-t"><i data-lucide="landmark"></i>정산 정보</p><p>' + (a.tax === 'freelancer' ? '프리랜서 (사업소득 ' + db().settings.taxRate + '% 원천징수)' : '개인사업자 (세금계산서 발행)') + ' · ' + E(a.bank) + ' ' + E(a.account) + '</p>' +
        (I.hasTaxInfo(a) ? '<p class="num" style="margin-top:4px">' + (a.taxInfo.kind === 'rrn' ? '주민등록번호 <b>' + E(a.taxInfo.masked) + '</b>' + (a.taxInfo.foreign ? ' (외국인 · ' + E(a.taxInfo.visa || '') + ')' : '') : '사업자등록번호 <b>' + E(a.taxInfo.bizNo) + '</b> · ' + E(a.taxInfo.bizName) + ' · 계산서 ' + E(a.taxInfo.invoiceMail)) + ' <span class="muted">· 등록 ' + a.taxInfo.at + '</span></p><p class="note" style="margin-top:4px"><i data-lucide="lock" style="width:12px;height:12px;vertical-align:-1px"></i> 암호화 저장 · 전체 번호는 정산 담당 권한만 열람(열람 기록 남김)</p>'
          : '<p class="demo" style="margin:8px 0 0;background:var(--bad-bg);color:var(--bad)"><i data-lucide="id-card"></i>' + (a.tax === 'business' ? '사업자등록번호' : '주민등록번호') + ' 미등록 · 등록 전까지 지급이 보류됩니다. <button class="btn btn-o btn-s" data-act="askinfo" style="margin-left:auto">등록 요청 보내기</button></p>') +
        revBlock(a) +
        '<p class="sec-t"><i data-lucide="history"></i>참여 이력</p>' + (hist.length ? '<div class="list">' + hist.map(function (j) { var p = j.apps.filter(function (x) { return x.a === a.id; })[0]; return '<div class="li"><span class="t"><b>' + E(j.title) + '</b><small>' + I.period(j) + ' · ' + I.skill(j.skill).n + '</small></span>' + appState(p, j) + '</div>'; }).join('') + '</div>' : '<p class="muted">아직 신청 이력이 없어요.</p>') +
        '<div class="mf">' + (a.status === 'pending' ? '<button class="btn btn-o" data-act="reject">반려</button><button class="btn btn-y" data-act="approve"><i data-lucide="check"></i>승인하고 알림 보내기</button>'
          : a.status === 'active' ? '<button class="btn btn-o" data-act="pause">활동 중지</button>' + (rest ? '<button class="btn btn-k" data-act="unrest">휴식 해제</button>' : '') + '<button class="btn btn-y" data-close>닫기</button>'
          : '<button class="btn btn-y" data-act="resume">활동 재개</button>') + '</div>',
        function (m, close) {
          m.querySelector('.modal-card').classList.add('wide'); I.icons();
          $$('[data-revp]', m).forEach(function (b) { b.onclick = function () { close(); reviewModal(b.dataset.revp, id, function () { profile(id); }); }; });
          $$('[data-act]', m).forEach(function (b) {
            b.onclick = function () {
              var act = b.dataset.act;
              if (act === 'approve') { a.status = 'active'; I.send('작가 승인', '', [a.id], db().settings.channels, '작가 등록 승인 · 공고 알림 수신 시작'); I.toast(a.name + ' 작가를 승인하고 안내를 보냈어요.'); }
              if (act === 'reject') { db().artists = db().artists.filter(function (x) { return x.id !== a.id; }); I.toast('등록 신청을 반려했어요.'); }
              if (act === 'pause') { a.status = 'paused'; I.toast('활동을 중지했어요. 공고 알림이 가지 않습니다.'); }
              if (act === 'resume') { a.status = 'active'; I.toast('활동을 재개했어요.'); }
              if (act === 'askinfo') { I.send('정산 정보 요청', '', [a.id], db().settings.channels, '정산 정보 등록 안내'); I.toast(a.name + ' 작가에게 정산 정보 등록 요청을 보냈어요.'); }
              if (act === 'unrest') {
                /* 가장 최근 확정 1건을 끊어 연속을 초기화 (운영자 재량) */
                db().jobs.push({ id: 'r' + Date.now() % 1e6, title: '휴식 해제(운영자)', client: '-', skill: a.skills[0].k, start: I.today, end: I.today, time: '-', hours: 0, place: '-', region: a.regions[0], need: 0, mode: 'pick', status: 'done', posted: I.stamp(), deadline: I.stamp(), fee: 0, hidden: true, apps: [{ a: a.id, at: I.stamp(), s: 'rest' }] });
                I.toast(a.name + ' 작가의 연속 횟수를 초기화했어요.');
              }
              I.save(); close(); sideCounts(); render();
            };
          });
        });
    }

    $('#q').addEventListener('input', function (e) { st.q = e.target.value.trim(); render(); });
    $('#fSkill').onchange = function (e) { st.skill = e.target.value; render(); };
    $('#fRegion').onchange = function (e) { st.region = e.target.value; render(); };
    $('#fStatus').onchange = function (e) { st.status = e.target.value; render(); };
    $('#artBody').addEventListener('click', function (e) { var r = e.target.closest('[data-a]'); if (r) profile(r.dataset.a); });
    $('#artBody').addEventListener('keydown', function (e) { var r = e.target.closest('[data-a]'); if (r && e.key === 'Enter') profile(r.dataset.a); });
    $('#pendNote').onclick = function () { $('#fStatus').value = 'pending'; st.status = 'pending'; render(); };
    render();
    var h = location.hash.slice(1); if (h && I.artist(h)) profile(h);
  }

  /* =========================================================
     알림 전송
     ========================================================= */
  var TPL = [
    { k: '공고 알림', icon: 'megaphone', body: '[IUX ART] 새 공고 안내\n\n#{작가명} 작가님, 참여 가능한 행사가 올라왔어요.\n\n■ 행사: #{행사명}\n■ 일정: #{기간} #{시간}\n■ 지역: #{지역}\n■ 모집: #{인원}명 (#{선정방식})\n■ 지급: #{지급액} (세전)\n\n마감: #{마감일}', btn: '공고 보고 신청하기' },
    { k: '선정 안내', icon: 'party-popper', body: '[IUX ART] 행사 선정 안내\n\n#{작가명} 작가님, 신청하신 행사에 선정되었습니다.\n\n■ 행사: #{행사명}\n■ 일정: #{기간} #{시간}\n■ 장소: #{장소}\n■ 지급 예정: #{지급액} (세전)\n\n행사 시작 30분 전까지 도착 부탁드립니다.', btn: '일정 확인하기' },
    { k: '미선정 안내', icon: 'mail-x', body: '[IUX ART] 선정 결과 안내\n\n#{작가명} 작가님, 신청해 주셔서 감사합니다.\n이번 #{행사명}은 모집 인원이 마감되었습니다.\n다음 공고에서 꼭 함께해요.', btn: '다른 공고 보기' },
    { k: '행사 리마인드', icon: 'alarm-clock', body: '[IUX ART] 내일 행사 안내\n\n#{작가명} 작가님, 내일 행사가 있어요.\n\n■ #{행사명}\n■ #{시간} · #{장소}\n\n준비물과 도착 시간을 한 번 더 확인해 주세요.', btn: '행사 정보 보기' },
    { k: '정산 완료', icon: 'wallet', body: '[IUX ART] 정산 완료 안내\n\n#{작가명} 작가님, 정산금이 입금되었습니다.\n\n■ 행사: #{행사명}\n■ 지급액: #{지급액}\n■ 원천징수: #{세액}\n■ 실지급액: #{실지급액}\n\n수고하셨습니다.', btn: '정산 내역 보기' },
    { k: '정산 정보 요청', icon: 'id-card', body: '[IUX ART] 정산 정보 등록 안내\n\n#{작가명} 작가님, 선정을 축하드립니다.\n정산금을 지급하려면 정산 정보 등록이 필요해요.\n\n■ 프리랜서: 주민등록번호 (3.3% 원천징수·지급명세서 제출용)\n■ 개인사업자: 사업자등록번호\n\n입력하신 정보는 암호화해 보관하며, 세무 신고 외에는 쓰지 않습니다.', btn: '정산 정보 등록하기' },
    { k: '작가 승인', icon: 'user-check', body: '[IUX ART] 작가 등록 승인\n\n#{작가명} 작가님, 등록이 승인되었습니다.\n이제 기술·지역에 맞는 공고 알림을 받아 보실 수 있어요.', btn: '작가 포털 열기' }
  ];
  function notify() {
    var d = db(), tpl = 0, chf = '';
    function sample(s) {
      var j = d.jobs.filter(function (x) { return x.status === 'open'; })[0] || d.jobs[0], a = I.artist(j.apps[0] ? j.apps[0].a : 'a1') || d.artists[0];
      var per = I.artistPay(j), tax = Math.floor(per * d.settings.taxRate / 1000) * 10;
      var v = { '작가명': a.name, '행사명': j.title, '기간': I.period(j), '시간': j.time, '지역': j.region, '장소': j.place, '인원': j.need, '선정방식': j.mode === 'fcfs' ? '선착순' : '운영자 선정', '지급액': I.won(per), '세액': I.won(tax), '실지급액': I.won(per - tax), '마감일': j.deadline };
      return s.replace(/#\{(.+?)\}/g, function (_, k) { return v[k] != null ? v[k] : _; });
    }
    function renderTpl() {
      $('#tplList').innerHTML = TPL.map(function (t, i) { return '<button class="tab' + (i === tpl ? ' on' : '') + '" data-t="' + i + '"><i data-lucide="' + t.icon + '" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px"></i>' + t.k + '</button>'; }).join('');
      var t = TPL[tpl], body = sample(t.body);
      $('#tplPrev').innerHTML = '<div class="grid g2"><div><p class="sec-t" style="margin-top:0"><span class="ch-k">알림톡</span> 미리보기</p><div class="kakao"><p class="from">IUX ART</p><div class="bub"><p class="bt">알림톡 도착</p><p class="bb">' + E(body) + '</p><span class="bl">' + t.btn + '</span></div></div></div>' +
        '<div><p class="sec-t" style="margin-top:0"><span class="ch-e">메일</span> 미리보기</p><div class="mail"><p class="mt"><b>보낸 사람</b> IUX ART &lt;noreply@iux.kr&gt;<br><b>제목</b> ' + E(body.split('\n')[0]) + '</p><p class="mb">' + E(body.split('\n').slice(2).join('\n')) + '</p></div>' +
        '<p class="sec-t">템플릿 원문 <small class="muted" style="font-weight:500">#{변수}는 보낼 때 자동으로 바뀝니다</small></p><div class="fld"><textarea readonly aria-label="템플릿 원문" style="height:150px">' + E(t.body) + '</textarea></div></div></div>';
      I.icons();
    }
    function renderLog() {
      var rows = db().logs.filter(function (l) { return !chf || l.ch === chf; });
      $('#logBody').innerHTML = rows.map(function (l) {
        var names = l.to.map(function (id) { var a = I.artist(id); return a ? a.name : id; });
        return '<tr><td class="num">' + l.at + '</td><td>' + chTag(l.ch) + '</td><td><b>' + E(l.type) + '</b></td><td>' + E(l.note) + '</td><td>' + E(names.slice(0, 4).join(', ')) + (names.length > 4 ? ' 외 ' + (names.length - 4) + '명' : '') + '</td><td class="r">' + l.to.length + '명</td><td><span class="badge ' + (/예약/.test(l.type) ? 'st-open">예약' : 'st-ok">발송 완료') + '</span></td></tr>';
      }).join('');
      var k = db().logs.filter(function (l) { return l.ch === 'kakao'; }).reduce(function (s, l) { return s + l.to.length; }, 0);
      var e = db().logs.filter(function (l) { return l.ch === 'email'; }).reduce(function (s, l) { return s + l.to.length; }, 0);
      $('#logKpi').innerHTML = '<div class="card kpi"><p class="k"><span class="ch-k">알림톡</span></p><p class="v">' + k + '<small>건</small></p><p class="s">누적 발송</p></div><div class="card kpi"><p class="k"><span class="ch-e">메일</span></p><p class="v">' + e + '<small>건</small></p><p class="s">누적 발송</p></div>' +
        '<div class="card kpi"><p class="k">알림톡 수신 작가</p><p class="v">' + db().artists.filter(function (a) { return a.kakao && a.status === 'active'; }).length + '<small>명</small></p></div><div class="card kpi"><p class="k">메일 수신 작가</p><p class="v">' + db().artists.filter(function (a) { return a.mail && a.status === 'active'; }).length + '<small>명</small></p></div>';
    }
    $('#tplList').addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) { tpl = +b.dataset.t; renderTpl(); } });
    $('#logTabs').addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (!b) return; chf = b.dataset.c; $$('[data-c]').forEach(function (x) { x.classList.toggle('on', x === b); }); renderLog(); });
    $('#manualSend').onclick = function () {
      I.modal('<div class="mh"><h3>직접 보내기</h3><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div><form class="form" id="ms">' +
        '<div class="fld"><label for="ms_t">템플릿</label><select class="sel" id="ms_t">' + TPL.map(function (t, i) { return '<option value="' + i + '">' + t.k + '</option>'; }).join('') + '</select></div>' +
        '<div class="fld"><label for="ms_s">받는 작가</label><select class="sel" id="ms_s"><option value="">활동 중인 작가 전체</option>' + d.skills.map(function (s) { return '<option value="' + s.k + '">' + s.n + ' 작가</option>'; }).join('') + '</select></div>' +
        '<div class="togs"><label class="tog"><input type="checkbox" id="ms_k" checked><span>알림톡</span></label><label class="tog"><input type="checkbox" id="ms_e" checked><span>메일</span></label></div>' +
        '<p class="note" id="ms_n"></p><div class="mf"><button type="button" class="btn btn-o" data-close>취소</button><button class="btn btn-y"><i data-lucide="send"></i>보내기</button></div></form>',
        function (m, close) {
          I.icons();
          var tgt = function () { var s = $('#ms_s', m).value; return db().artists.filter(function (a) { return a.status === 'active' && (!s || a.skills.some(function (x) { return x.k === s; })); }).map(function (a) { return a.id; }); };
          var n = function () { $('#ms_n', m).textContent = '대상 ' + tgt().length + '명 · 수신 거부한 채널은 자동으로 빠집니다.'; };
          $('#ms_s', m).onchange = n; n();
          $('#ms', m).onsubmit = function (e) {
            e.preventDefault();
            var r = I.send(TPL[+$('#ms_t', m).value].k, '', tgt(), { kakao: $('#ms_k', m).checked, email: $('#ms_e', m).checked }, '운영자 직접 발송');
            I.save(); close(); renderLog(); I.toast('알림 ' + r.reduce(function (s, x) { return s + x.to.length; }, 0) + '건을 보냈어요. (시안)');
          };
        });
    };
    renderTpl(); renderLog();
  }

  /* =========================================================
     정산
     ========================================================= */
  function settlement() {
    var month = '', state = '', group = false;
    var all = function () { return I.settlements(); };
    function months() {
      var s = {}; all().forEach(function (r) { s[r.job.start.slice(0, 7)] = 1; });
      return Object.keys(s).sort().reverse();
    }
    $('#fMonth').innerHTML = '<option value="">전체 기간</option>' + months().map(function (m) { return '<option value="' + m + '">' + m.replace('-', '년 ') + '월</option>'; }).join('');
    function rows() { return all().filter(function (r) { return (!month || r.job.start.slice(0, 7) === month) && (!state || r.state === state); }); }
    function render() {
      var R = rows(), A = all().filter(function (r) { return !month || r.job.start.slice(0, 7) === month; });
      var sum = function (arr, k) { return arr.reduce(function (s, r) { return s + r[k]; }, 0); };
      $('#setKpi').innerHTML =
        '<div class="card kpi"><p class="k"><i data-lucide="banknote"></i>지급 총액(세전)</p><p class="v">' + I.man(sum(A, 'gross')) + '<small>원</small></p><p class="s">' + A.length + '건</p></div>' +
        '<div class="card kpi"><p class="k"><i data-lucide="receipt"></i>원천징수 합계</p><p class="v">' + I.man(sum(A, 'tax')) + '<small>원</small></p><p class="s">사업소득 ' + db().settings.taxRate + '% (소득세 3% + 지방세 0.3%)</p></div>' +
        '<div class="card kpi"><p class="k"><i data-lucide="check-circle-2"></i>지급 완료</p><p class="v">' + I.man(sum(A.filter(function (r) { return r.state === 'paid'; }), 'net')) + '<small>원</small></p><p class="s">실지급액</p></div>' +
        '<div class="card kpi hl"><p class="k"><i data-lucide="hourglass"></i>지급 대기</p><p class="v">' + I.man(sum(A.filter(function (r) { return r.state === 'due'; }), 'net')) + '<small>원</small></p><p class="s">행사 완료 · 미지급' + (A.some(function (r) { return r.state === 'needinfo'; }) ? ' · 정보 미등록 ' + A.filter(function (r) { return r.state === 'needinfo'; }).length + '건 보류' : '') + '</p></div>';
      if (group) {
        var g = {};
        R.forEach(function (r) { var k = r.artist.id; g[k] = g[k] || { a: r.artist, n: 0, gross: 0, tax: 0, net: 0, due: 0 }; g[k].n++; g[k].gross += r.gross; g[k].tax += r.tax; g[k].net += r.net; if (r.state === 'due') g[k].due += r.net; });
        var G = Object.keys(g).map(function (k) { return g[k]; }).sort(function (a, b) { return b.gross - a.gross; });
        $('#setHead').innerHTML = '<tr><th>작가</th><th>소득 유형</th><th>지급 계좌</th><th class="r">건수</th><th class="r">지급 총액</th><th class="r">원천징수</th><th class="r">실지급액</th><th class="r">지급 대기</th></tr>';
        $('#setBody').innerHTML = G.map(function (x) { return '<tr><td><div class="who">' + I.avatar(x.a) + '<b>' + E(x.a.name) + '</b></div></td><td>' + (x.a.tax === 'freelancer' ? '프리랜서 3.3%' : '사업자(세금계산서)') + '</td><td class="num">' + E(x.a.bank + ' ' + x.a.account) + '</td><td class="r">' + x.n + '</td><td class="r">' + I.won(x.gross) + '</td><td class="r">' + I.won(x.tax) + '</td><td class="r"><b>' + I.won(x.net) + '</b></td><td class="r">' + (x.due ? '<span class="warn-t">' + I.won(x.due) + '</span>' : '-') + '</td></tr>'; }).join('');
        $('#setFoot').innerHTML = '<tr><td colspan="4">합계</td><td class="r">' + I.won(sum(G, 'gross')) + '</td><td class="r">' + I.won(sum(G, 'tax')) + '</td><td class="r">' + I.won(sum(G, 'net')) + '</td><td class="r">' + I.won(sum(G, 'due')) + '</td></tr>';
      } else {
        $('#setHead').innerHTML = '<tr><th class="c" style="width:40px"><input type="checkbox" id="chkAll" aria-label="지급 대기 전체 선택"></th><th>행사</th><th>작가</th><th class="r">근무</th><th class="r">1인 견적</th><th class="r">작가 몫</th><th class="r">교통비</th><th class="r">지급 총액</th><th class="r">원천징수</th><th class="r">실지급액</th><th>상태</th></tr>';
        $('#setBody').innerHTML = R.length ? R.map(function (r) {
          return '<tr><td class="c">' + (r.state === 'due' ? '<input type="checkbox" class="sp" value="' + r.key + '" aria-label="지급 선택">' : r.state === 'needinfo' ? '<button class="x" data-ask="' + r.artist.id + '" title="정산 정보 등록 요청" aria-label="정산 정보 등록 요청"><i data-lucide="send"></i></button>' : '') + '</td>' +
            '<td><b>' + E(r.job.title) + '</b><br><small class="muted num">' + I.period(r.job) + ' · ' + I.skill(r.job.skill).n + '</small></td>' +
            '<td><div class="who">' + I.avatar(r.artist) + '<div><b>' + E(r.artist.name) + '</b><small>' + (r.artist.tax === 'freelancer' ? '프리랜서' : '사업자') + '</small></div></div></td>' +
            '<td class="r">' + r.days + '일 × ' + r.hours + 'h</td><td class="r">' + I.won(r.rate) + '</td><td class="r">' + I.won(r.pay) + '</td><td class="r">' + (r.transport ? I.won(r.transport) : '-') + '</td>' +
            '<td class="r">' + I.won(r.gross) + '</td><td class="r">' + (r.tax ? '-' + I.won(r.tax) : '<small class="muted">계산서</small>') + '</td><td class="r"><b>' + I.won(r.net) + '</b></td>' +
            '<td>' + I.badge(I.PAY_STATE, r.state) + (r.paidAt ? '<br><small class="muted num">' + r.paidAt + '</small>' : '') + '</td></tr>';
        }).join('') : '<tr><td colspan="11"><div class="empty-s">정산 내역이 없어요.</div></td></tr>';
        $('#setFoot').innerHTML = R.length ? '<tr><td colspan="5">합계 (' + R.length + '건)</td><td class="r">' + I.won(sum(R, 'pay')) + '</td><td class="r">' + I.won(sum(R, 'transport')) + '</td><td class="r">' + I.won(sum(R, 'gross')) + '</td><td class="r">-' + I.won(sum(R, 'tax')) + '</td><td class="r">' + I.won(sum(R, 'net')) + '</td><td></td></tr>' : '';
        var ca = $('#chkAll');
        if (ca) ca.onchange = function () { $$('.sp').forEach(function (c) { c.checked = ca.checked; }); selN(); };
        $$('.sp').forEach(function (c) { c.onchange = selN; });
      }
      selN(); I.icons();
    }
    function selN() {
      var sel = $$('.sp:checked').map(function (c) { return c.value; });
      var amt = all().filter(function (r) { return sel.indexOf(r.key) > -1; }).reduce(function (s, r) { return s + r.net; }, 0);
      $('#paySel').disabled = !sel.length;
      $('#paySel').innerHTML = '<i data-lucide="check"></i>' + (sel.length ? sel.length + '건 지급 완료 처리 · ' + I.won(amt) : '선택한 정산 지급 완료');
      I.icons();
    }
    $('#setBody').addEventListener('click', function (e) {
      var b = e.target.closest('[data-ask]'); if (!b) return;
      var a = I.artist(b.dataset.ask);
      I.send('정산 정보 요청', '', [a.id], db().settings.channels, '정산 정보 등록 안내'); I.save();
      I.toast(a.name + ' 작가에게 정산 정보 등록 요청을 보냈어요.');
    });
    $('#fMonth').onchange = function (e) { month = e.target.value; render(); };
    $('#fState').onchange = function (e) { state = e.target.value; render(); };
    $('#grp').addEventListener('click', function (e) { var b = e.target.closest('[data-g]'); if (!b) return; group = b.dataset.g === '1'; $$('[data-g]').forEach(function (x) { x.classList.toggle('on', x === b); }); render(); });
    $('#paySel').onclick = function () {
      var sel = $$('.sp:checked').map(function (c) { return c.value; });
      if (!sel.length) return;
      var R = all().filter(function (r) { return sel.indexOf(r.key) > -1; });
      I.modal('<div class="mh"><h3>지급 완료 처리</h3><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div>' +
        '<p>' + R.length + '건 · 실지급액 <b>' + I.won(R.reduce(function (s, r) { return s + r.net; }, 0)) + '</b>을 지급 완료로 바꿉니다.</p>' +
        '<div class="list" style="margin-top:10px">' + R.map(function (r) { return '<div class="li"><span class="t"><b>' + E(r.artist.name) + ' · ' + E(r.job.title) + '</b><small>' + E(r.artist.bank + ' ' + r.artist.account) + '</small></span><b class="num">' + I.won(r.net) + '</b></div>'; }).join('') + '</div>' +
        '<label class="ck" style="margin-top:14px"><input type="checkbox" id="pn" checked>작가에게 정산 완료 알림 보내기 (알림톡·메일)</label>' +
        '<p class="note">실제 이체는 은행 대량이체(CMS) 또는 펌뱅킹 연동으로 처리하고, 원천징수 내역은 다음 달 10일까지 신고합니다.</p>' +
        '<div class="mf"><button class="btn btn-o" data-close>취소</button><button class="btn btn-y" id="doPay"><i data-lucide="check"></i>지급 완료</button></div>',
        function (m, close) {
          I.icons();
          $('#doPay', m).onclick = function () {
            R.forEach(function (r) { db().paid[r.key] = I.today; });
            if ($('#pn', m).checked) {
              var by = {}; R.forEach(function (r) { by[r.artist.id] = 1; });
              I.send('정산 완료', '', Object.keys(by), db().settings.channels, R.length + '건 정산 입금');
            }
            I.save(); close(); sideCounts(); render(); I.toast(R.length + '건을 지급 완료로 처리했어요.');
          };
        });
    };
    $('#exportBtn').onclick = function () { I.toast('엑셀 내보내기는 개발 단계에서 연결됩니다.'); };
    render();
  }

  /* =========================================================
     통계
     ========================================================= */
  function stats() {
    var d = db(), S = I.settlements();
    var done = d.jobs.filter(function (j) { return (j.status === 'confirmed' || j.status === 'done') && !j.hidden; });
    var fee = done.reduce(function (s, j) { return s + j.fee; }, 0), pay = S.reduce(function (s, r) { return s + r.gross; }, 0);
    var appsAll = d.jobs.reduce(function (s, j) { return s + (j.hidden ? 0 : j.apps.length); }, 0);
    var sel = d.jobs.reduce(function (s, j) { return s + j.apps.filter(function (p) { return p.s === 'selected'; }).length; }, 0);
    $('#stKpi').innerHTML =
      '<div class="card kpi"><p class="k"><i data-lucide="calendar-check"></i>확정·완료 행사</p><p class="v">' + done.length + '<small>건</small></p></div>' +
      '<div class="card kpi"><p class="k"><i data-lucide="trending-up"></i>업체 견적 매출</p><p class="v">' + I.man(fee) + '<small>원</small></p></div>' +
      '<div class="card kpi"><p class="k"><i data-lucide="piggy-bank"></i>마진</p><p class="v">' + I.man(fee - pay) + '<small>원</small></p><p class="s">마진율 ' + (fee ? Math.round((fee - pay) / fee * 100) : 0) + '%</p></div>' +
      '<div class="card kpi"><p class="k"><i data-lucide="percent"></i>신청 대비 선정률</p><p class="v">' + (appsAll ? Math.round(sel / appsAll * 100) : 0) + '<small>%</small></p><p class="s">신청 ' + appsAll + ' · 선정 ' + sel + '</p></div>';

    var hb = function (data, fmt) {
      var max = Math.max.apply(null, data.map(function (x) { return x[1]; }).concat([1]));
      return data.map(function (x) { return '<div class="hbar"><span>' + E(x[0]) + '</span><span class="tr"><i style="width:' + (x[1] / max * 100) + '%"></i></span><span class="r">' + (fmt ? fmt(x[1]) : x[1]) + '</span></div>'; }).join('');
    };
    var bySkill = d.skills.map(function (s) { return [s.n, done.filter(function (j) { return j.skill === s.k; }).length]; }).filter(function (x) { return x[1]; }).sort(function (a, b) { return b[1] - a[1]; });
    $('#bySkill').innerHTML = hb(bySkill, function (v) { return v + '건'; });
    var byRegion = d.regions.map(function (r) { return [r, done.filter(function (j) { return j.region === r; }).length]; }).filter(function (x) { return x[1]; }).sort(function (a, b) { return b[1] - a[1]; });
    $('#byRegion').innerHTML = hb(byRegion, function (v) { return v + '건'; });
    var supply = d.skills.map(function (s) { return [s.n, d.artists.filter(function (a) { return a.status === 'active' && a.skills.some(function (x) { return x.k === s.k; }); }).length]; });
    $('#supply').innerHTML = hb(supply, function (v) { return v + '명'; });

    var rank = d.artists.map(function (a) {
      var r = S.filter(function (x) { return x.artist.id === a.id; });
      var ap = d.jobs.filter(function (j) { return !j.hidden && j.apps.some(function (p) { return p.a === a.id; }); }).length;
      return { a: a, n: I.count(a.id), ap: ap, gross: r.reduce(function (s, x) { return s + x.gross; }, 0), st: I.streak(a.id) };
    }).filter(function (x) { return x.ap; }).sort(function (x, y) { return y.n - x.n || y.gross - x.gross; });
    $('#rankBody').innerHTML = rank.map(function (x, i) {
      return '<tr><td class="c"><span class="rank">' + (i + 1) + '</span></td><td><div class="who">' + I.avatar(x.a) + '<b>' + E(x.a.name) + '</b></div></td><td><div class="chips">' + I.skillChips(x.a) + '</div></td><td class="r">' + x.ap + '회</td><td class="r"><b>' + x.n + '회</b></td><td class="r">' + (x.ap ? Math.round(x.n / x.ap * 100) : 0) + '%</td><td class="r">' + (x.st ? x.st + '회' : '-') + '</td><td class="r">' + I.won(x.gross) + '</td></tr>';
    }).join('');

    var ms = {}; done.forEach(function (j) { var m = j.start.slice(0, 7); ms[m] = ms[m] || { n: 0, fee: 0, pay: 0 }; ms[m].n++; ms[m].fee += j.fee; });
    S.forEach(function (r) { var m = r.job.start.slice(0, 7); if (ms[m]) ms[m].pay += r.gross; });
    $('#monthBody').innerHTML = Object.keys(ms).sort().reverse().map(function (m) { var x = ms[m]; return '<tr><td>' + m.replace('-', '년 ') + '월</td><td class="r">' + x.n + '건</td><td class="r">' + I.won(x.fee) + '</td><td class="r">' + I.won(x.pay) + '</td><td class="r"><b>' + I.won(x.fee - x.pay) + '</b></td><td class="r">' + (x.fee ? Math.round((x.fee - x.pay) / x.fee * 100) : 0) + '%</td></tr>'; }).join('');
  }

  /* =========================================================
     운영 설정
     ========================================================= */
  function settings() {
    var s = db().settings;
    $('#s_rc').value = s.restCount; $('#s_rw').value = s.restWindow; $('#s_tax').value = s.taxRate; $('#s_tr').value = s.transportOutside;
    $('input[name=s_mode][value=' + s.defaultMode + ']').checked = true;
    $('#s_k').checked = s.channels.kakao; $('#s_e').checked = s.channels.email; $('#s_auto').checked = s.autoNotice;
    $('#s_sh').value = s.share || 70;
    $('#rateBody').innerHTML = db().skills.map(function (k, i) {
      var cnt = db().artists.filter(function (a) { return a.status === 'active' && a.skills.some(function (x) { return x.k === k.k; }); }).length;
      var inp = function (f) { return '<input class="inp num" style="width:110px;text-align:right" type="number" step="10000" min="0" data-p="' + i + ':' + f + '" value="' + k[f] + '" aria-label="' + k.n + ' ' + (f === 'p4' ? '4시간' : '6시간') + ' 단가">'; };
      var row = '<tr><td><b>' + k.n + (k.pc4 ? ' <small class="muted">포인트(흑백)</small>' : '') + '</b></td><td class="r">' + inp('p4') + '</td><td class="r">' + inp('p6') + '</td><td class="r muted">' + I.won(Math.round(k.p4 * (s.share || 70) / 100)) + '</td><td class="r">' + cnt + '명</td></tr>';
      if (k.pc4) row += '<tr><td><b>' + k.n + ' <small class="muted">컬러 · A5·A4 동일</small></b></td><td class="r">' + inp('pc4') + '</td><td class="r">' + inp('pc6') + '</td><td class="r muted">' + I.won(Math.round(k.pc4 * (s.share || 70) / 100)) + '</td><td class="r">-</td></tr>';
      return row;
    }).join('');
    var prev = function () {
      $('#restPrev').textContent = '최근 ' + ($('#s_rw').value || 30) + '일 안에 연속 ' + ($('#s_rc').value || 3) + '회 이상 확정된 작가는 다음 공고 1회에서 자동으로 빠집니다.';
    };
    $$('#s_rc,#s_rw').forEach(function (el) { el.addEventListener('input', prev); }); prev();
    $('#setForm').onsubmit = function (e) {
      e.preventDefault();
      s.restCount = Math.max(1, +$('#s_rc').value || 3); s.restWindow = Math.max(1, +$('#s_rw').value || 30);
      s.taxRate = +$('#s_tax').value || 0; s.transportOutside = +$('#s_tr').value || 0;
      s.defaultMode = $('input[name=s_mode]:checked').value; s.channels = { kakao: $('#s_k').checked, email: $('#s_e').checked }; s.autoNotice = $('#s_auto').checked;
      s.share = Math.min(100, Math.max(0, +$('#s_sh').value || 70));
      $$('[data-p]').forEach(function (inp) { var q = inp.dataset.p.split(':'); db().skills[+q[0]][q[1]] = +inp.value || 0; });
      I.save(); sideCounts(); settings(); I.toast('운영 설정을 저장했어요.');
    };
  }

  /* ---------- 알림 드롭다운 ---------- */
  function notiMenu() {
    var nt = $('#nt'); if (!nt) return;
    var btn = $('#ntBtn'), menu = $('#ntMenu'), tab = 'todo', KEY = 'iuxart-nt-read', read = {};
    try { read = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
    function todo() {
      var d = db(), L = [];
      d.quotes.forEach(function (q) { L.push({ k: 'q' + q.id, ic: 'inbox', c: 'y', t: '새 견적 문의', s: q.client + ' · ' + I.skill(q.skill).n + ' ' + q.need + '명', at: q.at, href: 'jobs.html#new-' + q.id }); });
      d.jobs.filter(function (j) { return j.status === 'review'; }).forEach(function (j) { L.push({ k: 'r' + j.id, ic: 'user-check', c: 'y', t: '작가 선정 필요', s: j.title + ' · 신청 ' + j.apps.length + '명', at: j.deadline, href: 'jobs.html#' + j.id }); });
      d.artists.filter(function (a) { return a.status === 'pending'; }).forEach(function (a) { L.push({ k: 'a' + a.id, ic: 'user-plus', c: 'b', t: '작가 등록 승인 대기', s: a.name + ' · ' + a.skills.map(function (x) { return I.skill(x.k).n; }).join(', '), at: a.joined + ' 00:00', href: 'artists.html#' + a.id }); });
      (d.posts || []).filter(function (p) { return p.state === 'pending'; }).forEach(function (p) { var a = I.artist(p.a); L.push({ k: 'p' + p.id, ic: 'image', c: 'g', t: '현장 후기 검수', s: (a ? a.name + ' · ' : '') + p.title, at: p.at, href: 'photos.html' }); });
      I.needInfo().forEach(function (a) { var js = I.selectedJobs(a.id).map(function (j) { return j.posted; }).sort(); L.push({ k: 'i' + a.id, ic: 'id-card', c: 'r', t: '정산 정보 미등록', s: a.name + ' · 지급 보류 중', at: js[js.length - 1] || I.stamp(), href: 'settlement.html' }); });
      reportsReady().forEach(function (x) { L.push({ k: 'rp' + x.job.id, ic: 'file-text', c: 'g', t: '결과 리포트 발송', s: x.job.client + ' · ' + x.job.title, at: x.posts.map(function (p) { return p.at; }).sort().pop(), href: 'reports.html#' + x.job.id }); });
      I.needReview().forEach(function (x) { L.push({ k: 'v' + x.j.id + x.a.id, ic: 'star', c: 'b', t: '작가 평가', s: x.a.name + ' · ' + x.j.title, at: x.j.end + ' 22:00', href: 'jobs.html#' + x.j.id }); });
      return L.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    }
    function act() {
      var d = db(), L = [];
      d.jobs.forEach(function (j) { j.apps.forEach(function (p) { var a = I.artist(p.a); if (a && !j.hidden) L.push({ ic: 'hand', c: 'b', t: a.name + ' 작가가 공고에 신청', s: j.title, at: p.at, href: 'jobs.html#' + j.id }); }); });
      (d.posts || []).forEach(function (p) { var a = I.artist(p.a); L.push({ ic: 'camera', c: 'g', t: (a ? a.name : '작가') + ' 작가가 현장 후기 등록', s: p.title, at: p.at, href: 'photos.html' }); });
      d.logs.slice(0, 20).forEach(function (l) { L.push({ ic: l.ch === 'kakao' ? 'message-circle' : 'mail', c: 'n', t: l.type + ' ' + l.to.length + '건 전송', s: (l.ch === 'kakao' ? '알림톡' : '메일') + (l.note ? ' · ' + l.note : ''), at: l.at, href: 'notify.html' }); });
      return L.filter(function (x) { return x.at <= I.stamp(); }).sort(function (a, b) { return a.at < b.at ? 1 : -1; }).slice(0, 15);
    }
    function ago(at) {
      var m = Math.round((new Date() - new Date(at.replace(' ', 'T'))) / 6e4);
      if (isNaN(m)) return at.slice(5, 10);
      if (m < 0) return '마감 ' + at.slice(5, 10).replace('-', '/');
      if (m < 60) return Math.max(1, m) + '분 전'; if (m < 1440) return Math.round(m / 60) + '시간 전';
      if (m < 10080) return Math.round(m / 1440) + '일 전'; return at.slice(5, 10).replace('-', '/');
    }
    function badge() {
      var n = todo().filter(function (x) { return !read[x.k]; }).length, el = $('#hdrDot');
      el.hidden = !n; el.textContent = n > 9 ? '9+' : n;
      btn.setAttribute('aria-label', '알림' + (n ? ' ' + n + '건 안 읽음' : ''));
      $('#ntTodoN').textContent = todo().length;
    }
    function draw() {
      var L = tab === 'todo' ? todo() : act();
      $$('.nt-tabs [data-nt]', menu).forEach(function (b) { b.classList.toggle('on', b.dataset.nt === tab); b.setAttribute('aria-selected', b.dataset.nt === tab); });
      $('#ntRead').hidden = tab !== 'todo';
      $('#ntList').innerHTML = L.length ? L.map(function (x) {
        var un = tab === 'todo' && !read[x.k];
        return '<a class="nt-i' + (un ? ' un' : '') + '" href="' + x.href + '"' + (x.k ? ' data-k="' + x.k + '"' : '') + '><span class="nt-ic c-' + x.c + '"><i data-lucide="' + x.ic + '"></i></span><span class="nt-t"><b>' + E(x.t) + '</b><small>' + E(x.s) + '</small></span><time>' + ago(x.at) + '</time></a>';
      }).join('') : '<p class="nt-empty"><i data-lucide="check-circle-2"></i>' + (tab === 'todo' ? '처리할 일이 없어요.' : '최근 활동이 없어요.') + '</p>';
      I.icons();
    }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(read)); } catch (e) {} }
    function open(v) { menu.hidden = !v; nt.classList.toggle('open', v); btn.setAttribute('aria-expanded', v); if (v) draw(); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); open(menu.hidden); var um = $('#umMenu'); if (um && !um.hidden) $('#umBtn').click(); });
    document.addEventListener('click', function (e) { if (!nt.contains(e.target)) open(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { open(false); btn.focus(); } });
    menu.addEventListener('click', function (e) {
      var t = e.target.closest('[data-nt]'); if (t) { tab = t.dataset.nt; draw(); return; }
      var i = e.target.closest('.nt-i[data-k]'); if (i) { read[i.dataset.k] = 1; save(); }
    });
    $('#ntRead').onclick = function () { todo().forEach(function (x) { read[x.k] = 1; }); save(); badge(); draw(); I.toast('알림을 모두 읽음으로 표시했어요.'); };
    badge();
    window.addEventListener('focus', badge);
  }

  /* ---------- 상단 헤더 · 사용자 메뉴 ---------- */
  (function header() {
    var w = ['일', '월', '화', '수', '목', '금', '토'], d = new Date();
    var hd = $('#hdrDate'); if (hd) hd.textContent = I.today.replace(/-/g, '.') + ' (' + w[d.getDay()] + ')';
    var ul = $('#umLast'); if (ul) ul.textContent = I.today.slice(5).replace('-', '/') + ' 09:12';
    notiMenu();
    var um = $('#um'), btn = $('#umBtn'), menu = $('#umMenu');
    if (!um) return;
    var items = function () { return $$('[role=menuitem]', menu); };
    function open(v, focus) {
      menu.hidden = !v; um.classList.toggle('open', v); btn.setAttribute('aria-expanded', v);
      if (v && focus) items()[0].focus();
    }
    btn.addEventListener('click', function () { open(menu.hidden, false); });
    btn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); open(true, true); } });
    document.addEventListener('click', function (e) { if (!um.contains(e.target)) open(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { open(false); btn.focus(); } });
    menu.addEventListener('keydown', function (e) {
      var list = items(), i = list.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    });
    menu.addEventListener('click', function (e) {
      var a = e.target.closest('[data-um]'); if (!a) return;
      e.preventDefault(); open(false);
      var k = a.dataset.um;
      if (k === 'profile') I.modal('<div class="mh"><h3>내 정보</h3><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div><form class="form" id="mf"><div class="f2"><div class="fld"><label for="mf_n">이름</label><input class="inp" id="mf_n" value="홍길동"></div><div class="fld"><label for="mf_r">권한</label><input class="inp" id="mf_r" value="최고 관리자" disabled></div></div><div class="f2"><div class="fld"><label for="mf_e">이메일</label><input class="inp" id="mf_e" type="email" value="art@iux.kr"></div><div class="fld"><label for="mf_p">휴대폰</label><input class="inp" id="mf_p" value="010-8388-1668"></div></div><div class="mf"><button type="button" class="btn btn-o" data-close>취소</button><button class="btn btn-y">저장</button></div></form>', function (m, close) { I.icons(); $('#mf', m).onsubmit = function (ev) { ev.preventDefault(); close(); I.toast('내 정보를 저장했어요.'); }; });
      if (k === 'password') I.modal('<div class="mh"><h3>비밀번호 변경</h3><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div><form class="form" id="pw"><div class="fld"><label for="pw0">현재 비밀번호</label><input class="inp" id="pw0" type="password" required autocomplete="current-password"></div><div class="fld"><label for="pw1">새 비밀번호</label><input class="inp" id="pw1" type="password" required minlength="10" autocomplete="new-password"><p class="help">영문·숫자·특수문자를 섞어 10자 이상</p></div><div class="fld"><label for="pw2">새 비밀번호 확인</label><input class="inp" id="pw2" type="password" required autocomplete="new-password"></div><div class="mf"><button type="button" class="btn btn-o" data-close>취소</button><button class="btn btn-y">변경</button></div></form>', function (m, close) { I.icons(); $('#pw', m).onsubmit = function (ev) { ev.preventDefault(); if (!ev.target.checkValidity()) { ev.target.reportValidity(); return; } if ($('#pw1', m).value !== $('#pw2', m).value) { I.toast('새 비밀번호가 서로 달라요.'); return; } close(); I.toast('비밀번호를 바꿨어요. (시안)'); }; });
      if (k === 'alarm') I.modal('<div class="mh"><h3>알림 받기 설정</h3><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div><div class="form"><label class="ck"><input type="checkbox" checked>새 견적 문의가 들어오면</label><label class="ck"><input type="checkbox" checked>공고 모집이 마감되면 (선정 필요)</label><label class="ck"><input type="checkbox" checked>새 작가 등록 신청</label><label class="ck"><input type="checkbox">작가가 공고에 신청할 때마다</label><label class="ck"><input type="checkbox" checked>정산 정보가 등록되면</label><p class="note">알림은 운영자 카카오 알림톡과 메일로 받습니다.</p></div><div class="mf"><button class="btn btn-y" data-close>저장</button></div>', function () { I.icons(); });
      if (k === 'logout') I.modal('<div class="mh"><h3>로그아웃</h3><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div><p class="muted">관리자 화면에서 로그아웃할까요?</p><div class="mf"><button class="btn btn-o" data-close>취소</button><button class="btn btn-k" id="lo">로그아웃</button></div>', function (m, close) { I.icons(); $('#lo', m).onclick = function () { close(); I.toast('로그아웃은 개발 단계에서 로그인과 함께 연결됩니다.'); }; });
    });
  })();

  /* ---------- 현장 후기 (작가 등록 → 검수 → 홈페이지 행사 후기) ---------- */
  function photos() {
    var jf = location.hash.slice(1), f = jf ? 'all' : 'pending';
    var TABS = [['all', '전체'], ['pending', '검수 대기'], ['published', '후기 게시'], ['hidden', '게시 안 함'], ['private', '내부 보관']];
    function list() { return (db().posts || []).slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; }); }
    function find(id) { return db().posts.filter(function (p) { return p.id === id; })[0]; }
    function acts(p, j) {
      if (!j || !j.photoOk) return '<p class="lock"><i data-lucide="lock"></i>고객 미동의 · 게시 불가</p>';
      return '<div class="act">' + (p.state !== 'published' ? '<button class="btn btn-y btn-s" data-pub="' + p.id + '"><i data-lucide="globe"></i>후기 게시</button>' : '') + (p.state !== 'hidden' ? '<button class="btn btn-o btn-s" data-hide="' + p.id + '">' + (p.state === 'published' ? '게시 내리기' : '게시 안 함') + '</button>' : '') + '</div>';
    }
    function render() {
      var P = list(), cnt = function (s) { return P.filter(function (p) { return p.state === s; }).length; };
      var shots = P.reduce(function (s, p) { return s + p.photos.length; }, 0);
      $('#phKpi').innerHTML = [['file-image', '전체 후기', P.length, '사진 ' + shots + '장'], ['hourglass', '검수 대기', cnt('pending'), '게시 여부를 정해 주세요'], ['globe', '후기 게시', cnt('published'), '홈페이지 행사 후기'], ['lock', '내부 보관', cnt('private'), '고객 홍보 미동의']].map(function (k, i) {
        return '<div class="card kpi' + (i === 1 && k[2] ? ' hl' : '') + '"><p class="k"><i data-lucide="' + k[0] + '"></i>' + k[1] + '</p><p class="v">' + k[2] + '<small>건</small></p><p class="s">' + k[3] + '</p></div>';
      }).join('');
      $('#phTabs').innerHTML = TABS.map(function (t) { var n = t[0] === 'all' ? P.length : cnt(t[0]); return '<button class="tab' + (f === t[0] ? ' on' : '') + '" data-f="' + t[0] + '">' + t[1] + ' <span class="n">' + n + '</span></button>'; }).join('');
      var jobsW = db().jobs.filter(function (j) { return P.some(function (p) { return p.job === j.id; }); });
      $('#phJob').innerHTML = '<option value="">행사 전체</option>' + jobsW.map(function (j) { return '<option value="' + j.id + '"' + (jf === j.id ? ' selected' : '') + '>' + E(j.title) + '</option>'; }).join('');
      var V = P.filter(function (p) { return (f === 'all' || p.state === f) && (!jf || p.job === jf); });
      $('#phGrid').innerHTML = V.length ? V.map(function (p) {
        var j = I.job(p.job), a = I.artist(p.a), ok = j && j.photoOk;
        return '<article class="phc"><button class="im" data-view="' + p.id + '" aria-label="후기 자세히 보기"><img src="' + I.src(p.photos[0]) + '" alt="" loading="lazy"><span class="tag">' + I.badge(I.POST_STATE, p.state) + '</span>' + (p.photos.length > 1 ? '<span class="cnt-b"><i data-lucide="images"></i>' + p.photos.length + '</span>' : '') + '</button>' +
          '<div class="b"><b>' + E(p.title) + '</b><small>' + (a ? E(a.name) : '-') + ' · ' + (j ? E(j.title) : '-') + ' · ' + p.at.slice(5, 10) + '</small><p class="ex">' + E(p.mood) + '</p>' +
          '<p class="cs">' + (ok ? '<span class="ok"><i data-lucide="check"></i>고객 홍보 동의</span>' : '<span class="no"><i data-lucide="x"></i>고객 홍보 미동의</span>') + (p.subj ? '<span class="ok"><i data-lucide="check"></i>손님 동의</span>' : '') + '</p>' + acts(p, j) + '</div></article>';
      }).join('') : '<div class="card empty-s" style="grid-column:1/-1"><i data-lucide="image"></i>해당하는 현장 후기가 없어요.</div>';
      sideCounts(); I.icons();
    }
    function setState(id, st) {
      var p = find(id), was = p.state; p.state = st; I.save(); render();
      I.toast(st === 'published' ? '홈페이지 행사 후기에 게시했어요.' : was === 'published' ? '게시를 내렸어요.' : '게시하지 않기로 했어요.');
    }
    function view(id) {
      var p = find(id), j = I.job(p.job), a = I.artist(p.a);
      I.modal('<div class="mh"><div><h3>' + E(p.title) + '</h3><p class="muted">' + E(a.name) + ' 작가 · ' + E(j.title) + ' · ' + I.period(j) + ' · ' + E(j.place) + '</p></div><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div>' +
        '<div class="pv-shots">' + p.photos.map(function (s) { return '<img src="' + I.src(s) + '" alt="">'; }).join('') + '</div>' +
        '<p style="margin-top:14px;line-height:1.7">' + E(p.mood) + '</p>' +
        '<p class="muted" style="margin-top:8px">' + p.tags.map(function (t) { return '#' + E(t); }).join(' ') + ' · 손님 ' + E(p.guests) + ' · 등록 ' + p.at + '</p>' +
        '<p class="note">홈페이지에는 업체명·정확한 장소·작가 실명 없이 <b>' + I.skill(j.skill).n + ' · ' + E(j.region) + ' · ' + j.start.slice(0, 7).replace('-', '.') + '</b>로 표시됩니다.</p>' +
        '<div class="mf">' + (j.photoOk ? (p.state !== 'hidden' ? '<button class="btn btn-o" data-st="hidden">' + (p.state === 'published' ? '게시 내리기' : '게시 안 함') + '</button>' : '') + (p.state !== 'published' ? '<button class="btn btn-y" data-st="published"><i data-lucide="globe"></i>후기 게시</button>' : '') : '<p class="lock"><i data-lucide="lock"></i>고객 미동의 · 내부 보관</p>') + '</div>',
        function (m, close) { m.querySelector('.modal-card').classList.add('wide'); I.icons(); $$('[data-st]', m).forEach(function (b) { b.onclick = function () { close(); setState(id, b.dataset.st); }; }); });
    }
    $('#phTabs').addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (b) { f = b.dataset.f; render(); } });
    $('#phJob').onchange = function () { jf = this.value; history.replaceState(null, '', jf ? '#' + jf : location.pathname); render(); };
    $('#phGrid').addEventListener('click', function (e) {
      var pb = e.target.closest('[data-pub]'), hd = e.target.closest('[data-hide]'), vw = e.target.closest('[data-view]');
      if (pb) setState(pb.dataset.pub, 'published');
      if (hd) setState(hd.dataset.hide, 'hidden');
      if (vw) view(vw.dataset.view);
    });
    render();
  }

  /* ---------- 결과 리포트 ---------- */
  function reportsReady() { return I.reportJobs().map(function (j) { return I.reportOf(j.id); }).filter(function (x) { return x.state !== 'sent' && !x.missing.length; }); }
  function seasonNext() {
    var m = +I.today.slice(5, 7);
    return m >= 10 ? '연말 송년회 시즌에는 캐리커처와 타로카드를 함께 운영하는 부스가 가장 인기가 많아요. 12월은 일정이 빨리 마감되니 미리 날짜를 잡아 두시면 좋아요.'
      : m <= 1 ? '설 명절·신년회에는 이름에 덕담을 담는 혁필화와 캘리그라피가 잘 어울려요.'
      : m <= 4 ? '5월 가정의 달 행사에는 페이스페인팅과 요술풍선 삐에로가 아이들에게 반응이 좋아요.'
      : m <= 7 ? '여름 축제에는 헤나와 페이스페인팅이 시원한 분위기를 더해 줍니다.'
      : '추석·가을 축제에는 혁필화와 가족 캐리커처를 추천드려요.';
  }
  function reportEditor(jid, after) {
    var x = I.reportOf(jid), j = x.job, d = db();
    d.reports = d.reports || {};
    var r = d.reports[jid] || { state: 'draft', token: I.newToken(), to: j.client + ' 담당자님', intro: j.title + ' 운영 결과를 정리해 보내드립니다. 함께해 주셔서 감사합니다.', next: '', skip: [] };
    r.next = r.next || seasonNext(); r.skip = r.skip || [];
    I.modal('<div class="mh"><div><h3>결과 리포트 ' + (x.state === 'sent' ? '보기' : '만들기') + '</h3><p class="muted">' + E(j.title) + ' · ' + I.period(j) + ' · ' + E(j.client) + '</p></div><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div>' +
      (x.missing.length ? '<p class="demo"><i data-lucide="hourglass"></i><span>아직 현장 후기를 올리지 않은 작가가 있어요: <b>' + x.missing.map(function (a) { return E(a.name); }).join(', ') + '</b> · 기다리거나 지금 있는 내용으로 보낼 수 있어요.</span><button type="button" class="btn btn-o btn-s" id="rpAsk" style="margin-left:auto">후기 요청 보내기</button></p>' : '') +
      '<div class="rp-sum"><div><span>참여 인원</span><b>' + x.total.toLocaleString() + '명</b></div><div><span>운영 시간</span><b>' + x.hours + '시간</b></div><div><span>투입 작가</span><b>' + x.artists.length + '명</b></div><div><span>현장 사진</span><b>' + x.photos.length + '장</b></div></div>' +
      '<form class="form" id="rpF"><div class="f2"><div class="fld"><label for="rp_to">받는 사람</label><input class="inp" id="rp_to" value="' + E(r.to) + '"></div><div class="fld"><span class="lb">보내는 방법</span><div class="togs"><label class="tog"><input type="checkbox" id="rp_k" checked><span>알림톡</span></label><label class="tog"><input type="checkbox" id="rp_e" checked><span>메일</span></label></div></div></div>' +
      '<div class="fld"><label for="rp_in">인사말</label><textarea class="inp" id="rp_in" rows="3">' + E(r.intro) + '</textarea></div>' +
      '<div class="fld"><span class="lb">넣을 사진 <small class="muted">눌러서 빼거나 다시 넣어요</small></span><div class="rp-shots">' + x.photos.map(function (s) { return '<label class="rp-shot"><input type="checkbox" value="' + E(s) + '"' + (r.skip.indexOf(s) > -1 ? '' : ' checked') + '><img src="' + I.src(s) + '" alt=""><i data-lucide="check"></i></label>'; }).join('') + '</div></div>' +
      '<div class="fld"><label for="rp_nx">다음 행사 제안</label><textarea class="inp" id="rp_nx" rows="2">' + E(r.next) + '</textarea></div>' +
      (r.rating ? '<p class="demo" style="background:var(--ok-bg);color:var(--ok)"><i data-lucide="star"></i><span>담당자 만족도 <b>' + I.stars(r.rating) + '</b> · “' + E(r.review || '') + '”</span></p>' : '') +
      '<div class="mf"><button type="button" class="btn btn-o" id="rpPv"><i data-lucide="external-link"></i>미리보기 (새 창)</button><button class="btn btn-y" type="submit"><i data-lucide="send"></i>' + (x.state === 'sent' ? '다시 보내기' : '담당자에게 보내기') + '</button></div></form>',
      function (m, close) {
        m.querySelector('.modal-card').classList.add('wide'); I.icons();
        var keep = function () {
          r.to = $('#rp_to', m).value.trim(); r.intro = $('#rp_in', m).value.trim(); r.next = $('#rp_nx', m).value.trim();
          r.skip = $$('.rp-shot input', m).filter(function (c) { return !c.checked; }).map(function (c) { return c.value; });
          d.reports[jid] = r; I.save();
        };
        $('#rpPv', m).onclick = function () { keep(); window.open('../report.html?r=' + r.token + '&pv=1', '_blank', 'noopener'); };
        var ask = $('#rpAsk', m);
        if (ask) ask.onclick = function () { var n = I.send('현장 후기 요청', jid, x.missing.map(function (a) { return a.id; }), d.settings.channels, j.title).reduce(function (s, l) { return s + l.to.length; }, 0); I.save(); I.toast('현장 후기 요청 ' + n + '건을 보냈어요.'); };
        $('#rpF', m).onsubmit = function (e) {
          e.preventDefault(); keep();
          var ch = []; if ($('#rp_k', m).checked) ch.push('kakao'); if ($('#rp_e', m).checked) ch.push('email');
          if (!ch.length) { I.toast('보내는 방법을 하나 이상 골라 주세요.'); return; }
          r.state = 'sent'; r.sentAt = I.stamp(); r.openedAt = '';
          ch.forEach(function (c) { d.logs.unshift({ at: I.stamp(), ch: c, type: '결과 리포트', jid: jid, to: [r.to || '담당자'], note: j.client + ' · ' + j.title }); });
          I.save(); close(); sideCounts(); if (after) after();
          I.toast(j.client + '에 결과 리포트를 보냈어요.');
        };
      });
  }
  function reports() {
    var f = location.hash.slice(1) && location.hash.slice(1).charAt(0) === 'j' ? 'all' : 'todo';
    var TABS = [['todo', '보낼 리포트'], ['wait', '후기 대기'], ['sent', '발송 완료'], ['all', '전체']];
    function render() {
      var X = I.reportJobs().map(function (j) { return I.reportOf(j.id); }).sort(function (a, b) { return a.job.start < b.job.start ? 1 : -1; });
      var todo = X.filter(function (x) { return x.state !== 'sent' && !x.missing.length; });
      var wait = X.filter(function (x) { return x.state !== 'sent' && x.missing.length; });
      var sent = X.filter(function (x) { return x.state === 'sent'; });
      var rated = sent.filter(function (x) { return x.rep.rating; });
      var avg = rated.length ? Math.round(rated.reduce(function (s, x) { return s + x.rep.rating; }, 0) / rated.length * 10) / 10 : 0;
      $('#rpKpi').innerHTML = [['send', '보낼 리포트', todo.length, '건', '후기가 모두 모인 행사'], ['hourglass', '후기 대기', wait.length, '건', '작가 후기를 기다리는 중'], ['mail-check', '발송 완료', sent.length, '건', '열람 ' + sent.filter(function (x) { return x.rep.openedAt; }).length + '건'], ['star', '담당자 만족도', avg || '-', avg ? '점' : '', '응답 ' + rated.length + '건']].map(function (k, i) {
        return '<div class="card kpi' + (i === 0 && k[2] ? ' hl' : '') + '"><p class="k"><i data-lucide="' + k[0] + '"></i>' + k[1] + '</p><p class="v">' + k[2] + '<small>' + k[3] + '</small></p><p class="s">' + k[4] + '</p></div>';
      }).join('');
      var C = { todo: todo, wait: wait, sent: sent, all: X };
      $('#rpTabs').innerHTML = TABS.map(function (t) { return '<button class="tab' + (f === t[0] ? ' on' : '') + '" data-f="' + t[0] + '">' + t[1] + ' <span class="n">' + C[t[0]].length + '</span></button>'; }).join('');
      var V = C[f];
      $('#rpBody').innerHTML = V.length ? V.map(function (x) {
        var j = x.job, st = x.state === 'sent' ? 'sent' : x.missing.length ? 'wait' : 'draft';
        var act = x.state === 'sent' ? '<button class="btn btn-o btn-s" data-rp="' + j.id + '">보기</button>' : '<button class="btn btn-' + (x.missing.length ? 'o' : 'y') + ' btn-s" data-rp="' + j.id + '"><i data-lucide="file-text"></i>' + (x.missing.length ? '미리 만들기' : '리포트 보내기') + '</button>';
        return '<tr' + (location.hash === '#' + j.id ? ' class="hl-row"' : '') + '><td><b>' + E(j.title) + '</b><br><small class="muted">' + E(j.client) + ' · ' + I.skill(j.skill).n + '</small></td><td class="num">' + I.period(j) + '</td>' +
          '<td class="c">' + (x.artists.length - x.missing.length) + ' / ' + x.artists.length + '</td><td class="r">' + (x.total ? x.total.toLocaleString() + '명' : '-') + '</td><td class="r">' + x.photos.length + '장</td>' +
          '<td>' + I.badge(I.REPORT_STATE, st) + (x.state === 'sent' ? '<br><small class="muted">' + x.rep.sentAt.slice(5, 16) + (x.rep.openedAt ? ' · 열람' : ' · 미열람') + '</small>' : '') + '</td>' +
          '<td class="c">' + (x.rep && x.rep.rating ? I.stars(x.rep.rating) : '-') + '</td><td class="r">' + act + '</td></tr>';
      }).join('') : '<tr><td colspan="8"><div class="empty-s">해당하는 리포트가 없어요.</div></td></tr>';
      I.icons();
    }
    $('#rpTabs').addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (b) { f = b.dataset.f; render(); } });
    $('#rpBody').addEventListener('click', function (e) { var b = e.target.closest('[data-rp]'); if (b) reportEditor(b.dataset.rp, render); });
    render();
    var h = location.hash.slice(1); if (h && I.job(h)) reportEditor(h, render);
  }

  var PAGES = { reports: reports, photos: photos, dashboard: dashboard, jobs: jobs, artists: artists, notify: notify, settlement: settlement, stats: stats, settings: settings };
  if (PAGES[page]) PAGES[page]();
  sideCounts();
  I.icons();
})();
