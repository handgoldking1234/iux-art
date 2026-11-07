from common import *

# 작가 코드 라인업 (실명·연락처 없이 코드만 노출)
LINEUP = [
  ("C-03", "caricature", "캐리커처", 12, "컬러 · 웨딩·기업 행사", "서울·경기 남부", "work-couple-01"),
  ("C-07", "caricature", "캐리커처 · 캘리 문구", 10, "수채 컬러 · 가족 단체", "서울·경기 남부", "work-family-01"),
  ("C-11", "caricature", "캐리커처", 11, "흑백 스피드 · 대학 축제", "경기 남부·충청", "work-couple-02"),
  ("C-15", "caricature", "캐리커처", 15, "파스텔 · 박람회·야외 행사", "인천·서울", "live-drawing-01"),
  ("F-02", "facepainting", "페이스페인팅", 8, "볼·손등 도안 · 어린이 행사", "경기 북부·서울", "fp-rainbow"),
  ("F-05", "facepainting", "페이스페인팅 · 헤나", 6, "글리터·큐빅 포인트", "서울·경기 북부", "fp-cherry"),
  ("F-09", "facepainting", "페이스페인팅 · 요술풍선", 7, "캐릭터 도안 · 축제", "경기 남부", "fp-live-bee"),
  ("B-03", "balloon", "요술풍선 삐에로", 7, "삐에로 분장 · 풍선 아트", "강원·경기 북부", "bl-clown-01"),
  ("P-02", "custompaint", "커스텀 페인팅", 8, "접시·에코백 브랜드 페인팅", "서울·경기", "cp-plate-swan"),
  ("K-04", "calligraphy", "캘리그라피 · 혁필화", 9, "붓글씨 · 웨딩 답례", "서울·인천", "work-parents"),
]

# 작품: (이미지, 분류(공백 구분), 제목, 작가 코드)
WORKS = [
  ("cc-couple-sunset", "caricature calligraphy", "잘 살자 커플 캐리커처", "C-07"),
  ("cc-family-7", "caricature", "엄마와 자매들", "C-03"),
  ("cz-01", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-02", "caricature", "포인트(흑백) 캐리커처", "C-07"),
  ("cc-anniv", "caricature", "1주년 커플", "C-11"),
  ("cc-kid-rabbit", "caricature", "토끼와 어린이", "C-15"),
  ("cz-03", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-04", "caricature", "컬러 캐리커처", "C-15"),
  ("cc-team-4", "caricature", "아자아자 팀 캐리커처", "C-03"),
  ("cc-hanbok", "caricature", "한복 커플", "C-07"),
  ("cz-05", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-06", "caricature", "컬러 캐리커처", "C-07"),
  ("work-couple-01", "caricature", "커플 캐리커처", "C-03"),
  ("fp-rainbow", "facepainting", "무지개 볼 도안", "F-02"),
  ("cz-07", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-08", "caricature", "컬러 캐리커처", "C-15"),
  ("work-family-01", "caricature calligraphy", "가족 캐리커처 · 캘리 문구", "C-07"),
  ("live-drawing-01", "site caricature", "축제 부스 현장", "C-15"),
  ("cz-09", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-10", "caricature", "컬러 캐리커처", "C-07"),
  ("fp-cherry", "facepainting", "체리 볼 도안", "F-05"),
  ("work-couple-02", "caricature", "부부 캐리커처", "C-11"),
  ("cz-11", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-12", "caricature", "컬러 캐리커처", "C-15"),
  ("work-parents", "caricature calligraphy", "부모님 캐리커처 · 캘리 문구", "K-04"),
  ("fp-live-bee", "site facepainting", "꿀벌 도안 현장", "F-09"),
  ("cz-13", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-14", "caricature", "컬러 캐리커처", "C-07"),
  ("work-family-03", "caricature", "4인 가족 캐리커처", "C-11"),
  ("fp-dragonfly", "facepainting", "잠자리 볼 도안", "F-02"),
  ("cz-15", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-16", "caricature", "컬러 캐리커처", "C-15"),
  ("work-princess", "caricature calligraphy", "공주 문구 캐리커처", "C-15"),
  ("site-family-01", "site caricature", "완성 그림을 받은 가족", "C-07"),
  ("cz-17", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-18", "caricature", "컬러 캐리커처", "C-07"),
  ("fp-octopus", "facepainting", "문어 볼 도안", "F-09"),
  ("work-sisters", "caricature", "자매 캐리커처", "C-15"),
  ("cz-19", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-20", "caricature", "컬러 캐리커처", "C-15"),
  ("fp-icecream", "facepainting", "아이스크림 손등 도안", "F-05"),
  ("work-single-01", "caricature calligraphy", "개인 캐리커처 · 응원 문구", "C-03"),
  ("cz-21", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-22", "caricature", "컬러 캐리커처", "C-07"),
  ("live-drawing-02", "site caricature", "커플 드로잉 현장", "C-15"),
  ("fp-jellyfish", "facepainting", "해파리 볼 도안", "F-02"),
  ("cz-23", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-24", "caricature", "컬러 캐리커처", "C-15"),
  ("work-family-02", "caricature", "4인 가족 캐리커처", "C-07"),
  ("fp-cat", "facepainting", "고양이 분장", "F-09"),
  ("cz-25", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-26", "caricature", "컬러 캐리커처", "C-07"),
  ("work-couple-03", "caricature calligraphy", "커플 캐리커처 · 문구", "C-03"),
  ("site-friends-01", "site caricature", "캐리커처를 받은 손님", "C-11"),
  ("cz-27", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-28", "caricature", "컬러 캐리커처", "C-15"),
  ("fp-stars", "facepainting", "별 눈가 장식", "F-05"),
  ("work-single-02", "caricature", "개인 캐리커처", "C-11"),
  ("cz-29", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-30", "caricature", "컬러 캐리커처", "C-07"),
  ("site-kid-01", "site caricature", "어린이 손님", "C-07"),
  ("site-single-01", "site caricature", "완성 그림 인증", "C-03"),
  ("cz-31", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-32", "caricature", "컬러 캐리커처", "C-15"),
  ("cc-birthday", "caricature calligraphy", "생일 축하 캐리커처", "C-11"),
  ("cc-travel", "caricature", "여행을 즐기다", "C-15"),
  ("cz-33", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-34", "caricature", "컬러 캐리커처", "C-07"),
  ("cc-couple-msg", "caricature calligraphy", "행복한 순간 커플", "C-03"),
  ("cc-friends", "caricature calligraphy", "잘했고 잘할거야", "C-07"),
  ("cz-35", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-36", "caricature", "컬러 캐리커처", "C-15"),
  ("cc-family-5", "caricature", "5인 가족", "C-11"),
  ("cc-couple-window", "caricature", "하트 커플", "C-15"),
  ("cz-37", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-38", "caricature", "컬러 캐리커처", "C-07"),
  ("cc-couple-heart", "caricature", "하트 배경 커플", "C-03"),
  ("cc-bucket", "caricature", "버킷햇 캐리커처", "C-07"),
  ("cz-39", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-40", "caricature", "컬러 캐리커처", "C-15"),
  ("hp-work-03", "hyukpil", "꽃과 물결 이름 혁필화", "K-04"),
  ("fp-dragon", "facepainting", "붉은 용 도안", "F-09"),
  ("cz-41", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-42", "caricature", "컬러 캐리커처", "C-07"),
  ("hp-kid-01", "site hyukpil", "이름 그림을 받은 어린이", "K-04"),
  ("fp-live-tiara", "site facepainting", "티아라·꽃 도안 현장", "F-05"),
  ("cz-43", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-44", "caricature", "컬러 캐리커처", "C-15"),
  ("hp-work-05", "hyukpil", "새와 해 이름 혁필화", "K-04"),
  ("fp-skull-hand", "facepainting", "할로윈 해골 손", "F-02"),
  ("cz-45", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-46", "caricature", "컬러 캐리커처", "C-07"),
  ("hp-booth", "site hyukpil", "매장 안 혁필화 부스", "K-04"),
  ("hp-work-06", "hyukpil", "새와 물결 혁필화", "K-04"),
  ("cz-47", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-48", "caricature", "컬러 캐리커처", "C-15"),
  ("fp-live-hearts", "site facepainting", "하트 도안을 그리는 모습", "F-05"),
  ("hp-tiger", "hyukpil", "호랑이 문양 혁필화", "K-04"),
  ("cz-49", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-50", "caricature", "컬러 캐리커처", "C-07"),
  ("fp-live-spider", "site facepainting", "할로윈 거미줄 도안", "F-09"),
  ("fp-live-skull", "site facepainting", "할로윈 전체 분장", "F-02"),
  ("cz-51", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-52", "caricature", "컬러 캐리커처", "C-15"),
  ("hp-work-02", "hyukpil", "영문 이름 혁필화", "K-04"),
  ("fp-live-cat", "site facepainting", "공원 행사 고양이 도안", "F-02"),
  ("cz-53", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-54", "caricature", "컬러 캐리커처", "C-07"),
  ("hp-kid-02", "site hyukpil", "완성 그림 인증", "K-04"),
  ("hp-work-07", "hyukpil", "해와 나비 혁필화", "K-04"),
  ("cz-55", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-56", "caricature", "컬러 캐리커처", "C-15"),
  ("fp-live-heart-eye", "facepainting", "하트 눈매 포인트", "F-05"),
  ("hp-work-08", "hyukpil", "꽃 문양 혁필화", "K-04"),
  ("cz-57", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-58", "caricature", "컬러 캐리커처", "C-07"),
  ("fp-live-cap", "site facepainting", "볼에 그림을 받는 어린이", "F-09"),
  ("hp-table", "site hyukpil", "부스 샘플 전시", "K-04"),
  ("cz-59", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-60", "caricature", "컬러 캐리커처", "C-15"),
  ("hp-work-04", "hyukpil", "나비와 해 혁필화", "K-04"),
  ("fp-live-booth", "site facepainting", "할로윈 축제 부스", "F-09"),
  ("cz-61", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-62", "caricature", "컬러 캐리커처", "C-07"),
  ("hp-work-09", "hyukpil", "새와 해 혁필화", "K-04"),
  ("hp-work-10", "hyukpil", "현장 완성 혁필화", "K-04"),
  ("cz-63", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-64", "caricature", "컬러 캐리커처", "C-15"),
  ("hp-tools", "site hyukpil", "가죽 붓과 물감", "K-04"),
  ("bl-live-hat", "site balloon", "풍선 모자를 쓴 어린이", "B-03"),
  ("cz-65", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-66", "caricature", "컬러 캐리커처", "C-07"),
  ("bl-swan-kid", "balloon facepainting", "백조 풍선과 꽃 페인팅", "B-03"),
  ("bl-live-sword", "site balloon", "풍선 칼 선물", "B-03"),
  ("cz-67", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-68", "caricature", "컬러 캐리커처", "C-15"),
  ("bl-pink-dog", "balloon", "분홍 강아지 풍선", "B-03"),
  ("bl-clown-01", "balloon", "삐에로 분장", "B-03"),
  ("cz-69", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-70", "caricature", "컬러 캐리커처", "C-07"),
  ("bl-live-table", "site balloon", "즉석 풍선 작품", "B-03"),
  ("bl-live-swan", "site balloon", "백조 풍선 전달", "B-03"),
  ("cz-71", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-72", "caricature", "컬러 캐리커처", "C-15"),
  ("bl-live-yellow", "site balloon", "노란 풍선 작품", "B-03"),
  ("cp-plate-swan", "custompaint", "백조 커스텀 접시", "P-02"),
  ("cz-73", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-74", "caricature", "컬러 캐리커처", "C-07"),
  ("cl-canvas-sun", "calligraphy", "캔버스 응원 문구", "K-04"),
  ("cp-showroom-01", "site custompaint", "전시장 커스텀 페인팅", "P-02"),
  ("cz-75", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-76", "caricature", "컬러 캐리커처", "C-15"),
  ("cp-plate-sunflower", "custompaint", "해바라기 접시", "P-02"),
  ("cl-chalk-board", "site calligraphy", "웰컴 칠판 캘리그라피", "K-04"),
  ("cz-77", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-78", "caricature", "컬러 캐리커처", "C-07"),
  ("cp-bag-01", "custompaint", "커스텀 에코백", "P-02"),
  ("cp-plate-horse", "custompaint", "말 그림 접시", "P-02"),
  ("cz-79", "caricature", "컬러 캐리커처", "C-11"),
  ("cz-80", "caricature", "컬러 캐리커처", "C-15"),
  ("cl-canvas-logo", "calligraphy", "로고 캔버스", "K-04"),
  ("cp-plates-4b", "custompaint", "커스텀 접시 모음", "P-02"),
  ("cz-81", "caricature", "컬러 캐리커처", "C-03"),
  ("cz-82", "caricature", "컬러 캐리커처", "C-07"),
  ("cp-bags-02", "custompaint", "로고 파우치", "P-02"),
  ("cz-83", "caricature", "컬러 캐리커처", "C-11"),
  ("lv-cari-01", "site caricature", "축제 캐리커처 현장", "C-15"),
  ("lv-face-01", "site facepainting", "페이스페인팅 현장", "C-03"),
  ("lv-tarot-01", "site tarot", "가족 타로카드 현장", "C-07"),
  ("cz-84", "caricature", "컬러 캐리커처", "C-11"),
  ("lv-cari-02", "site caricature", "숲속 부스 현장", "C-15"),
  ("lv-cari-07", "site caricature", "행복은 늘 내 안에", "C-15"),
  ("lv-cari-08", "site caricature", "축제 현장 캐리커처", "C-15"),
  ("lv-cari-09", "site caricature", "어르신 캐리커처", "C-15"),
  ("lv-cari-10", "site caricature", "이름을 넣은 캐리커처", "C-15"),
  ("lv-cari-11", "site caricature", "모자 쓴 손님 캐리커처", "C-15"),
]


def gallery():
    from events_more import PROGRAMS
    cats = [("all", "전체")] + [(k, n) for k, n, *_ in PROGRAMS] + [("site", "행사 현장")]
    tabs = ''.join(f'<button class="tab{" on" if f=="all" else ""}" data-f="{f}">{t}</button>' for f, t in cats)
    code_map = {c[0]: c for c in LINEUP}
    tiles = ''
    for img, cat, title, code in WORKS:
        c = code_map[code]
        tiles += (f'<figure class="tile ph-img nat gw" data-cat="{cat}" tabindex="0" role="button" aria-label="{title} 크게 보기" '
                  f'data-img="images/{img}.jpg" data-title="{title}" data-code="{code}" data-skill="{c[2]} {c[3]}년차" data-style="{c[4]}">'
                  f'<img class="cover" src="images/{img}.jpg" alt="{title}" loading="lazy"></figure>\n')
    line = ''
    for code, k, skill, yrs, style, region, img in LINEUP:
        line += f'''<article class="lc"><div class="lc-img ph-img fit" style="--img:url(images/{img}.jpg)"><img class="cover contain" src="images/{img}.jpg" alt="{code} 작가 대표 작품" loading="lazy"></div>
  <div class="lc-b"><p class="lc-code">IUX 작가 <b>{code}</b></p><p class="lc-sk">{skill} <b>{yrs}년차</b></p><p class="lc-st">{style}</p><p class="lc-rg"><i data-lucide="map-pin"></i>{region}</p>
  <a class="btn btn-ghost btn-sm" href="quote.html#a-{code.lower()}">이 작가로 견적 문의</a></div></article>\n'''

    body = ''
    body += f'''<section class="gal-page"><div class="wrap">
  <h1 class="gal-h">작품 갤러리</h1>
  <div class="tabs gal-tabs" data-filter="#galGrid">{tabs}</div>
  <div class="gal masonry" id="galGrid">{tiles}</div>
  <p class="gal-empty" id="galEmpty" hidden>이 프로그램의 작품 사진은 준비 중이에요.</p>
</div></section>


<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="작품 크게 보기">
  <button class="lb-x" id="lbX" aria-label="닫기">×</button>
  <button class="lb-nav prev" id="lbPrev" aria-label="이전 작품">‹</button>
  <figure class="lb-fig"><img id="lbImg" alt=""><figcaption><b id="lbTitle"></b><span id="lbMeta"></span><a class="btn btn-brand btn-sm" id="lbQuote" href="quote.html">이 작가로 견적 문의</a></figcaption></figure>
  <button class="lb-nav next" id="lbNext" aria-label="다음 작품">›</button>
</div>
<script>
(function () {{
  var lb = document.getElementById('lb'), list = [], cur = 0;
  function items() {{ return [].slice.call(document.querySelectorAll('#galGrid .gw')).filter(function (x) {{ return !x.hidden; }}); }}
  function show(i) {{
    list = items(); if (!list.length) return;
    cur = (i + list.length) % list.length;
    var t = list[cur].dataset;
    document.getElementById('lbImg').src = t.img; document.getElementById('lbImg').alt = t.title;
    document.getElementById('lbTitle').textContent = t.title;
    document.getElementById('lbMeta').textContent = 'IUX 작가 ' + t.code + ' · ' + t.skill + ' · ' + t.style;
    document.getElementById('lbQuote').href = 'quote.html#a-' + t.code.toLowerCase();
    lb.hidden = false; document.body.style.overflow = 'hidden';
  }}
  function close() {{ lb.hidden = true; document.body.style.overflow = ''; }}
  document.getElementById('galGrid').addEventListener('click', function (e) {{ var f = e.target.closest('.gw'); if (f) show(items().indexOf(f)); }});
  document.getElementById('galGrid').addEventListener('keydown', function (e) {{ var f = e.target.closest('.gw'); if (f && (e.key === 'Enter' || e.key === ' ')) {{ e.preventDefault(); show(items().indexOf(f)); }} }});
  document.getElementById('lbX').onclick = close;
  var empty = document.getElementById('galEmpty');
  document.querySelector('.gal-tabs').addEventListener('click', function () {{ setTimeout(function () {{ empty.hidden = items().length > 0; }}, 0); }});
  document.getElementById('lbPrev').onclick = function () {{ show(cur - 1); }};
  document.getElementById('lbNext').onclick = function () {{ show(cur + 1); }};
  lb.addEventListener('click', function (e) {{ if (e.target === lb) close(); }});
  document.addEventListener('keydown', function (e) {{ if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); }});
}})();
</script>
'''
    page('artists.html', '작품 갤러리 | IUX EVENT', 'IUX ART 캐리커처·페이스페인팅·캘리그라피 작품 갤러리와 작가 라인업', 'gallery', body)


gallery()
print('gallery ok')
