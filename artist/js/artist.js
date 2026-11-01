/* IUX ART 작가 등록·작가 포털 (시안용 간단 스크립트) */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var I = IUX, db = function () { return I.db; }, E = I.esc;
  var page = document.body.dataset.page;
  var thisYear = new Date().getFullYear();

  /* =========================================================
     작가 등록
     ========================================================= */
  function register() {
    var d = db(), files = [];
    /* 기술: 선택하면 시작 연도 칸이 열리고 연차를 바로 계산 */
    $('#skills').innerHTML = d.skills.map(function (s) {
      var yrs = ''; for (var y = thisYear; y >= thisYear - 40; y--) yrs += '<option value="' + y + '">' + y + '년부터</option>';
      return '<div class="skrow" data-k="' + s.k + '"><label class="tog"><input type="checkbox" name="sk" value="' + s.k + '"><span>' + s.n + '</span></label>' +
        '<span class="since" hidden><select class="sel" aria-label="' + s.n + ' 시작 연도">' + yrs + '</select><b class="yr">1년차</b></span></div>';
    }).join('');
    $$('.skrow').forEach(function (row) {
      var cb = $('input', row), sp = $('.since', row), sel = $('select', row), yr = $('.yr', row);
      var upd = function () { yr.textContent = I.years(+sel.value) + '년차'; };
      cb.onchange = function () { sp.hidden = !cb.checked; row.classList.toggle('on', cb.checked); };
      sel.onchange = upd; sel.value = thisYear - 2; upd();
    });
    $('#regions').innerHTML = d.regions.map(function (r) { return '<label class="tog"><input type="checkbox" name="rg" value="' + r + '"><span>' + r + '</span></label>'; }).join('');

    var birth = $('#r_birth');
    birth.max = I.today;
    birth.oninput = function () { $('#ageOut').textContent = birth.value ? '만 ' + I.age(birth.value) + '세' : ''; };

    /* 포트폴리오 미리보기 */
    var fin = $('#r_files'), grid = $('#pf');
    function drawPf() {
      grid.innerHTML = files.map(function (f, i) { return '<figure><img src="' + f.url + '" alt="포트폴리오 ' + (i + 1) + '"><button type="button" data-rm="' + i + '" aria-label="삭제">×</button></figure>'; }).join('') +
        (files.length < 10 ? '<label class="add" for="r_files"><i data-lucide="image-plus"></i><span>사진 추가<br><small>' + files.length + ' / 10</small></span></label>' : '');
      I.icons();
    }
    fin.onchange = function () {
      [].slice.call(fin.files).slice(0, 10 - files.length).forEach(function (f) {
        if (!/^image\//.test(f.type)) return;
        files.push({ name: f.name, url: URL.createObjectURL(f) });
      });
      fin.value = ''; drawPf();
    };
    grid.addEventListener('click', function (e) { var b = e.target.closest('[data-rm]'); if (b) { files.splice(+b.dataset.rm, 1); drawPf(); } });
    drawPf();

    $$('input[name=tax]').forEach(function (r) { r.onchange = function () { $('#taxNote').textContent = $('input[name=tax]:checked').value === 'business' ? '개인사업자는 행사 후 세금계산서를 발행해 주시면 전액 지급합니다.' : '프리랜서는 사업소득 3.3%를 원천징수한 뒤 지급하고, 다음 해 5월 종합소득세 신고 때 정산됩니다.'; }; });

    $('#regForm').onsubmit = function (e) {
      e.preventDefault();
      var f = e.target;
      var sk = $$('.skrow').filter(function (r) { return $('input', r).checked; }).map(function (r) { return { k: r.dataset.k, since: +$('select', r).value }; });
      var rg = $$('input[name=rg]:checked').map(function (c) { return c.value; });
      if (!sk.length) { I.toast('보유 기술을 1개 이상 골라 주세요.'); $('#skills').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      if (!rg.length) { I.toast('활동 지역을 1곳 이상 골라 주세요.'); $('#regions').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var acc = $('#r_acc').value.replace(/\D/g, '');
      var a = { id: 'a' + (Date.now() % 1e7), name: $('#r_name').value.trim(), birth: birth.value, phone: $('#r_phone').value.trim(), email: $('#r_email').value.trim(),
        regions: rg, skills: sk, status: 'pending', rating: 0, tax: $('input[name=tax]:checked').value, bank: $('#r_bank').value, account: '****-**-' + acc.slice(-4),
        kakao: $('#r_k').checked, mail: $('#r_m').checked, joined: I.today, bio: $('#r_bio').value.trim() || '자기소개를 아직 쓰지 않았어요.', portfolio: [], localFiles: files.length };
      db().artists.push(a); I.save();
      try { localStorage.setItem('iuxart-me', a.id); } catch (err) {}
      f.hidden = true;
      $('#regDone').hidden = false;
      $('#doneName').textContent = a.name;
      $('#doneSkills').innerHTML = I.skillChips(a);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  /* =========================================================
     작가 포털
     ========================================================= */
  function portal() {
    var me = null, tab = 'jobs';
    try { me = localStorage.getItem('iuxart-me'); } catch (e) {}
    var pick = $('#me');
    function fillMe() {
      var list = db().artists.filter(function (a) { return a.status !== 'paused'; });
      if (!me || !I.artist(me)) me = 'a1';
      pick.innerHTML = list.map(function (a) { return '<option value="' + a.id + '"' + (a.id === me ? ' selected' : '') + '>' + E(a.name) + (a.status === 'pending' ? ' (승인 대기)' : '') + '</option>'; }).join('');
    }
    pick.onchange = function () { me = pick.value; try { localStorage.setItem('iuxart-me', me); } catch (e) {} render(); };

    function header() {
      var a = I.artist(me), rest = a.status === 'active' && I.isRest(a.id);
      var S = I.settlements().filter(function (r) { return r.artist.id === a.id; });
      var due = S.filter(function (r) { return r.state !== 'paid'; }).reduce(function (s, r) { return s + r.net; }, 0);
      var up = I.selectedJobs(a.id).filter(function (j) { return j.status === 'confirmed'; }).length;
      $('#meCard').innerHTML = '<div class="prof">' + I.avatar(a, 'lg') + '<div><h2 style="font-size:20px">' + E(a.name) + ' 작가님 ' + (rest ? '<span class="badge st-rest">휴식 기간</span>' : I.badge(I.ART_STATE, a.status)) + '</h2><div class="chips" style="margin-top:6px">' + I.skillChips(a) + '</div></div></div>' +
        '<div class="mstat"><div><span>총 참여</span><b>' + I.count(a.id) + '회</b></div><div><span>예정 행사</span><b>' + up + '건</b></div><div><span>받을 정산</span><b>' + I.won(due) + '</b></div></div>';
      $('#restNote').hidden = !rest;
      if (rest) $('#restNote').innerHTML = '<i data-lucide="coffee"></i>최근 연속 ' + I.streak(a.id) + '회 참여하셨어요. 다른 작가에게도 기회를 나누기 위해 이번 공고 1회는 자동 선정에서 빠집니다. 신청은 할 수 있어요.';
      $('#pendNote').hidden = a.status !== 'pending';
    }

    function jobsTab() {
      var a = I.artist(me), mine = a.skills.map(function (s) { return s.k; });
      var open = db().jobs.filter(function (j) { return j.status === 'open'; }).sort(function (x, y) { return x.deadline < y.deadline ? -1 : 1; });
      var fit = function (j) { return mine.indexOf(j.skill) > -1; };
      open.sort(function (x, y) { return fit(y) - fit(x); });
      return open.length ? '<div class="jobs">' + open.map(function (j) {
        var p = j.apps.filter(function (x) { return x.a === a.id; })[0], ok = fit(j);
        var per = I.skill(j.skill).rate * j.hours * I.days(j.start, j.end);
        var near = a.regions.indexOf(j.region) > -1;
        var btn;
        if (a.status !== 'active') btn = '<button class="btn btn-o" disabled>승인 후 신청 가능</button>';
        else if (!ok) btn = '<button class="btn btn-o" disabled>보유 기술이 아니에요</button>';
        else if (p) btn = '<button class="btn btn-k" data-cancel="' + j.id + '"><i data-lucide="check"></i>신청 완료 · 취소</button>';
        else btn = '<button class="btn btn-y" data-apply="' + j.id + '"><i data-lucide="hand"></i>참석 신청</button>';
        var order = p ? j.apps.slice().sort(function (x, y) { return x.at < y.at ? -1 : 1; }).map(function (x) { return x.a; }).indexOf(a.id) + 1 : 0;
        return '<article class="job' + (ok ? '' : ' dim') + '"><div class="jt"><span class="chip">' + I.skill(j.skill).n + '</span><span class="badge ' + (j.mode === 'fcfs' ? 'st-open">선착순' : 'st-review">운영자 선정') + '</span>' + (near ? '<span class="badge st-ok">내 활동 지역</span>' : '') + '</div>' +
          '<h3>' + E(j.title) + '</h3><dl><dt>일정</dt><dd class="num">' + I.period(j) + ' · ' + j.time + '</dd><dt>장소</dt><dd>' + E(j.place) + '</dd><dt>모집</dt><dd>' + j.need + '명 · 현재 신청 ' + j.apps.length + '명</dd><dt>지급</dt><dd><b>' + I.won(per) + '</b> <small class="muted">세전 · 1인</small></dd><dt>마감</dt><dd class="num">' + j.deadline + '</dd></dl>' +
          (p ? '<p class="mine">내 신청 순번 <b>' + order + '번째</b> · ' + p.at.slice(5) + '</p>' : '') + '<div class="jb">' + btn + '</div></article>';
      }).join('') + '</div>' : '<div class="card empty-s"><i data-lucide="inbox"></i>지금 모집 중인 공고가 없어요. 새 공고가 올라오면 알림톡으로 알려드려요.</div>';
    }
    function scheduleTab() {
      var a = I.artist(me);
      var list = I.history(a.id);
      return list.length ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>행사</th><th>일정</th><th>장소</th><th>결과</th></tr></thead><tbody>' + list.filter(function (j) { return !j.hidden; }).map(function (j) {
        var p = j.apps.filter(function (x) { return x.a === a.id; })[0];
        var st = p.s === 'selected' ? (j.status === 'done' ? '<span class="badge st-done">참여 완료</span>' : '<span class="badge st-ok">선정 · 예정</span>') : p.s === 'rejected' ? '<span class="badge st-done">미선정</span>' : p.s === 'rest' ? '<span class="badge st-rest">휴식 제외</span>' : '<span class="badge st-open">결과 대기</span>';
        return '<tr><td><b>' + E(j.title) + '</b><br><small class="muted">' + I.skill(j.skill).n + '</small></td><td class="num">' + I.period(j) + '<br><small class="muted">' + j.time + '</small></td><td>' + E(j.place) + '</td><td>' + st + '</td></tr>';
      }).join('') + '</tbody></table></div>' : '<div class="card empty-s"><i data-lucide="calendar"></i>신청한 행사가 없어요.</div>';
    }
    function payTab() {
      var a = I.artist(me), R = I.settlements().filter(function (r) { return r.artist.id === a.id; });
      var sum = function (k, f) { return R.filter(f || function () { return true; }).reduce(function (s, r) { return s + r[k]; }, 0); };
      return '<div class="grid g3" style="margin-bottom:14px"><div class="card kpi"><p class="k">지급 완료</p><p class="v">' + I.man(sum('net', function (r) { return r.state === 'paid'; })) + '<small>원</small></p></div><div class="card kpi"><p class="k">지급 대기</p><p class="v">' + I.man(sum('net', function (r) { return r.state === 'due'; })) + '<small>원</small></p></div><div class="card kpi"><p class="k">행사 후 정산</p><p class="v">' + I.man(sum('net', function (r) { return r.state === 'scheduled'; })) + '<small>원</small></p></div></div>' +
        (R.length ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>행사</th><th class="r">근무</th><th class="r">지급 총액</th><th class="r">' + (a.tax === 'freelancer' ? '원천징수 3.3%' : '세금계산서') + '</th><th class="r">실지급액</th><th>상태</th></tr></thead><tbody>' + R.map(function (r) {
          return '<tr><td><b>' + E(r.job.title) + '</b><br><small class="muted num">' + I.period(r.job) + '</small></td><td class="r">' + r.days + '일 × ' + r.hours + 'h</td><td class="r">' + I.won(r.gross) + '</td><td class="r">' + (r.tax ? '-' + I.won(r.tax) : '발행 필요') + '</td><td class="r"><b>' + I.won(r.net) + '</b></td><td>' + I.badge(I.PAY_STATE, r.state) + (r.paidAt ? '<br><small class="muted num">' + r.paidAt + '</small>' : '') + '</td></tr>';
        }).join('') + '</tbody></table></div><p class="note">입금 계좌: ' + E(a.bank + ' ' + a.account) + ' · 계좌 변경은 고객센터로 문의해 주세요.</p>' : '<div class="card empty-s"><i data-lucide="wallet"></i>정산 내역이 없어요.</div>');
    }
    function profileTab() {
      var a = I.artist(me);
      return '<div class="card"><div class="grid g2"><div><p class="sec-t" style="margin-top:0">기본 정보</p><p>만 ' + I.age(a.birth) + '세 (' + a.birth + ')</p><p class="num">' + E(a.phone) + ' · ' + E(a.email) + '</p>' +
        '<p class="sec-t">기술·경력 <small class="muted" style="font-weight:500">해가 바뀌면 연차가 자동으로 올라가요</small></p><div class="chips">' + a.skills.map(function (s) { return '<span class="chip">' + I.skill(s.k).n + ' <b>' + I.years(s.since) + '년차</b> <span class="muted">(' + s.since + '~)</span></span>'; }).join('') + '</div>' +
        '<p class="sec-t">활동 지역</p><div class="chips">' + a.regions.map(function (r) { return '<span class="chip">' + r + '</span>'; }).join('') + '</div>' +
        '<p class="sec-t">알림 수신</p><label class="ck"><input type="checkbox" id="pk" ' + (a.kakao ? 'checked' : '') + '>카카오 알림톡</label><label class="ck" style="margin-top:6px"><input type="checkbox" id="pm" ' + (a.mail ? 'checked' : '') + '>메일</label></div>' +
        '<div><p class="sec-t" style="margin-top:0">포트폴리오</p><div class="port">' + (a.portfolio.length ? a.portfolio.map(function (p) { return '<img src="../images/' + p + '.jpg" alt="포트폴리오">'; }).join('') : '<p class="empty">' + (a.localFiles ? '등록 시 올린 사진 ' + a.localFiles + '장은 개발 단계에서 저장됩니다.' : '등록된 포트폴리오가 없어요.') + '</p>') + '</div>' +
        '<p class="sec-t">소개</p><p>' + E(a.bio) + '</p></div></div></div>';
    }

    function render() {
      header();
      $$('#ptabs [data-t]').forEach(function (b) { b.classList.toggle('on', b.dataset.t === tab); b.setAttribute('aria-selected', b.dataset.t === tab); });
      var n = db().jobs.filter(function (j) { return j.status === 'open'; }).length;
      $('#openN').textContent = n;
      $('#pbody').innerHTML = tab === 'jobs' ? jobsTab() : tab === 'schedule' ? scheduleTab() : tab === 'pay' ? payTab() : profileTab();
      I.icons();
      var a = I.artist(me);
      var pk = $('#pk'), pm = $('#pm');
      if (pk) pk.onchange = function () { a.kakao = pk.checked; I.save(); I.toast('알림톡 수신을 ' + (pk.checked ? '켰어요.' : '껐어요.')); };
      if (pm) pm.onchange = function () { a.mail = pm.checked; I.save(); I.toast('메일 수신을 ' + (pm.checked ? '켰어요.' : '껐어요.')); };
    }
    $('#ptabs').addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) { tab = b.dataset.t; render(); } });
    $('#pbody').addEventListener('click', function (e) {
      var ap = e.target.closest('[data-apply]'), cc = e.target.closest('[data-cancel]');
      if (ap) {
        var j = I.job(ap.dataset.apply);
        j.apps.push({ a: me, at: I.stamp(), s: 'applied' });
        I.save(); render();
        var order = j.apps.length;
        I.toast(j.mode === 'fcfs' ? '신청했어요. 현재 ' + order + '번째 신청입니다. (모집 ' + j.need + '명, 선착순)' : '신청했어요. 운영자가 확인 후 결과를 알림톡으로 보내드려요.');
      }
      if (cc) {
        var j2 = I.job(cc.dataset.cancel);
        j2.apps = j2.apps.filter(function (p) { return p.a !== me; });
        I.save(); render(); I.toast('신청을 취소했어요.');
      }
    });
    fillMe(); render();
  }

  if (page === 'register') register();
  if (page === 'portal') portal();
  I.icons();
})();
