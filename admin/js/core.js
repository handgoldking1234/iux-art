/* IUX ART 관리자·작가 공통 — 저장소와 계산 (시안용 간단 스크립트)
   실제 서비스에서는 DB·인증·알림톡/메일 API로 교체합니다. */
var IUX = (function () {
  var KEY = 'iuxart-admin-v1';
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  function load() {
    try {
      var s = localStorage.getItem(KEY);
      if (s) { var o = JSON.parse(s); if (o && o.version === IUX_SEED.version) return o; }
    } catch (e) {}
    return clone(IUX_SEED);
  }
  var db = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} db = clone(IUX_SEED); return db; }

  /* ---------- 날짜 ---------- */
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var now = new Date();
  var today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  var stamp = function () { var d = new Date(); return today + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  var toDate = function (s) { var p = s.slice(0, 10).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  var days = function (a, b) { return Math.round((toDate(b) - toDate(a)) / 864e5) + 1; };
  var md = function (s) { var p = s.slice(0, 10).split('-'); return (+p[1]) + '/' + (+p[2]); };
  var period = function (j) { return j.start === j.end ? j.start : j.start + ' ~ ' + j.end; };

  /* 나이: 생일 기준 만 나이 — 날짜가 바뀌면 자동 갱신 */
  function age(birth) {
    var b = toDate(birth), a = now.getFullYear() - b.getFullYear();
    if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) a--;
    return a;
  }
  /* 연차: 시작 연도를 1년차로 계산 — 해가 바뀌면 자동으로 +1 */
  function years(since) { return Math.max(1, now.getFullYear() - since + 1); }

  /* ---------- 조회 ---------- */
  var skill = function (k) { for (var i = 0; i < db.skills.length; i++) if (db.skills[i].k === k) return db.skills[i]; return { k: k, n: k, rate: 0 }; };
  var artist = function (id) { for (var i = 0; i < db.artists.length; i++) if (db.artists[i].id === id) return db.artists[i]; return null; };
  var job = function (id) { for (var i = 0; i < db.jobs.length; i++) if (db.jobs[i].id === id) return db.jobs[i]; return null; };
  var won = function (n) { return (Math.round(n) || 0).toLocaleString('ko-KR') + '원'; };
  var man = function (n) { n = Math.round(n) || 0; return n >= 10000 ? (Math.round(n / 1000) / 10).toLocaleString('ko-KR') + '만' : n.toLocaleString('ko-KR'); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- 참여·연속 ---------- */
  function history(aid) {
    return db.jobs.filter(function (j) { return j.apps.some(function (p) { return p.a === aid; }); })
      .sort(function (x, y) { return x.start < y.start ? 1 : -1; });
  }
  function selectedJobs(aid) {
    return history(aid).filter(function (j) { return j.status !== 'open' && j.status !== 'review' && j.apps.some(function (p) { return p.a === aid && p.s === 'selected'; }); });
  }
  /* 연속 확정: 최근 restWindow일 안의 마감 공고를 최근부터 거꾸로 보며,
     신청한 공고에서 연달아 확정된 횟수. 미선정·휴식 제외가 있으면 끊김 */
  function streak(aid) {
    var list = history(aid).filter(function (j) { return j.status === 'confirmed' || j.status === 'done'; });
    var n = 0, from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - db.settings.restWindow);
    for (var i = 0; i < list.length; i++) {
      if (toDate(list[i].start) < from) break;          /* 계산 기간 밖은 세지 않음 */
      var p = list[i].apps.filter(function (x) { return x.a === aid; })[0];
      if (p.s !== 'selected') break;                    /* 미선정·휴식 제외면 끊김 */
      n++;
    }
    return n;
  }
  var isRest = function (aid) { return streak(aid) >= db.settings.restCount; };
  var count = function (aid) { return selectedJobs(aid).length; };

  /* ---------- 정산 ---------- */
  /* 정산 정보: 프리랜서는 주민등록번호, 개인사업자는 사업자등록번호가 있어야 지급 가능 */
  function hasTaxInfo(a) { return !!(a && a.taxInfo && (a.tax === 'business' ? a.taxInfo.kind === 'biz' : a.taxInfo.kind === 'rrn')); }
  function needInfo() {
    /* 확정·완료 행사가 있는데 정산 정보가 없는 작가 */
    return db.artists.filter(function (a) { return !hasTaxInfo(a) && selectedJobs(a.id).length; });
  }
  function transport(j) { return /서울|경기|인천/.test(j.region) ? 0 : db.settings.transportOutside; }
  function settlements() {
    var rows = [];
    db.jobs.forEach(function (j) {
      if (j.status !== 'confirmed' && j.status !== 'done') return;
      j.apps.forEach(function (p) {
        if (p.s !== 'selected') return;
        var a = artist(p.a); if (!a) return;
        var d = days(j.start, j.end), rate = skill(j.skill).rate;
        var pay = rate * j.hours * d, tr = transport(j) * d, gross = pay + tr;
        var tax = a.tax === 'freelancer' ? Math.floor(gross * db.settings.taxRate / 100 / 10) * 10 : 0;
        var key = j.id + ':' + a.id, paidAt = db.paid[key];
        var st = paidAt ? 'paid' : (j.status === 'done' ? (hasTaxInfo(a) ? 'due' : 'needinfo') : 'scheduled');
        rows.push({ key: key, job: j, artist: a, days: d, hours: j.hours, rate: rate, pay: pay, transport: tr, gross: gross, tax: tax, net: gross - tax,
          state: st, paidAt: paidAt || '', infoOk: hasTaxInfo(a) });
      });
    });
    return rows.sort(function (x, y) { return x.job.start < y.job.start ? 1 : -1; });
  }

  /* ---------- 알림 ---------- */
  function send(type, jid, aids, chans, note) {
    var out = [];
    ['kakao', 'email'].forEach(function (ch) {
      if (!chans[ch]) return;
      var to = aids.filter(function (id) { var a = artist(id); return a && (ch === 'kakao' ? a.kakao : a.mail); });
      if (!to.length) return;
      var row = { at: stamp(), ch: ch, type: type, jid: jid || '', to: to, note: note || '' };
      db.logs.unshift(row); out.push(row);
    });
    return out;
  }
  /* 공고 알림 대상: 활동 중 + 기술 보유 + 지역 일치 */
  function targets(j) {
    return db.artists.filter(function (a) {
      return a.status === 'active' && a.skills.some(function (s) { return s.k === j.skill; }) && a.regions.indexOf(j.region) > -1;
    }).map(function (a) { return a.id; });
  }

  /* ---------- 상태 라벨 ---------- */
  var JOB_STATE = { open: ['모집 중', 'st-open'], review: ['선정 대기', 'st-review'], confirmed: ['확정', 'st-ok'], done: ['행사 완료', 'st-done'] };
  var ART_STATE = { active: ['활동 중', 'st-ok'], pending: ['승인 대기', 'st-review'], paused: ['활동 중지', 'st-done'] };
  var PHOTO_STATE = { pending: ['검수 대기', 'st-review'], published: ['홈페이지 게시', 'st-ok'], hidden: ['게시 안 함', 'st-done'], private: ['내부 보관', 'st-bad'] };
  var photoSrc = function (p) { return p.src.indexOf('data:') === 0 ? p.src : '../' + p.src; };
  var photosOf = function (jid, aid) { return (db.photos || []).filter(function (p) { return (!jid || p.job === jid) && (!aid || p.a === aid); }); };
  /* ---------- 작가 평가 ---------- */
  var CRIT = [['work', '작품 완성도'], ['time', '시간 준수'], ['cs', '고객 응대'], ['manner', '현장 매너']];
  var REHIRE = { yes: ['재섭외 추천', 'st-ok'], ok: ['보통', 'st-done'], no: ['재섭외 보류', 'st-bad'] };
  var reviewOf = function (jid, aid) { return (db.reviews || []).filter(function (r) { return r.job === jid && r.a === aid; })[0]; };
  var reviewsOf = function (aid) { return (db.reviews || []).filter(function (r) { return r.a === aid; }).sort(function (x, y) { return x.at < y.at ? 1 : -1; }); };
  var revAvg = function (r) { return CRIT.reduce(function (s, c) { return s + (r.s[c[0]] || 0); }, 0) / CRIT.length; };
  /* 평점: 평가가 있으면 평가 평균, 없으면 등록 때 값 */
  var rating = function (a) { var R = reviewsOf(a.id); if (!R.length) return a.rating || 0; return Math.round(R.reduce(function (s, r) { return s + revAvg(r); }, 0) / R.length * 10) / 10; };
  var needReview = function () {
    var out = [];
    db.jobs.forEach(function (j) { if (j.status !== 'done' || j.hidden) return; j.apps.forEach(function (p) { if (p.s === 'selected' && !reviewOf(j.id, p.a)) out.push({ j: j, a: artist(p.a) }); }); });
    return out;
  };
  var stars = function (v) { var n = Math.round(v); return '<span class="stars-v" aria-label="' + v + '점">' + '★★★★★'.slice(0, n) + '<i>' + '★★★★★'.slice(n) + '</i></span>'; };
  var PAY_STATE = { paid: ['지급 완료', 'st-ok'], due: ['지급 대기', 'st-review'], needinfo: ['정산 정보 미등록', 'st-bad'], scheduled: ['행사 후 정산', 'st-done'] };
  var badge = function (map, k) { var v = map[k] || [k, '']; return '<span class="badge ' + v[1] + '">' + v[0] + '</span>'; };
  var skillChips = function (a) {
    return a.skills.map(function (s) { return '<span class="chip">' + esc(skill(s.k).n) + ' <b>' + years(s.since) + '년차</b></span>'; }).join('');
  };
  var avatar = function (a, cls) {
    var img = a.portfolio && a.portfolio[0];
    return img ? '<span class="av ' + (cls || '') + '"><img src="../images/' + img + '.jpg" alt=""></span>'
               : '<span class="av ' + (cls || '') + '">' + esc(a.name.slice(-2)) + '</span>';
  };

  /* ---------- UI 공통 ---------- */
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }
  function modal(html, onReady) {
    var m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(m);
    var close = function () { m.remove(); document.removeEventListener('keydown', onKey); };
    var onKey = function (e) { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) close(); });
    if (onReady) onReady(m, close);
    var f = m.querySelector('button,input,select,textarea'); if (f) f.focus();
    return close;
  }
  function icons() { if (window.lucide) lucide.createIcons(); }

  return {
    get db() { return db; }, save: save, reset: reset,
    today: today, stamp: stamp, toDate: toDate, days: days, md: md, period: period, age: age, years: years,
    skill: skill, artist: artist, job: job, won: won, man: man, esc: esc,
    history: history, selectedJobs: selectedJobs, streak: streak, isRest: isRest, count: count,
    settlements: settlements, send: send, targets: targets, hasTaxInfo: hasTaxInfo, needInfo: needInfo,
    JOB_STATE: JOB_STATE, ART_STATE: ART_STATE, PAY_STATE: PAY_STATE, PHOTO_STATE: PHOTO_STATE, CRIT: CRIT, REHIRE: REHIRE, reviewOf: reviewOf, reviewsOf: reviewsOf, revAvg: revAvg, rating: rating, needReview: needReview, stars: stars, photoSrc: photoSrc, photosOf: photosOf, badge: badge, skillChips: skillChips, avatar: avatar,
    toast: toast, modal: modal, icons: icons
  };
})();
