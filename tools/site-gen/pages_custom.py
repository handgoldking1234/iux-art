from common import *

PRODUCTS = [
  ("family", "가족·커플 캔버스 액자 캐리커처", "작가 강하늘", 40000, 32000, "g1", "heart", ["BEST"]),
  ("family", "결혼기념일 컬러 캐리커처 (디지털 액자)", "작가 문채원", 30000, None, "g5", "gem", []),
  ("kids", "어린이집 단체 캐리커처 A5 (20명 이하)", "작가 임도윤", 20000, 15000, "g3", "baby", ["HOT"]),
  ("kids", "졸업 기념 단체 캐리커처 4×6인치", "작가 최다온", 15000, None, "g2", "graduation-cap", []),
  ("biz", "기업·병원 기념 캐리커처 + 굿즈 제작", "작가 한결", 30000, None, "g4", "building-2", ["NEW"]),
  ("biz", "퇴임·승진 기념 캐리커처 액자", "작가 강하늘", 50000, 45000, "g2", "award", []),
  ("logo", "간판·상업용 캐릭터 로고 제작", "작가 최다온", 100000, None, "g3", "store", ["BEST"]),
  ("logo", "유튜브·SNS 프로필 캐릭터", "작가 배나리", 60000, None, "g5", "at-sign", []),
  ("pet", "반려동물 캐리커처 원목 키링", "작가 박모아", 30000, 25000, "g1", "paw-print", ["HOT"]),
  ("pet", "반려동물 캔버스 액자", "작가 서보라", 30000, None, "g4", "dog", []),
  ("calli", "드라이플라워 캘리그라피 액자", "작가 윤솔", 50000, None, "g3", "flower-2", []),
  ("calli", "가훈·좌우명 붓글씨 액자", "작가 오가람", 70000, None, "g2", "scroll-text", ["NEW"]),
]

def won(n): return f'{n:,}원'

IMG = {
  "가족·커플 캔버스 액자 캐리커처": ("work-family-02", "4인 가족 캐리커처 작품"),
  "결혼기념일 컬러 캐리커처 (디지털 액자)": ("work-couple-02", "부부 캐리커처 작품"),
  "어린이집 단체 캐리커처 A5 (20명 이하)": ("work-sisters", "자매 캐리커처 작품"),
  "졸업 기념 단체 캐리커처 4×6인치": ("work-single-02", "개인 캐리커처 작품"),
  "퇴임·승진 기념 캐리커처 액자": ("work-parents", "부모님 캐리커처 작품"),
  "드라이플라워 캘리그라피 액자": ("work-single-01", "손글씨 문구가 들어간 개인 캐리커처"),
}

def custom():
    tabs = ''.join(f'<button class="tab{" on" if f=="all" else ""}" data-f="{f}">{t}</button>' for f, t in [("all","전체"),("family","가족·커플"),("kids","어린이집·유치원"),("biz","기업·병원"),("logo","캐릭터 로고"),("pet","반려동물"),("calli","캘리그라피")])
    cards = ''
    for cat, title, by, price, sale, g, ic, badges in PRODUCTS:
        b = ''.join(f'<i class="{"y" if x=="BEST" else ""}">{x}</i>' for x in badges)
        if sale:
            pr = f'<em>{round((price-sale)/price*100)}%</em><s>{won(price)}</s>{won(sale)}'
        else:
            pr = won(price)
        IMG.update({"기업·병원 기념 캐리커처 + 굿즈 제작": ("cz-66", "단체 기념 캐리커처"), "유튜브·SNS 프로필 캐릭터": ("cz-03", "프로필용 개인 캐리커처"),
            "반려동물 캐리커처 원목 키링": ("cz-36", "반려견과 함께 그린 캐리커처"), "반려동물 캔버스 액자": ("cz-32", "반려견을 안은 커플 캐리커처"),
            "가훈·좌우명 붓글씨 액자": ("cl-card-car", "붓글씨 캘리그라피 카드")})
        if title in IMG:
            f_, alt_ = IMG[title]
            visual = f'<div class="ph ph-img"><img class="cover" src="images/{f_}.jpg" alt="{alt_}" loading="lazy">'
        else:
            visual = f'<div class="ph {g}"><i data-lucide="{ic}"></i>'
        cards += f'<a href="product.html" class="pcard" data-cat="{cat}">{visual}<div class="badges">{b}</div><span class="play"><i data-lucide="shopping-bag"></i></span></div><p class="by">{by}</p><h3>{title}</h3><p class="pr">{pr}</p></a>\n'
    body = subhero(crumbs(('주문제작', None)), 'Custom order', '사진 한 장으로 만드는<br><em>세상에 하나뿐인 그림</em>',
                   '사진을 보내주시면 작가가 직접 그려 액자·키링·굿즈로 만들어 보내드립니다. 시안은 2회까지 무료로 수정해 드려요.')
    body += f'''<section class="sec-sm"><div class="wrap">
  <div class="toolbar"><div class="tabs" data-filter="#productGrid" data-hash>{tabs}</div><span class="count">상품 <b data-count-of="#productGrid">{len(PRODUCTS)}</b>개</span></div>
  <div class="pgrid" id="productGrid">{cards}</div>
</div></section>

<section class="sec-sm soft"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">주문제작 진행 순서</h2><p>평균 7일 안에 받아보실 수 있어요.</p></div></div>
  <ol class="steps">
    <li class="step rv"><span class="n">STEP 1</span><span class="ic"><i data-lucide="image-up"></i></span><h3>사진 보내기</h3><p>얼굴이 잘 보이는 정면 사진이 좋아요.</p></li>
    <li class="step rv d1"><span class="n">STEP 2</span><span class="ic"><i data-lucide="pencil-ruler"></i></span><h3>시안 확인</h3><p>2~3일 안에 스케치 시안을 보내드려요.</p></li>
    <li class="step rv d2"><span class="n">STEP 3</span><span class="ic"><i data-lucide="refresh-cw"></i></span><h3>수정 2회 무료</h3><p>표정·의상·배경을 원하는 대로 다듬어요.</p></li>
    <li class="step rv d3"><span class="n">STEP 4</span><span class="ic"><i data-lucide="package"></i></span><h3>제작·포장</h3><p>액자·키링 등 선택한 상품으로 제작해요.</p></li>
    <li class="step rv d3"><span class="n">STEP 5</span><span class="ic"><i data-lucide="truck"></i></span><h3>배송</h3><p>파일 상품은 메일로, 실물은 택배로 보내요.</p></li>
  </ol>
</div></section>
''' + cta('단체 주문은 따로 견적을 드려요', '20명 이상 단체 주문이나 기업 굿즈는 수량에 맞춰 할인된 견적을 보내드립니다.', '단체 주문 문의')
    page('custom.html', '주문제작 | IUX EVENT', '사진으로 주문하는 캐리커처·캘리그라피 그림 선물과 굿즈', 'custom', body)


def product():
    body = f'''<section class="sec-sm" style="padding-top:40px"><div class="wrap">
  {crumbs(('주문제작', 'custom.html'), ('가족·커플', 'custom.html#family'), ('상품 상세', None))}
  <div class="pd">
    <div class="rv">
      <div class="pd-main" id="pdMain"><img src="images/work-family-02.jpg" alt="4인 가족 캐리커처 작품"></div>
      <div class="pd-thumbs">
        <button type="button" class="on" data-src="images/work-family-02.jpg" data-alt="4인 가족 캐리커처 작품" aria-label="4인 가족 캐리커처 작품 보기"><img src="images/work-family-02.jpg" alt=""></button>
        <button type="button" class="" data-src="images/work-family-01.jpg" data-alt="행복한 우리가족 문구 캐리커처" aria-label="행복한 우리가족 문구 캐리커처 보기"><img src="images/work-family-01.jpg" alt=""></button>
        <button type="button" class="" data-src="images/work-family-03.jpg" data-alt="안경 쓴 가족 캐리커처" aria-label="안경 쓴 가족 캐리커처 보기"><img src="images/work-family-03.jpg" alt=""></button>
        <button type="button" class="" data-src="images/site-family-01.jpg" data-alt="완성 그림을 받은 가족 손님" aria-label="완성 그림을 받은 가족 손님 보기"><img src="images/site-family-01.jpg" alt=""></button>
      </div>
    </div>
    <form class="pd-info rv d1" id="pdForm" data-base="32000" data-demo data-msg="주문서가 접수되었습니다. 사진 업로드 안내를 보내드릴게요." data-reset="no">
      <p class="by">작가 강하늘 · 캐리커처</p>
      <h1>가족·커플 캔버스 액자 캐리커처</h1>
      <div class="pd-price"><em>20%</em><b>32,000원</b><s>40,000원</s></div>
      <dl class="spec">
        <dt>제작 기간</dt><dd>시안 2~3일 · 완성 후 1~2일 내 발송</dd>
        <dt>배송비</dt><dd>3,000원 (50,000원 이상 무료)</dd>
        <dt>수정</dt><dd>스케치 시안 2회 무료</dd>
      </dl>
      <div class="form" style="padding:22px 0;gap:16px;border-bottom:1px solid var(--line)">
        <div class="field"><label for="optSize">사이즈</label><select id="optSize"><option data-add="0">20×20cm 캔버스</option><option data-add="8000">30×30cm 캔버스 (+8,000원)</option><option data-add="18000">40×40cm 캔버스 (+18,000원)</option></select></div>
        <div class="field"><label for="optPeople">인원</label><select id="optPeople"><option data-add="0">1~2명</option><option data-add="10000">3~4명 (+10,000원)</option><option data-add="20000">5~6명 (+20,000원)</option></select></div>
        <div class="field"><label for="optStyle">채색</label><select id="optStyle"><option data-add="0">컬러</option><option data-add="0">흑백</option><option data-add="5000">수채화 (+5,000원)</option></select></div>
        <div class="field"><span class="lbl2">수량</span><div class="qty"><button type="button" data-qty="-1" aria-label="수량 줄이기"><i data-lucide="minus"></i></button><input id="qty" value="1" inputmode="numeric" aria-label="수량"><button type="button" data-qty="1" aria-label="수량 늘리기"><i data-lucide="plus"></i></button></div></div>
      </div>
      <div class="total"><span>총 상품 금액</span><b id="total">32,000원</b></div>
      <div class="pd-btns">
        <button type="button" class="btn btn-ghost" data-toast="관심 상품에 담았습니다." aria-label="관심 상품"><i data-lucide="heart"></i></button>
        <button type="button" class="btn btn-ghost" data-toast="장바구니에 담았습니다.">장바구니</button>
        <button type="submit" class="btn btn-brand">주문하기</button>
      </div>
    </form>
  </div>

  <nav class="anchor-tabs" aria-label="상품 정보"><a href="#pd-detail">상세 정보</a><a href="#pd-process">제작 과정</a><a href="#pd-review">구매 후기 (128)</a><a href="#pd-ship">배송·교환</a></nav>

  <div class="detail-block" id="pd-detail">
    <div class="detail-hero g1 rv"><p class="pen">우리 가족이 그림이 되는 날</p><div class="photo-strip" style="margin:28px auto 0;max-width:760px"><figure><img class="cover" src="images/work-family-02.jpg" alt="가족 캐리커처 예시 1" loading="lazy"></figure><figure><img class="cover" src="images/work-couple-03.jpg" alt="커플 캐리커처 예시" loading="lazy"></figure><figure><img class="cover" src="images/work-parents.jpg" alt="부모님 캐리커처 예시" loading="lazy"></figure><figure><img class="cover" src="images/work-family-03.jpg" alt="가족 캐리커처 예시 2" loading="lazy"></figure></div><p style="margin-top:10px;opacity:.9">사진 속 표정을 살려 따뜻한 컬러로 그려 캔버스 액자에 담아 드려요.</p></div>
    <div class="opts" style="margin-top:16px">
      <div class="opt-card"><i data-lucide="pen-tool"></i><h3>작가 직접 드로잉</h3><p>AI 변환이 아닌 작가의 손그림</p></div>
      <div class="opt-card"><i data-lucide="frame"></i><h3>원목 캔버스 액자</h3><p>벽걸이·스탠드 겸용</p></div>
      <div class="opt-card"><i data-lucide="type"></i><h3>문구 무료 추가</h3><p>이름·기념일을 그림에 함께</p></div>
      <div class="opt-card"><i data-lucide="file-image"></i><h3>원본 파일 제공</h3><p>SNS 프로필용 이미지 파일</p></div>
    </div>
  </div>

  <div class="detail-block" id="pd-process">
    <h2>제작 과정</h2>
    <ol class="steps s4">
      <li class="step"><span class="n">STEP 1</span><span class="ic"><i data-lucide="image-up"></i></span><h3>사진 업로드</h3><p>주문 후 안내 메시지로 사진을 보내요.</p></li>
      <li class="step"><span class="n">STEP 2</span><span class="ic"><i data-lucide="pencil-ruler"></i></span><h3>스케치 시안</h3><p>2~3일 안에 시안을 확인해요.</p></li>
      <li class="step"><span class="n">STEP 3</span><span class="ic"><i data-lucide="palette"></i></span><h3>채색·완성</h3><p>확정한 시안으로 채색해요.</p></li>
      <li class="step"><span class="n">STEP 4</span><span class="ic"><i data-lucide="truck"></i></span><h3>액자 제작·배송</h3><p>꼼꼼히 포장해 보내드려요.</p></li>
    </ol>
  </div>

  <div class="detail-block" id="pd-review">
    <h2>구매 후기 <span style="color:var(--ink-3);font-weight:500">128</span></h2>
    <div class="masonry">
      <div class="rcard"><div class="top"><div class="stars"><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i></div><small style="color:var(--ink-3)">2026.10.21</small></div><h3>부모님 결혼 35주년 선물로 드렸어요</h3><p>시안 단계에서 아버지 안경 모양까지 맞춰 주셔서 감동했습니다.</p></div>
      <div class="rcard"><div class="top"><div class="stars"><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i></div><small style="color:var(--ink-3)">2026.10.09</small></div><h3>강아지까지 넣어 달라고 했는데 완벽해요</h3><p>3인 + 반려견 구성으로 주문했어요. 배송도 빨랐습니다.</p></div>
      <div class="rcard"><div class="top"><div class="stars"><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i></div><small style="color:var(--ink-3)">2026.09.30</small></div><h3>커플 기념일 선물 성공</h3><p>수정 요청을 두 번 했는데 친절하게 반영해 주셨어요.</p></div>
    </div>
  </div>

  <div class="detail-block" id="pd-ship" style="border-bottom:0">
    <h2>배송·교환 안내</h2>
    <div class="acc">
      <details><summary><span class="q">Q</span>배송은 얼마나 걸리나요?<i data-lucide="plus" class="pl"></i></summary><p class="a">시안 확정 후 1~2일 안에 발송하며, 택배 수령까지 보통 1~2일이 더 걸립니다.</p></details>
      <details><summary><span class="q">Q</span>교환·환불이 가능한가요?<i data-lucide="plus" class="pl"></i></summary><p class="a">주문 제작 상품이라 작업 시작 후에는 단순 변심 환불이 어렵습니다. 파손이나 제작 오류는 수령 후 7일 안에 알려주시면 다시 제작해 드려요.</p></details>
    </div>
  </div>
</div></section>
'''
    page('product.html', '가족·커플 캔버스 액자 캐리커처 | IUX EVENT', '사진으로 주문하는 가족·커플 캐리커처 캔버스 액자', 'custom', body)

custom(); product()
print('custom ok')
