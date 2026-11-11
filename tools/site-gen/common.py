import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'site')
PHONE = '010-9033-1491'
BRAND = 'IUX ART'

NAV = [
  ("about", "회사소개", "about.html", [("IUX EVENT 소개", "about.html"), ("새소식", "news.html"), ("재능기부", "donation.html")]),
  ("event", "출장 이벤트", "event.html", [("전체 프로그램", "event.html"), ("캐리커처", "event-caricature.html"), ("페이스페인팅", "event-facepainting.html"), ("캘리그라피", "event-calligraphy.html"), ("타로카드", "event-tarot.html"), ("요술풍선 삐에로", "event-balloon.html"), ("헤나", "event-henna.html"), ("혁필화", "event-hyukpil.html"), ("손마사지 & 네일아트", "event-handcare.html"), ("손금 & 관상", "event-palm.html"), ("커스텀 페인팅", "event-custompaint.html"), ("비즈공예", "event-beads.html"), ("빼빼로 만들기", "event-pepero.html"), ("히든싱어 이문세편 가수 김정훈", "event-show.html")]),
  ("gallery", "작품 갤러리", "artists.html", []),
  ("custom", "주문제작", "custom.html", [("가족·커플 기념 선물", "custom.html#family"), ("어린이집·유치원 단체", "custom.html#kids"), ("기업·병원 기념품", "custom.html#biz"), ("캐릭터 로고", "custom.html#logo"), ("반려동물", "custom.html#pet")]),
  ("edu", "교육센터", "edu.html", [("교육과정", "edu.html"), ("출장 강의 신청", "edu-apply.html"), ("교육 문의", "edu-qna.html")]),
  ("review", "행사 후기", "review.html", []),
]

FONTS = '''<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;700;800;900&family=Noto+Sans+KR:wght@400;500;700;800&family=Nanum+Pen+Script&display=swap">
<link rel="stylesheet" href="css/common.css">'''


def head(title, desc, artifact_root=False):
    meta = f'''<title>{title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="{desc}">
{FONTS}'''
    if artifact_root:
        return meta + '\n'
    return f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
{meta}
</head>
<body>
'''


LOGO = '<span class="logo-mark"><i><b></b><b></b><b></b></i></span>IUX EVENT'


def header(active=None):
    items = []
    for key, label, href, subs in NAV:
        cls = ' class="on"' if key == active else ''
        chev = ' <i data-lucide="chevron-down"></i>' if subs else ''
        sub = ''
        if subs:
            sub = '\n        <ul class="sub">' + ''.join(f'<li><a href="{h}">{t}</a></li>' for t, h in subs) + '</ul>'
        items.append(f'      <li{cls}><a href="{href}">{label}{chev}</a>{sub}</li>')
    nav = '\n'.join(items)
    nav += f'\n      <li class="m-cta"><a href="quote.html" class="q">행사 견적 받기</a><a href="login.html" class="l">작가 로그인</a><p class="tel">전화 상담 <b>{PHONE}</b></p></li>'
    return f'''<header class="hd" id="hd">
  <div class="wrap hd-in">
    <a href="index.html" class="logo" aria-label="IUX EVENT 홈">{LOGO}</a>
    <ul class="nav" id="nav">
{nav}
    </ul>
    <div class="hd-act">
      <a href="login.html" class="login">작가 로그인</a>
      <a href="quote.html" class="btn btn-dark btn-sm">행사 견적 받기</a>
      <button class="menu-btn" id="menuBtn" aria-label="메뉴 열기" aria-expanded="false" aria-controls="nav"><span class="bar"></span><span class="bar"></span><span class="bar"></span></button>
    </div>
  </div>
</header>
'''


def footer(promo=False, full=True):
    promo_html = '''<div class="promo" id="promo"><span>연말 행사 시즌 조기 예약 <b style="color:var(--brand)">10% 할인</b></span><a href="quote.html" class="btn btn-brand btn-sm">예약 혜택 받기</a><button class="x" id="promoX" aria-label="배너 닫기"><i data-lucide="x"></i></button></div>
''' if promo else ''
    end = '</body>\n</html>\n' if full else ''
    return f'''<footer class="ft">
  <div class="wrap">
    <div class="ft-top">
      <a href="index.html" class="logo" aria-label="IUX EVENT 홈">{LOGO}</a>
      <div><h4>회사소개</h4><ul><li><a href="about.html">IUX EVENT 소개</a></li><li><a href="artists.html">작품 갤러리</a></li><li><a href="news.html">새소식</a></li><li><a href="login.html#join">작가 등록</a></li><li><a href="login.html">작가 로그인</a></li></ul></div>
      <div><h4>출장 이벤트</h4><ul><li><a href="event.html">전체 프로그램</a></li><li><a href="event-caricature.html">캐리커처</a></li><li><a href="event-facepainting.html">페이스페인팅</a></li><li><a href="event-calligraphy.html">캘리그라피</a></li><li><a href="event-tarot.html">타로카드</a></li><li><a href="event-balloon.html">요술풍선 삐에로</a></li></ul></div>
      <div><h4>주문제작</h4><ul><li><a href="custom.html#family">기념 선물</a></li><li><a href="custom.html#kids">단체 선물</a></li><li><a href="custom.html#logo">캐릭터 로고</a></li><li><a href="custom.html#pet">반려동물</a></li></ul></div>
      <div><h4>교육센터</h4><ul><li><a href="edu.html">교육과정</a></li><li><a href="edu-apply.html">출장 강의 신청</a></li><li><a href="edu-qna.html">교육 문의</a></li></ul></div>
      <div><h4>고객지원</h4><ul><li><a href="quote.html">행사 문의</a></li><li><a href="faq.html">자주 묻는 질문</a></li><li><a href="review.html">행사 후기</a></li><li><a href="donation.html">재능기부</a></li></ul></div>
    </div>
    <div class="ft-bot">
      <address>
        <b>고객센터 {PHONE}</b> (연중무휴 08:00~22:00)<br>
        이메일 art@iux.kr<br>
        상호 다마유(IUX ART) · 대표 손금왕 · 사업자등록번호 424-41-01509 · 경기도 과천시 과천대로8길 65, 604-504<br>
        © 2026 IUX EVENT. All rights reserved.
      </address>
      <div class="sns"><a href="#" aria-label="인스타그램"><i data-lucide="instagram"></i></a><a href="#" aria-label="유튜브"><i data-lucide="youtube"></i></a><a href="#" aria-label="블로그"><i data-lucide="book-open"></i></a><a href="#" aria-label="카카오톡 채널"><i data-lucide="message-square"></i></a></div>
    </div>
  </div>
</footer>

{promo_html}<a href="quote.html" class="fab" aria-label="행사 상담 문의"><i data-lucide="message-circle"></i></a>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>
<script src="js/common.js"></script>
{end}'''


def crumbs(*items):
    parts = ['<a href="index.html">홈</a>']
    for label, href in items:
        parts.append('<i data-lucide="chevron-right"></i>')
        parts.append(f'<a href="{href}">{label}</a>' if href else f'<span>{label}</span>')
    return '<nav class="crumb" aria-label="현재 위치">' + ''.join(parts) + '</nav>'


def subhero(crumb_html, eyebrow, title, lead, extra='', aside=None, cls=''):
    if aside:
        return f'''<section class="subhero {cls}">
  <div class="wrap subhero-grid">
    <div class="rv">
      {crumb_html}
      <span class="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p class="lead">{lead}</p>
      {extra}
    </div>
    <div class="rv d1">{aside}</div>
  </div>
</section>
'''
    return f'''<section class="subhero center {cls}">
  <div class="wrap rv">
    {crumb_html}
    <span class="eyebrow">{eyebrow}</span>
    <h1>{title}</h1>
    <p class="lead" style="margin-inline:auto">{lead}</p>
    {extra}
  </div>
</section>
'''


def cta(title='다음 행사, IUX EVENT와 시작하세요!', text='날짜·장소·예상 인원만 알려주시면 프로그램 구성과 맞춤 견적을 함께 보내드립니다.', btn='행사 문의하기', href='quote.html'):
    return f'''<section class="wrap" style="margin-top:40px">
  <div class="cta rv">
    <div class="confetti" aria-hidden="true"></div>
    <span class="eyebrow">Next event</span>
    <h2 style="margin-top:10px">{title}</h2>
    <p>{text}</p>
    <a href="{href}" class="btn btn-brand">{btn} <i data-lucide="arrow-right"></i></a>
  </div>
</section>
'''


def page(filename, title, desc, active, body, promo=False):
    html = head(title, desc) + header(active) + '<main>\n' + body + '</main>\n\n' + footer(promo)
    os.makedirs(OUT, exist_ok=True)
    html = html.replace('IUX EVENT', BRAND)
    with open(os.path.join(OUT, filename), 'w', encoding='utf-8') as f:
        f.write(html)
