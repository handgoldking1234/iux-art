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
      /* 행사 당일부터 30일 동안, 아직 현장 후기를 안 쓴 행사 */
      var fd = new Date(I.toDate(I.today) - 30 * 864e5), from = fd.getFullYear() + '-' + ('0' + (fd.getMonth() + 1)).slice(-2) + '-' + ('0' + fd.getDate()).slice(-2);
      var noPh = I.selectedJobs(a.id).filter(function (j) { return !j.hidden && j.start <= I.today && j.start >= from && !I.postOf(j.id, a.id); })
        .sort(function (x, y) { return x.start < y.start ? 1 : -1; });
      $('#photoNote').hidden = !noPh.length;
      if (noPh.length) $('#photoNote').innerHTML = '<p class="pn-h"><i data-lucide="camera"></i>현장 후기를 남겨 주세요. 사진과 분위기 몇 줄이면 돼요.</p>' +
        noPh.map(function (j) { return '<div class="pn-r"><span><b>' + E(j.title) + '</b><small>' + I.period(j) + (j.start === I.today ? ' · 오늘 행사' : '') + '</small></span><button class="btn btn-k btn-s" data-photo="' + j.id + '"><i data-lucide="camera"></i>현장 후기 올리기</button></div>'; }).join('');
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
      return list.length ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>행사</th><th>일정</th><th>장소</th><th>결과</th><th>현장 후기</th></tr></thead><tbody>' + list.filter(function (j) { return !j.hidden; }).map(function (j) {
        var p = j.apps.filter(function (x) { return x.a === a.id; })[0];
        var st = p.s === 'selected' ? (j.status === 'done' ? '<span class="badge st-done">참여 완료</span>' : '<span class="badge st-ok">선정 · 예정</span>') : p.s === 'rejected' ? '<span class="badge st-done">미선정</span>' : p.s === 'rest' ? '<span class="badge st-rest">휴식 제외</span>' : '<span class="badge st-open">결과 대기</span>';
        return '<tr><td><b>' + E(j.title) + '</b><br><small class="muted">' + I.skill(j.skill).n + '</small></td><td class="num">' + I.period(j) + '<br><small class="muted">' + j.time + '</small></td><td>' + E(j.place) + '</td><td>' + st + '</td><td>' + photoCell(j, p) + '</td></tr>';
      }).join('') + '</tbody></table></div>' : '<div class="card empty-s"><i data-lucide="calendar"></i>신청한 행사가 없어요.</div>';
    }
    function photoCell(j, p) {
      if (p.s !== 'selected') return '<small class="muted">-</small>';
      if (j.start > I.today) return '<small class="muted">행사 당일부터</small>';
      var po = I.postOf(j.id, me);
      return po ? '<span class="pc-st">' + I.badge(I.POST_STATE, po.state) + '<button class="btn btn-o btn-s" data-photo="' + j.id + '">수정</button></span>'
                : '<button class="btn btn-y btn-s" data-photo="' + j.id + '"><i data-lucide="camera"></i>현장 후기 올리기</button>';
    }
    /* 현장 후기 작성: 사진 + 분위기 글 → 운영자 검수 → 홈페이지 행사 후기 */
    function photoModal(jid) {
      var j = I.job(jid), a = I.artist(me), po = I.postOf(jid, me), sk = I.skill(j.skill);
      var MOODS = ['기업행사', '대학축제', '지역축제', '웨딩', '가족', '어린이', '송년회', '파티', '실내', '야외'];
      var GUESTS = ['50명 이하', '50~100명', '100~200명', '200명 이상'];
      var HINTS = [['공간', '부스는 '], ['손님 반응', '손님들은 '], ['인기 도안·화풍', '가장 많이 요청받은 건 '], ['기억에 남는 순간', '기억에 남는 순간은 ']];
      var shots = po ? po.photos.slice() : [], MAX = 10;
      var yrs = (a.skills.filter(function (s) { return s.k === j.skill; })[0] || {}).since;
      var defTitle = j.title.replace(/^\S*OO\S*\s*/, '').trim();
      I.modal('<div class="mh"><div><h3>' + (po ? '현장 후기 수정' : '현장 후기 올리기') + '</h3><p class="muted">' + E(j.title) + ' · ' + I.period(j) + '</p></div><button class="x" data-close aria-label="닫기"><i data-lucide="x"></i></button></div>' +
        (j.photoOk
          ? '<p class="demo" style="background:var(--ok-bg);color:var(--ok)"><i data-lucide="badge-check"></i><span>고객이 홍보 활용에 동의한 행사예요. 운영자 확인 후 홈페이지 <b>행사 후기 › 현장 스케치</b>에 실려요.' + (po && po.state === 'published' ? ' 수정하면 다시 확인을 거쳐요.' : '') + '</span></p>'
          : '<p class="demo" style="background:var(--bad-bg);color:var(--bad)"><i data-lucide="lock"></i>고객이 홍보 활용에 동의하지 않은 행사예요. 홈페이지에는 실리지 않고 내부 기록으로만 보관돼요.</p>') +
        '<div class="pw"><form class="form" id="upF" novalidate>' +
        '<div class="fld"><span class="lb">현장 사진 <i>*</i> <small class="muted" id="upCnt"></small></span><div class="ups up-edit" id="upList"></div>' +
        '<label class="drop"><input type="file" id="upFile" accept="image/*" multiple><i data-lucide="image-plus"></i><b>사진 추가</b><small>최대 10장 · 첫 번째 사진이 대표 사진이 돼요</small></label></div>' +
        '<div class="fld"><label for="upT">제목 <i>*</i></label><input class="inp" id="upT" maxlength="40" required placeholder="예) 임직원 가족의 날 캐리커처" value="' + E(po ? po.title : defTitle) + '"><p class="help">업체명은 빼고 적어 주세요. 홈페이지에는 업체명과 정확한 장소가 나오지 않아요.</p></div>' +
        '<div class="fld"><label for="upM">현장 분위기 <i>*</i> <small class="muted" id="upMc"></small></label>' +
        '<div class="hints">' + HINTS.map(function (h) { return '<button type="button" class="hint" data-hint="' + h[1] + '">+ ' + h[0] + '</button>'; }).join('') + '</div>' +
        '<textarea class="inp" id="upM" rows="4" maxlength="300" required placeholder="공간, 손님 반응, 기억에 남는 순간을 2~3문장으로 적어 주세요.">' + (po ? E(po.mood) : '') + '</textarea></div>' +
        '<div class="f2"><div class="fld"><span class="lb">분위기 태그 <small class="muted">최대 4개</small></span><div class="togs">' + MOODS.map(function (t) { return '<label class="tog"><input type="checkbox" name="upTag" value="' + t + '"' + (po && po.tags.indexOf(t) > -1 ? ' checked' : '') + '><span>#' + t + '</span></label>'; }).join('') + '</div></div>' +
        '<div class="fld"><label for="upN">그린 인원 <i>*</i></label><div class="n-in"><input class="inp" id="upN" type="number" min="1" max="2000" inputmode="numeric" required value="' + (po && po.count ? po.count : '') + '" placeholder="예) 120"><span>명</span></div><p class="help">실제로 그려 드린 손님 수예요. 담당자에게 보내는 결과 리포트에 들어가요.</p></div></div>' +
        (j.photoOk ? '<label class="ck"><input type="checkbox" id="upAgree"' + (po ? ' checked' : '') + '>얼굴이 나온 손님에게 촬영·게시 동의를 받았어요. 어린이는 보호자 동의를 받았어요. (필수)</label>' : '') +
        '<div class="mf">' + (po && po.state !== 'published' ? '<button type="button" class="btn btn-o" id="upDel">삭제</button>' : '') + '<button type="button" class="btn btn-o" data-close>취소</button><button class="btn btn-y" type="submit"><i data-lucide="send"></i>' + (j.photoOk ? (po ? '수정해서 다시 올리기' : '후기 올리기') : '내부 기록으로 저장') + '</button></div></form>' +
        '<aside class="pv"><p class="pv-l">홈페이지 미리보기</p><article class="sk-card" id="upPv"></article></aside></div>',
        function (m, close) {
          m.querySelector('.modal-card').classList.add('wide', 'xl'); I.icons();
          var shrink = function (file) {
            return new Promise(function (res) {
              var r = new FileReader();
              r.onload = function () { var im = new Image(); im.onload = function () { var k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .72)); }; im.onerror = function () { res(null); }; im.src = r.result; };
              r.readAsDataURL(file);
            });
          };
          var tags = function () { return $$('input[name=upTag]:checked', m).map(function (x) { return x.value; }); };
          var preview = function () {
            var t = $('#upT', m).value.trim() || '제목을 적어 주세요', md = $('#upM', m).value.trim() || '현장 분위기가 여기에 보여요.';
            $('#upPv', m).innerHTML = '<div class="sk-ph">' + (shots[0] ? '<img src="' + I.src(shots[0]) + '" alt="">' : '<span>대표 사진</span>') + (shots.length > 1 ? '<span class="sk-n">+' + (shots.length - 1) + '</span>' : '') + '</div>' +
              '<div class="sk-b"><p class="sk-m"><span>' + sk.n + '</span>' + E(j.region) + ' · ' + j.start.slice(0, 7).replace('-', '.') + '</p><h4>' + E(t) + '</h4><p class="sk-t">' + E(md) + '</p>' +
              '<p class="sk-tags">' + tags().map(function (x) { return '#' + E(x); }).join(' ') + '</p><p class="sk-a">IUX 작가 · ' + sk.n + (yrs ? ' ' + I.years(yrs) + '년차' : '') + '</p></div>';
            $('#upMc', m).textContent = $('#upM', m).value.length + ' / 300';
          };
          var draw = function () {
            $('#upList', m).innerHTML = shots.map(function (s, i) { return '<figure class="up" draggable="false"><img src="' + I.src(s) + '" alt="">' + (i === 0 ? '<span class="cover-b">대표</span>' : '<button type="button" class="mk" data-cover="' + i + '">대표로</button>') + '<button type="button" class="del" data-rm="' + i + '" aria-label="사진 빼기">×</button></figure>'; }).join('');
            $('#upCnt', m).textContent = shots.length + ' / ' + MAX;
            $('.drop', m).hidden = shots.length >= MAX;
            preview();
          };
          $('#upFile', m).onchange = function () {
            var fs = [].slice.call(this.files).filter(function (f) { return /^image\//.test(f.type) && f.size <= 10 * 1024 * 1024; }).slice(0, MAX - shots.length);
            Promise.all(fs.map(shrink)).then(function (r) { shots = shots.concat(r.filter(Boolean)); draw(); });
            this.value = '';
          };
          m.addEventListener('click', function (e) {
            var rm = e.target.closest('[data-rm]'), cv = e.target.closest('[data-cover]'), h = e.target.closest('[data-hint]');
            if (rm) { shots.splice(+rm.dataset.rm, 1); draw(); }
            if (cv) { var x = shots.splice(+cv.dataset.cover, 1)[0]; shots.unshift(x); draw(); }
            if (h) { var ta = $('#upM', m); ta.value = (ta.value.trim() ? ta.value.trim() + ' ' : '') + h.dataset.hint; ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); preview(); }
          });
          m.addEventListener('change', function (e) {
            if (e.target.name === 'upTag' && tags().length > 4) { e.target.checked = false; I.toast('태그는 4개까지 고를 수 있어요.'); }
            preview();
          });
          m.addEventListener('input', preview);
          var del = $('#upDel', m);
          if (del) del.onclick = function () { db().posts = db().posts.filter(function (x) { return x !== po; }); I.save(); close(); render(); I.toast('현장 후기를 지웠어요.'); };
          $('#upF', m).onsubmit = function (e) {
            e.preventDefault();
            if (!shots.length) { I.toast('사진을 1장 이상 올려 주세요.'); return; }
            if (!$('#upT', m).value.trim()) { $('#upT', m).focus(); I.toast('제목을 적어 주세요.'); return; }
            if ($('#upM', m).value.trim().length < 20) { $('#upM', m).focus(); I.toast('현장 분위기를 20자 이상 적어 주세요.'); return; }
            if (!(+$('#upN', m).value > 0)) { $('#upN', m).focus(); I.toast('그린 인원을 적어 주세요.'); return; }
            if (j.photoOk && !$('#upAgree', m).checked) { I.toast('손님 촬영·게시 동의를 확인해 주세요.'); return; }
            var row = po || { id: 's' + Date.now(), job: jid, a: me };
            row.at = I.stamp(); row.subj = true; row.title = $('#upT', m).value.trim(); row.mood = $('#upM', m).value.trim();
            row.tags = tags(); var cnt = +$('#upN', m).value; row.count = cnt; row.guests = cnt <= 50 ? '50명 이하' : cnt <= 100 ? '50~100명' : cnt <= 200 ? '100~200명' : '200명 이상'; row.photos = shots; row.state = j.photoOk ? 'pending' : 'private';
            db().posts = db().posts || []; if (!po) db().posts.push(row);
            I.save(); close(); render();
            I.toast(j.photoOk ? '현장 후기를 올렸어요. 운영자 확인 후 홈페이지에 게시돼요.' : '내부 기록으로 저장했어요.');
          };
          draw();
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
    var editing = false, pfDraft = null;
    var pfSrc = function (p) { return p.indexOf('data:') === 0 ? p : '../images/' + p + '.jpg'; };
    function profileTab() {
      var a = I.artist(me);
      if (!editing) return '<div class="card"><div class="pf-top"><p class="muted">다른 작가·업체에게는 실명과 연락처가 보이지 않아요. 공고 선정과 정산에만 쓰여요.</p><button class="btn btn-y btn-s" id="pfEdit"><i data-lucide="pencil"></i>프로필 수정</button></div><div class="grid g2"><div><p class="sec-t" style="margin-top:0">기본 정보</p><p>' + E(a.name) + ' · 만 ' + I.age(a.birth) + '세 (' + a.birth + ')</p><p class="num">' + E(a.phone) + ' · ' + E(a.email) + '</p>' +
        '<p class="sec-t">기술·경력 <small class="muted" style="font-weight:500">해가 바뀌면 연차가 자동으로 올라가요</small></p><div class="chips">' + a.skills.map(function (s) { return '<span class="chip">' + I.skill(s.k).n + ' <b>' + I.years(s.since) + '년차</b> <span class="muted">(' + s.since + '~)</span></span>'; }).join('') + '</div>' +
        '<p class="sec-t">활동 지역</p><div class="chips">' + a.regions.map(function (r) { return '<span class="chip">' + r + '</span>'; }).join('') + '</div>' +
        '<p class="sec-t">알림 수신</p><label class="ck"><input type="checkbox" id="pk" ' + (a.kakao ? 'checked' : '') + '>카카오 알림톡</label><label class="ck" style="margin-top:6px"><input type="checkbox" id="pm" ' + (a.mail ? 'checked' : '') + '>메일</label></div>' +
        '<div><p class="sec-t" style="margin-top:0">포트폴리오</p><div class="port">' + (a.portfolio.length ? a.portfolio.map(function (p) { return '<img src="' + pfSrc(p) + '" alt="포트폴리오">'; }).join('') : '<p class="empty">등록된 포트폴리오가 없어요.</p>') + '</div>' +
        '<p class="sec-t">소개</p><p>' + E(a.bio) + '</p></div></div></div>';
      var d = db(), Y = new Date().getFullYear();
      pfDraft = pfDraft || a.portfolio.slice();
      var yopt = function (v) { var h = ''; for (var y = Y; y >= Y - 40; y--) h += '<option value="' + y + '"' + (y === v ? ' selected' : '') + '>' + y + '년부터</option>'; return h; };
      return '<form class="card form" id="pfF" novalidate><div class="pf-top"><h3 style="font-size:17px">프로필 수정</h3><span class="muted">저장하면 바로 반영돼요</span></div>' +
        '<div class="grid g2"><div>' +
        '<p class="sec-t" style="margin-top:0">기본 정보</p><div class="f2"><div class="fld"><label>이름</label><input class="inp" value="' + E(a.name) + '" disabled></div><div class="fld"><label>생년월일</label><input class="inp" value="' + a.birth + '" disabled></div></div>' +
        '<p class="pf-lock">이름·생년월일은 본인 인증 정보라 바꿀 수 없어요. 잘못됐다면 운영자에게 문의해 주세요.</p>' +
        '<div class="f2"><div class="fld"><label for="pf_ph">휴대폰<i>*</i></label><input class="inp" id="pf_ph" inputmode="tel" value="' + E(a.phone) + '" required><p class="help">바꾸면 휴대폰 인증을 다시 해요.</p></div><div class="fld"><label for="pf_em">이메일<i>*</i></label><input class="inp" id="pf_em" type="email" value="' + E(a.email) + '" required></div></div>' +
        '<p class="sec-t">기술·경력</p><div id="pfSk">' + d.skills.map(function (s) {
          var mine = a.skills.filter(function (x) { return x.k === s.k; })[0];
          return '<div class="skrow' + (mine ? ' on' : '') + '" data-k="' + s.k + '"><label class="tog"><input type="checkbox"' + (mine ? ' checked' : '') + '><span>' + s.n + '</span></label><span class="since"' + (mine ? '' : ' hidden') + '><select class="sel" aria-label="' + s.n + ' 시작 연도">' + yopt(mine ? mine.since : Y - 2) + '</select><b class="yr">' + I.years(mine ? mine.since : Y - 2) + '년차</b></span></div>';
        }).join('') + '</div>' +
        '<p class="sec-t">활동 지역</p><div class="togs" id="pfRg">' + d.regions.map(function (r) { return '<label class="tog"><input type="checkbox" value="' + r + '"' + (a.regions.indexOf(r) > -1 ? ' checked' : '') + '><span>' + r + '</span></label>'; }).join('') + '</div>' +
        '</div><div>' +
        '<p class="sec-t" style="margin-top:0">포트폴리오 <small class="muted" id="pfCnt"></small></p><div class="ups up-edit" id="pfList"></div>' +
        '<label class="drop" id="pfDrop"><input type="file" id="pfFile" accept="image/*" multiple><i data-lucide="image-plus"></i><b>작품 사진 추가</b><small>최대 8장 · 첫 번째 사진이 프로필 사진이 돼요</small></label>' +
        '<p class="sec-t">소개</p><div class="fld"><textarea class="inp" id="pf_bio" rows="4" maxlength="200" placeholder="주로 하는 행사, 화풍, 완성 시간 등을 적어 주세요.">' + E(a.bio) + '</textarea><p class="help" id="pfBioC"></p></div>' +
        '</div></div>' +
        '<div class="mf"><button type="button" class="btn btn-o" id="pfCancel">취소</button><button class="btn btn-y" type="submit"><i data-lucide="check"></i>저장</button></div></form>';
    }
    function bindProfile() {
      var ed = $('#pfEdit'); if (ed) ed.onclick = function () { editing = true; pfDraft = null; render(); };
      var f = $('#pfF'); if (!f) return;
      var MAX = 8;
      var draw = function () {
        $('#pfList').innerHTML = pfDraft.map(function (p, i) { return '<figure class="up"><img src="' + pfSrc(p) + '" alt="">' + (i === 0 ? '<span class="cover-b">프로필</span>' : '<button type="button" class="mk" data-pfc="' + i + '">맨 앞으로</button>') + '<button type="button" class="del" data-pfr="' + i + '" aria-label="사진 빼기">×</button></figure>'; }).join('');
        $('#pfCnt').textContent = pfDraft.length + ' / ' + MAX; $('#pfDrop').hidden = pfDraft.length >= MAX;
      };
      var shrink = function (file) {
        return new Promise(function (res) { var r = new FileReader(); r.onload = function () { var im = new Image(); im.onload = function () { var k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .72)); }; im.onerror = function () { res(null); }; im.src = r.result; }; r.readAsDataURL(file); });
      };
      $('#pfFile').onchange = function () {
        var fs = [].slice.call(this.files).filter(function (x) { return /^image\//.test(x.type) && x.size <= 10 * 1024 * 1024; }).slice(0, MAX - pfDraft.length);
        Promise.all(fs.map(shrink)).then(function (r) { pfDraft = pfDraft.concat(r.filter(Boolean)); draw(); }); this.value = '';
      };
      f.addEventListener('click', function (e) {
        var r = e.target.closest('[data-pfr]'), c = e.target.closest('[data-pfc]');
        if (r) { pfDraft.splice(+r.dataset.pfr, 1); draw(); }
        if (c) { pfDraft.unshift(pfDraft.splice(+c.dataset.pfc, 1)[0]); draw(); }
      });
      $$('#pfSk .skrow').forEach(function (row) {
        var cb = $('input', row), sp = $('.since', row), sel = $('select', row);
        cb.onchange = function () { sp.hidden = !cb.checked; row.classList.toggle('on', cb.checked); };
        sel.onchange = function () { $('.yr', row).textContent = I.years(+sel.value) + '년차'; };
      });
      var bio = $('#pf_bio'), bc = function () { $('#pfBioC').textContent = bio.value.length + ' / 200'; }; bio.oninput = bc; bc();
      $('#pfCancel').onclick = function () { editing = false; pfDraft = null; render(); };
      f.onsubmit = function (e) {
        e.preventDefault();
        var a = I.artist(me);
        var sk = $$('#pfSk .skrow').filter(function (r) { return $('input', r).checked; }).map(function (r) { return { k: r.dataset.k, since: +$('select', r).value }; });
        var rg = $$('#pfRg input:checked').map(function (x) { return x.value; });
        var ph = $('#pf_ph').value.replace(/[^\d]/g, ''), em = $('#pf_em').value.trim();
        if (!/^01\d{8,9}$/.test(ph)) { $('#pf_ph').focus(); I.toast('휴대폰 번호를 확인해 주세요.'); return; }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { $('#pf_em').focus(); I.toast('이메일 주소를 확인해 주세요.'); return; }
        if (!sk.length) { I.toast('기술을 1개 이상 골라 주세요.'); return; }
        if (!rg.length) { I.toast('활동 지역을 1곳 이상 골라 주세요.'); return; }
        var phF = ph.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3'), phChanged = phF !== a.phone;
        a.phone = phF; a.email = em; a.skills = sk; a.regions = rg; a.portfolio = pfDraft.slice(); a.bio = bio.value.trim() || a.bio;
        I.save(); editing = false; pfDraft = null; render(); scrollTo({ top: $('#ptabs').offsetTop - 80, behavior: 'smooth' });
        I.toast('프로필을 저장했어요.' + (phChanged ? ' 바뀐 번호로 인증 문자를 보냈어요. (시안)' : ''));
      };
      draw();
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
      bindTax(); bindProfile();
      I.icons();
      var a = I.artist(me);
      var pk = $('#pk'), pm = $('#pm');
      if (pk) pk.onchange = function () { a.kakao = pk.checked; I.save(); I.toast('알림톡 수신을 ' + (pk.checked ? '켰어요.' : '껐어요.')); };
      if (pm) pm.onchange = function () { a.mail = pm.checked; I.save(); I.toast('메일 수신을 ' + (pm.checked ? '켰어요.' : '껐어요.')); };
    }
    $('#ptabs').addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) { tab = b.dataset.t; editing = false; pfDraft = null; render(); } });
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
