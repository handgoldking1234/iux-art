"""검색 노출(네이버·구글) — 정적 사이트 폴더에 대해 실행
사용: python3 seo.py <사이트 폴더>
- 페이지별 제목·설명 보강, canonical, Open Graph, 구조화 데이터(JSON-LD)
- robots.txt, sitemap.xml 생성 (관리자·작가·리포트·로그인·메일 페이지는 제외/색인 금지)
- 네이버·구글 소유 확인 코드는 아래 VERIFY 에 넣으면 모든 공개 페이지 <head>에 들어갑니다.
여러 번 실행해도 결과가 같습니다(<!--seo--> 블록을 매번 새로 씀)."""
import os, re, sys, json, html, datetime
from PIL import Image

SITE = 'https://art.iux.kr'
NAME = 'IUX ART'
PHONE = '010-8388-1668'
EMAIL = 'art@iux.kr'
VERIFY = {  # 서치어드바이저·서치콘솔에서 받은 코드 (content 값만)
    'naver-site-verification': '93b6fab707a96f821a35705610b26b8b7d1ace32',
    'google-site-verification': 'xOE0msXJM8k3Zo0Afg0GoNvfp9X1dh8eZr6Lwclo4qg',
}
NOINDEX = {'login.html', 'report.html', 'reset.html'}

# 검색 결과에 보일 제목·설명 (없으면 페이지의 기존 값 사용)
META = {
    'index.html': ('IUX ART | 캐리커처·페이스페인팅·캘리그라피 출장 이벤트',
                   '기업 송년회·축제·박람회에 캐리커처, 페이스페인팅, 캘리그라피, 타로, 풍선 삐에로, 헤나, 혁필화 체험 부스를 출장 운영합니다. 4시간 100명 이상, 1인 1~2분 완성. 전국 출장.'),
    'event.html': ('출장 이벤트 체험 부스 11종 | IUX ART',
                   '캐리커처·페이스페인팅·캘리그라피·타로카드·요술풍선 삐에로·헤나·혁필화·손마사지&네일아트·손금&관상·커스텀 페인팅·비즈공예. 행사에 맞게 골라 묶는 출장 체험 프로그램.'),
    'about.html': ('회사소개 | IUX ART 라이브 아트 출장 이벤트',
                   'IUX ART는 현장에서 그리고 만들어 손님이 결과물을 가져가는 라이브 아트 체험 부스를 기업·학교·지자체 행사에 출장 운영하는 회사입니다.'),
    'artists.html': ('작품 갤러리 — 캐리커처·캘리그라피·페이스페인팅 | IUX ART',
                     '실제 행사에서 그린 캐리커처, 캘리그라피, 페이스페인팅, 풍선아트, 혁필화 작품을 종목별로 모아 봤습니다.'),
    'custom.html': ('주문제작 캐리커처 선물 — 커플·가족·단체·반려동물 | IUX ART',
                    '커플·가족 캐리커처 액자, 단체 선물, 회사 캐릭터·로고, 반려동물 그림까지 사진으로 주문하는 맞춤 캐리커처.'),
    'product.html': ('가족·커플 캔버스 액자 캐리커처 주문 | IUX ART',
                     '사진만 보내 주시면 작가가 직접 그린 캐리커처를 캔버스 액자로 만들어 보내 드립니다. 기념일·부모님 선물·집들이 선물.'),
    'edu.html': ('캐리커처·캘리그라피 교육센터 | IUX ART',
                 '현장 작가에게 배우는 캐리커처·캘리그라피·페이스페인팅 클래스와 학교·기관 출장 강의.'),
    'edu-apply.html': ('출장 강의 신청 — 학교·기관·기업 클래스 | IUX ART',
                       '학교 방과후·진로체험, 기관 문화 프로그램, 기업 원데이 클래스로 캐리커처·캘리그라피 강의를 출장 진행합니다.'),
    'edu-qna.html': ('교육 문의 | IUX ART', '클래스 일정, 수강료, 준비물, 출장 강의에 대해 문의하세요.'),
    'donation.html': ('재능기부 | IUX ART', '복지관·아동센터·지역 행사에 작가들이 캐리커처와 페이스페인팅으로 재능을 나눕니다.'),
    'faq.html': ('자주 묻는 질문 — 출장 이벤트 예약·비용·준비 | IUX ART',
                 '출장 이벤트 예약 시기, 지방 출장 교통비, 부스 준비물, 시간당 체험 인원, 결제·세금계산서 등 자주 묻는 질문을 모았습니다.'),
    'quote.html': ('행사 견적 문의 | IUX ART 출장 이벤트',
                   '행사 날짜·장소·예상 인원과 원하는 프로그램을 남겨 주시면 종목과 작가 수를 골라 견적을 보내 드립니다.'),
    'review.html': ('행사 후기·현장 스케치 | IUX ART', '기업 행사, 대학 축제, 지역 축제에서 진행한 출장 이벤트 후기와 현장 사진.'),
    'news.html': ('새소식 | IUX ART', 'IUX ART의 새 프로그램, 행사 소식, 공지를 전합니다.'),
}

TODAY = datetime.date.today().isoformat()


def esc(s):
    return html.escape(s, quote=True)


def pages(root):
    return sorted(f for f in os.listdir(root) if f.endswith('.html') and not f.startswith('_'))


def og_image(root):
    """공유·검색 썸네일 1200×630"""
    out = os.path.join(root, 'images', 'og.jpg')
    src = os.path.join(root, 'images', 'lv-cari-01.jpg')
    if os.path.exists(src):
        im = Image.open(src).convert('RGB')
        w, h = im.size
        im = im.crop((48, 24, w - 48, h - 10))
        W, H = 1200, 630
        r = max(W / im.width, H / im.height)
        im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
        x = (im.width - W) // 2
        y = int((im.height - H) * .35)
        im.crop((x, y, x + W, y + H)).save(out, quality=84, optimize=True, progressive=True)
    return SITE + '/images/og.jpg'


def org_ld():
    return {
        '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': SITE + '/#org',
        'name': NAME, 'alternateName': '아이유엑스 아트', 'url': SITE + '/', 'image': SITE + '/images/og.jpg',
        'telephone': PHONE, 'email': EMAIL, 'priceRange': '₩300,000~', 'legalName': '다마유', 'taxID': '424-41-01509',
        'address': {'@type': 'PostalAddress', 'addressCountry': 'KR', 'addressRegion': '경기도', 'addressLocality': '과천시', 'streetAddress': '과천대로8길 65, 604-504'},
        'areaServed': {'@type': 'Country', 'name': '대한민국'},
        'description': META['index.html'][1],
        'makesOffer': [{'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': n + ' 출장 이벤트'}} for n in
                       ['캐리커처', '페이스페인팅', '캘리그라피', '타로카드', '요술풍선 삐에로', '헤나', '혁필화',
                        '손마사지 & 네일아트', '손금 & 관상', '커스텀 페인팅', '비즈공예']],
    }


def faq_ld(s):
    qa = re.findall(r'<details[^>]*><summary>(.*?)</summary>\s*<p class="a">(.*?)</p>', s, re.S)
    items = []
    for q, a in qa:
        q = re.sub(r'<span class="(q|cat)">.*?</span>|<[^>]+>', '', q).strip()
        a = re.sub(r'<[^>]+>', '', a).strip()
        if q and a:
            items.append({'@type': 'Question', 'name': html.unescape(q), 'acceptedAnswer': {'@type': 'Answer', 'text': html.unescape(a)}})
    return {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': items} if items else None


def service_ld(title, desc, url):
    return {'@context': 'https://schema.org', '@type': 'Service', 'name': title.split(' | ')[0],
            'serviceType': '출장 이벤트', 'description': desc, 'url': url, 'areaServed': '대한민국',
            'provider': {'@id': SITE + '/#org'}}


def run(root):
    img = og_image(root)
    listed = []
    for f in pages(root):
        p = os.path.join(root, f)
        s = open(p, encoding='utf-8').read()
        s = re.sub(r'\n?<!--seo-->.*?<!--/seo-->', '', s, flags=re.S)
        s = s.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
        robots_noindex = f in NOINDEX or re.search(r'name="robots" content="noindex', s)
        url = SITE + '/' + ('' if f == 'index.html' else f)
        title_m = re.search(r'<title>(.*?)</title>', s, re.S)
        desc_m = re.search(r'<meta name="description" content="(.*?)">', s)
        title = META.get(f, (html.unescape(title_m.group(1)) if title_m else NAME, None))[0]
        desc = META.get(f, (None, None))[1] or (html.unescape(desc_m.group(1)) if desc_m else META['index.html'][1])
        if title_m:
            s = s.replace(title_m.group(0), '<title>' + esc(title) + '</title>', 1)
        if desc_m:
            s = s.replace(desc_m.group(0), '<meta name="description" content="' + esc(desc) + '">', 1)
        else:
            s = s.replace('</title>', '</title>\n<meta name="description" content="' + esc(desc) + '">', 1)

        b = ['<!--seo-->']
        if robots_noindex:
            if 'name="robots"' not in s:
                b.append('<meta name="robots" content="noindex,nofollow">')
        else:
            listed.append(f)
            for k, v in VERIFY.items():
                if v:
                    b.append(f'<meta name="{k}" content="{esc(v)}">')
            b += [
                f'<link rel="canonical" href="{url}">',
                '<meta property="og:type" content="website">',
                f'<meta property="og:site_name" content="{NAME}">',
                '<meta property="og:locale" content="ko_KR">',
                f'<meta property="og:title" content="{esc(title)}">',
                f'<meta property="og:description" content="{esc(desc)}">',
                f'<meta property="og:url" content="{url}">',
                f'<meta property="og:image" content="{img}">',
                '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
                '<meta name="twitter:card" content="summary_large_image">',
                '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
                # IUX Cloud (studio.iux.kr): 방문 통계 + 문의함
                '<script src="js/iux-config.js" defer></script><script src="js/cloud.js" defer></script>',
            ]
            lds = []
            if f == 'index.html':
                lds.append(org_ld())
                lds.append({'@context': 'https://schema.org', '@type': 'WebSite', 'name': NAME, 'url': SITE + '/', 'inLanguage': 'ko'})
            if f.startswith('event-'):
                lds.append(service_ld(title, desc, url))
            if f in ('faq.html',) or f.startswith('event-'):
                fl = faq_ld(s)
                if fl: lds.append(fl)
            for ld in lds:
                b.append('<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>')
        b.append('<!--/seo-->')
        anchor = re.search(r'<meta name="description"[^>]*>', s) or re.search(r'</title>', s)
        s = s[:anchor.end()] + '\n' + '\n'.join(b) + s[anchor.end():]
        open(p, 'w', encoding='utf-8').write(s)

    # 공개 HTML 이외 영역 색인 금지 (admin 등은 이미 noindex 메타가 있음)
    open(os.path.join(root, 'robots.txt'), 'w').write(
        'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /artist/\nDisallow: /api/\n'
        'Disallow: /login.html\nDisallow: /reset.html\nDisallow: /report.html\nDisallow: /mail/\n\n'
        f'Sitemap: {SITE}/sitemap.xml\n')
    prio = lambda f: '1.0' if f == 'index.html' else '0.9' if f.startswith('event') or f == 'quote.html' else '0.6'
    urls = ''.join(f'  <url><loc>{SITE}/{"" if f == "index.html" else f}</loc><lastmod>{TODAY}</lastmod><priority>{prio(f)}</priority></url>\n' for f in listed)
    open(os.path.join(root, 'sitemap.xml'), 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '</urlset>\n')
    # 네이버용 RSS (새소식·주요 페이지) — 서치어드바이저 RSS 제출용
    items = ''.join(f'<item><title>{esc(META.get(f, (f,))[0])}</title><link>{SITE}/{"" if f == "index.html" else f}</link><description>{esc(META.get(f, ("", ""))[1] or "")}</description></item>' for f in listed if f in META)
    open(os.path.join(root, 'rss.xml'), 'w').write(f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>{NAME}</title><link>{SITE}/</link><description>{esc(META["index.html"][1])}</description><language>ko</language>{items}</channel></rss>\n')
    # 파비콘 (검색 결과 옆 아이콘)
    fav = os.path.join(root, 'favicon.svg')
    open(fav, 'w').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#121212"/><circle cx="32" cy="32" r="17" fill="#FFC800"/><rect x="22" y="31" width="5" height="10" rx="2" fill="#121212"/><rect x="29.5" y="25" width="5" height="16" rx="2" fill="#121212"/><rect x="37" y="28" width="5" height="13" rx="2" fill="#121212"/></svg>')
    print('seo:', len(listed), 'pages indexed')


if __name__ == '__main__':
    run(sys.argv[1])
