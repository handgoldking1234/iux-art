from common import *

STAR5 = '<div class="stars" aria-label="별점 5점">' + '<i data-lucide="star"></i>' * 5 + '</div>'

REVIEWS = [
  ("corp", "기업 행사", "창립기념일 캐리커처 부스, 400명 넘게 받아 갔어요", "작가님 네 분이 오셔서 대기 시간이 20분을 넘지 않았어요. 로고 프레임 덕분에 직원들이 책상에 붙여 두고 있습니다.", "제조사 인사팀", "김", "img", "site-friends-01"),
  ("school", "대학 축제", "축제 3일 내내 캐리커처 부스가 붐볐어요", "작가님들이 빠르게 그려 주셔서 사람들이 계속 모였어요. 3일 내내 줄이 끊기지 않았습니다.", "총학생회 축제기획단", "이", "img", "digital-sisters"),
  ("wedding", "웨딩", "하객 답례품이 완전히 달라졌어요", "캘리그라피 엽서에 두 사람 이름과 하객 이름을 함께 써 주셨는데, 액자에 넣어 간다는 분이 많았어요.", "웨딩플래너", "박", None, None),
  ("kids", "어린이 행사", "어린이날 페이스페인팅, 매년 같은 작가님으로 예약해요", "아이들 피부 걱정이 있었는데 재료 설명을 꼼꼼히 해 주셔서 학부모 민원이 한 건도 없었어요.", "구립 어린이집 원장", "최", "img", "fp-dragonfly"),
  ("corp", "송년회", "송년회 2부가 살아났습니다", "캐리커처와 타로 부스 덕분에 끝까지 자리를 지켰어요. 내년에도 부탁드리려고요.", "IT 스타트업 피플팀", "정", None, None),
  ("public", "지역 축제", "야외 행사였는데 준비가 철저했어요", "바람이 많이 불었는데 그늘막과 클립까지 챙겨 오셔서 문제없이 진행됐어요.", "구청 문화체육과", "한", "img", "site-single-01"),
  ("wedding", "돌잔치", "가족 캐리커처를 액자로 받아 왔어요", "현장에서 바로 액자에 넣어 주셔서 손님들이 정말 좋아했습니다.", "돌잔치 고객", "윤", "img", "work-family-02"),
  ("school", "졸업식", "졸업생 전원에게 캘리그라피 책갈피를", "학생 이름과 응원 문구를 하나하나 써 주셨어요. 선생님들 반응이 제일 좋았습니다.", "고등학교 교무부", "오", "img", "cz-73"),
  ("kids", "쇼핑몰 행사", "가족 단위 손님 체류 시간이 확실히 늘었어요", "페이스페인팅과 캐리커처를 같이 운영했더니 매장 방문까지 이어졌어요.", "복합쇼핑몰 마케팅팀", "서", "img", "fp-stars"),
]

def review():
    tabs = ''.join(f'<button class="tab{" on" if f=="all" else ""}" data-f="{f}">{t}</button>' for f, t in [("all","전체"),("corp","기업 행사"),("school","학교·축제"),("wedding","웨딩·가족"),("kids","어린이"),("public","관공서·지역")])
    cards = ''
    for cat, tag, title, text, who, init, g, ic in REVIEWS:
        if g == 'img':
            ph = f'<div class="ph ph-img"><img class="cover" src="images/{ic}.jpg" alt="{tag} 현장 사진" loading="lazy"></div>'
        else:
            ph = f'<div class="ph {g}"><i data-lucide="{ic}"></i></div>' if g else ''
        cards += f'<article class="rcard" data-cat="{cat}"><div class="top">{STAR5}<span class="pill">{tag}</span></div><h3>{title}</h3><p>{text}</p>{ph}<div class="who"><i>{init}</i><div>{who}<small>담당자 후기</small></div></div></article>\n'
    body = subhero(crumbs(('행사 후기', None)), 'Reviews', '담당자님들이 <em>다시 찾는 이유</em>', '작가들이 남긴 현장 스케치와 담당자님들의 후기를 모았습니다.')
    body += '''<nav class="rv-jump wrap" aria-label="후기 종류"><a href="#sketch" class="on">현장 스케치 <b id="skN">0</b></a><a href="#client">담당자 후기 <b>''' + str(len(REVIEWS)) + '''</b></a></nav>
<section class="sec-sm" id="sketch"><div class="wrap">
  <div class="sec-head"><div><h2 class="sec-title">현장 스케치</h2><p>행사를 마친 IUX 작가들이 직접 남긴 현장 사진과 분위기입니다.</p></div></div>
  <div class="toolbar"><div class="tabs" id="skTabs"></div></div>
  <div class="sk-grid" id="skGrid"></div>
  <p class="sk-empty" id="skEmpty" hidden>아직 등록된 현장 스케치가 없어요.</p>
</div></section>
<div class="lb sk-lb" id="skLb" hidden role="dialog" aria-modal="true" aria-label="현장 스케치">
  <button class="lb-x" id="skX" aria-label="닫기">×</button>
  <div class="sk-view">
    <div class="sk-slide"><img id="skImg" alt=""><button class="lb-nav prev" id="skPrev" aria-label="이전 사진">‹</button><button class="lb-nav next" id="skNext" aria-label="다음 사진">›</button><span class="sk-pg" id="skPg"></span></div>
    <div class="sk-info"><p class="sk-m" id="skMeta"></p><h3 id="skTitle"></h3><p id="skMood"></p><p class="sk-tags" id="skTags"></p><p class="sk-a" id="skArt"></p><div class="sk-thumbs" id="skThumbs"></div><a class="btn btn-brand btn-sm" id="skQuote" href="quote.html">이 프로그램 견적 문의</a></div>
  </div>
</div>
<script src="admin/js/data.js"></script>
<script>
/* 현장 스케치: 작가가 올리고 운영자가 게시한 후기 (시안은 브라우저 저장 데이터, 개발 단계에서 API로 교체) */
(function () {
  var d = IUX_SEED;
  try { var o = JSON.parse(localStorage.getItem('iuxart-admin-v1')); if (o && o.version === d.version) d = o; } catch (e) {}
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var job = function (id) { return d.jobs.filter(function (j) { return j.id === id; })[0]; };
  var sk = function (k) { return d.skills.filter(function (s) { return s.k === k; })[0] || { n: k }; };
  var Y = new Date().getFullYear();
  var yrs = function (aid, k) { var a = d.artists.filter(function (x) { return x.id === aid; })[0]; var s = a && a.skills.filter(function (x) { return x.k === k; })[0]; return s ? (Y - s.since + 1) + '년차' : ''; };
  var P = (d.posts || []).filter(function (p) { var j = job(p.job); return p.state === 'published' && j && j.photoOk; }).sort(function (a, b) { return job(a.job).start < job(b.job).start ? 1 : -1; });
  var f = 'all', list = [], cur = 0, shot = 0;
  var skills = []; P.forEach(function (p) { var k = job(p.job).skill; if (skills.indexOf(k) < 0) skills.push(k); });
  document.getElementById('skN').textContent = P.length;
  var tabs = document.getElementById('skTabs');
  tabs.innerHTML = '<button class="tab on" data-k="all">전체</button>' + skills.map(function (k) { return '<button class="tab" data-k="' + k + '">' + esc(sk(k).n) + '</button>'; }).join('');
  function meta(j) { return '<span>' + esc(sk(j.skill).n) + '</span>' + esc(j.region) + ' · ' + j.start.slice(0, 7).replace('-', '.'); }
  function draw() {
    list = P.filter(function (p) { return f === 'all' || job(p.job).skill === f; });
    document.getElementById('skGrid').innerHTML = list.map(function (p, i) {
      var j = job(p.job);
      return '<article class="sk-card" tabindex="0" role="button" data-i="' + i + '" aria-label="' + esc(p.title) + ' 자세히 보기"><div class="sk-ph"><img src="' + p.photos[0] + '" alt="' + esc(p.title) + '" loading="lazy">' + (p.photos.length > 1 ? '<span class="sk-n">+' + (p.photos.length - 1) + '</span>' : '') + '</div>' +
        '<div class="sk-b"><p class="sk-m">' + meta(j) + '</p><h4>' + esc(p.title) + '</h4><p class="sk-t">' + esc(p.mood) + '</p><p class="sk-tags">' + p.tags.map(function (t) { return '#' + esc(t); }).join(' ') + '</p><p class="sk-a">IUX 작가 · ' + esc(sk(j.skill).n) + ' ' + yrs(p.a, j.skill) + '</p></div></article>';
    }).join('');
    document.getElementById('skEmpty').hidden = list.length > 0;
  }
  var lb = document.getElementById('skLb');
  function showShot(n) {
    var p = list[cur]; shot = (n + p.photos.length) % p.photos.length;
    document.getElementById('skImg').src = p.photos[shot];
    document.getElementById('skPg').textContent = (shot + 1) + ' / ' + p.photos.length;
    [].forEach.call(document.querySelectorAll('#skThumbs button'), function (b, i) { b.classList.toggle('on', i === shot); });
    var one = p.photos.length < 2; document.getElementById('skPrev').hidden = one; document.getElementById('skNext').hidden = one;
  }
  function open(i) {
    cur = i; var p = list[i], j = job(p.job);
    document.getElementById('skMeta').innerHTML = meta(j) + ' · 손님 ' + esc(p.guests);
    document.getElementById('skTitle').textContent = p.title;
    document.getElementById('skMood').textContent = p.mood;
    document.getElementById('skTags').textContent = p.tags.map(function (t) { return '#' + t; }).join(' ');
    document.getElementById('skArt').textContent = 'IUX 작가 · ' + sk(j.skill).n + ' ' + yrs(p.a, j.skill);
    document.getElementById('skThumbs').innerHTML = p.photos.map(function (s, n) { return '<button aria-label="' + (n + 1) + '번째 사진"><img src="' + s + '" alt=""></button>'; }).join('');
    document.getElementById('skQuote').href = 'quote.html#p-' + j.skill;
    showShot(0); lb.hidden = false; document.body.style.overflow = 'hidden';
  }
  function close() { lb.hidden = true; document.body.style.overflow = ''; }
  tabs.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (!b) return; f = b.dataset.k; [].forEach.call(tabs.children, function (x) { x.classList.toggle('on', x === b); }); draw(); });
  var grid = document.getElementById('skGrid');
  grid.addEventListener('click', function (e) { var c = e.target.closest('[data-i]'); if (c) open(+c.dataset.i); });
  grid.addEventListener('keydown', function (e) { var c = e.target.closest('[data-i]'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(+c.dataset.i); } });
  document.getElementById('skThumbs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) showShot([].indexOf.call(this.children, b)); });
  document.getElementById('skPrev').onclick = function () { showShot(shot - 1); };
  document.getElementById('skNext').onclick = function () { showShot(shot + 1); };
  document.getElementById('skX').onclick = close;
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') showShot(shot - 1); if (e.key === 'ArrowRight') showShot(shot + 1); });
  draw();
})();
</script>
'''
    body += f'''<section class="sec-sm soft" id="client"><div class="wrap">
  <div class="sec-head"><div><h2 class="sec-title">담당자 후기</h2><p>행사를 마친 담당자님들이 직접 남겨 주신 후기입니다.</p></div></div>
  <div class="rsum rv">
    <div class="score"><b>4.9</b>{STAR5}<small>후기 2,418건 평균</small></div>
    <div class="bars">
      <div><span>5점</span><i style="--w:92%"></i><span>92%</span></div>
      <div><span>4점</span><i style="--w:6%"></i><span>6%</span></div>
      <div><span>3점</span><i style="--w:1.5%"></i><span>1.5%</span></div>
      <div><span>2점 이하</span><i style="--w:.5%"></i><span>0.5%</span></div>
    </div>
  </div>
  <div class="toolbar" style="margin-top:48px"><div class="tabs" data-filter="#reviewGrid">{tabs}</div><span class="count">후기 <b data-count-of="#reviewGrid">{len(REVIEWS)}</b>건</span></div>
  <div class="masonry" id="reviewGrid">{cards}</div>
  <div style="text-align:center;margin-top:24px"><button class="btn btn-ghost" data-toast="후기 더보기는 개발 단계에서 연결됩니다.">후기 더보기</button></div>
</div></section>
''' + cta('다음 후기의 주인공이 되어 주세요')
    page('review.html', '행사 후기 | IUX EVENT', 'IUX EVENT 출장 이벤트 담당자 후기', 'review', body)


def donation():
    body = subhero(crumbs(('회사소개', 'about.html'), ('재능기부', None)), 'Give back', '그림으로 나누는<br><em>따뜻한 하루</em>',
                   'IUX EVENT 작가들은 매달 복지관·소아병동·지역아동센터를 찾아 캐리커처와 페이스페인팅을 선물합니다.')
    body += f'''<section class="sec-sm"><div class="wrap donate-band">
  <div class="donate-photo ph-img rv" style="position:relative;overflow:hidden"><img class="cover" src="images/cz-63.jpg" alt="어머니와 아들을 함께 그린 캐리커처" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 30%"><span style="position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(transparent,rgba(0,0,0,.72))"></span><p class="pen" style="position:absolute;left:24px;right:24px;bottom:20px;z-index:1;text-align:left;font-size:26px;line-height:1.3">"제 얼굴이<br>이렇게 웃고 있었네요"</p></div>
  <div class="rv d1">
    <h2 class="sec-title">작가 한 명의 두 시간이<br>누군가에게는 오래 남는 선물이 됩니다</h2>
    <p style="color:var(--ink-2);margin-top:14px">행사 수익의 일부와 작가들의 시간을 모아 문화 활동 기회가 적은 곳을 찾아갑니다. 재료비와 교통비는 IUX EVENT가 모두 부담합니다.</p>
    <div class="kpis k3" style="margin-top:28px">
      <div class="kpi"><span>누적 방문</span><b data-count="214">214</b><p>곳</p></div>
      <div class="kpi"><span>그려 드린 그림</span><b data-count="9860">9,860</b><p>장</p></div>
      <div class="kpi"><span>참여 작가</span><b data-count="73">73</b><p>명</p></div>
    </div>
  </div>
</div></section>

<section class="sec-sm soft"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">이런 곳을 찾아가요</h2></div></div>
  <div class="dcards">
    <article class="dcard rv"><div class="dv ph-img"><img class="cover" src="images/fp-live-hearts.jpg" alt="어린이 볼에 하트를 그리는 페이스페인팅" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:center 35%"></div><div class="db"><small>매월 둘째 주</small><h3>소아병동 페이스페인팅</h3><p>입원 중인 아이들과 보호자에게 웃음을 선물해요.</p></div></article>
    <article class="dcard rv d1"><div class="dv ph-img"><img class="cover" src="images/cz-64.jpg" alt="3대 가족 캐리커처" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:center 20%"></div><div class="db"><small>매월 넷째 주</small><h3>노인복지관 가족 캐리커처</h3><p>어르신 캐리커처를 액자에 담아 드려요.</p></div></article>
    <article class="dcard rv d2"><div class="dv ph-img"><img class="cover" src="images/cl-canvas-sun.jpg" alt="캔버스 캘리그라피" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div><div class="db"><small>방학 기간</small><h3>지역아동센터 캘리그라피 수업</h3><p>나만의 이름 캘리그라피를 함께 써 봐요.</p></div></article>
  </div>
</div></section>

<section class="sec-sm"><div class="wrap with-aside">
  <div>
    <div class="sec-head"><div><h2 class="sec-title">재능기부 신청</h2><p>비영리 기관이라면 어디든 신청할 수 있어요. 매달 선정 결과를 개별 안내드립니다.</p></div></div>
    <form class="form" data-demo data-success="#donateDone">
      <div class="row2">
        <div class="field"><label for="dn_org">기관명<i class="req">*</i></label><input id="dn_org" required></div>
        <div class="field"><label for="dn_name">담당자명<i class="req">*</i></label><input id="dn_name" required></div>
      </div>
      <div class="row2">
        <div class="field"><label for="dn_tel">연락처<i class="req">*</i></label><input id="dn_tel" type="tel" required placeholder="010-0000-0000"></div>
        <div class="field"><label for="dn_prog">희망 프로그램</label><select id="dn_prog"><option>캐리커처</option><option>캘리그라피</option><option>페이스페인팅</option></select></div>
      </div>
      <div class="field"><label for="dn_msg">기관 소개와 신청 사유<i class="req">*</i></label><textarea id="dn_msg" required placeholder="대상(연령·인원)과 희망 시기를 함께 적어 주세요."></textarea></div>
      <label class="check"><input type="checkbox" id="dn_agree" required>개인정보 수집·이용에 동의합니다. (필수)</label>
      <div class="form-actions"><button type="submit" class="btn btn-brand">재능기부 신청</button></div>
    </form>
    <div class="success" id="donateDone" hidden><span class="ic"><i data-lucide="heart-handshake"></i></span><h2>신청해 주셔서 감사합니다</h2><p>매달 말일에 다음 달 방문 기관을 선정해 개별 연락드립니다.</p></div>
  </div>
  <aside class="aside">
    <h3>신청 안내</h3>
    <dl><dt>대상</dt><dd>복지관·병원·아동센터 등 비영리 기관</dd><dt>인원</dt><dd>20 ~ 80명</dd><dt>비용</dt><dd>무료 (재료·교통비 포함)</dd><dt>선정</dt><dd>매월 말일 개별 안내</dd></dl>
    <div class="call">문의<b>{PHONE}</b></div>
  </aside>
</div></section>
'''
    page('donation.html', '재능기부 | IUX EVENT', 'IUX EVENT 작가들의 재능기부 활동과 신청', 'about', body)


def quote():
    from events_more import PROGRAMS
    progs = [x for k, n, f, sh, ic, g, c, im in PROGRAMS for x in ([('포인트 캐리커처', ic, '흑백 · 4시간 30만원~'), ('컬러 캐리커처', 'palette', '채색 · 4시간 40만원~')] if k == 'caricature' else [(n, ic, sh)])] + [("현장 굿즈 제작", "key-round", "키링·액자 당일 제작"), ("아직 모르겠어요", "message-circle-question", "상담 후 추천받을게요")]
    pick = ''.join(f'<label><input type="checkbox" name="prog" value="{t}"><span class="pc"><span class="ck"><i data-lucide="check"></i></span><i data-lucide="{ic}"></i><b>{t}</b><small>{d}</small></span></label>' for t, ic, d in progs)
    body = subhero(crumbs(('행사 문의', None)), 'Get a quote', '행사 견적 문의', '3단계만 입력하시면 24시간 안에 프로그램 구성과 견적을 보내드립니다.')
    body += f'''<section class="sec-sm"><div class="wrap with-aside">
  <div>
    <form id="quoteForm" class="rv" data-demo data-success="#quoteDone" novalidate>
      <div class="stepper" aria-hidden="true"><span class="on"><i>1</i>프로그램</span><span><i>2</i>행사 정보</span><span><i>3</i>연락처</span></div>

      <div class="qpane">
        <h2>어떤 프로그램이 필요하세요?</h2><p class="sub-t">여러 개를 함께 선택할 수 있어요.</p>
        <div class="pick">{pick}</div>
        <div class="form-actions" style="margin-top:32px"><button type="button" class="btn btn-brand" data-next>다음 <i data-lucide="arrow-right"></i></button></div>
      </div>

      <div class="qpane form" hidden>
        <div><h2>행사 정보를 알려주세요</h2><p class="sub-t" style="margin:0">정확하지 않아도 괜찮아요. 대략적인 내용으로 견적을 드립니다.</p></div>
        <div class="row2">
          <div class="field"><label for="q_type">행사 유형<i class="req">*</i></label><select id="q_type" name="evtype" required><option value="">선택해 주세요</option><option>기업 행사</option><option>대학 축제·학교 행사</option><option>웨딩·돌잔치</option><option>어린이 행사</option><option>지역 축제·관공서</option><option>매장 오픈·팝업</option><option>기타</option></select></div>
          <div class="field"><label for="q_people">섭외 작가 수<i class="req">*</i></label><input id="q_people" name="people" type="number" min="1" required placeholder="예) 2" inputmode="numeric"><p class="help">잘 모르시면 예상 손님 수를 요청 사항에 적어 주세요. 알맞은 작가 수를 추천해 드려요.</p></div>
        </div>
        <div class="field"><label for="q_date">행사 기간<i class="req">*</i></label><div class="daterange"><input id="q_date" class="dr-input" type="text" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" autocomplete="off" inputmode="none" required aria-haspopup="dialog"><input type="hidden" name="date" data-start><input type="hidden" name="date_end" data-end></div><p class="help">시작일과 종료일을 차례로 누르세요. 하루 행사는 같은 날을 두 번 누르면 돼요.</p></div>
        <div class="field"><label for="q_time">하루 진행 시간</label><input id="q_time" name="time" placeholder="예) 14:00 ~ 17:00"></div>
        <div class="field"><label for="q_place">행사 장소<i class="req">*</i></label><input id="q_place" name="place" required placeholder="예) 서울 강남구 OO호텔 그랜드볼룸"><p class="help">실내·실외 여부도 함께 적어 주시면 준비에 도움이 돼요.</p></div>
        <div class="form-actions"><button type="button" class="btn btn-ghost" data-prev>이전</button><button type="button" class="btn btn-brand" data-next>다음 <i data-lucide="arrow-right"></i></button></div>
      </div>

      <div class="qpane form" hidden>
        <div><h2>견적을 받으실 연락처</h2><p class="sub-t" style="margin:0">담당 매니저가 직접 연락드립니다.</p></div>
        <div class="row2">
          <div class="field"><label for="q_org">회사·기관명</label><input id="q_org" name="org"></div>
          <div class="field"><label for="q_name">담당자명<i class="req">*</i></label><input id="q_name" name="name" required></div>
        </div>
        <div class="row2">
          <div class="field"><label for="q_tel">연락처<i class="req">*</i></label><input id="q_tel" name="tel" type="tel" required placeholder="010-0000-0000"></div>
          <div class="field"><label for="q_mail">이메일</label><input id="q_mail" name="mail" type="email" placeholder="견적서를 받을 메일"></div>
        </div>
        <div class="field"><label for="q_msg">추가 요청 사항</label><textarea id="q_msg" name="msg" placeholder="예상 손님 수, 로고 인쇄, 원하는 작가, 예산 범위 등"></textarea></div>
        <div class="agree"><p>수집 항목: 담당자명, 연락처, 이메일, 회사명 · 이용 목적: 행사 견적 상담 · 보관 기간: 상담 종료 후 1년</p>
          <label class="check"><input type="checkbox" id="q_agree" required>개인정보 수집·이용에 동의합니다. (필수)</label>
          <label class="check"><input type="checkbox" name="photo_ok" id="q_photo">행사 현장 사진을 IUX ART 홈페이지·SNS 홍보에 활용하는 데 동의합니다. (선택)</label>
          <p>작가가 찍은 현장·작품 사진을 검수 후 게시하며, 얼굴이 드러난 사진은 당사자 동의를 받은 사진만 사용합니다. 동의하지 않아도 견적 상담은 그대로 진행되고, 사진은 내부 기록용으로만 보관됩니다.</p></div>
        <div class="form-actions"><button type="button" class="btn btn-ghost" data-prev>이전</button><button type="submit" class="btn btn-brand">견적 요청하기</button></div>
      </div>
    </form>
    <div class="success" id="quoteDone" hidden><span class="ic"><i data-lucide="party-popper"></i></span><h2>견적 요청이 접수되었습니다</h2><p>담당 매니저가 일정을 확인한 뒤 24시간 안에 연락드릴게요. 급하시면 전화로 문의해 주세요.</p><div class="btns" style="justify-content:center"><a href="index.html" class="btn btn-ghost">홈으로</a><a href="review.html" class="btn btn-brand">행사 후기 보기</a></div></div>
  </div>
  <aside class="aside">
    <h3>문의 요약</h3>
    <dl><dt>프로그램</dt><dd id="sumProg">선택 전</dd><dt>행사 유형</dt><dd id="sum_evtype">-</dd><dt>기간</dt><dd id="sum_date">-</dd><dt>시간</dt><dd id="sum_time">-</dd><dt>장소</dt><dd id="sum_place">-</dd><dt>작가 수</dt><dd id="sum_people">-</dd><dt>예상 진행 인원</dt><dd id="sumArtist">-</dd></dl>
    <div class="call">전화로 바로 상담<b>{PHONE}</b>연중무휴 08:00 ~ 22:00</div>
  </aside>
</div></section>
'''
    page('quote.html', '행사 견적 문의 | IUX EVENT', '캐리커처·페이스페인팅·타로·요술풍선 등 11가지 출장 이벤트 견적 문의', None, body)


FAQ = [
  ("event", "출장 이벤트", "예약은 언제까지 해야 하나요?", "보통 행사 2주 전까지 예약하시면 원하는 작가로 배정할 수 있습니다. 5월·10월·12월 성수기에는 한 달 전 예약을 권장해요."),
  ("event", "출장 이벤트", "지방 출장도 가능한가요?", "전국 어디든 갑니다. 수도권 외 지역은 거리와 시간에 따라 교통비가 추가되며 견적에 함께 안내드려요."),
  ("event", "출장 이벤트", "작가는 몇 명이 필요할까요?", "한 분당 케어·작업이 1~2분이라 작가 1명이 4시간에 100명 이상 진행할 수 있어요. 예상 인원과 진행 시간을 알려주시면 대기 시간이 길어지지 않도록 작가 수를 맞춰 드려요."),
  ("event", "출장 이벤트", "행사장에서 준비할 것이 있나요?", "작가 1명당 테이블 1개와 의자 2개, 콘센트 1구만 준비해 주세요. 나머지 재료와 소품은 저희가 가져갑니다."),
  ("pay", "결제·취소", "세금계산서 발행이 되나요?", "네. 사업자등록증을 보내주시면 행사 후 세금계산서를 발행해 드립니다. 카드 결제도 가능합니다."),
  ("pay", "결제·취소", "취소 수수료가 있나요?", "행사 7일 전까지는 무료로 취소할 수 있고, 이후에는 작가 일정 확보 비용으로 계약금의 일부가 발생합니다."),
  ("custom", "주문제작", "시안 수정은 몇 번까지 되나요?", "스케치 단계에서 2회까지 무료로 수정해 드립니다. 3회부터는 소정의 추가 비용이 있어요."),
  ("custom", "주문제작", "사진은 어떤 걸 보내면 좋나요?", "얼굴이 정면으로 크게 나온 밝은 사진이 가장 좋아요. 여러 명은 각자 사진을 따로 보내셔도 한 그림에 모아 그려 드립니다."),
  ("edu", "교육센터", "그림을 전혀 못 그려도 수강할 수 있나요?", "취미반과 기초반은 처음 그리는 분을 기준으로 만들어졌습니다. 선 긋기부터 차근차근 시작해요."),
  ("edu", "교육센터", "수료 후 작가로 활동할 수 있나요?", "자격증 과정 수료 후 현장 실습 평가를 통과하면 IUX EVENT 작가로 등록해 출장 이벤트에 참여할 수 있습니다."),
]

def faq():
    tabs = ''.join(f'<button class="tab{" on" if f=="all" else ""}" data-f="{f}">{t}</button>' for f, t in [("all","전체"),("event","출장 이벤트"),("pay","결제·취소"),("custom","주문제작"),("edu","교육센터")])
    items = ''.join(f'<details data-cat="{c}"><summary><span class="q">Q</span><span class="cat">{cl}</span>{q}<i data-lucide="plus" class="pl"></i></summary><p class="a">{a}</p></details>' for c, cl, q, a in FAQ)
    body = subhero(crumbs(('자주 묻는 질문', None)), 'FAQ', '자주 묻는 질문', '찾으시는 답이 없다면 언제든 전화나 견적 문의로 물어봐 주세요.')
    body += f'''<section class="sec-sm"><div class="wrap" style="max-width:920px">
  <div class="toolbar"><div class="tabs" data-filter="#faqList">{tabs}</div></div>
  <div class="acc" id="faqList">{items}</div>
  <div class="loc" style="margin-top:48px">
    <div><b><i data-lucide="phone"></i>전화 상담</b><span class="sel">{PHONE}</span></div>
    <div><b><i data-lucide="clock"></i>상담 시간</b>연중무휴 08:00 ~ 22:00</div>
    <div><b><i data-lucide="mail"></i>이메일</b><span class="sel">art@iux.kr</span></div>
  </div>
</div></section>
''' + cta('궁금한 점은 견적 문의에 함께 남겨 주세요')
    page('faq.html', '자주 묻는 질문 | IUX EVENT', 'IUX EVENT 출장 이벤트·주문제작·교육 자주 묻는 질문', None, body)


def login():
    body = f"""<section class="wrap"><div class="auth" data-tabwrap>
  <a href="index.html" class="logo">{LOGO}</a>
  <p class="auth-sub">작가 전용 로그인입니다. 행사 문의는 로그인 없이 <a href="quote.html">견적 문의</a>에서 바로 하실 수 있어요.</p>
  <div class="auth-tabs" role="tablist" data-tabs><button class="on" data-tab="login" role="tab" aria-selected="true">작가 로그인</button><button data-tab="join" role="tab" aria-selected="false">작가 등록</button></div>

  <form class="form" data-pane="login" id="artistLogin" novalidate>
    <div class="field"><label for="lg_id">휴대폰 번호 또는 이메일</label><input id="lg_id" required autocomplete="username" placeholder="010-0000-0000"></div>
    <div class="field"><label for="lg_pw">비밀번호</label><input id="lg_pw" type="password" required autocomplete="current-password"></div>
    <div class="auth-links"><label class="check"><input type="checkbox" id="lg_keep">로그인 유지</label><a href="#" data-toast="비밀번호 찾기는 휴대폰 인증으로 개발 단계에서 연결됩니다.">비밀번호 찾기</a></div>
    <button type="submit" class="btn btn-brand btn-block">로그인하고 작가 포털로</button>
    <p class="or">간편 로그인</p>
    <div class="social">
      <button type="button" class="kakao" data-go-portal><i data-lucide="message-circle"></i>카카오로 시작하기</button>
    </div>
  </form>

  <div data-pane="join" hidden>
    <ol class="join-steps">
      <li><span>1</span><div><b>작가 등록 신청</b><p>기술·시작 연도, 활동 지역, 포트폴리오를 올려요. 5분이면 끝나요.</p></div></li>
      <li><span>2</span><div><b>운영자 승인</b><p>포트폴리오를 확인한 뒤 승인 결과를 알림톡으로 보내드려요.</p></div></li>
      <li><span>3</span><div><b>공고 알림 받고 참석 신청</b><p>내 기술·지역에 맞는 행사가 올라오면 바로 알려드려요.</p></div></li>
      <li><span>4</span><div><b>행사 후 정산</b><p>첫 선정 때 정산 정보를 등록하면 행사 후 계좌로 지급돼요.</p></div></li>
    </ol>
    <div class="join-tags"><span>캐리커처</span><span>페이스페인팅</span><span>캘리그라피</span><span>타로카드</span><span>요술풍선</span><span>헤나</span><span>혁필화</span><span>손마사지·네일</span><span>비즈공예</span></div>
    <a href="artist/register.html" class="btn btn-brand btn-block">작가 등록 시작하기 <i data-lucide="arrow-right"></i></a>
    <p class="auth-foot">이미 등록하셨나요? 승인 전이어도 <a href="artist/index.html">작가 포털</a>에서 진행 상태를 볼 수 있어요.</p>
  </div>
</div></section>
<script>
(function () {{
  var go = function () {{ location.href = 'artist/index.html'; }};
  var f = document.getElementById('artistLogin');
  f.addEventListener('submit', function (e) {{ e.preventDefault(); if (!f.checkValidity()) {{ f.reportValidity(); return; }} go(); }});
  [].forEach.call(document.querySelectorAll('[data-go-portal]'), function (b) {{ b.addEventListener('click', go); }});
  var openJoin = function () {{ if (location.hash === '#join') {{ var t = document.querySelector('[data-tab="join"]'); if (t) t.click(); }} }};
  window.addEventListener('DOMContentLoaded', openJoin); window.addEventListener('hashchange', openJoin);
}})();
</script>
"""
    page('login.html', '작가 로그인 | IUX EVENT', 'IUX EVENT 작가 로그인·작가 등록', None, body)

review(); donation(); quote(); faq(); login()
print('etc ok')
