"""IUX ART 공개 단가 (작가 1명 기준 시작가) · 묶음 패키지"""
TIER = {
    'caricature': 'A', 'tarot': 'A', 'facepainting': 'A', 'calligraphy': 'A',
    'handcare': 'A', 'henna': 'A', 'palm': 'A',
    'hyukpil': 'B', 'balloon': 'B',
}
PRICE = {'A': (300000, 450000), 'B': (500000, 750000)}  # 6시간 = 4시간 × 1.5 (시간 비례)
# 캐리커처: 포인트(흑백) / 컬러 — A5·A4 사이즈 같은 가격
CARI = {'point': (300000, 450000), 'color': (400000, 600000)}
COLOR_UP = '컬러로 바꾸면 4시간 +10만원 · 6시간 +15만원'

# 두 프로그램 묶음: (키1, 키2, 이름, 한 줄 설명, 4시간, 6시간)
BUNDLES = [
    ('caricature', 'tarot', '캐리커처 + 타로카드', '그림 기다리는 동안 운세까지, 송년회·파티 인기 조합', 550000, 825000),
    ('caricature', 'calligraphy', '캐리커처 + 캘리그라피', '그림에 이름·덕담 문구를 더해 액자 선물로', 550000, 825000),
    ('henna', 'balloon', '헤나 + 삐에로 풍선', '어른은 헤나, 아이는 풍선으로 가족 모두 만족', 750000, 1125000),
    ('calligraphy', 'hyukpil', '캘리그라피 + 혁필화', '이름을 글씨와 그림으로, 외국인·전통 행사 추천', 750000, 1125000),
    ('handcare', 'handcare', '손마사지 + 네일아트', '마사지 후 네일 포인트까지 한 번에 힐링 코스', 550000, 825000),
    ('facepainting', 'henna', '페이스페인팅 + 헤나', '아이 볼에는 페인팅, 어른 손등에는 헤나', 550000, 825000),
]
CAPACITY = '4시간 동안 작가 1명이 100명 이상 진행할 수 있어요. 한 분당 케어와 작업이 1~2분이면 끝나 대기 줄이 빠르게 줄어요.'

def won(n):
    return f'{n:,}'

def bundles_of(k):
    return [b for b in BUNDLES if k in (b[0], b[1])]

def plans_for(k, name):
    t = TIER.get(k)
    if not t:
        return None
    p4, p6 = PRICE[t]
    if k == 'caricature':
        (a4, a6), (c4, c6) = CARI['point'], CARI['color']
        plans = [
            dict(name='포인트 캐리커처', desc='색 없이 흑백 · 깔끔한 펜 드로잉', price=f'{won(a4)}<small>원~</small>',
                 items=['4시간 기준 · 6시간 ' + won(a6) + '원~', 'A5 · A4 사이즈 같은 가격', '작가 1명 · 100명 이상 참여', '1인 1~2분 케어·작업', '재료·도구 일체 포함']),
            dict(name='컬러 캐리커처', desc='파스텔 채색 · 이름·문구까지 화사하게', price=f'{won(c4)}<small>원~</small>',
                 items=['4시간 기준 · 6시간 ' + won(c6) + '원~', 'A5 · A4 사이즈 같은 가격', '작가 1명 · 100명 이상 참여', '1인 1~2분 케어·작업', '행사 결과 리포트 제공'], best=True),
        ]
        bs = bundles_of(k)
        plans.append(dict(name='2개 묶음 패키지', desc='두 프로그램을 한 부스에서 함께', price=f'{won(min(b[4] for b in bs))}<small>원~</small>',
                          items=[f'{x[2]} · 4시간 {won(x[4])}원~ / 6시간 {won(x[5])}원~' for x in bs] + ['포인트(흑백) 기준 · ' + COLOR_UP]))
        return plans
    plans = [
        dict(name='4시간', desc='반나절 행사·소규모 이벤트', price=f'{won(p4)}<small>원~</small>',
             items=['작가 1명 · 4시간 운영', '100명 이상 참여 가능', '1인 1~2분 케어·작업', '재료·도구 일체 포함']),
        dict(name='6시간', desc='축제·종일 행사 추천', price=f'{won(p6)}<small>원~</small>',
             items=['작가 1명 · 6시간 운영', '150명 이상 참여 가능', '1인 1~2분 케어·작업', '재료·도구 일체 포함', '행사 결과 리포트 제공'], best=True),
    ]
    bs = bundles_of(k)
    if bs:
        b = min(bs, key=lambda x: x[4])
        items = [f'{x[2]} · 4시간 {won(x[4])}원~ / 6시간 {won(x[5])}원~' for x in bs]
        plans.append(dict(name='2개 묶음 패키지', desc='두 프로그램을 한 부스에서 함께', price=f'{won(b[4])}<small>원~</small>',
                          items=items + ['한 부스에서 두 프로그램 동시 운영', '손님 체류 시간이 길어져 만족도 업']))
    else:
        plans.append(dict(name='맞춤 구성', desc='대형 행사·여러 부스 운영', price='맞춤 견적',
                          items=['작가 여러 명 · 종일 운영', '다른 프로그램과 함께 구성', '진행 매니저 동행']))
    return plans
