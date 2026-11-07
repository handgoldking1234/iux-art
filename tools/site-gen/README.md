# 홈페이지 생성 원본 (Python)

art.iux.kr 공개 페이지(index, event-*, quote …)는 이 스크립트들로 만듭니다.
문구·가격·사진 배치를 크게 바꿀 때는 여기를 고친 뒤 다시 생성합니다. 그리고 결과 HTML을 `public/`(정적으로 운영 중인 main 브랜치에도)로 복사합니다.

```bash
# common.py 의 ROOT/OUT: 이 폴더의 상위에 site/ (출력)와 이미지 원본이 있다고 가정
python3 build_index.py        # 메인
python3 pages_event.py        # 출장 이벤트 페이지들
python3 pages_company.py pages_custom.py pages_edu.py pages_etc.py gallery.py admin_build.py report_page.py
python3 postprocess.py        # 이미지 width/height
python3 seo.py <사이트 폴더>   # 검색 노출·IUX Cloud 스크립트 (반드시 마지막)
```

| 파일 | 내용 |
| --- | --- |
| `pricing.py` | 가격 (4시간·6시간, 묶음) |
| `common.py` | 공통 머리·꼬리, 고객센터 번호·이메일 |
| `seo.py` | 페이지별 제목·설명, 검색 확인 코드(`VERIFY`), sitemap·robots·rss |
| `events_more.py`, `pages_event.py` | 프로그램별 상세 페이지 |
| `collab.py` | 콜라보 혜택 |

연결 값(Supabase·studio)은 여기가 아니라 `public/js/iux-config.js`에 있습니다. 계정이 바뀔 때는 `docs/ACCOUNTS.md`를 보세요.
