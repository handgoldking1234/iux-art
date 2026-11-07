from common import *

# ---------------- 회사소개 ----------------
def about():
    body = subhero(crumbs(('회사소개', None)), 'About us', '행사장에 <em>사람이 모이는 이유</em>를<br>그림으로 만듭니다',
                   'IUX EVENT는 캐리커처·캘리그라피·페이스페인팅 작가가 직접 찾아가는 라이브 아트 이벤트 회사입니다.')
    body += '''<section class="sec-sm"><div class="wrap">
  <p class="manifesto rv">좋은 행사는 오래 기억되는 장면 하나를 남깁니다. <span>우리는 그 장면을 손님 손에 들려 보내는 일을 합니다.</span></p>
  <div class="values">
    <div class="value rv"><span class="pen">빠르게</span><h3>1인 1~2분, 4시간 100명+</h3><p>한 분당 케어·작업이 1~2분이라 작가 1명이 4시간에 100명 이상 진행합니다.</p></div>
    <div class="value rv d1"><span class="pen">꼼꼼하게</span><h3>담당 매니저 1:1 진행</h3><p>견적부터 현장 세팅, 결과 리포트까지 한 사람이 끝까지 챙깁니다.</p></div>
    <div class="value rv d2"><span class="pen">즐겁게</span><h3>보는 사람도 즐거운 부스</h3><p>그리는 과정 자체가 볼거리가 되도록 부스와 동선을 설계합니다.</p></div>
  </div>
  <div class="gal masonry rv" style="margin-top:56px">
    <figure class="tile ph-img nat"><img class="cover" src="images/live-drawing-01.jpg" alt="축제 부스에서 손님을 그리는 캐리커처 작가" loading="lazy"><span>캐리커처 부스</span></figure>
    <figure class="tile ph-img nat"><img class="cover" src="images/fp-rainbow.jpg" alt="무지개 페이스페인팅을 받은 어린이" loading="lazy"><span>페이스페인팅</span></figure>
    <figure class="tile ph-img nat"><img class="cover" src="images/work-parents.jpg" alt="캘리그라피 문구가 들어간 부모님 캐리커처" loading="lazy"><span>캘리 문구</span></figure>
    <figure class="tile ph-img nat"><img class="cover" src="images/fp-live-bee.jpg" alt="어린이 볼에 꿀벌을 그리는 작가" loading="lazy"><span>현장 진행</span></figure>
  </div>
</div></section>

<section class="data">
  <div class="wrap center">
    <h2 class="sec-title rv">숫자로 보는 IUX EVENT</h2>
    <div class="stats">
      <div class="stat rv"><b><span data-count="8412">8,412</span><sup>+</sup></b><p>누적 출장 행사 수</p></div>
      <div class="stat rv d1"><b><span data-count="785">785</span><sup>+</sup></b><p>전국 소속 작가 수</p></div>
      <div class="stat rv d2"><b><span data-count="97">97</span><sup>%</sup></b><p>담당자 재의뢰 의향</p></div>
    </div>
  </div>
</section>

<section class="sec-sm"><div class="wrap split">
  <div class="rv"><span class="eyebrow">History</span><h2 class="sec-title" style="margin-top:10px">걸어온 길</h2><p style="color:var(--ink-2);margin-top:12px">한 명의 캐리커처 작가로 시작해 전국 785명의 작가가 함께하는 팀이 되었습니다.</p></div>
  <ol class="tl rv d1">
    <li><span class="y">2026</span><ul><li>누적 출장 행사 8,000건 돌파</li><li>출장 프로그램 9종으로 확대 (타로·요술풍선·헤나·혁필화 등)</li></ul></li>
    <li><span class="y">2024</span><ul><li>교육센터 개관, 캐리커처·페이스페인팅 자격증 과정 개설</li><li>주문제작 굿즈 라인 확대</li></ul></li>
    <li><span class="y">2021</span><ul><li>캘리그라피 출장 이벤트 시작</li><li>재능기부 프로그램 정례화</li></ul></li>
    <li><span class="y">2018</span><ul><li>IUX EVENT 설립</li><li>캐리커처·페이스페인팅 출장 이벤트 시작</li></ul></li>
  </ol>
</div></section>

<section class="sec-sm soft"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">함께한 고객사</h2><p>기업·대학·관공서·웨딩홀 등 3,200곳 이상이 함께했습니다.</p></div></div>
</div>
  <div class="marquee rv d1"><div class="marquee-track">
    <span><i data-lucide="building-2"></i>OO전자</span><span><i data-lucide="graduation-cap"></i>OO대학교</span><span><i data-lucide="landmark"></i>OO구청</span><span><i data-lucide="heart"></i>OO웨딩홀</span><span><i data-lucide="shopping-bag"></i>OO백화점</span><span><i data-lucide="building"></i>OO은행</span><span><i data-lucide="hospital"></i>OO병원</span><span><i data-lucide="tent"></i>OO페스티벌</span>
    <span><i data-lucide="building-2"></i>OO전자</span><span><i data-lucide="graduation-cap"></i>OO대학교</span><span><i data-lucide="landmark"></i>OO구청</span><span><i data-lucide="heart"></i>OO웨딩홀</span><span><i data-lucide="shopping-bag"></i>OO백화점</span><span><i data-lucide="building"></i>OO은행</span><span><i data-lucide="hospital"></i>OO병원</span><span><i data-lucide="tent"></i>OO페스티벌</span>
  </div></div>
</section>

<section class="sec-sm"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">오시는 길</h2><p>교육센터와 사무실이 같은 건물에 있습니다.</p></div></div>
  <div class="mapbox rv d1" role="img" aria-label="지도 자리표시"><div class="road" style="left:0;right:0;top:58%;height:14px"></div><div class="road" style="top:0;bottom:0;left:36%;width:14px"></div><div class="pin"><i data-lucide="map-pin"></i></div></div>
  <div class="loc">
    <div><b><i data-lucide="map-pin"></i>주소</b><span class="sel">경기도 과천시 과천대로8길 65, 604-504</span></div>
    <div><b><i data-lucide="phone"></i>전화</b><span class="sel">''' + PHONE + '''</span></div>
    <div><b><i data-lucide="clock"></i>상담 시간</b>연중무휴 08:00 ~ 22:00</div>
  </div>
</div></section>
''' + cta()
    page('about.html', '회사소개 | IUX EVENT', 'IUX EVENT 회사소개, 연혁, 오시는 길', 'about', body)


# ---------------- 작가 갤러리 ----------------
ARTISTS = [
  ("강하늘", "하늘", "caricature", "캐리커처 · 컬러", ["기업 행사", "컬러 캐리커처"], "g1", "12년"),
  ("윤솔", "솔", "calligraphy", "캘리그라피", ["웨딩", "붓글씨 퍼포먼스"], "g3", "9년"),
  ("박모아", "모아", "face", "페이스페인팅", ["어린이날", "할로윈"], "g5", "7년"),
  ("최다온", "다온", "caricature", "캐리커처", ["대학 축제", "컬러"], "g2", "10년"),
  ("이새벽", "새벽", "calligraphy", "캘리그라피 · 영문", ["VIP 행사", "영문 캘리"], "g4", "8년"),
  ("정유리", "유리", "face", "페이스페인팅 · 헤나", ["축제", "헤나 타투"], "g1", "6년"),
  ("한결", "결", "caricature", "캐리커처 · 스피드", ["박람회", "대형 행사"], "g3", "11년"),
  ("오가람", "가람", "calligraphy", "캘리그라피 · 서예", ["전통 축제", "한자"], "g2", "15년"),
  ("서보라", "보라", "face", "페이스페인팅", ["쇼핑몰", "글리터"], "g4", "5년"),
  ("문채원", "채원", "caricature", "캐리커처 · 수채화", ["웨딩", "수채 캐리커처"], "g5", "8년"),
  ("배나리", "나리", "calligraphy", "디지털 캘리그라피", ["브랜드 팝업", "디지털"], "g1", "6년"),
  ("임도윤", "도윤", "caricature", "캐리커처", ["어린이 행사", "흑백 스피드"], "g2", "9년"),
]

def artists():
    tabs = '<button class="tab on" data-f="all">전체</button><button class="tab" data-f="caricature">캐리커처</button><button class="tab" data-f="calligraphy">캘리그라피</button><button class="tab" data-f="face">페이스페인팅</button>'
    cards = ''
    for name, short, cat, role, tags, g, yr in ARTISTS:
        t = ''.join(f'<span>{x}</span>' for x in tags)
        cards += f'<a href="quote.html" class="acard" data-cat="{cat}"><div class="av {g}">{short}</div><span class="play"><i data-lucide="arrow-up-right"></i></span><h3>{name}</h3><p class="role">{role} · 경력 {yr}</p><div class="tags">{t}</div></a>\n'
    body = subhero(crumbs(('회사소개', 'about.html'), ('작가 갤러리', None)), 'Artists', '행사를 빛내는<br><em>785명의 작가</em>',
                   '모든 작가는 현장 실기 테스트와 서비스 교육을 거쳐 활동합니다. 마음에 드는 작가를 지정해 예약할 수도 있어요.')
    body += f'''<section class="sec-sm"><div class="wrap">
  <div class="toolbar"><div class="tabs" data-filter="#artistGrid">{tabs}</div><span class="count">작가 <b data-count-of="#artistGrid">{len(ARTISTS)}</b>명</span></div>
  <div class="agrid" id="artistGrid">{cards}</div>
  <p class="note" style="text-align:center;margin-top:32px">작가 이름과 경력은 시안용 예시입니다.</p>
</div></section>
''' + cta('IUX ART와 함께할 작가를 찾고 있어요', '캐리커처·페이스페인팅·캘리그라피 등 11가지 분야 작가님의 등록을 기다립니다. 등록하면 맞는 공고를 알림톡으로 받아 보실 수 있어요.', '작가로 등록하기', 'login.html#join')
    page('artists.html', '작가 갤러리 | IUX EVENT', 'IUX EVENT 소속 캐리커처·캘리그라피·페이스페인팅 작가', 'about', body)


# ---------------- 새소식 ----------------
NEWS = [
  ("notice", "공지", "세금계산서·카드 결제 안내", "2026.10.28", "1,204"),
  ("notice", "공지", "연말 행사 시즌 조기 예약 10% 할인 (~11/30)", "2026.10.20", "2,318"),
  ("news", "소식", "출장 프로그램 9종으로 확대합니다", "2026.10.14", "873"),
  ("news", "소식", "대학 축제 시즌 출장 120건 진행 후기", "2026.10.02", "641"),
  ("edu", "교육", "11월 캐리커처 전문작가반 모집", "2026.09.25", "512"),
  ("news", "소식", "소아병동 재능기부 페이스페인팅 진행", "2026.09.18", "430"),
  ("edu", "교육", "페이스페인팅 자격증반 수료식 안내", "2026.09.09", "377"),
  ("news", "소식", "추석 연휴 고객센터 운영 안내", "2026.09.01", "295"),
  ("news", "소식", "기업 송년회 프로그램 패키지 출시", "2026.08.22", "702"),
  ("edu", "교육", "아이패드 디지털 드로잉 주말반 개설", "2026.08.11", "388"),
]

def news():
    rows = ''
    n = len([x for x in NEWS if x[0] != 'notice'])
    for cat, label, title, date, view in NEWS:
        if cat == 'notice':
            rows += f'<tr class="pin"><td><span class="st notice">공지</span></td><td class="hm">{label}</td><td class="t"><a href="news-view.html"><b>{title}</b></a></td><td class="hm">{date}</td><td class="hm">{view}</td></tr>\n'
        else:
            rows += f'<tr><td>{n}</td><td class="hm">{label}</td><td class="t"><a href="news-view.html">{title}</a></td><td class="hm">{date}</td><td class="hm">{view}</td></tr>\n'
            n -= 1
    body = subhero(crumbs(('회사소개', 'about.html'), ('새소식', None)), 'News', '새소식', 'IUX EVENT의 공지사항과 행사·교육 소식을 전합니다.')
    body += f'''<section class="sec-sm"><div class="wrap">
  <div class="toolbar"><span class="count">전체 <b>128</b>건</span>
    <form class="searchbar" role="search"><select id="newsField" aria-label="검색 항목"><option>제목</option><option>내용</option></select><input id="newsQ" type="search" placeholder="검색어를 입력하세요" aria-label="검색어"><button class="btn btn-dark btn-sm" type="submit">검색</button></form>
  </div>
  <div class="board-wrap"><table class="board">
    <thead><tr><th style="width:80px">번호</th><th class="hm" style="width:90px">분류</th><th>제목</th><th class="hm" style="width:120px">작성일</th><th class="hm" style="width:80px">조회</th></tr></thead>
    <tbody>{rows}</tbody>
  </table></div>
  <nav class="pagination" aria-label="페이지"><a href="#" aria-label="이전"><i data-lucide="chevron-left"></i></a><a href="#" class="on">1</a><a href="#">2</a><a href="#">3</a><a href="#">4</a><a href="#">5</a><a href="#" aria-label="다음"><i data-lucide="chevron-right"></i></a></nav>
</div></section>
'''
    page('news.html', '새소식 | IUX EVENT', 'IUX EVENT 공지사항과 소식', 'about', body)


def news_view():
    body = subhero(crumbs(('회사소개', 'about.html'), ('새소식', 'news.html'), ('상세', None)), 'News', '새소식', 'IUX EVENT의 공지사항과 행사·교육 소식을 전합니다.')
    body += '''<section class="sec-sm"><div class="wrap"><article class="article">
  <header class="article-head"><span class="st">소식</span><h1>출장 프로그램 9종으로 확대합니다</h1>
    <div class="meta"><span>IUX EVENT</span><span>2026.10.14</span><span>조회 873</span></div></header>
  <div class="article-body">
    <p>캐리커처·페이스페인팅·캘리그라피에 이어 타로카드, 요술풍선 삐에로, 헤나, 혁필화, 손마사지 &amp; 네일아트, 손금 &amp; 관상, 커스텀 페인팅, 비즈공예까지 모두 11가지 프로그램을 한 팀이 함께 운영합니다.</p>
    <p>여러 프로그램을 함께 고르시면 부스 배치와 동선, 작가 일정을 한 번에 맞춰 드려 담당자님이 따로 섭외하실 필요가 없습니다.</p>
    <figure class="article-fig ph-img" style="margin:28px auto"><img class="cover" src="images/work-couple-01.jpg" alt="하트 배경의 커플 캐리커처 작품" loading="lazy"></figure>
    <h3>이렇게 묶으면 좋아요</h3>
    <ul><li>어린이·가족 행사: 페이스페인팅 + 요술풍선 삐에로 + 비즈공예</li><li>기업 송년회·워크숍: 캐리커처 + 타로카드 + 손마사지 &amp; 네일아트</li><li>외국인·전통 행사: 혁필화 + 캘리그라피 + 헤나</li></ul>
    <p>프로그램별 구성과 요금은 출장 이벤트 메뉴에서 확인해 주세요.</p>
  </div>
  <nav class="article-nav"><a href="news-view.html"><span>이전 글</span><b>대학 축제 시즌 출장 120건 진행 후기</b></a><a href="news-view.html"><span>다음 글</span><b>연말 행사 시즌 조기 예약 10% 할인 (~11/30)</b></a></nav>
  <div class="board-foot"><a href="news.html" class="btn btn-ghost btn-sm">목록으로</a></div>
</article></div></section>
'''
    page('news-view.html', '출장 프로그램 9종으로 확대합니다 | IUX EVENT', 'IUX EVENT 새소식', 'about', body)

about(); news(); news_view()
print('company ok')
