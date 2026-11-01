/* IUX ART — 공통 스크립트 (퍼블리싱용 간단 스크립트) */
(function () {
  var d = document;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.lucide) lucide.createIcons();
  d.documentElement.classList.add('js');

  /* ---------- 토스트 ---------- */
  var toastEl = $('#toast');
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  /* ---------- 헤더 / 모바일 메뉴 ---------- */
  var hd = $('#hd'), menuBtn = $('#menuBtn');
  function setMenu(open) {
    hd.classList.toggle('open', open);
    d.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!hd.classList.contains('open')); });
    $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    addEventListener('resize', function () { if (innerWidth > 1024) setMenu(false); });
  }

  /* ---------- 스크롤 등장 + 숫자 카운트 ---------- */
  function countUp(el) {
    var to = +el.dataset.count;
    if (reduce || !to) return;
    var t0 = null, dur = 1600;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      p = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * p).toLocaleString('ko-KR');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      if (e.target.matches('[data-count]')) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: .15 });
  $$('.rv, .scrib').forEach(function (el) { io.observe(el); });
  setTimeout(function () { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }, 3500);

  /* ---------- 히어로 확장 + 콜라주 패럴랙스 (메인) ---------- */
  var hm = $('#heroMedia'), collage = $('.collage'), cols = $$('[data-speed]');
  function onScroll() {
    var y = scrollY;
    if (hd) hd.classList.toggle('scrolled', y > 8);
    if (hm) {
      var vw = d.documentElement.clientWidth, base = Math.min(1140, vw - 40);
      var p = reduce ? 0 : Math.min(1, Math.max(0, y / 420));
      hm.style.width = (base + (vw - base) * p) + 'px';
      hm.style.borderRadius = (28 * (1 - p)) + 'px';
    }
    if (collage && (reduce || innerWidth < 721)) cols.forEach(function (c) { c.style.transform = ''; });
    else if (collage) {
      var r = collage.getBoundingClientRect(), mid = r.top + r.height / 2 - innerHeight / 2;
      cols.forEach(function (c) { c.style.transform = 'translateY(' + (mid * +c.dataset.speed) + 'px)'; });
    }
  }
  var ticking = false;
  addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 서비스 캐러셀 (메인) ---------- */
  var car = $('#svc');
  if (car) {
    var track = $('.track', car), items = [].slice.call(track.children), pager = $('#svcPager'), idx = 1, timer;
    items.forEach(function () { pager.appendChild(d.createElement('i')); });
    var dots = [].slice.call(pager.children);
    var go = function (n) {
      idx = (n + items.length) % items.length;
      items.forEach(function (el, k) { el.classList.toggle('on', k === idx); });
      dots.forEach(function (el, k) { el.classList.toggle('on', k === idx); });
      var el = items[idx];
      track.style.transform = 'translateX(' + (-(el.offsetLeft + el.offsetWidth / 2 - car.clientWidth / 2)) + 'px)';
    };
    var auto = function () { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(idx + 1); }, 4500); };
    $('#svcPrev').onclick = function () { go(idx - 1); auto(); };
    $('#svcNext').onclick = function () { go(idx + 1); auto(); };
    car.addEventListener('mouseenter', function () { clearInterval(timer); });
    car.addEventListener('mouseleave', auto);
    var sx = null;
    car.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    car.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); auto(); }
      sx = null;
    });
    addEventListener('resize', function () { go(idx); });
    go(idx); auto();
  }

  /* ---------- 가로 스크롤 목록 (후기) ---------- */
  var ts = $('#tscroll');
  if (ts) {
    var stepW = function () { var c = $('.tcard', ts); return c ? c.offsetWidth + 20 : 300; };
    $('#tPrev').onclick = function () { ts.scrollBy({ left: -stepW(), behavior: 'smooth' }); };
    $('#tNext').onclick = function () { ts.scrollBy({ left: stepW(), behavior: 'smooth' }); };
  }

  /* ---------- CTA 컨페티 ---------- */
  if (!reduce) $$('.confetti').forEach(function (cf) {
    var colors = ['#FFC800', '#FFE680', '#FF8A1F', '#FF3D7F', '#FFFFFF'];
    for (var i = 0; i < 28; i++) {
      var c = d.createElement('i');
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = (5 + Math.random() * 5) + 's';
      c.style.animationDelay = (-Math.random() * 10) + 's';
      cf.appendChild(c);
    }
  });

  /* ---------- 하단 프로모 배너 ---------- */
  var promoX = $('#promoX');
  if (promoX) promoX.onclick = function () { $('#promo').classList.add('hide'); };

  /* ---------- 카테고리 필터 (주문제작·작가·후기·FAQ·교육) ---------- */
  $$('[data-filter]').forEach(function (group) {
    var tabs = $$('.tab', group), target = $(group.dataset.filter);
    if (!target) return;
    var items = $$('[data-cat]', target), countEl = $('[data-count-of="' + group.dataset.filter + '"]');
    function apply(f) {
      var n = 0;
      tabs.forEach(function (t) { t.classList.toggle('on', t.dataset.f === f); t.setAttribute('aria-pressed', t.dataset.f === f); });
      items.forEach(function (it) {
        var show = f === 'all' || it.dataset.cat.split(' ').indexOf(f) > -1;
        it.hidden = !show;
        if (show) n++;
      });
      if (countEl) countEl.textContent = n;
    }
    var useHash = group.hasAttribute('data-hash');
    function fromHash() {
      var h = location.hash.slice(1);
      apply(tabs.some(function (t) { return t.dataset.f === h; }) ? h : 'all');
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        apply(t.dataset.f);
        if (useHash) {
          if (t.dataset.f === 'all') { if (location.hash) location.hash = 'all'; }
          else location.hash = t.dataset.f;
        }
      });
    });
    if (useHash) { fromHash(); addEventListener('hashchange', fromHash); } else apply('all');
  });

  /* ---------- 탭 전환 (로그인/회원가입) ---------- */
  $$('[data-tabs]').forEach(function (g) {
    var btns = $$('[data-tab]', g), wrap = g.closest('[data-tabwrap]') || d;
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
        $$('[data-pane]', wrap).forEach(function (p) { p.hidden = p.dataset.pane !== b.dataset.tab; });
      });
    });
  });

  /* ---------- 데모 폼 (실제 전송은 개발 단계에서 연결) ---------- */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var ok = f.dataset.success && $(f.dataset.success);
      if (ok) {
        f.hidden = true;
        ok.hidden = false;
        ok.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      } else {
        toast(f.dataset.msg || '접수되었습니다.');
        if (f.dataset.reset !== 'no') f.reset();
      }
    });
  });
  $$('[data-toast]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); toast(b.dataset.toast); });
  });


  /* ---------- 기간 달력 (YYYY-MM-DD ~ YYYY-MM-DD) ---------- */
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var ymd = function (dt) { return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate()); };
  var parse = function (v) { var p = v.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  var todayStr = ymd(new Date());
  $$('.daterange').forEach(function (wrap) {
    var input = $('.dr-input', wrap), hs = $('[data-start]', wrap), he = $('[data-end]', wrap);
    var pop = d.createElement('div');
    pop.className = 'dr-pop'; pop.hidden = true;
    pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', '기간 선택');
    wrap.appendChild(pop);
    var start = '', end = '', hover = '';
    var view = new Date(); view.setDate(1);
    var two = function () { return innerWidth > 720; };

    function monthHTML(base) {
      var y = base.getFullYear(), m = base.getMonth();
      var first = new Date(y, m, 1).getDay(), last = new Date(y, m + 1, 0).getDate();
      var h = '<div class="dr-month"><p class="dr-title">' + y + '년 ' + (m + 1) + '월</p><div class="dr-grid">';
      '일월화수목금토'.split('').forEach(function (w, i) { h += '<span class="dr-w' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '') + '">' + w + '</span>'; });
      for (var i = 0; i < first; i++) h += '<span></span>';
      var to = end || (start && hover && hover > start ? hover : '');
      for (var dd = 1; dd <= last; dd++) {
        var v = y + '-' + pad(m + 1) + '-' + pad(dd), dow = (first + dd - 1) % 7;
        var c = 'dr-d' + (dow === 0 ? ' sun' : dow === 6 ? ' sat' : '');
        if (v < todayStr) c += ' past';
        if (v === todayStr) c += ' today';
        if (v === start) c += ' s';
        if (v === (end || '')) c += ' e';
        if (start && to && v > start && v < to) c += ' in';
        if (start && to && v === start) c += ' has-e';
        h += '<button type="button" class="' + c + '" data-v="' + v + '"' + (v < todayStr ? ' disabled' : '') + '>' + dd + '</button>';
      }
      return h + '</div></div>';
    }
    function label() {
      if (!start) return '시작일을 눌러 주세요';
      if (!end) return start + ' ~ 종료일을 눌러 주세요';
      var days = Math.round((parse(end) - parse(start)) / 864e5) + 1;
      return (start === end ? start : start + ' ~ ' + end) + ' · ' + days + '일';
    }
    function render() {
      var next = new Date(view.getFullYear(), view.getMonth() + 1, 1);
      pop.innerHTML = '<div class="dr-head"><button type="button" class="dr-nav" data-nav="-1" aria-label="이전 달">‹</button><button type="button" class="dr-nav" data-nav="1" aria-label="다음 달">›</button></div>'
        + '<div class="dr-months">' + monthHTML(view) + (two() ? monthHTML(next) : '') + '</div>'
        + '<div class="dr-foot"><span class="dr-sel">' + label() + '</span><button type="button" class="dr-btn ghost" data-act="reset">초기화</button><button type="button" class="dr-btn" data-act="ok"' + (start ? '' : ' disabled') + '>적용</button></div>';
    }
    function commit() {
      var e = end || start;
      hs.value = start; he.value = start ? e : '';
      input.value = !start ? '' : (e === start ? start : start + ' ~ ' + e);
      input.setCustomValidity('');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function open() {
      start = hs.value; end = he.value || '';
      if (start) { view = parse(start); view.setDate(1); }
      render(); pop.hidden = false; wrap.classList.add('open');
    }
    function close() { pop.hidden = true; wrap.classList.remove('open'); }

    input.addEventListener('click', open);
    input.addEventListener('focus', open);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') { close(); return; }
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Backspace' || e.key === 'Delete') { start = end = ''; commit(); render(); }
      e.preventDefault();
    });
    pop.addEventListener('mousedown', function (e) { e.preventDefault(); });
    pop.addEventListener('mouseover', function (e) {
      var b = e.target.closest('.dr-d');
      if (b && start && !end && b.dataset.v !== hover) { hover = b.dataset.v; render(); }
    });
    pop.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.nav) { view.setMonth(view.getMonth() + (+b.dataset.nav)); render(); return; }
      if (b.dataset.act === 'reset') { start = end = hover = ''; commit(); render(); return; }
      if (b.dataset.act === 'ok') { if (start && !end) end = start; commit(); close(); return; }
      var v = b.dataset.v;
      if (!v) return;
      if (!start || end) { start = v; end = ''; hover = ''; }
      else if (v < start) { end = start; start = v; }
      else end = v;
      render();
      if (start && end) { commit(); setTimeout(close, 180); }
    });
    d.addEventListener('mousedown', function (e) { if (!wrap.contains(e.target)) close(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    addEventListener('resize', function () { if (!pop.hidden) render(); });
  });

  /* ---------- 행사 견적 단계 폼 ---------- */
  var q = $('#quoteForm');
  if (q) {
    var panes = $$('.qpane', q), marks = $$('.stepper span'), cur = 0;
    var show = function (i, scroll) {
      cur = i;
      panes.forEach(function (p, k) { p.hidden = k !== i; });
      marks.forEach(function (m, k) { m.classList.toggle('on', k === i); m.classList.toggle('done', k < i); });
      if (scroll) scrollTo({ top: q.getBoundingClientRect().top + scrollY - 110, behavior: reduce ? 'auto' : 'smooth' });
    };
    $$('[data-next]', q).forEach(function (b) {
      b.addEventListener('click', function () {
        if (cur === 0 && !$$('input[name="prog"]:checked', q).length) { toast('프로그램을 1개 이상 선택해 주세요.'); return; }
        var bad = $$('input,select,textarea', panes[cur]).filter(function (el) { return !el.checkValidity(); })[0];
        if (bad) { bad.reportValidity(); return; }
        show(cur + 1, true);
      });
    });
    $$('[data-prev]', q).forEach(function (b) { b.addEventListener('click', function () { show(cur - 1, true); }); });
    var sum = function () {
      var progs = $$('input[name="prog"]:checked', q).map(function (i) { return i.value; });
      $('#sumProg').textContent = progs.length ? progs.join(', ') : '선택 전';
      ['date', 'time', 'place', 'people', 'evtype'].forEach(function (k) {
        var el = q.querySelector('[name="' + k + '"]'), out = $('#sum_' + k);
        if (el && out) out.textContent = el.value ? el.value + (k === 'people' ? '명' : '') : '-';
      });
      /* 행사 기간: YYYY-MM-DD ~ YYYY-MM-DD (일수 표시) */
      var ds = q.querySelector('[name="date"]'), de = q.querySelector('[name="date_end"]');
      if (ds && de) {
        var txt = '-';
        if (ds.value) {
          var end = de.value || ds.value;
          var days = Math.round((new Date(end) - new Date(ds.value)) / 864e5) + 1;
          txt = (end === ds.value ? ds.value : ds.value + ' ~ ' + end) + ' (' + days + '일)';
        }
        $('#sum_date').textContent = txt;
      }
      var ppl = +(q.querySelector('[name="people"]').value || 0);
      /* 작가 1명이 1시간에 약 15명 · 기본 3시간 기준 */
      $('#sumArtist').textContent = ppl ? '하루 약 ' + (ppl * 45).toLocaleString('ko-KR') + '명 (3시간 기준)' : '-';
    };
    q.addEventListener('input', sum);
    q.addEventListener('change', sum);
    sum(); show(0, false);
  }

  /* ---------- 상품 상세: 썸네일 · 옵션 금액 ---------- */
  var pd = $('#pdForm');
  if (pd) {
    var main = $('#pdMain');
    $$('.pd-thumbs button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.pd-thumbs button').forEach(function (x) { x.classList.toggle('on', x === b); });
        var im = new Image();
        im.src = b.dataset.src;
        im.alt = b.dataset.alt || '';
        main.innerHTML = '';
        main.appendChild(im);
      });
    });
    var qty = $('#qty');
    var calc = function () {
      var add = $$('select', pd).reduce(function (s, el) { return s + (+(el.selectedOptions[0].dataset.add || 0)); }, 0);
      var n = Math.max(1, +qty.value || 1);
      $('#total').textContent = ((+pd.dataset.base + add) * n).toLocaleString('ko-KR') + '원';
    };
    $$('[data-qty]', pd).forEach(function (b) {
      b.addEventListener('click', function () { qty.value = Math.max(1, (+qty.value || 1) + (+b.dataset.qty)); calc(); });
    });
    pd.addEventListener('change', calc);
    pd.addEventListener('input', calc);
    calc();
  }

  /* ---------- 게시판 검색 (데모) ---------- */
  $$('form.searchbar').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); toast('검색 기능은 개발 단계에서 연결됩니다.'); });
  });
})();
