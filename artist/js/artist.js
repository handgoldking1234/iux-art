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
    // 시안 확인용: artist/index.html?a=a3 처럼 주소로 작가 전환 (실서비스는 로그인한 본인)
    var qa = (location.search.match(/[?&]a=([\w-]+)/) || [])[1];
    if (qa) { me = qa; try { localStorage.setItem('iuxart-me', me); } catch (e) {} }
    function fillMe() {
      if (!me || !I.artist(me)) me = 'a1';
      var a = I.artist(me);
      $('#umAv').innerHTML = I.avatar(a); $('#umName').textContent = a.name + ' 작가님';
    }
    var um = $('#um'), umBtn = $('#umBtn'), umMenu = $('#umMenu');
    function umSet(o) { um.classList.toggle('open', o); umMenu.hidden = !o; umBtn.setAttribute('aria-expanded', o); }
    umBtn.onclick = function (e) { e.stopPropagation(); umSet(umMenu.hidden); };
    document.addEventListener('click', function (e) { if (!um.contains(e.target)) umSet(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') umSet(false); });
    umMenu.addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (!b) return; tab = b.dataset.go; umSet(false); render(); $('#ptabs').scrollIntoView({ behavior: 'smooth', block: 'start' }); });

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
      var noPh = I.selectedJobs(a.id).filter(function (j) { return j.status === 'done' && !j.hidden && j.start >= '2026-10-01' && !I.photosOf(j.id, a.id).length; });
      $('#photoNote').hidden = !noPh.length;
      if (noPh.length) $('#photoNote').innerHTML = '<i data-lucide="camera"></i><span>최근 행사 <b>' + E(noPh[0].title) + '</b>' + (noPh.length > 1 ? ' 외 ' + (noPh.length - 1) + '건' : '') + '의 현장 사진을 올려 주세요.</span><button class="btn btn-k btn-s" data-photo="' + noPh[0].id + '" style="margin-left:auto">사진 올리기</button>';
      var needInfo = !I.hasTaxInfo(a) && I.selectedJobs(a.id).length;
      $('#infoNote').hidden = !needInfo;
      if (needInfo) $('#infoNote').innerHTML = '<i data-lucide="id-card"></i><span>선정을 축하드려요. 정산금을 받으려면 <b>정산 정보</b>를 등록해 주세요. 등록 전까지 지급이 보류됩니다.</span><button class="btn btn-k btn-s" data-goinfo style="margin-left:auto">지금 등록</button>';
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
      return list.length ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>행사</th><th>일정</th><th>장소</th><th>결과</th><th>현장 사진</th></tr></thead><tbody>' + list.filter(function (j) { return !j.hidden; }).map(function (j) {
        var p = j.apps.filter(function (x) { return x.a === a.id; })[0];
        var st = p.s === 'selected' ? (j.status === 'done' ? '<span class="badge st-done">참여 완료</span>' : '<span class="badge st-ok">선정 · 예정</span>') : p.s === 'rejected' ? '<span class="badge st-done">미선정</span>' : p.s === 'rest' ? '<span class="badge st-rest">휴식 제외</span>' : '<span class="badge st-open">결과 대기</span>';
        return '<tr><td><b>' + E(j.title) + '</b><br><small class="muted">' + I.skill(j.skill).n + '</small></td><td class="num">' + I.period(j) + '<br><small class="muted">' + j.time + '</small></td><td>' + E(j.place) + '</td><td>' + st + '</td><td>' + photoCell(j, p) + '</td></tr>';
      }).join('') + '</tbody></table></div>' : '<div class="card empty-s"><i data-lucide="calendar"></i>신청한 행사가 없어요.</div>';
    }
    function photoCell(j, p) {
      if (p.s !== 'selected') return '<small class="muted">-</small>';
      if (j.start > I.today) return '<small class="muted">행사 당일부터</small>';
      var n = I.photosOf(j.id, me).length;
      return '<button class="btn btn-' + (n ? 'o' : 'y') + ' btn-s" data-photo="' + j.id + '"><i data-lucide="camera"></i>' + (n ? n + '장 · 더 올리기' : '사진 올리기') + '</button>';
    }
    function photoModal(jid) {
      var j = I.job(jid), picked = [];
      var mine = function () { return I.photosOf(jid, me); };
      var list = function () {
        return mine().map(function (p) { return '<figure class="up"><img src="' + I.photoSrc(p) + '" alt="">' + I.badge(I.PHOTO_STATE, p.state) + (p.state === 'pending' || p.state === 'private' ? '<button type="button" class="del" data-del="' + p.id + '" aria-label="삭제">×</button>' : '') + '</figure>'; }).join('');
      };
      I.modal('<div class="mh"><h3>현장 사진 올리기</h3><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div>' +
        '<p class="muted" style="margin-bottom:12px"><b>' + E(j.title) + '</b> · ' + I.period(j) + '</p>' +
        (j.photoOk
          ? '<p class="demo" style="background:var(--ok-bg);color:var(--ok)"><i data-lucide="badge-check"></i>고객이 현장 사진 홍보 활용에 동의한 행사예요. 올린 사진은 운영자 검수 후 홈페이지·SNS에 실릴 수 있어요.</p>'
          : '<p class="demo" style="background:var(--bad-bg);color:var(--bad)"><i data-lucide="lock"></i>고객이 홍보 활용에 동의하지 않은 행사예요. 사진은 내부 기록용으로만 보관되고 외부에 공개되지 않아요.</p>') +
        '<div class="ups" id="upMine">' + list() + '</div>' +
        '<form class="form" id="upF"><label class="drop"><input type="file" id="upFile" accept="image/*" multiple><i data-lucide="image-plus"></i><b>사진 고르기</b><small>여러 장 한 번에 · 장당 10MB 이하</small></label>' +
        '<div class="ups" id="upNew"></div>' +
        '<ul class="tips"><li>완성 작품, 부스 전경, 작업하는 모습 위주로 찍어 주세요.</li><li>얼굴이 드러난 손님 사진은 촬영 전에 게시 동의를 받아 주세요. 어린이는 보호자 동의가 필요해요.</li><li>행사장 내부 자료, 다른 손님의 개인정보가 보이는 사진은 피해 주세요.</li></ul>' +
        '<label class="ck"><input type="checkbox" id="upAgree" required>사진에 나온 분들께 촬영·게시 동의를 받았어요. (필수)</label>' +
        '<div class="mf"><button type="button" class="btn btn-o" data-close>닫기</button><button class="btn btn-y" type="submit" id="upGo" disabled><i data-lucide="upload"></i>올리기</button></div></form>',
        function (m, close) {
          m.querySelector('.modal-card').classList.add('wide'); I.icons();
          var shrink = function (file) {
            return new Promise(function (res) {
              var r = new FileReader();
              r.onload = function () { var im = new Image(); im.onload = function () { var k = Math.min(1, 720 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .72)); }; im.onerror = function () { res(null); }; im.src = r.result; };
              r.readAsDataURL(file);
            });
          };
          var draw = function () {
            $('#upNew', m).innerHTML = picked.map(function (src, i) { return '<figure class="up"><img src="' + src + '" alt=""><button type="button" class="del" data-rm="' + i + '" aria-label="빼기">×</button></figure>'; }).join('');
            $('#upGo', m).disabled = !picked.length;
            $('#upGo', m).innerHTML = '<i data-lucide="upload"></i>' + (picked.length ? picked.length + '장 올리기' : '올리기'); I.icons();
          };
          $('#upFile', m).onchange = function () {
            var fs = [].slice.call(this.files).filter(function (f) { return /^image\//.test(f.type) && f.size <= 10 * 1024 * 1024; });
            Promise.all(fs.map(shrink)).then(function (r) { picked = picked.concat(r.filter(Boolean)); draw(); });
            this.value = '';
          };
          m.addEventListener('click', function (e) {
            var rm = e.target.closest('[data-rm]'), dl = e.target.closest('[data-del]');
            if (rm) { picked.splice(+rm.dataset.rm, 1); draw(); }
            if (dl) { db().photos = db().photos.filter(function (p) { return p.id !== dl.dataset.del; }); I.save(); $('#upMine', m).innerHTML = list(); render(); I.toast('사진을 지웠어요.'); }
          });
          $('#upF', m).onsubmit = function (e) {
            e.preventDefault();
            if (!$('#upAgree', m).checked) { $('#upAgree', m).reportValidity(); return; }
            db().photos = db().photos || [];
            picked.forEach(function (src, i) { db().photos.push({ id: 'p' + Date.now() + i, job: jid, a: me, src: src, at: I.stamp(), subj: true, state: j.photoOk ? 'pending' : 'private' }); });
            I.save(); var n = picked.length; close(); render();
            I.toast(n + '장을 올렸어요. ' + (j.photoOk ? '운영자 검수 후 게시 여부가 정해져요.' : '내부 기록용으로 보관됩니다.'));
          };
        });
    }
    function payTab() {
      var a = I.artist(me), R = I.settlements().filter(function (r) { return r.artist.id === a.id; });
      var sum = function (k, f) { return R.filter(f || function () { return true; }).reduce(function (s, r) { return s + r[k]; }, 0); };
      return '<div class="grid g3" style="margin-bottom:14px"><div class="card kpi"><p class="k">지급 완료</p><p class="v">' + I.man(sum('net', function (r) { return r.state === 'paid'; })) + '<small>원</small></p></div><div class="card kpi"><p class="k">지급 대기</p><p class="v">' + I.man(sum('net', function (r) { return r.state === 'due' || r.state === 'needinfo'; })) + '<small>원</small></p></div><div class="card kpi"><p class="k">행사 후 정산</p><p class="v">' + I.man(sum('net', function (r) { return r.state === 'scheduled'; })) + '<small>원</small></p></div></div>' +
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


    /* ---------- 정산 정보 (주민등록번호·사업자등록번호) ---------- */
    function taxTab() {
      var a = I.artist(me), t = a.taxInfo, biz = a.tax === 'business';
      var cur = I.hasTaxInfo(a)
        ? '<div class="demo" style="background:var(--ok-bg);color:var(--ok)"><i data-lucide="shield-check"></i>' + (t.kind === 'rrn' ? '주민등록번호 <b class="num" style="margin:0 4px">' + E(t.masked) + '</b>' : '사업자등록번호 <b class="num" style="margin:0 4px">' + E(t.bizNo) + '</b>') + '등록 완료 (' + t.at + ') · 다시 입력하면 새 정보로 바뀝니다.</div>'
        : '<div class="demo" style="background:var(--bad-bg);color:var(--bad)"><i data-lucide="id-card"></i>아직 등록하지 않았어요. 첫 정산 전에 등록해 주세요.</div>';
      var visas = ['E-6 예술흥행', 'F-2 거주', 'F-4 재외동포', 'F-5 영주', 'F-6 결혼이민', 'D-2 유학(시간제 취업허가)', '기타'];
      return '<div class="card" style="max-width:760px">' + cur +
        '<form class="form" id="taxForm" novalidate>' +
        '<div class="fld"><span class="lb">소득 유형</span><div class="togs"><label class="tog"><input type="radio" name="tk" value="freelancer"' + (biz ? '' : ' checked') + '><span>프리랜서 (3.3% 원천징수)</span></label><label class="tog"><input type="radio" name="tk" value="business"' + (biz ? ' checked' : '') + '><span>개인사업자 (세금계산서)</span></label></div></div>' +
        '<div id="tkRrn"' + (biz ? ' hidden' : '') + '>' +
          '<label class="ck" style="margin-bottom:10px"><input type="checkbox" id="tFor">외국인입니다 (외국인등록번호)</label>' +
          '<div class="fld"><label for="tR1" id="tRl">주민등록번호<i>*</i></label><div class="rrn"><input class="inp num" id="tR1" inputmode="numeric" maxlength="6" placeholder="앞 6자리" autocomplete="off" aria-label="앞 6자리"><span>-</span><input class="inp num" id="tR2" type="password" inputmode="numeric" maxlength="7" placeholder="뒤 7자리" autocomplete="off" aria-label="뒤 7자리"></div>' +
          '<p class="help">소득세법에 따른 원천징수 신고와 (간이)지급명세서 제출에만 사용합니다.</p></div>' +
          '<div class="fld" id="tVisaF" hidden style="margin-top:10px"><label for="tVisa">체류자격<i>*</i></label><select class="sel" id="tVisa">' + visas.map(function (v) { return '<option>' + v + '</option>'; }).join('') + '</select><p class="help">취업이 가능한 체류자격인지 확인이 필요해 외국인등록증 사본을 따로 요청드릴 수 있어요.</p></div>' +
        '</div>' +
        '<div id="tkBiz"' + (biz ? '' : ' hidden') + '><div class="f2"><div class="fld"><label for="tB">사업자등록번호<i>*</i></label><input class="inp num" id="tB" inputmode="numeric" maxlength="12" placeholder="000-00-00000" autocomplete="off"></div>' +
          '<div class="fld"><label for="tBn">상호<i>*</i></label><input class="inp" id="tBn" value="' + E(t && t.bizName || '') + '"></div></div>' +
          '<div class="fld" style="margin-top:10px"><label for="tBm">세금계산서 받을 메일<i>*</i></label><input class="inp" id="tBm" type="email" value="' + E(t && t.invoiceMail || a.email) + '"></div></div>' +
        '<div class="f3"><div class="fld"><label for="tBank">은행<i>*</i></label><input class="inp" id="tBank" value="' + E(a.bank) + '"></div><div class="fld"><label for="tAcc">계좌번호</label><input class="inp num" id="tAcc" inputmode="numeric" placeholder="' + E(a.account) + '"></div><div class="fld"><label for="tHold">예금주<i>*</i></label><input class="inp" id="tHold" value="' + E(t && t.holder || a.name) + '"></div></div>' +
        '<div class="demo" style="background:var(--soft);color:var(--ink-2);margin:0;align-items:flex-start"><i data-lucide="lock"></i><span>수집 근거: 소득세법(원천징수·지급명세서 제출), 개인정보 보호법 제24조의2 · 보관: 암호화 저장, 정산 담당자만 열람 · 보관 기간: 마지막 지급 후 5년(세무 신고 기준) 뒤 파기 · 법령에 따라 처리되며 다른 용도로 쓰지 않습니다.</span></div>' +
        '<div style="display:flex;justify-content:flex-end"><button class="btn btn-y" type="submit"><i data-lucide="shield-check"></i>정산 정보 저장</button></div></form>' +
        '<p class="note">시안에서는 입력한 번호를 저장하지 않고 가린 형태(예: 950505-1******)만 남깁니다. 실제 서비스는 서버에서 암호화해 저장합니다.</p></div>';
    }
    function bindTax() {
      var f = $('#taxForm'); if (!f) return;
      var a = I.artist(me);
      $$('input[name=tk]', f).forEach(function (r) { r.onchange = function () { var b = $('input[name=tk]:checked', f).value === 'business'; $('#tkRrn').hidden = b; $('#tkBiz').hidden = !b; }; });
      $('#tFor').onchange = function () { $('#tVisaF').hidden = !this.checked; $('#tRl').firstChild.textContent = this.checked ? '외국인등록번호' : '주민등록번호'; };
      var digits = function (el) { el.addEventListener('input', function () { el.value = el.value.replace(/\D/g, ''); }); };
      digits($('#tR1')); digits($('#tR2'));
      $('#tR1').addEventListener('input', function () { if (this.value.length === 6) $('#tR2').focus(); });
      $('#tB').addEventListener('input', function () { var v = this.value.replace(/\D/g, '').slice(0, 10); this.value = v.length > 5 ? v.slice(0, 3) + '-' + v.slice(3, 5) + '-' + v.slice(5) : v.length > 3 ? v.slice(0, 3) + '-' + v.slice(3) : v; });
      f.onsubmit = function (e) {
        e.preventDefault();
        var biz = $('input[name=tk]:checked', f).value === 'business';
        var bank = $('#tBank').value.trim(), acc = $('#tAcc').value.replace(/\D/g, ''), hold = $('#tHold').value.trim();
        if (!bank || !hold) { I.toast('은행과 예금주를 입력해 주세요.'); return; }
        if (biz) {
          var b = $('#tB').value.replace(/\D/g, '');
          if (b.length !== 10) { I.toast('사업자등록번호 10자리를 입력해 주세요.'); $('#tB').focus(); return; }
          if (!$('#tBn').value.trim()) { I.toast('상호를 입력해 주세요.'); return; }
          a.tax = 'business';
          a.taxInfo = { kind: 'biz', bizNo: b.slice(0, 3) + '-' + b.slice(3, 5) + '-*****', bizName: $('#tBn').value.trim(), invoiceMail: $('#tBm').value.trim(), holder: hold, at: I.today };
        } else {
          var r1 = $('#tR1').value, r2 = $('#tR2').value;
          if (r1.length !== 6 || r2.length !== 7) { I.toast('번호 앞 6자리와 뒤 7자리를 모두 입력해 주세요.'); (r1.length !== 6 ? $('#tR1') : $('#tR2')).focus(); return; }
          var foreign = $('#tFor').checked;
          if (!foreign && !/[1-4]/.test(r2[0])) { I.toast('주민등록번호 뒷자리 첫 숫자를 확인해 주세요. 외국인이면 "외국인입니다"를 체크해 주세요.'); return; }
          a.tax = 'freelancer';
          a.taxInfo = { kind: 'rrn', masked: r1 + '-' + r2[0] + '******', foreign: foreign, visa: foreign ? $('#tVisa').value : '', holder: hold, at: I.today };
          $('#tR2').value = '';
        }
        a.bank = bank; if (acc) a.account = '****-**-' + acc.slice(-4);
        I.save(); render(); I.toast('정산 정보를 저장했어요. 보류된 정산이 지급 대기로 바뀝니다.');
      };
    }

    function render() {
      header();
      $$('#ptabs [data-t]').forEach(function (b) { b.classList.toggle('on', b.dataset.t === tab); b.setAttribute('aria-selected', b.dataset.t === tab); });
      var n = db().jobs.filter(function (j) { return j.status === 'open'; }).length;
      $('#openN').textContent = n;
      $('#pbody').innerHTML = tab === 'jobs' ? jobsTab() : tab === 'schedule' ? scheduleTab() : tab === 'pay' ? payTab() : tab === 'tax' ? taxTab() : profileTab();
      bindTax();
      I.icons();
      var a = I.artist(me);
      var pk = $('#pk'), pm = $('#pm');
      if (pk) pk.onchange = function () { a.kakao = pk.checked; I.save(); I.toast('알림톡 수신을 ' + (pk.checked ? '켰어요.' : '껐어요.')); };
      if (pm) pm.onchange = function () { a.mail = pm.checked; I.save(); I.toast('메일 수신을 ' + (pm.checked ? '켰어요.' : '껐어요.')); };
    }
    $('#ptabs').addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) { tab = b.dataset.t; render(); } });
    $('#infoNote').addEventListener('click', function (e) { if (e.target.closest('[data-goinfo]')) { tab = 'tax'; render(); $('#ptabs').scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
    document.addEventListener('click', function (e) { var b = e.target.closest('[data-photo]'); if (b) photoModal(b.dataset.photo); });
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
