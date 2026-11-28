/* 관리자 > 소식·퍼나르기
   글 쓰기·예약 → 홈페이지(/story) 게시, 자동 채널(페이스북·인스타그램) 올리기, 수동 채널(네이버) 복사 */
(function () {
  'use strict';
  if (document.body.dataset.page !== 'stories') return;

  var SITE = (window.IUX_CONFIG && window.IUX_CONFIG.site) || 'https://art.iux.kr';
  var CATS = { story: '스토리', news: '뉴스', promo: '홍보' };
  var MANUAL = [
    { id: 'nblog', name: '네이버 블로그', url: 'https://blog.naver.com/GoBlogWrite.naver' },
    { id: 'ncafe', name: '네이버 카페', url: 'https://cafe.naver.com/' }
  ];
  var AUTO = [{ id: 'fb', name: '페이스북 페이지' }, { id: 'insta', name: '인스타그램' }];

  var stories = [], conn = { fb: false, insta: false }, editing = null, sharing = null, filter = '', imgData = '';
  var $ = function (id) { return document.getElementById(id); };
  var E = function (v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

  function toast(msg) {
    var t = $('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.tm); toast.tm = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  function icons() { try { if (window.lucide) window.lucide.createIcons(); } catch (e) {} }

  function api(method, url, data) {
    return fetch(url, { method: method, credentials: 'same-origin', headers: data ? { 'Content-Type': 'application/json' } : {}, body: data ? JSON.stringify(data) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (o) { if (!r.ok) throw new Error(o.error || '요청에 실패했어요. (' + r.status + ')'); return o; }); });
  }

  /* 시각 */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toLocalInput(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function showTime(iso) { var d = new Date(iso); return d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  /* 그날 오전 9시~오후 8시 59분 사이 무작위 시각 */
  function randomTime(day) { var d = new Date(day); d.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0); return d; }

  function stateOf(s) {
    if (s.state !== 'pub') return 'draft';
    return new Date(s.at).getTime() > Date.now() ? 'sched' : 'live';
  }
  function manualLeft(s) { return MANUAL.filter(function (m) { return !(s.manual && s.manual[m.id]); }).length; }

  /* ── 목록 ── */
  function renderList() {
    var rows = stories.filter(function (s) {
      var st = stateOf(s);
      if (!filter) return true;
      if (filter === 'todo') return st === 'live' && manualLeft(s) > 0;
      return st === filter;
    });
    var badge = { draft: '<span class="badge st-done">임시 저장</span>', sched: '<span class="badge st-open">예약</span>', live: '<span class="badge st-ok">게시됨</span>' };
    $('storyBody').innerHTML = rows.length ? rows.map(function (s) {
      var st = stateOf(s);
      var auto = AUTO.map(function (a) {
        var r = s.shared && s.shared[a.id];
        if (r && r.ok) return '<span class="badge st-ok">' + a.name.slice(0, 4) + ' 완료</span>';
        if (r && !r.ok) return '<span class="badge st-bad" title="' + E(r.error) + '">' + a.name.slice(0, 4) + ' 실패</span>';
        if (s.auto && s.auto[a.id]) return '<span class="badge st-review">' + a.name.slice(0, 4) + ' 대기</span>';
        return '';
      }).join(' ') || '<span class="muted">-</span>';
      var man = st === 'live' ? (manualLeft(s) ? '<span class="badge st-review">' + manualLeft(s) + '곳 남음</span>' : '<span class="badge st-ok">완료</span>') : '<span class="muted">-</span>';
      return '<tr><td>' + showTime(s.at) + '</td><td>' + E(CATS[s.cat] || '') + '</td><td><b>' + E(s.title) + '</b></td><td>' + badge[st] + '</td><td>' + auto + '</td><td>' + man + '</td>' +
        '<td class="r" style="white-space:nowrap">' +
        (st === 'live' ? '<button type="button" class="btn btn-y btn-s" data-share="' + E(s.id) + '">퍼나르기</button> <a class="btn btn-o btn-s" href="/story/' + encodeURIComponent(s.id) + '" target="_blank" rel="noopener">보기</a> ' : '') +
        '<button type="button" class="btn btn-o btn-s" data-edit="' + E(s.id) + '">수정</button> <button type="button" class="btn btn-o btn-s" data-del="' + E(s.id) + '">삭제</button></td></tr>';
    }).join('') : '<tr><td colspan="7"><div class="empty-s"><i data-lucide="newspaper"></i>' + (filter ? '여기에 해당하는 글이 없어요.' : '아직 쓴 글이 없어요. 새 글 쓰기로 시작하세요.') + '</div></td></tr>';
    var pill = function (ok, name) { return name + ' <span class="badge ' + (ok ? 'st-ok">연결됨' : 'st-done">연결 전') + '</span>'; };
    $('connLine').innerHTML = '자동 채널 연결 상태: ' + pill(conn.fb, '페이스북 페이지') + ' · ' + pill(conn.insta, '인스타그램') + (conn.fb && conn.insta ? '' : ' · 연결 방법은 저장소의 docs/STORY.md 에 있습니다. 연결 전에는 퍼나르기에서 복사해 올리면 됩니다.');
    icons();
  }

  /* ── 글쓰기 ── */
  function setImage(src) {
    $('imgPrev').innerHTML = src ? '<img src="' + E(src) + '" alt="" style="width:100%;height:100%;object-fit:cover">' : '없음';
  }
  function openEdit(s) {
    editing = s || null; imgData = '';
    $('editTitle').textContent = s ? '글 수정' : '새 글 쓰기';
    $('f_cat').value = s ? s.cat : 'story';
    $('f_title').value = s ? s.title : '';
    $('f_summary').value = s ? s.summary : '';
    $('f_body').value = s ? s.body : '';
    $('f_tags').value = s ? (s.tags || []).join(' ') : '';
    $('f_at').value = toLocalInput(s ? new Date(s.at) : new Date());
    $('f_fb').checked = s ? !!(s.auto && s.auto.fb) : conn.fb;
    $('f_insta').checked = s ? !!(s.auto && s.auto.insta) : conn.insta;
    $('f_img').value = '';
    $('imgPrev').dataset.src = s ? s.image || '' : '';
    setImage(s ? s.image : '');
    $('editCard').hidden = false;
    $('editCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('f_title').focus();
  }
  function collect(state) {
    var at = $('f_at').value ? new Date($('f_at').value) : new Date();
    return {
      id: editing ? editing.id : undefined,
      cat: $('f_cat').value, title: $('f_title').value, summary: $('f_summary').value, body: $('f_body').value,
      tags: $('f_tags').value, image: imgData || $('imgPrev').dataset.src || '',
      state: state, at: at.toISOString(), auto: { fb: $('f_fb').checked, insta: $('f_insta').checked },
      manual: editing ? editing.manual : {}
    };
  }
  function save(state) {
    if (!$('f_title').value.trim()) { toast('제목을 적어 주세요.'); $('f_title').focus(); return; }
    var data = collect(state);
    var later = state === 'pub' && new Date(data.at).getTime() > Date.now() + 60000;
    api('POST', '/api/admin/story', { story: data }).then(function (o) {
      stories = o.stories; $('editCard').hidden = true; editing = null;
      toast(state === 'draft' ? '임시 저장했어요.' : later ? '예약했어요. ' + showTime(data.at) + '에 올라갑니다.' : '홈페이지에 올렸어요.');
      renderList();
      if (state === 'pub' && !later && o.saved && o.saved[0]) openShare(o.saved[0].id);
    }).catch(function (e) { toast(e.message); });
  }

  /* 사진을 줄여서 올림 (긴 변 1600px) */
  function readImage(file) {
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var k = Math.min(1, 1600 / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        imgData = c.toDataURL('image/jpeg', 0.88);
        setImage(imgData);
      };
      img.onerror = function () { toast('이 이미지는 열 수 없어요.'); };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  /* ── 일주일 예약: 임시 저장 글을 내일부터 하루 한 편씩, 무작위 시각으로 ── */
  function scheduleWeek() {
    var drafts = stories.filter(function (s) { return stateOf(s) === 'draft'; }).sort(function (a, b) { return a.created < b.created ? -1 : 1; }).slice(0, 7);
    if (!drafts.length) { toast('임시 저장한 글이 없어요. 글을 먼저 임시 저장해 두세요.'); return; }
    /* 이미 예약된 날은 건너뜀 */
    var taken = {};
    stories.forEach(function (s) { if (stateOf(s) === 'sched') taken[new Date(s.at).toDateString()] = 1; });
    var day = new Date(); var plan = [];
    drafts.forEach(function (s) {
      do { day = new Date(day.getTime() + 86400000); } while (taken[day.toDateString()]);
      var c = JSON.parse(JSON.stringify(s)); c.state = 'pub'; c.at = randomTime(day).toISOString();
      if (!c.auto) c.auto = {};
      if (conn.fb) c.auto.fb = true;
      if (conn.insta && c.image) c.auto.insta = true;
      plan.push(c);
    });
    var msg = '임시 저장 글 ' + plan.length + '편을 하루 한 편씩 예약할까요?\n\n' + plan.map(function (p) { return showTime(p.at) + '  ' + p.title; }).join('\n');
    if (!window.confirm(msg)) return;
    api('POST', '/api/admin/story', { stories: plan }).then(function (o) { stories = o.stories; toast(plan.length + '편을 예약했어요.'); filter = 'sched'; syncTabs(); renderList(); }).catch(function (e) { toast(e.message); });
  }

  /* ── 퍼나르기 ── */
  function tagsOf(s, max) { return (max ? s.tags.slice(0, max) : s.tags || []).map(function (t) { return '#' + t; }).join(' '); }
  function join(parts) { return parts.filter(function (p) { return p && String(p).trim(); }).join('\n\n'); }
  function linkOf(s) { return SITE + '/story/' + encodeURIComponent(s.id); }
  function manualFields(m, s) {
    if (m.id === 'nblog') return [['제목', s.title], ['본문', join([s.body || s.summary, '원본 보기: ' + linkOf(s)])], ['태그', (s.tags || []).slice(0, 30).join(', ')]];
    return [['제목', s.title], ['본문', join([s.summary, s.body, linkOf(s)])]];
  }
  function openShare(id) {
    var s = stories.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    sharing = id;
    $('shareName').textContent = '· ' + s.title;
    var auto = AUTO.map(function (a) {
      var r = s.shared && s.shared[a.id], st;
      if (r && r.ok) st = '<span class="badge st-ok">올렸음 · ' + showTime(r.at) + '</span>' + (r.link ? ' <a href="' + E(r.link) + '" target="_blank" rel="noopener">열기</a>' : '');
      else if (!conn[a.id]) st = '<span class="badge st-done">연결 전</span> <span class="muted">아래 수동 방식처럼 복사해서 올리세요.</span>';
      else st = (r ? '<span class="badge st-bad">실패</span> <span class="muted">' + E(r.error) + '</span> ' : '') + '<button type="button" class="btn btn-y btn-s" data-post="' + a.id + '"><i data-lucide="send"></i>지금 올리기</button>';
      return '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:10px 0;border-bottom:1px solid var(--line)"><b style="min-width:120px">' + a.name + '</b>' + st + '</div>';
    }).join('');
    var both = AUTO.filter(function (a) { return conn[a.id] && !(s.shared && s.shared[a.id] && s.shared[a.id].ok); });
    var manual = MANUAL.map(function (m) {
      var done = s.manual && s.manual[m.id];
      return '<div style="padding:14px 0;border-bottom:1px solid var(--line)"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px"><b style="min-width:120px">' + m.name + '</b><span class="badge st-review">수동</span>' +
        '<a class="btn btn-o btn-s" href="' + m.url + '" target="_blank" rel="noopener"><i data-lucide="external-link"></i>글쓰기 열기</a>' +
        '<label style="margin-left:auto;display:flex;gap:6px;align-items:center;font-weight:700;font-size:13px"><input type="checkbox" data-done="' + m.id + '"' + (done ? ' checked' : '') + '> 올렸음</label></div>' +
        manualFields(m, s).map(function (f, i) {
          return '<div class="fld" style="margin-bottom:8px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span class="lb" style="margin:0">' + f[0] + '</span><button type="button" class="btn btn-k btn-s" data-copy="c_' + m.id + i + '" style="margin-left:auto"><i data-lucide="copy"></i>복사</button></div>' +
            '<textarea readonly id="c_' + m.id + i + '" style="height:' + (f[0] === '본문' ? 120 : 42) + 'px">' + E(f[1]) + '</textarea></div>';
        }).join('') + '</div>';
    }).join('');
    $('shareBody').innerHTML =
      '<p class="lb" style="font-size:12px;font-weight:800;margin-bottom:4px">자동으로 올리는 곳</p>' + auto +
      (both.length > 1 ? '<div style="padding:10px 0"><button type="button" class="btn btn-y" data-post="all"><i data-lucide="send"></i>연결된 곳에 모두 올리기</button></div>' : '') +
      '<p class="lb" style="font-size:12px;font-weight:800;margin:18px 0 0">직접 올리는 곳</p>' + manual +
      (s.image ? '<p class="note">이미지는 글쓰기 화면에서 같은 사진을 첨부하세요. <a href="' + E(s.image) + '" target="_blank" rel="noopener">이미지 열기</a></p>' : '') +
      '<div style="text-align:right;margin-top:12px"><button type="button" class="btn btn-o" id="shareClose">닫기</button></div>';
    $('shareCard').hidden = false;
    icons();
    $('shareCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function post(which, btn) {
    var s = stories.filter(function (x) { return x.id === sharing; })[0];
    if (!s) return;
    var channels = which === 'all' ? AUTO.map(function (a) { return a.id; }).filter(function (c) { return conn[c] && !(s.shared && s.shared[c] && s.shared[c].ok); }) : [which];
    btn.disabled = true; btn.textContent = '올리는 중…';
    api('POST', '/api/admin/story/share', { id: s.id, channels: channels }).then(function (o) {
      stories = o.stories;
      var bad = Object.keys(o.result).filter(function (k) { return !o.result[k].ok; });
      toast(bad.length ? '올리지 못한 곳이 있어요. 사유를 확인해 주세요.' : '올렸어요.');
      renderList(); openShare(s.id);
    }).catch(function (e) { toast(e.message); openShare(s.id); });
  }
  function markManual(ch, on) {
    var s = stories.filter(function (x) { return x.id === sharing; })[0];
    if (!s) return;
    var c = JSON.parse(JSON.stringify(s));
    c.manual = c.manual || {};
    if (on) c.manual[ch] = new Date().toISOString(); else delete c.manual[ch];
    api('POST', '/api/admin/story', { story: c }).then(function (o) { stories = o.stories; renderList(); }).catch(function (e) { toast(e.message); });
  }
  function copy(id, btn) {
    var a = $(id);
    var ok = function () { toast('복사했어요.'); };
    var manual = function () { a.focus(); a.select(); try { document.execCommand('copy'); ok(); } catch (e) { toast('글을 선택했어요. Ctrl+C로 복사하세요.'); } };
    try { navigator.clipboard.writeText(a.value).then(ok, manual); } catch (e) { manual(); }
  }

  function syncTabs() {
    Array.prototype.forEach.call(document.querySelectorAll('#listTabs .tab'), function (t) { t.classList.toggle('on', t.dataset.f === filter); });
  }

  /* ── 이벤트 ── */
  $('newBtn').addEventListener('click', function () { openEdit(null); });
  $('weekBtn').addEventListener('click', scheduleWeek);
  $('cancelBtn').addEventListener('click', function () { $('editCard').hidden = true; editing = null; });
  $('draftBtn').addEventListener('click', function () { save('draft'); });
  $('storyForm').addEventListener('submit', function (e) { e.preventDefault(); save('pub'); });
  $('randBtn').addEventListener('click', function () {
    var cur = $('f_at').value ? new Date($('f_at').value) : new Date();
    var d = randomTime(cur);
    if (d.getTime() < Date.now()) d = randomTime(new Date(Date.now() + 86400000));   // 오늘 시각이 이미 지났으면 내일로
    $('f_at').value = toLocalInput(d);
  });
  $('f_img').addEventListener('change', function (e) { var f = e.target.files && e.target.files[0]; if (f) readImage(f); });
  $('imgClear').addEventListener('click', function () { imgData = ''; $('imgPrev').dataset.src = ''; $('f_img').value = ''; setImage(''); });
  $('listTabs').addEventListener('click', function (e) { var t = e.target.closest('.tab'); if (!t) return; filter = t.dataset.f; syncTabs(); renderList(); });
  $('storyBody').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var find = function (id) { return stories.filter(function (x) { return x.id === id; })[0]; };
    if (b.dataset.edit) openEdit(find(b.dataset.edit));
    else if (b.dataset.share) openShare(b.dataset.share);
    else if (b.dataset.del) {
      var s = find(b.dataset.del);
      if (!s || !window.confirm('"' + s.title + '" 글을 지울까요? 홈페이지에서도 사라집니다.')) return;
      api('DELETE', '/api/admin/story?id=' + encodeURIComponent(s.id)).then(function (o) { stories = o.stories; if (sharing === s.id) $('shareCard').hidden = true; toast('지웠어요.'); renderList(); }).catch(function (er) { toast(er.message); });
    }
  });
  $('shareBody').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.post) post(b.dataset.post, b);
    else if (b.dataset.copy) copy(b.dataset.copy, b);
    else if (b.id === 'shareClose') { $('shareCard').hidden = true; sharing = null; }
  });
  $('shareBody').addEventListener('change', function (e) { if (e.target.dataset && e.target.dataset.done) markManual(e.target.dataset.done, e.target.checked); });

  /* ── 시작 ── */
  api('GET', '/api/admin/story').then(function (o) { stories = o.stories || []; conn = o.connected || conn; renderList(); })
    .catch(function (e) { $('storyBody').innerHTML = '<tr><td colspan="7"><div class="empty-s">' + E(e.message) + '</div></td></tr>'; });
})();
