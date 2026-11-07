import os
OUT = '/home/claude/iux-event/site'

FONTS = '''<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;700;800;900&family=Noto+Sans+KR:wght@400;500;700;800&display=swap">'''

BRAND = '<a href="index.html" class="brand"><i><b><span></span><span></span><span></span></b></i>IUX ART <small>ADMIN</small></a>'

NAV = [
  ('dashboard', 'index.html', 'layout-dashboard', '대시보드', None),
  ('jobs', 'jobs.html', 'megaphone', '공고·섭외', 'jobs'),
  ('artists', 'artists.html', 'users', '작가 관리', 'artists'),
  ('notify', 'notify.html', 'send', '알림 전송', None),
  ('photos', 'photos.html', 'image', '현장 후기', 'photos'),
  ('reports', 'reports.html', 'file-text', '결과 리포트', 'reports'),
  ('settlement', 'settlement.html', 'wallet', '정산', 'settle'),
  ('stats', 'stats.html', 'bar-chart-3', '통계', None),
  ('settings', 'settings.html', 'settings', '운영 설정', None),
]

def shell(page, title, desc, body, actions=''):
    nav = ''
    for key, href, icon, label, cnt in NAV:
        c = f'<span class="cnt" data-cnt="{cnt}" hidden></span>' if cnt else ''
        on = ' on' if key == page else ''
        cur = ' aria-current="page"' if key == page else ''
        nav += f'<a class="nv{on}" href="{href}"{cur}><i data-lucide="{icon}"></i>{label}{c}</a>\n'
    return f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title} | IUX ART 관리자</title>
<meta name="robots" content="noindex">
{FONTS}
<link rel="stylesheet" href="css/admin.css">
</head>
<body data-page="{page}">
<div class="adm">
  <aside class="side" id="side">
    {BRAND}
    <button type="button" class="side-btn" id="sideBtn" aria-label="메뉴 열기" aria-expanded="false" aria-controls="side"><span></span><span></span><span></span></button>
    <p class="lbl">운영</p>
    <nav aria-label="관리자 메뉴">
{nav}    </nav>
    <div class="foot">
      <a href="../artist/index.html" target="_blank" rel="noopener"><i data-lucide="palette"></i>작가 포털 보기<i data-lucide="external-link" class="ext"></i></a>
      <a href="../artist/register.html" target="_blank" rel="noopener"><i data-lucide="user-plus"></i>작가 등록 페이지<i data-lucide="external-link" class="ext"></i></a>
      <a href="../index.html" target="_blank" rel="noopener"><i data-lucide="globe"></i>홈페이지<i data-lucide="external-link" class="ext"></i></a>
      <button type="button" id="resetDemo"><i data-lucide="rotate-ccw"></i>예시 데이터 초기화</button>
    </div>
  </aside>
  <main class="main">
    <header class="hdr">
      <p class="hdr-date" id="hdrDate"></p>
      <div class="hdr-r">
        <div class="nt" id="nt">
          <button type="button" class="hdr-ic" id="ntBtn" aria-label="알림" aria-haspopup="true" aria-expanded="false" aria-controls="ntMenu"><i data-lucide="bell"></i><span class="nt-n" id="hdrDot" hidden></span></button>
          <div class="nt-menu" id="ntMenu" hidden>
            <div class="nt-h"><b>알림</b><button type="button" id="ntRead">모두 읽음</button></div>
            <div class="nt-tabs" role="tablist"><button type="button" class="on" data-nt="todo" role="tab">처리할 일 <span id="ntTodoN"></span></button><button type="button" data-nt="act" role="tab">최근 활동</button></div>
            <div class="nt-list" id="ntList"></div>
            <a class="nt-f" href="index.html">대시보드에서 모두 보기</a>
          </div>
        </div>
        <div class="um" id="um">
          <button type="button" class="um-btn" id="umBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="umMenu">
            <span class="av">운영</span><span class="um-t"><b>홍길동</b><small>운영 관리자</small></span><i data-lucide="chevron-down" class="um-cv"></i>
          </button>
          <div class="um-menu" id="umMenu" role="menu" hidden>
            <div class="um-head"><span class="av lg">운영</span><div><b>홍길동</b><small>art@iux.kr</small><span class="badge st-ok" style="margin-top:6px">최고 관리자</span></div></div>
            <a role="menuitem" href="#" data-um="profile"><i data-lucide="user-round"></i>내 정보</a>
            <a role="menuitem" href="#" data-um="password"><i data-lucide="key-round"></i>비밀번호 변경</a>
            <a role="menuitem" href="#" data-um="alarm"><i data-lucide="bell-ring"></i>알림 받기 설정</a>
            <a role="menuitem" href="settings.html"><i data-lucide="settings"></i>운영 설정</a>
            <hr>
            <a role="menuitem" href="../index.html" target="_blank" rel="noopener"><i data-lucide="globe"></i>홈페이지 열기<i data-lucide="external-link" class="ext"></i></a>
            <p class="um-meta">최근 로그인 <span id="umLast"></span> · IP 211.***.**.24</p>
            <a role="menuitem" href="#" data-um="logout" class="out"><i data-lucide="log-out"></i>로그아웃</a>
          </div>
        </div>
      </div>
    </header>
    <div class="top"><div><h1>{title}</h1><p>{desc}</p></div><div class="act">{actions}</div></div>
{body}
  </main>
</div>
<script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>
<script src="js/data.js"></script>
<script src="js/core.js"></script>
<script src="js/admin.js"></script>
</body>
</html>
'''

DEMO = '<p class="demo"><i data-lucide="info"></i>시안용 예시 데이터입니다. 바꾼 내용은 이 브라우저에만 저장되고, 알림톡·메일·이체는 개발 단계에서 실제 API로 연결합니다.</p>'

PAGES = {
 'index.html': ('dashboard', '대시보드', '오늘 처리할 섭외·승인·정산을 한눈에 봅니다.', DEMO + '''
    <div class="grid g4" id="kpis"></div>
    <div class="grid g21" style="margin-top:16px">
      <div class="card"><h2><i data-lucide="bar-chart-3"></i>월별 매출·작가 지급 <a class="more" href="stats.html">통계 보기</a></h2><div id="chart" style="margin-top:8px"></div></div>
      <div class="card"><h2><i data-lucide="list-checks"></i>처리할 일</h2><div class="list" id="todo"></div></div>
    </div>
    <div class="grid g2" style="margin-top:16px">
      <div class="card"><h2><i data-lucide="calendar-days"></i>다가오는 확정 행사 <a class="more" href="jobs.html">공고 보기</a></h2><div class="list" id="upcoming"></div></div>
      <div class="card"><h2><i data-lucide="send"></i>최근 알림 전송 <a class="more" href="notify.html">전체 기록</a></h2><div class="list" id="logs"></div></div>
    </div>''', '<a class="btn btn-o" href="jobs.html"><i data-lucide="megaphone"></i>공고·섭외</a><a class="btn btn-y" href="jobs.html#new-"><i data-lucide="plus"></i>새 공고</a>'),

 'jobs.html': ('jobs', '공고·섭외', '견적 문의를 공고로 올리고, 신청한 작가 중 선착순 또는 직접 선택으로 확정합니다.', '''
    <div class="toolbar"><div class="tabs" id="jobTabs"></div></div>
    <div class="split">
      <div class="jl" id="jobList" aria-label="공고 목록"></div>
      <div id="jobDetail"></div>
    </div>''', '<button class="btn btn-y" id="newJob"><i data-lucide="plus"></i>새 공고 등록</button>'),

 'artists.html': ('artists', '작가 관리', '기술·연차·지역·나이·참여 이력을 보고 승인과 휴식을 관리합니다.', '''
    <button class="demo" id="pendNote" hidden style="width:100%;text-align:left;cursor:pointer"><i data-lucide="user-plus"></i>승인 대기 작가 <b id="pendN">0</b>명이 있어요. 눌러서 모아 보기</button>
    <div class="toolbar">
      <div class="filters">
        <label class="search"><i data-lucide="search"></i><input class="inp" id="q" type="search" placeholder="이름·연락처 검색" aria-label="작가 검색"></label>
        <select class="sel" id="fSkill" aria-label="기술"></select>
        <select class="sel" id="fRegion" aria-label="지역"></select>
        <select class="sel" id="fStatus" aria-label="상태"><option value="">상태 전체</option><option value="active">활동 중</option><option value="rest">휴식 대상</option><option value="pending">승인 대기</option><option value="paused">활동 중지</option></select>
      </div>
      <span class="muted">작가 <b id="artCount">0</b>명</span>
    </div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>작가</th><th>나이</th><th>기술·연차</th><th>활동 지역</th><th class="r">총 참여</th><th class="r">연속</th><th class="r">누적 지급</th><th class="c">평점</th><th>상태</th></tr></thead><tbody id="artBody"></tbody></table></div>
    <p class="note">· 나이는 생년월일, 연차는 기술별 시작 연도로 계산해 날짜·해가 바뀌면 자동으로 갱신됩니다.<br>· 행을 누르면 포트폴리오·참여 이력·정산 정보를 볼 수 있어요.</p>''', '<a class="btn btn-y" href="../artist/register.html" target="_blank" rel="noopener"><i data-lucide="user-plus"></i>작가 등록 (새 창)</a>'),

 'notify.html': ('notify', '알림 전송', '공고·선정·리마인드·정산 알림을 카카오 알림톡과 메일로 보냅니다.', '''
    <div class="grid g4" id="logKpi"></div>
    <div class="card" style="margin-top:16px"><h2><i data-lucide="layout-template"></i>알림 템플릿</h2><div class="tabs" id="tplList" style="margin:14px 0"></div><div id="tplPrev"></div></div>
    <div class="toolbar" style="margin-top:24px"><h2 style="font-size:16px">전송 기록</h2><div class="tabs" id="logTabs"><button class="tab on" data-c="">전체</button><button class="tab" data-c="kakao">알림톡</button><button class="tab" data-c="email">메일</button></div></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>보낸 시각</th><th>채널</th><th>종류</th><th>내용</th><th>받는 작가</th><th class="r">인원</th><th>결과</th></tr></thead><tbody id="logBody"></tbody></table></div>
    <p class="note">· 카카오 알림톡은 비즈메시지 발신 프로필과 사전 승인된 템플릿이 있어야 보낼 수 있습니다. 실패하면 문자(LMS)로 대체 발송하도록 개발 단계에서 연결합니다.<br>· 작가가 수신을 거부한 채널은 자동으로 빠집니다.</p>''', '<button class="btn btn-y" id="manualSend"><i data-lucide="send"></i>직접 보내기</button>'),

 'photos.html': ('photos', '현장 후기', '작가가 행사 후 올린 사진과 분위기 글을 확인하고, 홈페이지 행사 후기(현장 스케치)에 게시합니다.', '''
    <div class="grid g4" id="phKpi"></div>
    <div class="toolbar" style="margin-top:20px"><div class="tabs" id="phTabs"></div><select class="sel" id="phJob" aria-label="행사"></select></div>
    <div class="phg" id="phGrid"></div>
    <p class="note">· 작가가 포털의 <b>내 신청·일정 › 현장 후기 올리기</b>에서 사진과 분위기 글을 등록하면 여기에 검수 대기로 올라옵니다.<br>· 견적 문의 때 고객이 <b>현장 사진 홍보 활용</b>에 동의한 행사만 게시할 수 있어요. 미동의 행사는 <b>내부 보관</b>으로 저장되고 외부에 공개되지 않습니다.<br>· 홈페이지에는 업체명·정확한 장소·작가 실명 없이 프로그램·지역·행사 월·작가 연차만 표시됩니다. 고객이나 당사자가 삭제를 요청하면 바로 내립니다.</p>''', ''),

 'reports.html': ('reports', '결과 리포트', '작가들의 현장 후기를 모아 행사 결과 리포트를 만들고, 고객 담당자에게 보냅니다.', '''
    <div class="grid g4" id="rpKpi"></div>
    <div class="toolbar" style="margin-top:20px"><div class="tabs" id="rpTabs"></div></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>행사</th><th>일정</th><th class="c">작가 후기</th><th class="r">참여 인원</th><th class="r">사진</th><th>상태</th><th class="c">만족도</th><th></th></tr></thead><tbody id="rpBody"></tbody></table></div>
    <p class="note">· 행사가 끝나고 작가가 <b>현장 후기</b>(사진·분위기 글·그린 인원)를 올리면 리포트 초안이 자동으로 만들어집니다. 작가가 여러 명이면 한 리포트로 합쳐져요.<br>· 운영자가 인사말과 사진을 확인하고 보내면 담당자에게 알림톡·메일로 리포트 링크가 갑니다. 담당자는 PDF로 저장·출력할 수 있어요.<br>· 리포트 주소는 추측할 수 없는 임의 문자열이며 발송일부터 90일 동안 열 수 있습니다. 홍보 미동의 행사도 고객 본인 리포트에는 사진이 포함됩니다.</p>''', ''),

 'settlement.html': ('settlement', '정산', '확정된 행사의 작가료·교통비·원천징수를 계산하고 지급 완료를 처리합니다.', '''
    <div class="grid g4" id="setKpi"></div>
    <div class="toolbar" style="margin-top:20px">
      <div class="filters">
        <select class="sel" id="fMonth" aria-label="기간"></select>
        <select class="sel" id="fState" aria-label="상태"><option value="">상태 전체</option><option value="due">지급 대기</option><option value="paid">지급 완료</option><option value="needinfo">정산 정보 미등록</option><option value="scheduled">행사 후 정산</option></select>
        <div class="tabs" id="grp"><button class="tab on" data-g="0">행사별</button><button class="tab" data-g="1">작가별 합계</button></div>
      </div>
      <button class="btn btn-y" id="paySel" disabled></button>
    </div>
    <div class="tbl-wrap"><table class="tbl"><thead id="setHead"></thead><tbody id="setBody"></tbody><tfoot id="setFoot"></tfoot></table></div>
    <p class="note">· 작가 몫 = 업체 견적 ÷ 섭외 인원 × 배분 비율(기본 7:3, 작가 70%), 수도권 밖 행사는 1일 교통비가 더해집니다. (운영 설정에서 변경)<br>· 프리랜서는 사업소득 3.3%(소득세 3% + 지방소득세 0.3%)를 원천징수하고, 개인사업자는 세금계산서를 받고 전액 지급합니다.<br>· 행사가 끝나면 <b>지급 대기</b>로 바뀌고, 지급 완료 처리 때 작가에게 정산 알림이 갑니다.<br>· 프리랜서는 주민등록번호, 사업자는 사업자등록번호가 등록돼야 지급할 수 있어요. 미등록 건은 <b>정산 정보 미등록</b>으로 보류되며, 보내기 버튼으로 등록 요청을 보낼 수 있습니다. 주민등록번호는 암호화 저장하고 화면에는 가려서 표시합니다.</p>''', '<button class="btn btn-o" id="exportBtn"><i data-lucide="download"></i>엑셀 내보내기</button>'),

 'stats.html': ('stats', '통계', '프로그램·지역별 행사, 작가 참여 순위, 월별 매출과 마진을 봅니다.', '''
    <div class="grid g4" id="stKpi"></div>
    <div class="grid g3" style="margin-top:16px">
      <div class="card"><h2><i data-lucide="palette"></i>프로그램별 행사</h2><div id="bySkill" style="margin-top:10px"></div></div>
      <div class="card"><h2><i data-lucide="map-pin"></i>지역별 행사</h2><div id="byRegion" style="margin-top:10px"></div></div>
      <div class="card"><h2><i data-lucide="users"></i>프로그램별 활동 작가</h2><div id="supply" style="margin-top:10px"></div></div>
    </div>
    <h2 style="font-size:16px;margin:28px 0 12px">작가 참여 순위</h2>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th class="c">순위</th><th>작가</th><th>기술·연차</th><th class="r">신청</th><th class="r">참여(확정)</th><th class="r">선정률</th><th class="r">현재 연속</th><th class="r">누적 지급</th></tr></thead><tbody id="rankBody"></tbody></table></div>
    <h2 style="font-size:16px;margin:28px 0 12px">월별 매출·지급·마진</h2>
    <div class="tbl-wrap"><table class="tbl" style="min-width:560px"><thead><tr><th>월</th><th class="r">행사</th><th class="r">업체 견적 매출</th><th class="r">작가 지급</th><th class="r">마진</th><th class="r">마진율</th></tr></thead><tbody id="monthBody"></tbody></table></div>''', ''),

 'settings.html': ('settings', '운영 설정', '휴식 규칙, 선정 방식, 알림 채널, 업체 견적 단가와 작가 배분 비율을 정합니다.', '''
    <form id="setForm" class="grid g2">
      <div class="card"><h2><i data-lucide="coffee"></i>연속 참여 휴식 규칙</h2>
        <div class="f2" style="margin-top:14px"><div class="fld"><label for="s_rc">연속 확정 횟수</label><input class="inp" id="s_rc" type="number" min="1" max="10"></div>
        <div class="fld"><label for="s_rw">계산 기간(일)</label><input class="inp" id="s_rw" type="number" min="1" max="365"></div></div>
        <p class="note" id="restPrev"></p>
        <p class="note">휴식 대상은 공고 신청은 할 수 있지만 선착순 자동 선정에서 빠지고, 확정 시 <b>휴식 제외</b>로 처리되어 연속 횟수가 초기화됩니다. 작가 관리에서 직접 휴식을 해제할 수도 있어요.</p>
      </div>
      <div class="card"><h2><i data-lucide="user-check"></i>선정 방식</h2>
        <div class="togs" style="margin-top:14px"><label class="tog"><input type="radio" name="s_mode" value="fcfs"><span>선착순 (신청 순서대로)</span></label><label class="tog"><input type="radio" name="s_mode" value="pick"><span>직접 선택 (운영자 지정)</span></label></div>
        <p class="note">새 공고의 기본값입니다. 공고마다 따로 바꿀 수 있어요.</p>
        <h2 style="margin-top:20px"><i data-lucide="send"></i>알림 채널</h2>
        <div class="form" style="margin-top:12px"><label class="ck"><input type="checkbox" id="s_k">카카오 알림톡</label><label class="ck"><input type="checkbox" id="s_e">메일</label><label class="ck"><input type="checkbox" id="s_auto">공고 등록 시 기술·지역이 맞는 작가에게 자동 알림</label></div>
      </div>
      <div class="card"><h2><i data-lucide="receipt"></i>정산 기준</h2>
        <div class="f2" style="margin-top:14px"><div class="fld"><label for="s_sh">작가 몫 비율(%)</label><input class="inp" id="s_sh" type="number" step="5" min="0" max="100"><p class="help">기본 70% · 회사 30% (7:3)</p></div><div class="fld"><label for="s_tax">프리랜서 원천징수율(%)</label><input class="inp" id="s_tax" type="number" step="0.1" min="0"></div>
        </div><div class="f2"><div class="fld"><label for="s_tr">수도권 밖 교통비(1인·1일)</label><input class="inp" id="s_tr" type="number" step="5000" min="0"></div></div>
        <p class="note">사업소득 원천징수 3.3% = 소득세 3% + 지방소득세 0.3%. 지급한 달의 다음 달 10일까지 신고·납부합니다.</p>
      </div>
      <div class="card"><h2><i data-lucide="coins"></i>프로그램별 업체 견적 단가 <small class="muted" style="font-weight:500">작가 1명 기준</small></h2>
        <div class="tbl-wrap" style="margin-top:12px"><table class="tbl" style="min-width:0"><thead><tr><th>프로그램</th><th class="r">4시간</th><th class="r">6시간</th><th class="r">작가 몫(4h)</th><th class="r">활동 작가</th></tr></thead><tbody id="rateBody"></tbody></table></div>
      </div>
      <div style="grid-column:1/-1;display:flex;justify-content:flex-end"><button class="btn btn-y" type="submit"><i data-lucide="save"></i>설정 저장</button></div>
    </form>''', ''),
}

os.makedirs(os.path.join(OUT, 'admin'), exist_ok=True)
for fn, (page, title, desc, body, act) in PAGES.items():
    html = shell(page, title, desc, body, act)
    open(os.path.join(OUT, 'admin', fn), 'w', encoding='utf-8').write(html)
print('admin pages', len(PAGES))

# ---------------- 작가 페이지 ----------------
def ashell(page, title, body, right):
    return f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title} | IUX ART</title>
{FONTS}
<link rel="stylesheet" href="../admin/css/admin.css">
<link rel="stylesheet" href="css/artist.css">
</head>
<body data-page="{page}">
<header class="ph"><div class="ph-in"><a href="../index.html" class="brand"><i><b><span></span><span></span><span></span></b></i>IUX ART <small>ARTIST</small></a><div class="sp">{right}</div></div></header>
<main class="wrapx">
{body}
</main>
<script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>
<script src="../admin/js/data.js"></script>
<script src="../admin/js/core.js"></script>
<script src="js/artist.js"></script>
</body>
</html>
'''

REG = '''<div class="reg-hero"><h1>IUX ART 작가 등록</h1><p>등록하시면 기술과 지역에 맞는 행사 공고를 알림톡과 메일로 받아 보실 수 있어요.</p>
  <div class="steps3"><span><b>1</b>등록 신청</span><span><b>2</b>운영자 승인</span><span><b>3</b>공고 알림 받고 참석 신청</span></div></div>
<form class="regf" id="regForm" novalidate>
  <section class="card"><h2><i data-lucide="user"></i>기본 정보</h2>
    <div class="form">
      <div class="f2"><div class="fld"><label for="r_name">이름<i>*</i></label><input class="inp" id="r_name" required autocomplete="name"></div>
      <div class="fld"><label for="r_birth">생년월일<i>*</i></label><input class="inp" id="r_birth" type="date" required><p class="age-out" id="ageOut"></p></div></div>
      <div class="f2"><div class="fld"><label for="r_phone">휴대폰 번호<i>*</i></label><input class="inp" id="r_phone" type="tel" required placeholder="010-0000-0000" autocomplete="tel"></div>
      <div class="fld"><label for="r_email">이메일<i>*</i></label><input class="inp" id="r_email" type="email" required autocomplete="email"></div></div>
    </div></section>
  <section class="card"><h2><i data-lucide="sparkles"></i>보유 기술·경력</h2>
    <p class="note" style="margin:-6px 0 12px">기술을 고르고 시작한 연도를 정하면 연차가 계산돼요. 해가 바뀌면 연차가 자동으로 올라갑니다.</p>
    <div id="skills"></div></section>
  <section class="card"><h2><i data-lucide="map-pin"></i>활동 가능 지역</h2><div class="togs" id="regions"></div><p class="note">고른 지역의 공고만 알림으로 받아요. 여러 곳을 골라도 됩니다.</p></section>
  <section class="card"><h2><i data-lucide="image"></i>포트폴리오</h2><input type="file" id="r_files" accept="image/*" multiple hidden><div class="pf" id="pf"></div><p class="note">작업 사진을 최대 10장까지 올려 주세요. 운영자 승인과 업체 제안에 쓰입니다.</p>
    <div class="fld" style="margin-top:12px"><label for="r_bio">자기소개</label><textarea id="r_bio" placeholder="주로 하는 행사, 강점, 가능한 화풍 등을 적어 주세요."></textarea></div></section>
  <section class="card"><h2><i data-lucide="landmark"></i>정산 정보</h2>
    <div class="form"><div class="togs"><label class="tog"><input type="radio" name="tax" value="freelancer" checked><span>프리랜서 (3.3% 원천징수)</span></label><label class="tog"><input type="radio" name="tax" value="business"><span>개인사업자 (세금계산서)</span></label></div>
      <p class="note" id="taxNote" style="margin-top:0">프리랜서는 사업소득 3.3%를 원천징수한 뒤 지급하고, 다음 해 5월 종합소득세 신고 때 정산됩니다.</p>
      <p class="demo" style="margin:0;background:var(--soft);color:var(--ink-2)"><i data-lucide="id-card"></i>주민등록번호(사업자는 사업자등록번호)는 지금 받지 않아요. 승인 후 첫 행사에 선정되면 작가 포털의 <b style="margin:0 3px">정산 정보</b> 탭에서 등록합니다.</p>
      <div class="f3"><div class="fld"><label for="r_bank">은행<i>*</i></label><select class="sel" id="r_bank" required><option value="">선택</option><option>국민</option><option>신한</option><option>우리</option><option>하나</option><option>농협</option><option>기업</option><option>카카오뱅크</option><option>토스뱅크</option><option>새마을금고</option><option>우체국</option></select></div>
      <div class="fld"><label for="r_acc">계좌번호<i>*</i></label><input class="inp" id="r_acc" required inputmode="numeric" placeholder="- 없이 입력"></div>
      <div class="fld"><label for="r_holder">예금주<i>*</i></label><input class="inp" id="r_holder" required></div></div></div></section>
  <section class="card"><h2><i data-lucide="bell"></i>알림 수신</h2>
    <div class="form"><label class="ck"><input type="checkbox" id="r_k" checked>카카오 알림톡으로 공고·선정·정산 알림 받기</label><label class="ck"><input type="checkbox" id="r_m" checked>메일로 받기</label>
    <div class="demo" style="margin:6px 0 0;background:var(--soft);color:var(--ink-2)"><span>수집 항목: 이름, 생년월일, 연락처, 이메일, 활동 지역, 계좌 정보 · 이용 목적: 행사 섭외와 정산 · 보관 기간: 탈퇴 후 5년(세무 신고)</span></div>
    <label class="ck"><input type="checkbox" id="r_agree" required>개인정보 수집·이용에 동의합니다. (필수)</label></div></section>
  <div style="display:flex;justify-content:flex-end;gap:8px"><a class="btn btn-o" href="index.html">작가 포털 보기</a><button class="btn btn-y" type="submit" style="height:48px;padding:0 28px"><i data-lucide="send"></i>등록 신청</button></div>
</form>
<div class="done-box" id="regDone" hidden><span class="ic"><i data-lucide="check"></i></span><h2><span id="doneName"></span> 작가님, 등록 신청이 접수되었어요</h2><div class="chips" id="doneSkills"></div><p class="muted">운영자가 포트폴리오를 확인하고 승인하면 알림톡으로 알려드려요. 승인 후 공고에 바로 참석 신청할 수 있어요.</p>
  <div style="display:flex;gap:8px;justify-content:center;margin-top:20px;flex-wrap:wrap"><a class="btn btn-o" href="../admin/artists.html" target="_blank" rel="noopener">관리자 화면에서 승인해 보기 (새 창)</a><a class="btn btn-y" href="index.html">작가 포털로 가기</a></div></div>'''

PORTAL = '''<section class="hero-a" id="meCard"></section>
<p class="demo" id="pendNote" hidden style="margin-top:14px"><i data-lucide="hourglass"></i>등록 승인을 기다리고 있어요. 승인되면 공고에 참석 신청할 수 있습니다.</p>
<p class="demo" id="infoNote" hidden style="margin-top:14px;background:var(--bad-bg);color:var(--bad)"></p>
<p class="demo" id="photoNote" hidden style="margin-top:14px"></p>
<p class="demo" id="restNote" hidden style="margin-top:14px;background:var(--bad-bg);color:var(--bad)"></p>
<div class="ptabs tabs" id="ptabs" role="tablist"><button class="tab on" data-t="jobs" role="tab">모집 공고 <span class="n" id="openN"></span></button><button class="tab" data-t="schedule" role="tab">내 신청·일정</button><button class="tab" data-t="pay" role="tab">정산 내역</button><button class="tab" data-t="tax" role="tab">정산 정보</button><button class="tab" data-t="profile" role="tab">내 프로필</button></div>
<div id="pbody"></div>'''

os.makedirs(os.path.join(OUT, 'artist'), exist_ok=True)
open(os.path.join(OUT, 'artist', 'register.html'), 'w', encoding='utf-8').write(ashell('register', '작가 등록', REG, '<span>이미 등록하셨나요?</span><a class="lk" href="index.html">작가 포털</a>'))
open(os.path.join(OUT, 'artist', 'index.html'), 'w', encoding='utf-8').write(ashell('portal', '작가 포털', PORTAL, '<div class="um" id="um"><button class="um-btn" id="umBtn" aria-haspopup="true" aria-expanded="false"><span id="umAv"></span><b id="umName"></b><i data-lucide="chevron-down" class="um-cv"></i><span class="um-bars" aria-hidden="true"><i></i><i></i><i></i></span></button><div class="um-menu" id="umMenu" hidden><button data-go="profile"><i data-lucide="user"></i>내 프로필</button><button data-go="schedule"><i data-lucide="calendar-check"></i>내 신청·일정</button><button data-go="tax"><i data-lucide="id-card"></i>정산 정보</button><hr><a href="../index.html"><i data-lucide="home"></i>홈페이지</a><a class="out" href="../login.html"><i data-lucide="log-out"></i>로그아웃</a></div></div>'))
print('artist pages ok')
