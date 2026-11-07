from common import *
from events_more import MORE, PROGRAMS
from collab import COLLAB, COMMON
from pricing import plans_for, bundles_of, BUNDLES, TIER, PRICE, CARI, COLOR_UP, CAPACITY, won

STEPS = [
  ("message-square-text", "문의 접수", "행사 날짜·장소·예상 인원을 남겨 주세요."),
  ("calculator", "상담·견적", "24시간 안에 프로그램 구성과 견적을 보내드려요."),
  ("user-check", "작가 배정", "행사 성격에 맞는 작가와 도안·소재를 확정해요."),
  ("party-popper", "현장 진행", "시작 30분 전 도착해 부스를 세팅하고 진행해요."),
  ("clipboard-check", "결과 리포트", "참여 인원과 현장 사진을 담아 정리해 드려요."),
]

def li(items):
    return ''.join(f'<li><i data-lucide="check"></i>{x}</li>' for x in items)

def plans_html(plans):
    out = []
    for p in plans:
        best = p.get('best')
        tag = '<span class="tagb">BEST</span>' if best else ''
        btn = 'btn-brand' if best else 'btn-ghost'
        out.append(f'''<div class="plan{' best' if best else ''} rv">{tag}
          <div><h3>{p['name']}</h3><p class="desc">{p['desc']}</p></div>
          <div class="price">{p['price']}</div>
          <ul>{li(p['items'])}</ul>
          <a href="quote.html" class="btn {btn}">이 구성으로 문의</a>
        </div>''')
    return '\n'.join(out)

EVENTS = {
 'caricature': dict(
   file='event-caricature.html', name='캐리커처', g='g1', icon='smile',
   h1='1~2분이면 완성되는<br><em>현장 캐리커처</em>',
   lead='손님 얼굴의 특징을 살려 1~2분 안에 그려 드립니다. 기업 행사·대학 축제·웨딩·돌잔치까지, 대기 줄이 생기는 부스를 만들어 드려요.',
   mock='<div class="mock"><div class="row"><b>현장 진행 현황</b><span class="tag">LIVE</span></div><div class="row"><span>완성</span><b>148장</b></div><div class="row"><span>평균 소요</span><b>3분 10초</b></div><div class="row"><span>투입 작가</span><b>4명</b></div></div>',
   kpis=[("1인 소요 시간", "3", "분", "흑백 기준, 컬러는 5분 내외"), ("작가 1명·1시간", "15~18", "명", "인원에 맞춰 작가 수를 정해요"), ("소속 캐리커처 작가", "92", "명", "전국 출장 가능")],
   occ=[("building-2", "기업 창립·송년 행사"), ("graduation-cap", "대학 축제·입학식"), ("heart", "웨딩·돌잔치"), ("store", "매장 오픈·팝업"), ("presentation", "박람회·컨퍼런스"), ("baby", "어린이날·가족 행사"), ("landmark", "지역 축제·관공서"), ("cake", "생일·프라이빗 파티")],
   plans=[
     dict(name='베이직', desc='작은 사내 행사, 프라이빗 파티', price='440,000<small>원~</small>', items=['작가 1명 · 2시간', '약 30~35명 참여', '흑백 캐리커처 · A4 용지', '기본 부스 세팅']),
     dict(name='스탠다드', desc='가장 많이 선택하는 행사 구성', price='1,180,000<small>원~</small>', items=['작가 2명 · 3시간', '약 90~100명 참여', '컬러 캐리커처 · 전용 비닐 포장', '행사 로고 프레임 인쇄', '결과 리포트 제공'], best=True),
     dict(name='프리미엄', desc='대형 행사·축제', price='맞춤 견적', items=['작가 3명 이상 · 종일 운영', '행사 포토존 액자 세팅', '현장 키링·액자 제작', '진행 매니저 동행']),
   ],
   opts=[("palette", "컬러 캐리커처", "흑백 대신 화사하게 채색 · A5·A4 같은 가격", "4시간 +100,000원"), ("frame", "미니 액자 포장", "완성 그림을 바로 액자에 담아 증정", "1개 3,000원"), ("key-round", "원목 키링 제작", "현장에서 그림을 키링으로 제작", "1개 6,000원"), ("printer", "로고 프레임 인쇄", "행사명·로고가 들어간 용지 제작", "+ 60,000원")],
   photo=('live-drawing-01', '축제 부스에서 작가가 손님을 마주 보고 캐리커처를 그리는 모습'),
   gal=[("", "", "축제 현장", "lv-cari-01", "야외 축제에서 캐리커처를 그리는 작가"), ("", "", "숲속 부스", "lv-cari-02", "천막 부스에서 손님을 그리는 작가"), ("", "", "행운 가득한 우리 가족", "lv-cari-03", "축제 현장에서 엄마와 아들을 함께 그린 캐리커처"), ("", "", "행복한 우리 가족", "lv-cari-06", "세 식구를 한 장에 그린 가족 캐리커처"), ("", "", "남매 캐리커처", "lv-cari-05", "누나와 남동생을 함께 그린 캐리커처"), ("", "", "무병장수", "lv-cari-04", "어르신께 그려 드린 덕담 캐리커처"), ("", "", "포인트(흑백)", "cz-02", "액자에 담은 흑백 포인트 캐리커처"),
        ("", "", "자매", "cz-08", "곱슬머리 자매 컬러 캐리커처"), ("", "", "반려견과 함께", "cz-09", "반려견과 함께 그린 캐리커처"), ("", "", "가족 3인", "cz-10", "아이들과 함께 그린 가족 캐리커처")] + \
   [("", "", "커플 · 문구", "cc-couple-msg", "문구를 넣은 컬러 커플 캐리커처"), ("", "", "가족 7인", "cc-family-7", "엄마와 자매들 컬러 캐리커처"), ("", "", "한복 커플", "cc-hanbok", "한복 입은 커플 캐리커처"),
        ("", "", "생일 선물", "cc-birthday", "생일 축하 컬러 캐리커처"), ("", "", "팀 단체", "cc-team-4", "4인 팀 단체 캐리커처"), ("", "", "어린이", "cc-kid-rabbit", "토끼와 함께 그린 어린이 캐리커처"),
        ("", "", "1주년", "cc-anniv", "1주년 기념 커플 캐리커처"), ("", "", "여행 테마", "cc-travel", "여행 테마 전신 캐리커처"), ("", "", "가족 5인", "cc-family-5", "5인 가족 컬러 캐리커처")] + \
   [("", "", "커플", "work-couple-01", "커플 캐리커처 작품"), ("", "", "현장 드로잉", "live-drawing-02", "작가가 커플을 그리는 손끝"), ("", "", "가족 4인", "work-family-03", "4인 가족 캐리커처"),
        ("", "", "공주 문구", "work-princess", "공주 문구가 들어간 캐리커처"), ("", "", "어린이 손님", "site-kid-01", "자기 캐리커처를 든 어린이"), ("", "", "현장 기념사진", "site-friends-01", "캐리커처를 받아 든 손님들"),
        ("", "", "개인", "work-single-02", "개인 캐리커처"), ("", "", "가족 손님", "site-family-01", "가족 캐리커처를 받은 손님들"), ("", "", "부부", "work-couple-02", "부부 캐리커처"), ("", "", "가족 문구", "work-family-01", "가족 문구 캐리커처")],
   faq=[("몇 명까지 그릴 수 있나요?", "작가 1명이 1시간에 흑백 기준 15~18명을 그립니다. 예상 인원을 알려주시면 대기 시간이 20분을 넘지 않도록 작가 수를 맞춰 드려요."),
        ("야외 행사도 가능한가요?", "가능합니다. 그늘막과 바람막이 클립을 준비해 가며, 우천 시에는 실내 대체 공간이 있으면 그대로 진행합니다."),
        ("부스에 필요한 준비물이 있나요?", "테이블 1개와 의자 2개(작가 1명 기준), 콘센트 1구만 있으면 됩니다. 이젤과 용지, 포장재는 저희가 가져갑니다."),
        ("행사 로고를 넣을 수 있나요?", "로고 파일을 보내주시면 용지 하단에 행사명과 로고를 인쇄해 기념품처럼 드릴 수 있어요.")],
   extra=None),
 'calligraphy': dict(
   file='event-calligraphy.html', name='캘리그라피', g='g3', icon='pen-line',
   h1='이름 한 줄도<br><em>작품이 되는 캘리그라피</em>',
   lead='전문 작가가 이름과 응원 문구를 손글씨로 써서 엽서·부채·에코백에 담아 드립니다. 웨딩 답례품과 기업 기념품으로 인기가 많아요.',
   mock='<div class="mock"><div class="big">함께여서<br>빛나는 날</div><div class="row"><span>소재</span><b>엽서·부채·에코백</b></div><div class="row"><span>1인 소요</span><b>약 1분</b></div></div>',
   kpis=[("1인 소요 시간", "1", "분", "이름 + 짧은 문구 기준"), ("작가 1명·1시간", "30~40", "명", "엽서 기준, 소재별 상이"), ("캘리그라피 작가", "38", "명", "붓·펜·디지털 캘리 가능")],
   occ=[("heart", "웨딩 답례품"), ("building-2", "기업 VIP 행사"), ("flower-2", "어버이날·스승의날"), ("school", "졸업·입학식"), ("store", "브랜드 팝업스토어"), ("landmark", "전통 축제·문화 행사"), ("gift", "연말 감사 이벤트"), ("hand-heart", "기부·후원 행사")],
   plans=[
     dict(name='베이직', desc='소규모 모임·매장 이벤트', price='380,000<small>원~</small>', items=['작가 1명 · 2시간', '약 60~70명 참여', '캘리그라피 엽서 기본 제공', '기본 부스 세팅']),
     dict(name='스탠다드', desc='웨딩·기업 행사 추천 구성', price='980,000<small>원~</small>', items=['작가 2명 · 3시간', '약 180명 참여', '엽서 + 부채 또는 책갈피', '행사 문구 맞춤 디자인', '결과 리포트 제공'], best=True),
     dict(name='프리미엄', desc='대형 행사·브랜드 협업', price='맞춤 견적', items=['작가 3명 이상 · 종일 운영', '에코백·텀블러 각인 등 굿즈', '현장 대형 캘리 퍼포먼스', '진행 매니저 동행']),
   ],
   opts=[("frame", "캔버스 캘리그라피", "캔버스에 브랜드 문구·로고를 써서 증정", "캘리그라피 단가 + 캔버스 비용"), ("presentation", "초크아트 웰컴보드", "큰 칠판 3개 + 작은 칠판 4개 기준", "550,000원")] + \
   [("scroll-text", "대형 퍼포먼스", "무대에서 행사 슬로건을 대형 붓글씨로", "+ 330,000원"), ("shopping-bag", "에코백 캘리", "패브릭 마커로 에코백에 직접 작성", "1개 7,000원"), ("bookmark", "책갈피·엽서", "코팅 책갈피, 고급 엽서 용지", "1개 1,500원"), ("frame", "액자 포장", "완성 작품을 액자에 담아 증정", "1개 4,000원")],
   gal=[("", "", "웰컴 칠판", "cl-chalk-board", "전시장 입구 칠판 캘리그라피"), ("", "", "캔버스 문구", "cl-canvas-sun", "캔버스에 쓴 브랜드 응원 문구"), ("", "", "로고 캔버스", "cl-canvas-logo", "로고와 차를 그린 캔버스"), ("", "", "현장 카드", "cl-card-car", "신차 앞에서 쓴 캘리그라피 카드")] + \
   [("", "", "부모님께 드리는 문구", "work-parents", "사랑하는 아버지 어머니 문구를 넣은 부모님 캐리커처"), ("", "", "응원 문구 카드", "cl-eun-card", "토닥토닥 오늘도 수고했어요 캘리그라피 카드"),
    ("", "", "엽서 캘리", "cl-eun-lucky", "나는 운이 좋은 사람 캘리그라피 엽서"), ("", "", "손글씨 소품", "cl-eun-stones", "꽃 그림과 캘리그라피 문구를 그린 흙 소품"),
    ("", "", "행사 부스 현장", "cl-eun-event", "행사장 부스에서 완성한 캘리그라피 카드를 들어 보이는 작가"), ("", "", "가족 문구 캘리", "work-family-01", "가족 문구를 넣은 가족 캐리커처")],
   faq=[("원하는 문구로 써 줄 수 있나요?", "네. 행사 슬로건이나 감사 문구를 미리 알려주시면 작가가 문구별로 서체를 정해 갑니다. 현장에서 손님이 원하는 문구도 써 드려요."),
        ("영문이나 한자도 가능한가요?", "영문 캘리그라피와 한자 서예가 가능한 작가가 따로 있습니다. 문의하실 때 함께 알려주세요."),
        ("먹물이 옷에 묻을 걱정은 없나요?", "현장에서는 빠르게 마르는 붓펜과 안료 마커를 사용하고, 먹물은 퍼포먼스에서만 사용합니다."),
        ("답례품을 미리 받아볼 수 있나요?", "행사 문구가 들어간 엽서를 미리 제작해 택배로 보내드리는 사전 제작도 가능합니다.")],
   extra=None),
 'facepainting': dict(
   file='event-facepainting.html', name='페이스페인팅', g='g5', icon='sparkles',
   photo=('fp-live-bee', '작가가 태블릿 도안을 보며 어린이 볼에 꿀벌을 그리는 모습'),
   h1='아이들이 먼저 찾는<br><em>페이스페인팅</em>',
   lead='피부 자극 테스트를 통과한 전용 물감으로 4분 안에 그려 드립니다. 어린이날·할로윈·가족 행사의 분위기를 확실하게 바꿔 드려요.',
   mock='<div class="mock"><div class="row"><b>인기 도안</b><span class="tag">BEST</span></div><div class="dots"><i style="background:#FFC800"></i><i style="background:#FF8A1F"></i><i style="background:#0E8F8A"></i><i style="background:#7C4DFF"></i><i style="background:#D441C9"></i></div><div class="row"><span>1인 소요</span><b>약 4분</b></div></div>',
   kpis=[("1인 소요 시간", "4", "분", "볼 도안 기준, 풀페이스 10분"), ("작가 1명·1시간", "12~15", "명", "도안 크기에 따라 달라요"), ("페이스페인팅 작가", "56", "명", "아동 행사 경력 2년 이상")],
   occ=[("baby", "어린이날 행사"), ("ghost", "할로윈 파티"), ("trophy", "체육대회·응원전"), ("tent", "지역 축제·캠핑장"), ("school", "어린이집·유치원"), ("shopping-cart", "쇼핑몰 가족 이벤트"), ("music", "공연·페스티벌"), ("users", "가족 초청 행사")],
   plans=[
     dict(name='베이직', desc='어린이집·소규모 가족 행사', price='350,000<small>원~</small>', items=['작가 1명 · 2시간', '약 25~30명 참여', '볼·손등 기본 도안 20종', '거울·물티슈 등 기본 세팅']),
     dict(name='스탠다드', desc='어린이날·쇼핑몰 행사 추천', price='920,000<small>원~</small>', items=['작가 2명 · 3시간', '약 80명 참여', '시즌 도안 + 글리터', '대기 번호표 운영', '결과 리포트 제공'], best=True),
     dict(name='프리미엄', desc='축제·테마파크·응원전', price='맞춤 견적', items=['작가 3명 이상 · 종일 운영', '풀페이스 분장 · 할로윈 특수 분장', '헤나·글리터 타투 부스 추가', '진행 매니저 동행']),
   ],
   opts=[("sparkles", "글리터 타투", "반짝이는 글리터 스텐실 타투", "+ 120,000원"), ("ghost", "할로윈 특수 분장", "상처·좀비 등 성인 대상 분장", "+ 180,000원"), ("hand", "헤나 타투", "천연 헤나로 1~2주 유지", "+ 200,000원"), ("flag", "응원 도안", "학교·팀 로고 맞춤 도안 제작", "+ 50,000원")],
   gal=[("", "", "부스 현장", "lv-face-01", "축제 부스에서 아이 볼에 그리는 작가")] + \
   [("", "", "무지개", "fp-rainbow", "볼에 그린 무지개"), ("", "", "체리", "fp-cherry", "볼에 그린 체리와 큐빅"), ("", "", "잠자리", "fp-dragonfly", "볼에 그린 파란 잠자리"),
        ("", "", "문어", "fp-octopus", "볼에 그린 문어"), ("", "", "아이스크림", "fp-icecream", "손등에 그린 아이스크림"), ("", "", "해파리", "fp-jellyfish", "볼에 그린 해파리"),
        ("", "", "고양이", "fp-cat", "얼굴에 그린 고양이 분장"), ("", "", "별", "fp-stars", "눈 아래 그린 별 장식"),
        ("", "", "용", "fp-dragon", "볼에 그린 붉은 용"), ("", "", "하트", "fp-live-hearts", "작가가 볼에 하트를 그리는 모습"), ("", "", "티아라", "fp-live-tiara", "이마에 그린 티아라와 꽃"),
        ("", "", "해골 손", "fp-skull-hand", "할로윈 해골 손 도안"), ("", "", "거미줄", "fp-live-spider", "할로윈 거미줄 도안을 그리는 모습"), ("", "", "할로윈 분장", "fp-live-skull", "얼굴 전체 할로윈 분장"),
        ("", "", "하트 눈매", "fp-live-heart-eye", "눈가에 그린 하트 포인트"), ("", "", "검은 고양이", "fp-live-cat", "공원 행사에서 고양이를 그리는 모습"), ("", "", "축제 부스", "fp-live-booth", "할로윈 축제 부스 현장")],
   faq=[("아이 피부에 안전한가요?", "피부 자극 테스트를 통과한 수성 전용 페이스페인팅 물감만 사용합니다. 그리기 전에 알레르기 여부를 보호자께 꼭 확인해요."),
        ("지우는 방법이 궁금해요.", "미지근한 물과 순한 비누로 부드럽게 닦으면 지워집니다. 현장에서 지우는 방법 안내 카드를 함께 드려요."),
        ("몇 살부터 가능한가요?", "만 3세부터 권장합니다. 그보다 어린 아이는 손등에 작은 도안으로 진행해요."),
        ("도안을 미리 정할 수 있나요?", "행사 테마에 맞춰 도안판을 미리 보내드리고, 원하시면 학교·팀 로고 도안도 만들어 드려요.")],
   extra=None),
}

DIGITAL = '''<section class="sec-sm soft" id="digital">
  <div class="wrap subhero-grid">
    <div class="rv">
      <span class="eyebrow">Digital caricature</span>
      <h2 class="sec-title" style="margin-top:10px">작가의 펜 끝을<br>대형 스크린으로 생중계</h2>
      <p class="lead" style="margin-top:14px;color:var(--ink-2)">태블릿으로 그리는 과정을 무대 화면에 실시간으로 띄웁니다. 그리는 사람도, 지켜보는 사람도 함께 즐기는 퍼포먼스예요. 완성본은 현장에서 바로 인화하거나 QR 코드로 받아 갈 수 있어요.</p>
      <div class="opts" style="grid-template-columns:1fr 1fr;margin-top:24px">
        <div class="opt-card"><i data-lucide="monitor-play"></i><h3>실시간 화면 중계</h3><p>HDMI로 행사장 스크린에 바로 연결</p></div>
        <div class="opt-card"><i data-lucide="qr-code"></i><h3>QR 파일 전송</h3><p>완성 그림을 고화질 파일로 전달</p></div>
      </div>
    </div>
    <div class="rv d1">
      <div class="compare" style="margin-top:0"><figure><img src="images/work-sisters.jpg" alt="종이에 그린 자매 캐리커처" loading="lazy"><figcaption>현장 손그림</figcaption></figure><figure><img src="images/digital-sisters.jpg" alt="같은 그림의 디지털 캐리커처" loading="lazy"><figcaption>디지털 캐리커처 (고화질 파일)</figcaption></figure></div>
    </div>
  </div>
</section>
'''

def build_event(key):
    e = dict(EVENTS[key])
    # 공개 단가·수용 인원 (pricing.py 기준으로 통일)
    if key in TIER:
        e['plans'] = plans_for(key, e['name'])
        e['kpis'] = [("1인 소요 시간", "1~2", "분", "케어부터 작업까지"), ("4시간 수용 인원", "100", "명+", "작가 1명 기준")] + list(e['kpis'][2:3])
        e['faq'] = [(q, CAPACITY + ' 손님이 더 많으면 작가 수를 늘려 드려요.') if ('몇 명' in q or '몇 개' in q) else (q, a) for q, a in e['faq']]
    if e.get('photo'):
        aside = f'<div class="ev-visual ph-img fit" style="--img:url(images/{e["photo"][0]}.jpg)"><img class="cover contain" src="images/{e["photo"][0]}.jpg" alt="{e["photo"][1]}"><span class="live badge"><i></i>LIVE</span></div>'
    else:
        aside = f'<div class="ev-visual {e["g"]}"><i data-lucide="{e["icon"]}" class="bigico"></i><span class="live badge"><i></i>LIVE</span>{e["mock"]}</div>'
    extra_btn = '<div class="btns"><a href="quote.html" class="btn btn-brand">견적 받기</a><a href="#plans" class="btn btn-ghost">구성·요금 보기</a></div>'
    body = subhero(crumbs(('출장 이벤트', 'event.html'), (e['name'], None)), 'On-site event', e['h1'], e['lead'], extra_btn, aside)

    kpis = ''.join(f'<div class="kpi rv d{i}"><span>{a}</span><b>{b}<small>{c}</small></b><p>{d}</p></div>' for i, (a, b, c, d) in enumerate(e['kpis']))
    body += f'<section class="sec-sm"><div class="wrap"><div class="kpis">{kpis}</div></div></section>\n'

    occ = ''.join(f'<div><span class="ic"><i data-lucide="{ic}"></i></span>{t}</div>' for ic, t in e['occ'])
    body += f'''<section class="sec-sm" style="padding-top:0"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">이런 행사에 잘 맞아요</h2><p>행사 성격에 맞춰 도안과 소재를 바꿔 진행합니다.</p></div></div>
  <div class="occ rv d1">{occ}</div>
</div></section>
'''

    steps = ''.join(f'<li class="step rv d{min(i,3)}"><span class="n">STEP {i+1}</span><span class="ic"><i data-lucide="{ic}"></i></span><h3>{t}</h3><p>{d}</p></li>' for i, (ic, t, d) in enumerate(STEPS))
    body += f'''<section class="sec-sm"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">진행 순서</h2><p>문의부터 행사 후 리포트까지 담당 매니저 한 명이 챙깁니다.</p></div></div>
  <ol class="steps">{steps}</ol>
</div></section>
'''
    body += f'''<section class="sec-sm soft" id="plans"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">{e['name']} 구성·요금</h2><p>4시간·6시간 기준이며, 두 프로그램을 묶으면 부스 하나로 더 풍성하게 운영할 수 있어요.</p></div><a href="quote.html" class="more">맞춤 견적 받기 <i data-lucide="arrow-right"></i></a></div>
  <div class="plans">{plans_html(e['plans'])}</div>
  <p class="note">작가 1명 기준 시작가 · 수도권 기준 · 재료비 포함 · VAT 별도 · 지방 출장은 교통비가 추가됩니다. 인원·장소·옵션에 따라 달라질 수 있어요.</p>
</div></section>
'''
    if key in COLLAB:
        names = {k: (n, f, ic, g) for k, n, f, sh, ic, g, c, im in PROGRAMS}
        def bprice(a, b):
            for x in BUNDLES:
                if {x[0], x[1]} == {a, b}:
                    return f'<p class="cb-price">함께 운영 · 4시간 <b>{won(x[4])}원~</b> · 6시간 <b>{won(x[5])}원~</b></p>'
            return '<p class="cb-price">함께 운영 · <b>맞춤 견적</b></p>'
        common = ''.join(f'<li><i data-lucide="{ic}"></i><div><b>{t}</b><span>{d}</span></div></li>' for ic, t, d in COMMON)
        cards = ''
        for i, (pk, title, concept, pts) in enumerate(COLLAB[key]):
            pn, pf, pic, pg = names[pk]
            href = pf if pk != key else 'quote.html'
            cards += f'''<article class="cb-card rv d{min(i, 3)}"><div class="cb-top"><span class="cb-ic {e['g']}"><i data-lucide="{e['icon']}"></i></span><span class="cb-plus">+</span><span class="cb-ic {pg}"><i data-lucide="{pic}"></i></span></div>
  <h3>{title}</h3><p class="cb-c">{concept}</p><ul>{''.join(f'<li><i data-lucide="check"></i>{x}</li>' for x in pts)}</ul>{bprice(key, pk) if pk != key else bprice(key, key)}
  <div class="cb-act"><a href="quote.html#p-{key}" class="btn btn-brand btn-sm">이 조합으로 문의</a>{'' if pk == key else f'<a href="{href}" class="btn btn-ghost btn-sm">{pn} 보기</a>'}</div></article>'''
        body += f'''<section class="sec-sm" id="collab"><div class="wrap">
  <div class="sec-head rv"><div><span class="eyebrow">Collaboration</span><h2 class="sec-title" style="margin-top:8px">다른 프로그램과 함께하면<br>더 좋아요</h2><p>두 프로그램을 한 부스에서 운영하면 손님은 더 오래 머물고, 담당자는 준비가 줄어요.</p></div></div>
  <ul class="cb-why rv d1">{common}</ul>
  <div class="cb-grid">{cards}</div>
</div></section>
'''
    opts = ''.join(f'<div class="opt-card rv d{min(i,3)}"><i data-lucide="{ic}"></i><h3>{t}</h3><p>{d}</p><b>{p}</b></div>' for i, (ic, t, d, p) in enumerate(e['opts']))
    body += f'''<section class="sec-sm"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">추가 옵션</h2><p>행사 만족도를 높여 주는 인기 옵션이에요.</p></div></div>
  <div class="opts">{opts}</div>
</div></section>
'''
    all_img = all(len(x) > 3 for x in e['gal'])
    def tile(x):
        g, ic, t = x[:3]
        if all_img:
            return f'<figure class="tile ph-img nat"><img class="cover" src="images/{x[3]}.jpg" alt="{x[4] if len(x) > 4 else t}" loading="lazy"><span>{t}</span></figure>'
        if len(x) > 3:
            span = ' '.join(c for c in g.split() if c in ('tall', 'wide'))
            return f'<figure class="tile ph-img fit {span}" style="margin:0;--img:url(images/{x[3]}.jpg)"><img class="cover contain" src="images/{x[3]}.jpg" alt="{t} 캐리커처 작품" loading="lazy"><span>{t}</span></figure>'
        return f'<div class="tile {g}"><i data-lucide="{ic}"></i><span>{t}</span></div>'
    gal = ''.join(tile(x) for x in e['gal'])
    body += f'''<section class="sec-sm" style="padding-top:0"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">현장 갤러리</h2><p>최근 진행한 {e['name']} 행사 현장입니다.</p></div><a href="review.html" class="more">행사 후기 보기 <i data-lucide="arrow-right"></i></a></div>
  <div class="gal{' masonry' if all_img else ''} rv d1">{gal}</div>
</div></section>
'''
    faq = ''.join(f'<details><summary><span class="q">Q</span>{q}<i data-lucide="plus" class="pl"></i></summary><p class="a">{a}</p></details>' for q, a in e['faq'])
    body += f'''<section class="sec-sm" style="padding-top:0"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">자주 묻는 질문</h2></div><a href="faq.html" class="more">전체 FAQ <i data-lucide="arrow-right"></i></a></div>
  <div class="acc rv d1">{faq}</div>
</div></section>
'''
    rel = []
    keys = list(EVENTS)
    i0 = keys.index(key)
    for k2 in [keys[(i0 + d) % len(keys)] for d in (1, 2)]:
        e2 = EVENTS[k2]
        rel.append(f'<a href="{e2["file"]}" class="{e2["g"]}"><i data-lucide="{e2["icon"]}"></i><div><small>출장 이벤트</small><br><b>{e2["name"]}</b></div></a>')
    rel.append('<a href="custom.html" class="g2"><i data-lucide="gift"></i><div><small>주문제작</small><br><b>그림 선물·굿즈</b></div></a>')
    rel.append('<a href="edu.html" class="g4"><i data-lucide="graduation-cap"></i><div><small>교육센터</small><br><b>작가 양성 과정</b></div></a>')
    body += f'''<section class="sec-sm" style="padding-top:0"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">함께 보면 좋은 프로그램</h2></div></div>
  <div class="rel rv d1">{''.join(rel)}</div>
</div></section>
'''
    body += cta(f'{e["name"]} 행사, 일정부터 확인해 드릴게요', '원하는 날짜에 가능한 작가가 있는지 먼저 확인하고 견적을 보내드립니다.', '견적 문의하기')
    page(e['file'], f'{e["name"]} 출장 이벤트 | IUX EVENT', e['lead'], 'event', body)

# 순서: 메뉴 순서와 같게
_order = [k for k, *_ in PROGRAMS]
EVENTS.update(MORE)
EVENTS = {k: EVENTS[k] for k in _order}

def prog_visual(name, icon, g, img, alt=''):
    if img:
        return f'<div class="pv ph-img fit" style="--img:url(images/{img}.jpg)"><img class="cover contain" src="images/{img}.jpg" alt="{alt or name + ' 현장 작품'}" loading="lazy"></div>'
    return f'<div class="pv {g}"><i data-lucide="{icon}"></i></div>'

def price_block():
    names = {k: n for k, n, *_ in PROGRAMS}
    def tier_row(t, label):
        ks = [k for k, v in TIER.items() if v == t and k in names]
        p4, p6 = PRICE[t]
        return f'''<div class="pr-tier rv"><p class="pr-k">{label}</p><p class="pr-names">{' · '.join(names[k] for k in ks)}</p>
      <div class="pr-p"><div><span>4시간</span><b>{won(p4)}<small>원~</small></b></div><div><span>6시간</span><b>{won(p6)}<small>원~</small></b></div></div></div>'''
    bs = ''.join(f'''<a class="pr-b rv" href="quote.html#p-{a}"><span class="pr-tag">2개 묶음</span><h3>{nm}</h3><p>{d}</p><div class="pr-p sm"><div><span>4시간</span><b>{won(p4)}<small>원~</small></b></div><div><span>6시간</span><b>{won(p6)}<small>원~</small></b></div></div>{'<p class="pr-note">포인트(흑백) 기준 · 컬러 +10만원</p>' if 'caricature' in (a, b) else ''}</a>''' for a, b, nm, d, p4, p6 in BUNDLES)
    return f'''<section class="sec-sm soft" id="price"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">요금 안내</h2><p>작가 1명 기준 시작가예요. 한 분당 케어·작업 1~2분, <b>4시간에 100명 이상</b> 진행할 수 있어요.</p></div><a href="quote.html" class="more">맞춤 견적 받기 <i data-lucide="arrow-right"></i></a></div>
  <div class="pr-tiers">{tier_row('A', '드로잉·뷰티·운세')}{tier_row('B', '퍼포먼스·전통')}</div>
  <div class="pr-cari rv"><div><p class="pr-k">캐리커처</p><h3>포인트(흑백)와 컬러 중 고르세요</h3><p>A5 · A4 사이즈는 같은 가격이에요.</p></div>
    <div class="pr-p"><div><span>포인트(흑백) 4시간 · 6시간</span><b>{won(CARI['point'][0])}<small>원~</small></b><em>{won(CARI['point'][1])}원~</em></div><div class="hl"><span>컬러 4시간 · 6시간</span><b>{won(CARI['color'][0])}<small>원~</small></b><em>{won(CARI['color'][1])}원~</em></div></div></div>
  <div class="pr-cari rv"><div><p class="pr-k">커스텀 페인팅</p><h3>접시 · 에코백 브랜드 페인팅</h3><p>재료비는 소재·수량에 따라 따로 협의해요.</p></div>
    <div class="pr-p"><div class="hl"><span>4시간 · 6시간 (작가 1명)</span><b>450,000<small>원~</small></b><em>6시간 675,000원~ · 재료비·수량 협의</em></div></div></div>
  <div class="pr-cari rv"><div><p class="pr-k">캘리그라피 특별 구성</p><h3>캔버스 캘리그라피 · 초크아트</h3><p>브랜드 행사 웰컴보드와 문구 선물로 인기예요.</p></div>
    <div class="pr-p"><div><span>캔버스 캘리그라피</span><b style="font-size:18px">캘리 단가<small>+ 캔버스</small></b><em>4시간 300,000원~ · 6시간 450,000원~ + 캔버스 비용</em></div><div class="hl"><span>초크아트 (큰 칠판 3 · 작은 칠판 4)</span><b>550,000<small>원</small></b><em>칠판 수에 따라 조정</em></div></div></div>
  <h3 class="pr-h rv">두 프로그램을 함께하면 더 풍성해요</h3>
  <div class="pr-bundles">{bs}</div>
  <p class="note">수도권 기준 · 재료비 포함 · VAT 별도 · 지방 출장은 교통비가 추가됩니다. 인원·장소·옵션에 따라 달라질 수 있어요.</p>
</div></section>
'''

def overview():
    tabs = ''.join(f'<button class="tab{" on" if f=="all" else ""}" data-f="{f}">{t}</button>' for f, t in [("all","전체"),("draw","드로잉"),("kids","키즈·체험"),("beauty","뷰티·힐링"),("fun","운세·이벤트")])
    big = {"caricature": "cc-couple-sunset", "facepainting": "fp-cherry", "calligraphy": "work-parents", "hyukpil": "hp-work-03", "balloon": "bl-live-hat", "custompaint": "cp-plate-swan", "tarot": "lv-tarot-01", "pepero": "pp-hero"}
    cards = ''
    for k, name, file, short, icon, g, cat, img in PROGRAMS:
        e = EVENTS[k]
        k1 = e['kpis'][0]; k2 = e['kpis'][1]
        if k in TIER: k1, k2 = ('1인 소요', '1~2', '분'), ('4시간 수용', '100', '명+')
        cards += f'''<a href="{file}" class="pcard2" data-cat="{cat}">{prog_visual(name, icon, g, big.get(k))}
  <div class="pb"><h3>{name}</h3><p>{short}</p><dl><dt>{k1[0]}</dt><dd>{k1[1]}{k1[2]}</dd><dt>{k2[0]}</dt><dd>{k2[1]}{k2[2]}</dd></dl><span class="go">자세히 보기 <i data-lucide="arrow-right"></i></span></div></a>\n'''
    body = subhero(crumbs(('출장 이벤트', None)), 'Programs', '행사에 맞춰 고르는<br><em>12가지 라이브 프로그램</em>',
                   '그리고, 꾸미고, 만들고, 즐기는 프로그램을 한 팀이 함께 운영합니다. 여러 프로그램을 묶으면 부스 구성과 견적을 한 번에 맞춰 드려요.',
                   '<div class="btns"><a href="quote.html" class="btn btn-brand">여러 프로그램 함께 견적 받기</a></div>')
    body += f'''<section class="sec-sm"><div class="wrap">
  <div class="toolbar"><div class="tabs" data-filter="#progGrid">{tabs}</div><span class="count">프로그램 <b data-count-of="#progGrid">{len(PROGRAMS)}</b>개</span></div>
  <div class="pgrid2" id="progGrid">{cards}</div>
</div></section>

{price_block()}
''' + cta('프로그램 조합이 고민된다면', '행사 성격과 인원을 알려주시면 어울리는 조합과 부스 배치를 함께 제안해 드립니다.', '조합 추천 받기')
    page('event.html', '출장 이벤트 프로그램 | IUX EVENT', '캐리커처·페이스페인팅·캘리그라피·타로카드·요술풍선·헤나·혁필화·손마사지·손금·관상·빼빼로 만들기 출장 이벤트 요금과 패키지', 'event', body)

for k in EVENTS:
    build_event(k)
overview()
print('events ok')
