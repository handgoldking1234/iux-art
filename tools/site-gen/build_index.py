import os, re
from common import *

src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
style = src[src.index('<style>') + 7: src.index('</style>')]
main = src[src.index('<main>') + 6: src.index('</main>')]

# --- 공통 CSS / JS ---
os.makedirs(os.path.join(OUT, 'css'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'js'), exist_ok=True)
sub_css = open(os.path.join(ROOT, 'gen', 'sub.css'), encoding='utf-8').read()
open(os.path.join(OUT, 'css', 'common.css'), 'w', encoding='utf-8').write('/* IUX ART — 공통 스타일 */\n' + style.strip() + '\n' + sub_css)
open(os.path.join(OUT, 'js', 'common.js'), 'w', encoding='utf-8').write(open(os.path.join(ROOT, 'gen', 'common.js'), encoding='utf-8').read())

# --- 메인 본문 수정: 링크 연결 + 3대 프로그램 중심 ---
R = [
  ('<a href="#quote" class="btn btn-brand">무료 견적 받기</a>', '<a href="quote.html" class="btn btn-brand">무료 견적 받기</a>'),
  ('''      <article class="scard g4">
        <div><span class="lbl">타로·사주</span><h3>행사장 한쪽,<br>가장 오래 머무는 부스</h3><p>연말 파티·축제에서 대기 줄이 끊이지 않는 상담 이벤트</p></div>
        <div class="mock"><div class="row"><b>오늘의 카드</b><span class="tag">THE STAR</span></div><div class="big">"좋은 기운이<br>들어와요"</div><div class="row"><span>상담 1회</span><b>약 5분</b></div></div>
      </article>''',
   '''      <article class="scard g4">
        <div><span class="lbl">현장 굿즈 제작</span><h3>그린 그림이 그 자리에서<br>키링·액자가 됩니다</h3><p>행사 로고를 넣은 기념품으로 참여 만족도를 한 번 더 올려 드립니다</p></div>
        <div class="mock"><div class="row"><b>현장 제작 옵션</b><span class="tag">당일 완성</span></div><div class="row"><span>원목 키링</span><b>10분</b></div><div class="row"><span>미니 액자</span><b>즉시</b></div><div class="row"><span>엽서 인화</span><b>즉시</b></div></div>
      </article>'''),
  ('<span class="lbl">디지털 실시간 중계</span>', '<span class="lbl">디지털 캐리커처</span>'),
  ('<a href="#" class="bc dk rv">', '<a href="event-caricature.html" class="bc dk rv">'),
  ('<a href="#" class="bc rv d1">\n        <span class="k">실시간 중계</span>', '<a href="event-caricature.html#digital" class="bc rv d1">\n        <span class="k">디지털 캐리커처</span>'),
  ('<a href="#" class="bc rv d2">', '<a href="custom.html" class="bc rv d2">'),
  ('<a href="#" class="bc rv">', '<a href="edu.html" class="bc rv">'),
  ('<a href="#" class="bc rv d1">', '<a href="review.html" class="bc rv d1">'),
  ('<a href="#" class="bc dk rv d2">', '<a href="quote.html" class="bc dk rv d2">'),
  ('<h3>타로·사주 부스 덕분에 자리를 뜨는 사람이 없었어요.</h3>', '<h3>디지털 캐리커처를 대형 스크린에 띄우니 끝까지 자리를 지켰어요.</h3>'),
  ('<div class="tile t-h2 g4"><i data-lucide="moon-star"></i><span>타로</span></div>', '<div class="tile t-h2 g4"><i data-lucide="party-popper"></i><span>기업 행사</span></div>'),
  ('<span>실시간 중계</span>', '<span>디지털 캐리커처</span>'),
  ('''        <a href="#" class="btn btn-brand">무료 견적 받기</a>
        <a href="#" class="btn btn-ghost">작가 포트폴리오 보기</a>''',
   '''        <a href="quote.html" class="btn btn-brand">무료 견적 받기</a>
        <a href="artists.html" class="btn btn-ghost">작가 포트폴리오 보기</a>'''),
  ('<a href="#" class="btn btn-brand">행사 문의하기 <i data-lucide="arrow-right"></i></a>', '<a href="quote.html" class="btn btn-brand">행사 문의하기 <i data-lucide="arrow-right"></i></a>'),
  ('<section class="sec" style="padding-top:0" id="quote">', '<section class="sec" style="padding-top:0">'),
  ('<div class="confetti" id="confetti" aria-hidden="true"></div>', '<div class="confetti" aria-hidden="true"></div>'),
]
for a, b in R:
    assert a in main, a[:70]
    main = main.replace(a, b)
assert '타로' not in main

# --- 실제 작품·현장 사진 적용 ---
def img(name, alt, pos='center 30%'):
    return f'<img class="cover" src="images/{name}.jpg" alt="{alt}" loading="lazy" style="object-position:{pos}">'

main = main.replace('<div class="stage" role="img" aria-label="무대 조명 아래 작가가 캐리커처를 실시간으로 그리는 장면">',
  '<div class="stage ph-img">\n      ' + img('site-family-01', '행사장에서 완성된 가족 캐리커처를 들고 기념사진을 찍는 손님들', 'center 35%').replace(' loading="lazy"', ''))
main = re.sub(r'<div class="easel">.*?<span class="sign">.*?</span>\s*</div>',
  '<figure class="easel photo"><img src="images/work-couple-01.jpg" alt="하트 배경의 커플 캐리커처 작품"></figure>', main, flags=re.S)
R2 = [
  ('<div class="mock"><div class="row"><b>현장 진행 현황</b><span class="tag">LIVE</span></div><div class="row"><span>완성</span><b>148장</b></div><div class="row"><span>평균 소요</span><b>3분 10초</b></div><div class="row"><span>투입 작가</span><b>4명</b></div></div>',
   '<figure class="art-card"><img src="images/work-family-01.jpg" alt="행복한 우리가족 문구가 들어간 4인 가족 캐리커처" loading="lazy"><figcaption>현장에서 3분 완성</figcaption></figure>'),
  ('<div class="mock"><div class="screen"><i data-lucide="monitor-play"></i></div><div class="row"><span>출력</span><b>현장 즉시 인화</b></div></div>',
   '<figure class="art-card"><img src="images/digital-sisters.jpg" alt="태블릿으로 그린 자매 디지털 캐리커처" loading="lazy"><figcaption>고화질 파일로 전달</figcaption></figure>'),
  ('<div class="mock"><div class="big">함께여서<br>빛나는 날</div><div class="row"><span>소재</span><b>엽서·부채·에코백</b></div></div>',
   '<figure class="art-card"><img src="images/cc-couple-heart-day.jpg" alt="함께해서 좋은 날 문구가 들어간 커플 컬러 캐리커처" loading="lazy"><figcaption>그림 위 손글씨 문구</figcaption></figure>'),
]
for a, b in R2:
    assert a in main, a[:60]
    main = main.replace(a, b)
main = re.sub(r'(<div class="art"><div class="monitor"><div class="scr"><span class="live"><i></i>LIVE</span>)\s*<svg class="face".*?</svg>',
  lambda m: m.group(1) + img('live-drawing-02', '작가가 캐리커처를 그리는 손끝').replace('class="cover"', 'class="cover contain"'), main, flags=re.S)
TH = [('thumb g1', 'site-friends-01', '캐리커처를 받아 들고 웃는 두 손님'), ('thumb g2', 'live-drawing-01', '축제 부스에서 손님을 그리는 작가'),
      ('thumb g3', 'work-couple-03', '고마워 사랑해 행복해 문구가 들어간 커플 캐리커처'), ('thumb g5', 'fp-cat', '고양이 페이스페인팅을 받고 웃는 어린이'),
      ('thumb g4', 'site-single-01', '완성된 캐리커처를 보여 주는 손님')]
for cls, n, alt in TH:
    main = re.sub(r'<div class="' + cls + r'"( style="color:#121212")?><svg class="deco".*?</svg>',
                  f'<div class="{cls.replace("thumb ", "thumb ph-img fit ")}" style="--img:url(images/{n}.jpg)">' + img(n, alt).replace('class="cover"', 'class="cover contain"'), main, count=1, flags=re.S)
TILES = [
  ('<div class="tile t-h1 g1"><i data-lucide="smile"></i><span>캐리커처</span></div>', 'work-couple-02', '부부 캐리커처 작품', '캐리커처'),
  ('<div class="tile t-h2 g2"><i data-lucide="monitor-play"></i><span>디지털 캐리커처</span></div>', 'fp-live-tiara', '이마에 티아라와 볼에 꽃을 그린 페이스페인팅', '페이스페인팅'),
  ('<div class="tile t-h2 g4"><i data-lucide="party-popper"></i><span>기업 행사</span></div>', 'work-princess', '공주 문구가 들어간 캐리커처', '캐리커처 엽서'),
  ('<div class="tile t-h3 g5"><i data-lucide="sparkles"></i><span>페이스페인팅</span></div>', 'fp-live-bee', '작가가 어린이 볼에 꿀벌을 그리는 모습', '현장 페이스페인팅'),
  ('<div class="tile t-h2 g3" style="color:#121212"><i data-lucide="pen-line"></i><span>캘리그라피</span></div>', 'fp-icecream', '손등에 그린 아이스크림 페이스페인팅', '손등 도안'),
  ('<div class="tile t-h2 g1"><i data-lucide="gift"></i><span>굿즈 제작</span></div>', 'work-family-03', '4인 가족 캐리커처 작품', '가족 캐리커처'),
  ('<div class="tile t-h1 g2"><i data-lucide="graduation-cap"></i><span>교육센터</span></div>', 'fp-octopus', '볼에 문어를 그린 페이스페인팅', '볼 도안'),
]
for a, n, alt, label in TILES:
    assert a in main, a[:50]
    main = main.replace(a, f'<figure class="tile ph-img nat">' + img(n, alt) + f'<span>{label}</span></figure>')
main, k = re.subn(r'<div class="mock"><div class="row"><b>인기 도안</b>.*?약 4분</b></div></div>',
  '<figure class="art-card"><img src="images/fp-cherry.jpg" alt="볼에 체리를 그린 페이스페인팅" loading="lazy"><figcaption>볼 도안 4분 완성</figcaption></figure>', main, flags=re.S)
assert k == 1

# --- 디지털 캐리커처·대형 스크린 제외 ---
_R3 = [
  ('<b>대형 스크린 중계</b><small>작가 손끝을 실시간으로</small>', '<b>11가지 프로그램</b><small>한 팀이 함께 운영해요</small>'),
  ('<span class="lbl">디지털 캐리커처</span><h3>작가의 펜 끝을<br>대형 스크린으로 생중계</h3><p>태블릿 드로잉을 무대 화면에 띄워 모두가 함께 보는 퍼포먼스</p>',
   '<span class="lbl">타로카드</span><h3>행사장 한쪽,<br>가장 오래 머무는 부스</h3><p>송년회·축제에서 대기 줄이 끊이지 않는 5분 운세 상담</p>'),
  ('<figure class="art-card"><img src="images/digital-sisters.jpg" alt="태블릿으로 그린 자매 디지털 캐리커처" loading="lazy"><figcaption>고화질 파일로 전달</figcaption></figure>',
   '<div class="mock"><div class="row"><b>오늘의 카드</b><span class="tag">THE STAR</span></div><div class="big">좋은 기운이<br>들어와요</div><div class="row"><span>상담 1회</span><b>약 5분</b></div></div>'),
  ('<h3>디지털 중계 퍼포먼스가 축제 영상에서 가장 많이 공유됐어요.</h3>', '<h3>축제 3일 내내 캐리커처 부스 줄이 끊이지 않았어요.</h3>'),
  ('무대 화면에<br>함성이 터졌죠', '3일 내내<br>줄이 섰어요'),
  ('<h3>디지털 캐리커처를 대형 스크린에 띄우니 끝까지 자리를 지켰어요.</h3>', '<h3>캐리커처와 타로 부스 덕분에 끝까지 자리를 지켰어요.</h3>'),
]
for a, b in _R3:
    assert a in main, a[:60]
    main = main.replace(a, b)
main, _n = re.subn(r'<a href="event-caricature\.html#digital" class="bc rv d1">.*?</a>',
  '<a href="event-facepainting.html" class="bc rv d1">\n        <span class="k">페이스페인팅</span>\n        <h3>아이들이 먼저 찾는<br><u>4분 완성</u> 볼 도안</h3>\n        <div class="art"><figure class="art-card bento-art"><img src="images/fp-rainbow.jpg" alt="볼에 무지개를 그린 페이스페인팅" loading="lazy"><figcaption>무지개 볼 도안</figcaption></figure></div>\n        <span class="play"><i data-lucide="arrow-up-right"></i></span>\n      </a>', main, count=1, flags=re.S)
assert _n == 1

# --- 11가지 프로그램 섹션 + 문구 ---
from events_more import PROGRAMS
main = main.replace('캐리커처·캘리그라피·페이스페인팅까지 전국 어디든 전문 작가가 찾아갑니다.', '캐리커처·페이스페인팅·타로카드·요술풍선까지 11가지 프로그램을 전국 어디든 전문 작가가 찾아가 진행합니다.')
cards = ''
for k, name, file, short, icon, g, cat, im in PROGRAMS:
    if im:
        v = f'<div class="pv ph-img fit" style="--img:url(images/{im}.jpg)"><img class="cover contain" src="images/{im}.jpg" alt="{name} 현장 작품" loading="lazy"></div>'
    else:
        v = f'<div class="pv {g}"><i data-lucide="{icon}"></i></div>'
    cards += f'<a href="{file}">{v}<h3>{name}</h3><p>{short}</p></a>'
prog_sec = f'''
<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv"><div><span class="eyebrow">11 live programs</span><h2 class="sec-title" style="margin-top:8px">행사에 맞춰 고르는<br>9가지 라이브 프로그램</h2></div><a href="event.html" class="more">전체 프로그램 보기 <i data-lucide="arrow-right"></i></a></div>
    <div class="prog9 rv d1">{cards}</div>
  </div>
</section>
'''
i = main.index('<div class="car-nav">'); j = main.index('</section>', i) + len('</section>')
main = main[:j] + prog_sec + main[j:]

# ---- 메인 비주얼: 여러 이벤트 롤링 ----
SLIDES = [
  # key, 탭 이름, 배경, 배경 위치, 작품, 작품 방향(p/l), 손글씨, 칩3개[(아이콘|eq, 제목, 설명)], 링크
  ("caricature", "캐리커처", "site-family-01", "center 35%", "cc-sisters-flower", "p", "1~2분이면 완성!",
   [("users", "대기 12명", "현장 줄서기 진행 중"), ("eq", "11가지 프로그램", "한 팀이 함께 운영해요"), ("gift", "키링·액자 제작", "그린 그림 그대로 굿즈로")], "event-caricature.html"),
  ("facepainting", "페이스페인팅", "lv-face-01", "center 40%", "fp-live-tiara", "p", "아이들 줄 1순위!",
   [("sparkles", "1~2분 완성", "볼·손등 도안 50종"), ("shield-check", "피부 안전 물감", "수성 전용 · 바로 지워져요"), ("smile", "어린이 행사 인기", "운동회·축제·가족의 날")], "event-facepainting.html"),
  ("hyukpil", "혁필화", "hp-booth", "center 50%", "hp-work-05", "l", "이름이 그림이 되는 순간",
   [("brush", "가죽 붓 전통 기법", "한 번에 그리는 문자 그림"), ("globe", "외국인 행사 인기", "영문 이름도 가능"), ("scroll-text", "족자 포장", "선물용으로 바로 증정")], "event-hyukpil.html"),
  ("calligraphy", "캘리그라피", "live-drawing-02", "center 40%", "cl-canvas-sun", "p", "마음을 글씨로",
   [("pen-line", "이름·덕담 문구", "현장에서 바로 써 드려요"), ("bookmark", "책갈피·엽서", "소품에 담아 증정"), ("heart", "웨딩·어버이날", "감사 행사에 딱")], "event-calligraphy.html"),
  ("balloon", "요술풍선 삐에로", "bl-live-table", "center 55%", "bl-swan-kid", "p", "1분이면 뚝딱!",
   [("wand-sparkles", "풍선 아트 20종", "강아지·칼·꽃·왕관"), ("party-popper", "삐에로 분장", "무지개 가발로 분위기 업"), ("baby", "어린이 행사 인기", "축제·어린이날·매장 오픈")], "event-balloon.html"),
  ("custompaint", "커스텀 페인팅", "cp-showroom-01", "center 45%", "cp-plate-sunflower", "l", "브랜드가 작품이 되는 순간",
   [("paintbrush", "접시·에코백 페인팅", "로고와 취향을 담아 현장 제작"), ("car", "신차 발표·VIP 행사", "전시장 분위기를 살려요"), ("gift", "오래 간직하는 기념품", "개별 박스 포장")], "event-custompaint.html"),
  ("festival", "축제 부스", "fp-live-booth", "center 40%", "hp-tiger", "l", "부스 하나로 축제 완성",
   [("layout-grid", "프로그램 묶음 운영", "캐리커처+페인팅+혁필화"), ("map-pin", "전국 출장", "야외·실내 어디든"), ("file-text", "결과 리포트", "사진·참여 인원 정리")], "event.html"),
]
def _chip(i, c):
    ic, t, d = c
    head = '<div class="eqbar"><i></i><i></i><i></i><i></i></div>' if ic == 'eq' else f'<span class="ico"><i data-lucide="{ic}"></i></span>'
    return f'<div class="chip {"abc"[i]}">{head}<div><b>{t}</b><small>{d}</small></div></div>'
slides = ''
for n, (k, name, bg, pos, art, ori, pen, chips, href) in enumerate(SLIDES):
    lazy = '' if n == 0 else ' loading="lazy"'
    slides += (f'<div class="hs-slide{" on" if n == 0 else ""}" data-k="{k}" role="group" aria-roledescription="slide" aria-label="{n+1} / {len(SLIDES)} {name}"{"" if n == 0 else " aria-hidden=\"true\""}>'
               f'<img class="cover" src="images/{bg}.jpg" alt=""{lazy} style="object-position:{pos}">'
               f'<span class="pen-note">{pen}</span>'
               f'<a class="easel photo{" land" if ori == "l" else ""}" href="{href}" tabindex="{0 if n == 0 else -1}" aria-label="{name} 자세히 보기"><img src="images/{art}.jpg" alt="{name} 작품"{lazy}></a>'
               + ''.join(_chip(i, c) for i, c in enumerate(chips)) + '</div>\n')
tabs = ''.join(f'<button type="button" class="hs-tab{" on" if n == 0 else ""}" data-i="{n}" role="tab" aria-selected="{"true" if n == 0 else "false"}"><span>{name}</span><i><b></b></i></button>' for n, (k, name, *_ ) in enumerate(SLIDES))
hero_new = f"""<div class="stage ph-img hs" id="heroSlider" aria-roledescription="carousel" aria-label="IUX ART 이벤트 소개">
      <div class="beam l"></div><div class="beam r"></div><div class="floor"></div>
      {slides}      <span class="live"><i></i>LIVE <em id="hsName">캐리커처</em></span>
      <button type="button" class="hs-nav prev" aria-label="이전 이벤트">‹</button><button type="button" class="hs-nav next" aria-label="다음 이벤트">›</button>
      <div class="hs-bar"><div class="hs-tabs" role="tablist" aria-label="이벤트 선택">{tabs}</div><button type="button" class="hs-play" aria-label="자동 넘김 멈춤"><span class="pz">❚❚</span><span class="pl">▶</span></button></div>
    </div>"""
_i = main.index('<div class="stage ph-img">')
_j = main.index('</div>\n  </div>\n</section>', _i)
main = main[:_i] + hero_new + main[_j + len('</div>'):]

def index_html(artifact_root):
    return (head('IUX EVENT', '캐리커처·페이스페인팅·캘리그라피·타로카드·요술풍선·헤나·혁필화·손마사지·비즈공예 출장 이벤트 IUX EVENT', artifact_root)
            + header(None) + '<main>' + main + '</main>\n\n' + footer(promo=True, full=not artifact_root)).replace('IUX EVENT', BRAND)

open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(index_html(True))
open(os.path.join(OUT, '_index_full.html'), 'w', encoding='utf-8').write(index_html(False))
print('index ok')

# 메인 콜라주에 삐에로 사진 추가
main = main.replace('<div class="col c3" data-speed="0.04"><figure class="tile ph-img nat"><img class="cover" src="images/fp-live-bee.jpg"',
  '<div class="col c3" data-speed="0.04"><figure class="tile ph-img nat"><img class="cover" src="images/bl-clown-01.jpg" alt="무지개 가발을 쓴 삐에로 아티스트" loading="lazy" width="1050" height="1400"><span>요술풍선 삐에로</span></figure><figure class="tile ph-img nat"><img class="cover" src="images/fp-live-bee.jpg"', 1)
main = main.replace('<div class="col c5" data-speed="0.06"><figure class="tile ph-img nat"><img class="cover" src="images/fp-octopus.jpg"',
  '<div class="col c5" data-speed="0.06"><figure class="tile ph-img nat"><img class="cover" src="images/bl-pink-dog.jpg" alt="분홍 강아지 풍선을 안은 어린이" loading="lazy" width="1050" height="1400"><span>풍선 선물</span></figure><figure class="tile ph-img nat"><img class="cover" src="images/fp-octopus.jpg"', 1)
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(index_html(True))
open(os.path.join(OUT, '_index_full.html'), 'w', encoding='utf-8').write(index_html(False))
# 소요 시간·수용 인원 문구 통일 (1인 1~2분, 4시간 100명+)
for a, b in [('3분 10초', '1분 40초'), ('3분 완성', '1~2분 완성'), ('3분이면 완성', '1~2분이면 완성'), ('3분 만에', '1~2분 만에')]:
    main = main.replace(a, b)
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(index_html(True))
open(os.path.join(OUT, '_index_full.html'), 'w', encoding='utf-8').write(index_html(False))

# 컬러 캐리커처 신작으로 메인 사진 교체
for a, b in [('images/work-couple-02.jpg" alt="부부 캐리커처 작품"', 'images/cc-family-7.jpg" alt="엄마와 자매들 컬러 캐리커처"'),
             ('images/work-princess.jpg"', 'images/cc-anniv.jpg"'),
             ('images/work-family-03.jpg" alt="4인 가족 캐리', 'images/cc-team-4.jpg" alt="4인 팀 단체 캐리'),
             ('images/work-family-01.jpg" alt="행복한 우리가족', 'images/cc-couple-msg.jpg" alt="행복한 순간 문구')]:
    main = main.replace(a, b)
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(index_html(True))
open(os.path.join(OUT, '_index_full.html'), 'w', encoding='utf-8').write(index_html(False))

for a, b in [('images/fp-icecream.jpg" alt="손등에 그린 아이스크림 페이스페인팅"', 'images/cz-25.jpg" alt="컬러 커플 캐리커처"'),
             ('images/fp-octopus.jpg" alt="볼에 문어를 그린 페이스페인팅"', 'images/lv-cari-01.jpg" alt="축제 현장에서 캐리커처를 그리는 작가"')]:
    main = main.replace(a, b)
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(index_html(True))
open(os.path.join(OUT, '_index_full.html'), 'w', encoding='utf-8').write(index_html(False))

main = main.replace('images/fp-live-tiara.jpg" alt="이마에 티아라와 볼에 꽃을 그린 페이스페인팅"', 'images/fp-live-hearts.jpg" alt="어린이 볼에 하트를 그리는 페이스페인팅"', 1)
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(index_html(True))
open(os.path.join(OUT, '_index_full.html'), 'w', encoding='utf-8').write(index_html(False))
main = main.replace('4분 완성', '1~2분 완성')
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(index_html(True))
open(os.path.join(OUT, '_index_full.html'), 'w', encoding='utf-8').write(index_html(False))
