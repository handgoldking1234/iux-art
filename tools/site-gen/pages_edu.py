from common import *

COURSES = [
  ("caricature", "캐리커처 취미반", "그림을 처음 시작하는 분도 4주면 얼굴 특징을 잡아 그릴 수 있어요.", "g1", "smile", "입문", "4주 · 주 1회", "240,000원"),
  ("caricature", "캐리커처 전문작가반", "3분 스피드 드로잉과 현장 응대까지, 출장 작가로 활동하는 과정입니다.", "g4", "pen-tool", "전문", "12주 · 주 2회", "980,000원"),
  ("caricature", "캐리커처 자격증 과정", "민간자격 캐리커처 지도사 취득과 현장 실습을 함께 진행합니다.", "g2", "award", "자격증", "8주 · 주 2회", "720,000원"),
  ("digital", "아이패드 디지털 드로잉", "프로크리에이트로 캐리커처와 일러스트를 그리는 법을 배워요.", "g5", "tablet", "입문~중급", "8주 · 주말반", "420,000원"),
  ("calligraphy", "캘리그라피 기초반", "붓펜과 붓으로 나만의 손글씨 서체를 만드는 과정입니다.", "g3", "pen-line", "입문", "6주 · 주 1회", "260,000원"),
  ("face", "페이스페인팅 자격증반", "안전한 재료 사용법부터 이벤트 도안 30종까지 익혀요.", "g1", "sparkles", "자격증", "8주 · 주 1회", "580,000원"),
]

def edu():
    tabs = ''.join(f'<button class="tab{" on" if f=="all" else ""}" data-f="{f}">{t}</button>' for f, t in [("all","전체"),("caricature","캐리커처"),("digital","디지털 드로잉"),("calligraphy","캘리그라피"),("face","페이스페인팅")])
    cards = ''
    for cat, title, desc, g, ic, lv, period, price in COURSES:
        im = {"캐리커처 자격증 과정": "cz-81", "캘리그라피 기초반": "cl-canvas-logo", "캐리커처 취미반": "work-single-01", "캐리커처 전문작가반": "live-drawing-02", "아이패드 디지털 드로잉": "digital-sisters", "페이스페인팅 자격증반": "fp-jellyfish"}.get(title)
        cv = (f'<div class="cv ph-img fit" style="--img:url(images/{im}.jpg)"><img class="cover contain" src="images/{im}.jpg" alt="{title} 수강 예시 작품" loading="lazy"><span class="lv">{lv}</span></div>'
              if im else f'<div class="cv {g}"><i data-lucide="{ic}"></i><span class="lv">{lv}</span></div>')
        cards += f'''<article class="ccard" data-cat="{cat}">{cv}
  <div class="cb"><h3>{title}</h3><p>{desc}</p><dl><dt>기간</dt><dd>{period}</dd><dt>수강료</dt><dd>{price}</dd></dl><a href="edu-qna.html" class="btn btn-ghost btn-sm">수강 문의</a></div></article>\n'''
    body = subhero(crumbs(('교육센터', None)), 'Academy', '취미에서 <em>현장 작가</em>까지',
                   'IUX EVENT 현직 작가에게 직접 배우는 교육센터입니다. 수료 후 실력이 검증되면 출장 이벤트 작가로 활동할 수 있어요.',
                   '<div class="btns"><a href="#courses" class="btn btn-brand">교육과정 보기</a><a href="edu-apply.html" class="btn btn-ghost">기관 출장 강의 신청</a></div>')
    body += f'''<section class="sec-sm" id="courses"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">교육과정</h2><p>모든 과정은 소수 정예 8명 이내로 운영합니다.</p></div></div>
  <div class="toolbar"><div class="tabs" data-filter="#courseGrid">{tabs}</div><span class="count">과정 <b data-count-of="#courseGrid">{len(COURSES)}</b>개</span></div>
  <div class="cgrid" id="courseGrid">{cards}</div>
  <p class="note">수강료와 일정은 시안용 예시입니다. 재료비 별도.</p>
</div></section>

<section class="sec-sm" style="padding-top:0"><div class="wrap">
  <div class="cert rv">
    <div><span class="eyebrow">Certificate</span><h2 style="margin-top:10px">수료하면 현장으로,<br>자격증과 실습까지 한 번에</h2><p>자격증 과정 수료생은 선배 작가와 함께 실제 행사에 3회 이상 참여하는 현장 실습을 거칩니다. 실습 평가를 통과하면 IUX EVENT 작가로 등록할 수 있어요.</p>
      <div class="btns" style="margin-top:24px"><a href="edu-qna.html" class="btn btn-brand">자격증 과정 문의</a></div></div>
    <div class="cert-card"><small>CERTIFICATE</small><b>캐리커처 지도사</b><p style="font-size:13px;color:#555">위 사람은 소정의 과정을 수료하였기에<br>이 증서를 드립니다.</p><p class="pen" style="margin-top:14px">IUX EVENT 교육센터</p></div>
  </div>
</div></section>

<section class="sec-sm soft"><div class="wrap">
  <div class="sec-head rv"><div><h2 class="sec-title">학교·기관으로 찾아가는 출장 강의</h2><p>방과후 수업, 직원 워크숍, 문화센터 원데이 클래스를 운영합니다.</p></div><a href="edu-apply.html" class="more">출장 강의 신청 <i data-lucide="arrow-right"></i></a></div>
  <div class="occ rv d1">
    <div><span class="ic"><i data-lucide="school"></i></span>초·중·고 방과후</div>
    <div><span class="ic"><i data-lucide="briefcase"></i></span>기업 직원 워크숍</div>
    <div><span class="ic"><i data-lucide="library"></i></span>도서관·문화센터</div>
    <div><span class="ic"><i data-lucide="hand-heart"></i></span>복지관·평생학습관</div>
  </div>
</div></section>
''' + cta('어떤 과정이 맞을지 고민된다면', '그림 경험과 목표를 알려주시면 맞는 과정을 추천해 드립니다.', '교육 상담 신청', 'edu-qna.html')
    page('edu.html', '교육센터 | IUX EVENT', '캐리커처·캘리그라피·페이스페인팅 교육과정과 자격증', 'edu', body)


def edu_apply():
    body = subhero(crumbs(('교육센터', 'edu.html'), ('출장 강의 신청', None)), 'On-site class', '출장 강의 신청', '학교·기업·기관으로 강사가 직접 찾아갑니다. 신청서를 남겨 주시면 1영업일 안에 연락드릴게요.')
    body += f'''<section class="sec-sm"><div class="wrap with-aside">
  <div>
    <form class="form rv" data-demo data-success="#applyDone">
      <div class="row2">
        <div class="field"><label for="ea_org">기관명<i class="req">*</i></label><input id="ea_org" required placeholder="예) OO초등학교"></div>
        <div class="field"><label for="ea_name">담당자명<i class="req">*</i></label><input id="ea_name" required></div>
      </div>
      <div class="row2">
        <div class="field"><label for="ea_tel">연락처<i class="req">*</i></label><input id="ea_tel" type="tel" required placeholder="010-0000-0000"></div>
        <div class="field"><label for="ea_mail">이메일</label><input id="ea_mail" type="email" placeholder="name@example.com"></div>
      </div>
      <div class="row3 r-date">
        <div class="field"><label for="ea_course">희망 과정<i class="req">*</i></label><select id="ea_course" required><option value="">선택해 주세요</option><option>캐리커처 원데이</option><option>캘리그라피 원데이</option><option>페이스페인팅 체험</option><option>아이패드 드로잉</option><option>정규 과정(4주 이상)</option></select></div>
        <div class="field"><label for="ea_date">희망 기간</label><div class="daterange"><input id="ea_date" class="dr-input" type="text" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" autocomplete="off" inputmode="none" aria-haspopup="dialog"><input type="hidden" name="date" data-start><input type="hidden" name="date_end" data-end></div><p class="help">정규 과정은 시작일~종료일, 원데이는 하루만 고르세요.</p></div>
        <div class="field"><label for="ea_ppl">예상 인원<i class="req">*</i></label><input id="ea_ppl" type="number" min="1" required placeholder="20"></div>
      </div>
      <div class="field"><label for="ea_place">강의 장소</label><input id="ea_place" placeholder="주소 또는 지역"></div>
      <div class="field"><label for="ea_msg">요청 사항</label><textarea id="ea_msg" placeholder="대상 연령, 수업 시간, 준비 가능한 기자재 등을 알려주세요."></textarea></div>
      <div class="agree"><p>수집 항목: 기관명, 담당자명, 연락처, 이메일 · 이용 목적: 출장 강의 상담 · 보관 기간: 상담 종료 후 1년</p>
        <label class="check"><input type="checkbox" id="ea_agree" required>개인정보 수집·이용에 동의합니다. (필수)</label></div>
      <div class="form-actions"><button type="submit" class="btn btn-brand">신청서 보내기</button></div>
    </form>
    <div class="success" id="applyDone" hidden><span class="ic"><i data-lucide="check"></i></span><h2>신청이 접수되었습니다</h2><p>담당 매니저가 1영업일 안에 남겨 주신 연락처로 연락드릴게요.</p><a href="edu.html" class="btn btn-ghost">교육센터로 돌아가기</a></div>
  </div>
  <aside class="aside rv d1">
    <h3>출장 강의 안내</h3>
    <dl><dt>최소 인원</dt><dd>10명</dd><dt>수업 시간</dt><dd>90분 ~ 120분</dd><dt>재료</dt><dd>강사가 모두 준비</dd><dt>지역</dt><dd>전국 (지방 교통비 별도)</dd></dl>
    <div class="call">전화 상담<b>{PHONE}</b>연중무휴 08:00 ~ 22:00</div>
  </aside>
</div></section>
'''
    page('edu-apply.html', '출장 강의 신청 | IUX EVENT', '학교·기업·기관 출장 강의 신청', 'edu', body)


QNA = [
  ("done", "캐리커처 전문작가반 11월 기수 남은 자리 있나요?", "김*진", "2026.10.30", True),
  ("wait", "아이패드 드로잉 주말반 준비물 문의", "이*아", "2026.10.29", False),
  ("done", "대전 연수원 팝아트 원데이 출강 가능할까요?", "박*호", "2026.10.27", True),
  ("done", "페이스페인팅 자격증 취득 후 활동 방법", "최*은", "2026.10.24", True),
  ("done", "프로그램 문의드립니다.", "정*수", "2026.10.20", True),
  ("done", "캘리그라피 기초반 수강료 분납 가능한가요?", "한*림", "2026.10.17", False),
  ("done", "초등학교 방과후 캐리커처 수업 견적 요청", "오*경", "2026.10.15", True),
  ("done", "수채화 캐리커처 강의 일정 문의", "서*윤", "2026.10.11", False),
]

def edu_qna():
    rows = ''
    n = 214
    for st, title, who, date, lock in QNA:
        s = '<span class="st done">답변완료</span>' if st == 'done' else '<span class="st">답변대기</span>'
        lk = '<i data-lucide="lock" class="lock" aria-label="비밀글"></i>' if lock else ''
        rows += f'<tr><td class="hm">{n}</td><td class="t"><a href="#" data-toast="비밀글은 작성자만 볼 수 있습니다.">{title}</a>{lk}</td><td>{s}</td><td class="hm">{who}</td><td class="hm">{date}</td></tr>\n'
        n -= 1
    body = subhero(crumbs(('교육센터', 'edu.html'), ('교육 문의', None)), 'Q&amp;A', '교육 문의', '과정·일정·수강료가 궁금하시면 남겨 주세요. 평일 기준 하루 안에 답변드립니다.')
    body += f'''<section class="sec-sm"><div class="wrap">
  <div class="toolbar"><span class="count">전체 <b>214</b>건</span>
    <form class="searchbar" role="search"><input id="qnaQ" type="search" placeholder="제목으로 검색" aria-label="검색어"><button class="btn btn-dark btn-sm" type="submit">검색</button></form>
  </div>
  <div class="board-wrap"><table class="board">
    <thead><tr><th class="hm" style="width:80px">번호</th><th>제목</th><th style="width:110px">상태</th><th class="hm" style="width:100px">작성자</th><th class="hm" style="width:120px">작성일</th></tr></thead>
    <tbody>{rows}</tbody>
  </table></div>
  <div class="board-foot"><a href="#write" class="btn btn-brand btn-sm"><i data-lucide="pencil"></i>문의 작성</a></div>
  <nav class="pagination" aria-label="페이지"><a href="#" aria-label="이전"><i data-lucide="chevron-left"></i></a><a href="#" class="on">1</a><a href="#">2</a><a href="#">3</a><a href="#" aria-label="다음"><i data-lucide="chevron-right"></i></a></nav>
</div></section>

<section class="sec-sm soft" id="write"><div class="wrap" style="max-width:820px">
  <div class="sec-head"><div><h2 class="sec-title">문의 작성</h2><p>답변은 연락처 또는 이 게시판으로 드립니다.</p></div></div>
  <form class="form" data-demo data-msg="문의가 등록되었습니다. 답변이 달리면 문자로 알려드릴게요.">
    <div class="row2">
      <div class="field"><label for="qw_name">이름<i class="req">*</i></label><input id="qw_name" required></div>
      <div class="field"><label for="qw_tel">연락처<i class="req">*</i></label><input id="qw_tel" type="tel" required placeholder="010-0000-0000"></div>
    </div>
    <div class="field"><label for="qw_course">관심 과정</label><select id="qw_course"><option>캐리커처</option><option>아이패드 디지털 드로잉</option><option>캘리그라피</option><option>페이스페인팅</option><option>출장 강의</option><option>기타</option></select></div>
    <div class="field"><label for="qw_title">제목<i class="req">*</i></label><input id="qw_title" required></div>
    <div class="field"><label for="qw_body">내용<i class="req">*</i></label><textarea id="qw_body" required></textarea></div>
    <label class="check"><input type="checkbox" id="qw_secret" checked>비밀글로 작성</label>
    <label class="check"><input type="checkbox" id="qw_agree" required>개인정보 수집·이용에 동의합니다. (필수)</label>
    <div class="form-actions"><button type="submit" class="btn btn-brand">문의 등록</button></div>
  </form>
</div></section>
'''
    page('edu-qna.html', '교육 문의 | IUX EVENT', 'IUX EVENT 교육센터 수강 문의 게시판', 'edu', body)

edu(); edu_apply(); edu_qna()
print('edu ok')
