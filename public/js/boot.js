/* IUX ART 서버 연결 — 페이지가 그려지기 전에 DB 상태를 받아 window.IUX_SEED로 넣습니다.
   <script src="/js/boot.js" data-mode="admin|artist|public|report"></script> (data.js 다음, core.js 앞)
   API가 없는 정적 미리보기에서는 아무것도 하지 않아 기존 시안 동작(브라우저 저장)을 그대로 씁니다. */
(function () {
  var me = document.currentScript, mode = me && me.getAttribute('data-mode');
  if (!mode || location.protocol === 'file:') return;
  var token = (location.search.match(/[?&]r=([a-z0-9]+)/) || [])[1] || '';
  var preview = /[?&]pv=1/.test(location.search);

  function req(method, url, body) {
    var x = new XMLHttpRequest();
    try {
      x.open(method, url, false);
      if (body !== undefined) x.setRequestHeader('Content-Type', 'application/json');
      x.send(body === undefined ? null : JSON.stringify(body));
    } catch (e) { return { status: 0, data: null }; }
    var data = null; try { data = JSON.parse(x.responseText); } catch (e) {}
    return { status: x.status, data: data };
  }
  function toLogin() {
    var back = encodeURIComponent(location.pathname + location.search);
    location.replace(mode === 'admin' ? '/admin/login.html?next=' + back : '/login.html?next=' + back);
  }

  var r = req('GET', '/api/state?mode=' + mode + (mode === 'report' ? '&r=' + token + (preview ? '&pv=1' : '') : ''));
  if (r.status === 401 || r.status === 403) { toLogin(); document.documentElement.style.visibility = 'hidden'; return; }
  if (mode === 'report' && r.status === 404) { window.IUX_SEED = { version: (window.IUX_SEED || {}).version, skills: [], regions: [], settings: {}, artists: [], jobs: [], logs: [], paid: {}, posts: [], reviews: [], reports: {}, quotes: [] }; window.__IUX_MODE = mode; return; }
  if (r.status !== 200 || !r.data) return; // API 없음 → 시안 모드
  window.IUX_SEED = r.data;
  window.__IUX_MODE = mode;
  window.__IUX_ME = r.data.me || null;

  /* 화면 객체를 그대로 두고 내용만 바꿈 (열려 있는 화면의 참조가 끊기지 않게) */
  function merge(db, s) {
    Object.keys(s).forEach(function (k) {
      var a = db[k], b = s[k];
      if (Array.isArray(a) && Array.isArray(b) && b.length && b[0] && b[0].id !== undefined) {
        var byId = {}; a.forEach(function (x) { if (x && x.id !== undefined) byId[x.id] = x; });
        db[k] = b.map(function (x) { var o = byId[x.id]; if (!o) return x; Object.keys(o).forEach(function (p) { if (!(p in x)) delete o[p]; }); return Object.assign(o, x); });
      } else db[k] = b;
    });
  }
  function fail(res) {
    if (res.status === 401) { alert('로그인이 만료됐어요. 다시 로그인해 주세요.'); toLogin(); return; }
    if (res.status === 409) { alert((res.data && res.data.error) || '다른 곳에서 먼저 저장된 내용이 있어요. 최신 내용으로 다시 불러올게요.'); location.reload(); return; }
    alert((res.data && res.data.error) || '저장하지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.');
  }

  window.IUXSave = function (db) {
    var res;
    if (mode === 'admin') {
      res = req('PUT', '/api/admin/state', { rev: db.rev, state: db });
      if (res.status !== 200) return fail(res);
      db.rev = res.data.rev;
      if (res.data.state) merge(db, res.data.state);
    } else if (mode === 'artist') {
      res = req('POST', '/api/artist/sync', { state: db });
      if (res.status !== 200) return fail(res);
      merge(db, res.data);
    } else if (mode === 'report') {
      var jid = Object.keys(db.reports || {})[0], rp = jid && db.reports[jid];
      if (!rp || preview) return;
      req('POST', '/api/report/' + token, { openedAt: rp.openedAt, rating: rp.rating, review: rp.review, publish: rp.publish });
    }
  };

  /* 로그아웃 */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a,button');
    if (!a || (a.textContent || '').trim() !== '로그아웃') return;
    e.preventDefault();
    req('POST', '/api/auth/logout', {});
    location.href = mode === 'admin' ? '/admin/login.html' : '/login.html';
  }, true);
})();

/* 관리자: 정산 정보 원문 보기 (서버가 열람 기록을 남김) */
document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('[data-secret]');
  if (!b) return;
  fetch('/api/admin/secret?artist=' + encodeURIComponent(b.getAttribute('data-secret'))).then(function (r) { return r.json().then(function (o) { return { ok: r.ok, o: o }; }); }).then(function (x) {
    if (!x.ok) { alert(x.o.error || '불러오지 못했어요.'); return; }
    var d = x.o, num = d.rrn ? d.rrn.slice(0, 6) + '-' + d.rrn.slice(6) : d.bizNo ? d.bizNo.slice(0, 3) + '-' + d.bizNo.slice(3, 5) + '-' + d.bizNo.slice(5) : '';
    var t = document.createElement('div');
    t.className = 'demo'; t.style.marginTop = '6px';
    t.textContent = (d.rrn ? '주민등록번호 ' : '사업자등록번호 ') + num + ' · ' + (d.bank || '') + ' ' + (d.account || '') + ' (' + (d.holder || '') + ')';
    b.replaceWith(t);
  });
});
