/* IUX ART 관리자 — 시안용 샘플 데이터 (개발 단계에서 DB로 교체) */
var IUX_SEED = {
  version: 7,

  /* 업체 견적 단가(작가 1명 기준): p4 = 4시간, p6 = 6시간. 작가 몫은 운영 설정의 배분 비율(기본 7:3) */
  skills: [
    { k: 'caricature',   n: '캐리커처',            p4: 300000, p6: 350000, pc4: 400000, pc6: 500000 }, // p: 포인트(흑백), pc: 컬러 · A5·A4 같은 가격
    { k: 'tarot',        n: '타로카드',            p4: 300000, p6: 350000 },
    { k: 'facepainting', n: '페이스페인팅',        p4: 300000, p6: 350000 },
    { k: 'calligraphy',  n: '캘리그라피',          p4: 300000, p6: 350000 },
    { k: 'handcare',     n: '손마사지 & 네일아트', p4: 300000, p6: 350000 },
    { k: 'henna',        n: '헤나',                p4: 300000, p6: 350000 },
    { k: 'palm',         n: '손금 & 관상',         p4: 300000, p6: 350000 },
    { k: 'hyukpil',      n: '혁필화',              p4: 500000, p6: 650000 },
    { k: 'balloon',      n: '요술풍선 삐에로',     p4: 500000, p6: 650000 },
    { k: 'beads',        n: '비즈공예',            p4: 300000, p6: 350000 }
  ],

  regions: ['서울', '경기 북부', '경기 남부', '인천', '강원', '충청·대전', '전라·광주', '경상·대구', '부산·울산', '제주'],

  settings: {
    restCount: 3,          // 연속 확정 N회 이상이면
    restWindow: 30,        // 최근 N일 안의 연속만 계산
    defaultMode: 'fcfs',   // fcfs 선착순 / pick 직접 선택
    share: 70,             // 작가 몫(%) — 나머지는 회사 몫 (7:3)
    taxRate: 3.3,          // 프리랜서 원천징수율(%)
    channels: { kakao: true, email: true },
    autoNotice: true,      // 공고 등록 시 기술·지역이 맞는 작가에게 자동 알림
    transportOutside: 30000 // 수도권 밖 교통비(1인·1일)
  },

  artists: [
    { id: 'a1',  name: '강하늘', birth: '1990-04-12', phone: '010-2214-7781', email: 'haneul@example.com', regions: ['서울', '경기 남부'], skills: [{ k: 'caricature', since: 2015 }, { k: 'calligraphy', since: 2020 }], status: 'active', rating: 4.9, tax: 'freelancer', bank: '국민', account: '****-**-1234', kakao: true, mail: true, joined: '2024-03-02', bio: '기업 행사와 웨딩 위주로 활동합니다. 컬러 캐리커처 3분 완성.', portfolio: ['work-couple-01', 'work-family-02', 'work-parents'], taxInfo: { kind: 'rrn', masked: '900412-2******', holder: '강하늘', at: '2024-03-10' } },
    { id: 'a2',  name: '윤솔',   birth: '1993-09-03', phone: '010-3381-0042', email: 'sol@example.com',    regions: ['서울', '인천'], skills: [{ k: 'calligraphy', since: 2017 }, { k: 'hyukpil', since: 2021 }], status: 'active', rating: 4.8, tax: 'freelancer', bank: '신한', account: '****-**-5521', kakao: true, mail: true, joined: '2024-04-18', bio: '웨딩 답례 엽서와 붓글씨 퍼포먼스 전문.', portfolio: ['work-family-01'], taxInfo: { kind: 'rrn', masked: '930903-2******', holder: '윤솔', at: '2024-04-20' } },
    { id: 'a3',  name: '박모아', birth: '1996-01-25', phone: '010-5521-9902', email: 'moa@example.com',    regions: ['경기 북부', '서울'], skills: [{ k: 'facepainting', since: 2019 }, { k: 'henna', since: 2022 }], status: 'active', rating: 5.0, tax: 'freelancer', bank: '카카오뱅크', account: '****-**-7810', kakao: true, mail: false, joined: '2024-05-07', bio: '어린이 행사 경력 6년, 아이들 눈높이 진행.', portfolio: ['fp-rainbow', 'fp-cherry', 'fp-jellyfish'], taxInfo: { kind: 'rrn', masked: '960125-2******', holder: '박모아', at: '2024-05-09' } },
    { id: 'a4',  name: '최다온', birth: '1988-11-30', phone: '010-7712-3345', email: 'daon@example.com',   regions: ['경기 남부', '충청·대전'], skills: [{ k: 'caricature', since: 2016 }], status: 'active', rating: 4.7, tax: 'business', bank: '우리', account: '****-**-0091', kakao: true, mail: true, joined: '2024-03-15', bio: '대학 축제 다수, 흑백 스피드 캐리커처.', portfolio: ['work-single-02', 'work-sisters'], taxInfo: { kind: 'biz', bizNo: '214-38-*****', bizName: '다온드로잉', invoiceMail: 'daon@example.com', holder: '최다온', at: '2024-03-16' } },
    { id: 'a5',  name: '이새벽', birth: '1994-06-14', phone: '010-9120-4471', email: 'saebyeok@example.com', regions: ['서울'], skills: [{ k: 'calligraphy', since: 2018 }], status: 'active', rating: 4.6, tax: 'freelancer', bank: '하나', account: '****-**-3307', kakao: true, mail: true, joined: '2024-06-01', bio: '영문 캘리그라피 가능.', portfolio: ['work-single-01'], taxInfo: { kind: 'rrn', masked: '940614-2******', holder: '이새벽', at: '2024-06-03' } },
    { id: 'a6',  name: '정유리', birth: '1998-03-08', phone: '010-4402-1188', email: 'yuri@example.com',   regions: ['서울', '경기 북부'], skills: [{ k: 'facepainting', since: 2021 }, { k: 'handcare', since: 2023 }], status: 'active', rating: 4.8, tax: 'freelancer', bank: '토스뱅크', account: '****-**-6624', kakao: true, mail: true, joined: '2024-07-11', bio: '글리터·헤나 도안 다수 보유.', portfolio: ['fp-stars', 'fp-cat'], taxInfo: { kind: 'rrn', masked: '980308-2******', holder: '정유리', at: '2024-07-12' } },
    { id: 'a7',  name: '한결',   birth: '1985-12-02', phone: '010-6630-2290', email: 'gyeol@example.com',  regions: ['인천', '서울'], skills: [{ k: 'caricature', since: 2012 }, { k: 'hyukpil', since: 2019 }], status: 'active', rating: 4.9, tax: 'business', bank: '농협', account: '****-**-4410', kakao: true, mail: true, joined: '2024-02-20', bio: '박람회·대형 행사 경력 14년.', portfolio: ['live-drawing-01', 'work-princess'], taxInfo: { kind: 'biz', bizNo: '131-27-*****', bizName: '한결아트', invoiceMail: 'gyeol@example.com', holder: '한결', at: '2024-02-21' } },
    { id: 'a8',  name: '오가람', birth: '1979-08-21', phone: '010-2017-5503', email: 'garam@example.com',  regions: ['경상·대구', '부산·울산'], skills: [{ k: 'hyukpil', since: 2009 }, { k: 'calligraphy', since: 2011 }], status: 'active', rating: 4.9, tax: 'freelancer', bank: '대구', account: '****-**-8812', kakao: true, mail: true, joined: '2024-08-03', bio: '전통 혁필화 18년, 외국인 행사 다수.', portfolio: [], taxInfo: { kind: 'rrn', masked: '790821-1******', holder: '오가람', at: '2024-08-05' } },
    { id: 'a9',  name: '서보라', birth: '1997-05-19', phone: '010-8823-1167', email: 'bora@example.com',   regions: ['경기 남부'], skills: [{ k: 'facepainting', since: 2020 }, { k: 'balloon', since: 2022 }], status: 'active', rating: 4.7, tax: 'freelancer', bank: '국민', account: '****-**-2203', kakao: true, mail: true, joined: '2024-09-09', bio: '풍선 아트·버블쇼 가능.', portfolio: ['fp-octopus', 'fp-icecream'], taxInfo: { kind: 'rrn', masked: '970519-2******', holder: '서보라', at: '2024-09-10' } },
    { id: 'a10', name: '문채원', birth: '1992-02-11', phone: '010-3349-7720', email: 'chaewon@example.com', regions: ['서울', '경기 남부'], skills: [{ k: 'caricature', since: 2017 }, { k: 'tarot', since: 2021 }], status: 'active', rating: 4.8, tax: 'freelancer', bank: '신한', account: '****-**-9015', kakao: true, mail: true, joined: '2024-03-28', bio: '수채 캐리커처, 송년회 타로 부스 운영.', portfolio: ['work-couple-02', 'work-family-03'], taxInfo: null },
    { id: 'a11', name: '배나리', birth: '1999-10-05', phone: '010-5590-3381', email: 'nari@example.com',   regions: ['서울', '인천'], skills: [{ k: 'beads', since: 2022 }, { k: 'handcare', since: 2023 }], status: 'active', rating: 4.6, tax: 'freelancer', bank: '카카오뱅크', account: '****-**-1477', kakao: true, mail: false, joined: '2025-01-14', bio: '어린이 비즈공예 체험 강사.', portfolio: [], taxInfo: null },
    { id: 'a12', name: '임도윤', birth: '1991-07-27', phone: '010-7781-6654', email: 'doyun@example.com',  regions: ['경기 북부', '강원'], skills: [{ k: 'caricature', since: 2018 }, { k: 'balloon', since: 2020 }], status: 'active', rating: 4.5, tax: 'freelancer', bank: '우리', account: '****-**-3390', kakao: true, mail: true, joined: '2024-10-22', bio: '어린이 행사 흑백 캐리커처, 풍선 아트.', portfolio: ['site-kid-01'], taxInfo: { kind: 'rrn', masked: '910727-1******', holder: '임도윤', at: '2024-10-25' } },
    { id: 'a13', name: '조하린', birth: '2000-12-14', phone: '010-2245-8890', email: 'harin@example.com',  regions: ['전라·광주'], skills: [{ k: 'tarot', since: 2022 }], status: 'paused', rating: 4.4, tax: 'freelancer', bank: '광주', account: '****-**-6120', kakao: true, mail: true, joined: '2025-03-03', bio: '휴학 중 일시 활동 중지.', portfolio: [], taxInfo: null },
    { id: 'a14', name: '송지우', birth: '1995-03-30', phone: '010-6612-4409', email: 'jiwoo@example.com',  regions: ['서울', '경기 북부'], skills: [{ k: 'facepainting', since: 2023 }, { k: 'henna', since: 2023 }], status: 'pending', rating: 0, tax: 'freelancer', bank: '국민', account: '****-**-5512', kakao: true, mail: true, joined: '2026-10-29', bio: '페이스페인팅 자격증 취득 후 첫 등록입니다.', portfolio: ['fp-live-bee', 'fp-dragonfly'], taxInfo: null }
  ],

  /* 공고 상태: open 모집 중 / review 선정 대기(마감) / confirmed 확정 / done 행사 완료 */
  jobs: [
    { id: 'j1', photoOk: true,  title: 'OO전자 추석 가족 행사', client: 'OO전자 인사팀', skill: 'caricature', start: '2026-09-06', end: '2026-09-06', time: '13:00~16:00', hours: 3, place: '경기 수원 OO전자 사옥', region: '경기 남부', need: 2, mode: 'fcfs', status: 'done', posted: '2026-08-25 10:00', deadline: '2026-08-29 18:00', fee: 600000,
      apps: [{ a: 'a1', at: '2026-08-25 10:04', s: 'selected' }, { a: 'a4', at: '2026-08-25 10:09', s: 'selected' }, { a: 'a10', at: '2026-08-25 11:30', s: 'rejected' }] },
    { id: 'j2', photoOk: true,  title: 'OO대학교 가을 축제 1일차', client: 'OO대학교 총학생회', skill: 'facepainting', start: '2026-09-13', end: '2026-09-13', time: '12:00~17:00', hours: 5, place: '서울 성북구 OO대학교', region: '서울', need: 2, mode: 'pick', status: 'done', posted: '2026-09-01 09:30', deadline: '2026-09-05 18:00', fee: 700000,
      apps: [{ a: 'a3', at: '2026-09-01 09:41', s: 'selected' }, { a: 'a6', at: '2026-09-01 10:02', s: 'selected' }, { a: 'a9', at: '2026-09-01 12:20', s: 'rejected' }] },
    { id: 'j3', photoOk: false,  title: '웨딩홀 하객 답례 캘리그라피', client: 'OO웨딩홀', skill: 'calligraphy', start: '2026-09-20', end: '2026-09-20', time: '11:00~14:00', hours: 3, place: '서울 강남구 OO웨딩홀', region: '서울', need: 1, mode: 'pick', status: 'done', posted: '2026-09-08 14:00', deadline: '2026-09-12 18:00', fee: 300000,
      apps: [{ a: 'a2', at: '2026-09-08 14:10', s: 'selected' }, { a: 'a5', at: '2026-09-08 15:22', s: 'rejected' }] },
    { id: 'j4', photoOk: true,  title: '구청 가을 문화 축제', client: 'OO구청 문화체육과', skill: 'caricature', start: '2026-09-27', end: '2026-09-28', time: '11:00~17:00', hours: 6, place: '인천 연수구 OO공원', region: '인천', need: 2, mode: 'fcfs', status: 'done', posted: '2026-09-14 10:00', deadline: '2026-09-19 18:00', fee: 1400000,
      apps: [{ a: 'a7', at: '2026-09-14 10:01', s: 'selected' }, { a: 'a10', at: '2026-09-14 10:06', s: 'selected' }, { a: 'a12', at: '2026-09-14 10:40', s: 'rejected' }] },
    { id: 'j5', photoOk: false,  title: '쇼핑몰 주말 가족 이벤트', client: 'OO몰 마케팅팀', skill: 'balloon', start: '2026-10-04', end: '2026-10-04', time: '13:00~17:00', hours: 4, place: '경기 하남 OO몰', region: '경기 남부', need: 1, mode: 'fcfs', status: 'done', posted: '2026-09-22 11:00', deadline: '2026-09-26 18:00', fee: 500000,
      apps: [{ a: 'a9', at: '2026-09-22 11:03', s: 'selected' }, { a: 'a12', at: '2026-09-22 11:15', s: 'rejected' }] },
    { id: 'j6', photoOk: false,  title: 'OO은행 VIP 고객 감사 행사', client: 'OO은행 강남지점', skill: 'caricature', start: '2026-10-11', end: '2026-10-11', time: '14:00~17:00', hours: 3, place: '서울 강남구 OO은행', region: '서울', need: 1, mode: 'pick', status: 'done', posted: '2026-09-29 10:00', deadline: '2026-10-02 18:00', fee: 300000,
      apps: [{ a: 'a1', at: '2026-09-29 10:20', s: 'selected' }, { a: 'a10', at: '2026-09-29 11:02', s: 'rejected' }] },
    { id: 'j7', photoOk: true,  title: 'IT기업 창립 10주년 행사', client: 'OO테크 피플팀', skill: 'caricature', start: '2026-10-18', end: '2026-10-18', time: '15:00~18:00', hours: 3, place: '서울 성동구 OO타워', region: '서울', need: 2, mode: 'fcfs', status: 'done', posted: '2026-10-05 09:00', deadline: '2026-10-09 18:00', fee: 600000,
      apps: [{ a: 'a1', at: '2026-10-05 09:02', s: 'selected' }, { a: 'a7', at: '2026-10-05 09:05', s: 'selected' }, { a: 'a4', at: '2026-10-05 09:31', s: 'rejected' }] },
    { id: 'j8', photoOk: true,  title: '어린이집 가을 운동회', client: 'OO어린이집', skill: 'facepainting', start: '2026-10-24', end: '2026-10-24', time: '10:00~12:00', hours: 2, place: '경기 고양 OO초등학교 운동장', region: '경기 북부', need: 1, mode: 'fcfs', status: 'done', posted: '2026-10-12 10:00', deadline: '2026-10-16 18:00', fee: 300000,
      apps: [{ a: 'a3', at: '2026-10-12 10:02', s: 'selected' }, { a: 'a6', at: '2026-10-12 10:11', s: 'rejected' }] },
    { id: 'j9', photoOk: true,  title: '호텔 웨딩 애프터파티', client: 'OO호텔 연회팀', skill: 'caricature', start: '2026-10-25', end: '2026-10-25', time: '18:00~21:00', hours: 3, place: '서울 중구 OO호텔', region: '서울', need: 1, mode: 'pick', status: 'done', posted: '2026-10-13 15:00', deadline: '2026-10-17 18:00', fee: 300000,
      apps: [{ a: 'a1', at: '2026-10-13 15:05', s: 'selected' }, { a: 'a10', at: '2026-10-13 16:40', s: 'rejected' }] },
    { id: 'j10', photoOk: true, title: '증권사 송년회 2부', client: 'OO증권 총무팀', skill: 'tarot', start: '2026-11-07', end: '2026-11-07', time: '19:00~22:00', hours: 3, place: '서울 영등포구 OO컨벤션', region: '서울', need: 1, mode: 'pick', status: 'confirmed', posted: '2026-10-20 10:00', deadline: '2026-10-24 18:00', fee: 300000,
      apps: [{ a: 'a10', at: '2026-10-20 10:12', s: 'selected' }] },
    { id: 'j11', photoOk: false, title: '외국인 유학생 한국문화 체험', client: 'OO대학교 국제처', skill: 'hyukpil', start: '2026-11-14', end: '2026-11-14', time: '13:00~16:00', hours: 3, place: '서울 동대문구 OO대학교', region: '서울', need: 1, mode: 'pick', status: 'confirmed', posted: '2026-10-22 11:00', deadline: '2026-10-27 18:00', fee: 500000,
      apps: [{ a: 'a7', at: '2026-10-22 11:20', s: 'selected' }, { a: 'a2', at: '2026-10-22 12:02', s: 'rejected' }] },
    { id: 'j12', photoOk: true, title: '제약회사 임직원 가족의 날', client: 'OO제약 인사팀', skill: 'caricature', start: '2026-11-08', end: '2026-11-08', time: '11:00~15:00', hours: 4, place: '경기 성남 OO제약 본사', region: '경기 남부', need: 2, mode: 'fcfs', status: 'review', posted: '2026-10-26 09:00', deadline: '2026-10-31 18:00', fee: 600000,
      apps: [{ a: 'a1', at: '2026-10-26 09:01', s: 'applied' }, { a: 'a4', at: '2026-10-26 09:07', s: 'applied' }, { a: 'a10', at: '2026-10-26 09:26', s: 'applied' }, { a: 'a12', at: '2026-10-26 13:40', s: 'applied' }] },
    { id: 'j13', photoOk: true, title: '아파트 단지 연말 축제', client: 'OO아파트 입주자대표회의', skill: 'facepainting', start: '2026-11-21', end: '2026-11-22', time: '13:00~17:00', hours: 4, place: '경기 파주 OO아파트 중앙광장', region: '경기 북부', need: 2, mode: 'fcfs', status: 'open', posted: '2026-10-30 10:00', deadline: '2026-11-10 18:00', fee: 1200000,
      apps: [{ a: 'a6', at: '2026-10-30 10:03', s: 'applied' }, { a: 'a3', at: '2026-10-30 10:15', s: 'applied' }] },
    { id: 'j14', photoOk: false, title: '백화점 크리스마스 고객 이벤트', client: 'OO백화점 판촉팀', skill: 'balloon', start: '2026-12-19', end: '2026-12-20', time: '12:00~18:00', hours: 6, place: '서울 송파구 OO백화점', region: '서울', need: 2, mode: 'pick', status: 'open', posted: '2026-10-31 14:00', deadline: '2026-11-20 18:00', fee: 2600000,
      apps: [{ a: 'a9', at: '2026-10-31 14:22', s: 'applied' }] },
    { id: 'j15', photoOk: true, title: '협회 신년회 손마사지 부스', client: 'OO협회 사무국', skill: 'handcare', start: '2027-01-09', end: '2027-01-09', time: '17:00~20:00', hours: 3, place: '서울 중구 OO호텔', region: '서울', need: 2, mode: 'fcfs', status: 'open', posted: '2026-11-01 09:00', deadline: '2026-12-15 18:00', fee: 600000,
      apps: [] }
  ],

  /* 알림 전송 기록 (그룹 단위) */
  logs: [
    { at: '2026-11-01 09:00', ch: 'kakao', type: '공고 알림', jid: 'j15', to: ['a6', 'a11'], note: '손마사지 & 네일아트 · 서울' },
    { at: '2026-10-31 14:00', ch: 'kakao', type: '공고 알림', jid: 'j14', to: ['a9', 'a12'], note: '요술풍선 삐에로 · 서울' },
    { at: '2026-10-30 10:00', ch: 'kakao', type: '공고 알림', jid: 'j13', to: ['a3', 'a6', 'a9', 'a14'], note: '페이스페인팅 · 경기 북부' },
    { at: '2026-10-30 10:00', ch: 'email', type: '공고 알림', jid: 'j13', to: ['a6', 'a9', 'a14'], note: '페이스페인팅 · 경기 북부' },
    { at: '2026-10-27 18:10', ch: 'kakao', type: '선정 안내', jid: 'j11', to: ['a7'], note: '외국인 유학생 한국문화 체험' },
    { at: '2026-10-27 18:10', ch: 'kakao', type: '미선정 안내', jid: 'j11', to: ['a2'], note: '외국인 유학생 한국문화 체험' },
    { at: '2026-10-26 09:00', ch: 'kakao', type: '공고 알림', jid: 'j12', to: ['a1', 'a4', 'a7', 'a10', 'a12'], note: '캐리커처 · 경기 남부' },
    { at: '2026-10-24 18:20', ch: 'kakao', type: '선정 안내', jid: 'j10', to: ['a10'], note: '증권사 송년회 2부' },
    { at: '2026-10-24 18:20', ch: 'email', type: '선정 안내', jid: 'j10', to: ['a10'], note: '증권사 송년회 2부' },
    { at: '2026-10-24 10:00', ch: 'kakao', type: '행사 리마인드', jid: 'j9', to: ['a1'], note: '내일 18:00 OO호텔' },
    { at: '2026-10-10 15:00', ch: 'kakao', type: '정산 완료', jid: 'j6', to: ['a1'], note: '9월~10월 초 정산' }
  ],

  /* 지급 완료 처리된 정산 (키: 공고ID:작가ID) */
  paid: {
    'j1:a1': '2026-09-15', 'j1:a4': '2026-09-15', 'j2:a3': '2026-09-25', 'j2:a6': '2026-09-25',
    'j3:a2': '2026-09-25', 'j4:a7': '2026-10-10', 'j5:a9': '2026-10-10', 'j6:a1': '2026-10-20'
  },

  /* 작가가 올린 현장 후기 (행사 1건 · 작가 1명당 1개)
     state: pending 검수 대기 / published 후기 게시 / hidden 게시 안 함 / private 내부 보관(고객 홍보 미동의)
     공개 화면에는 업체명·정확한 장소·작가 실명 없이 프로그램·지역·작가 연차만 노출 */
  posts: [
    { id: 's1', job: 'j1', a: 'a1', at: '2026-09-06 18:10', state: 'published', subj: true, count: 168,
      title: '추석 맞이 임직원 가족 캐리커처', guests: '100~200명', tags: ['기업행사', '가족', '실내'],
      mood: '로비에 부스 두 개를 펴자마자 줄이 길게 섰어요. 아이 손을 잡고 온 가족이 많아서 4인 가족 그림을 제일 많이 그렸고, 완성된 그림을 받고 사진 찍는 모습이 끝날 때까지 이어졌습니다.',
      photos: ['images/live-drawing-01.jpg', 'images/site-family-01.jpg', 'images/work-family-02.jpg'] },
    { id: 's2', job: 'j2', a: 'a3', at: '2026-09-13 18:40', state: 'published', subj: true, count: 212,
      title: '가을 축제 부스 페이스페인팅', guests: '200명 이상', tags: ['대학축제', '야외', '학생'],
      mood: '축제 메인 거리 한가운데 부스라 오후 내내 대기 줄이 끊이지 않았어요. 학생들은 학과 상징이나 별·하트 도안을 많이 골랐고, 친구끼리 같은 도안으로 맞추는 경우가 많았어요.',
      photos: ['images/fp-live-bee.jpg', 'images/fp-rainbow.jpg', 'images/fp-cat.jpg', 'images/fp-stars.jpg'] },
    { id: 's3', job: 'j4', a: 'a7', at: '2026-09-28 18:20', state: 'published', subj: true, count: 265,
      title: '이틀간의 구민 문화 축제 캐리커처', guests: '200명 이상', tags: ['지역축제', '야외', '가족'],
      mood: '공원 잔디 광장에서 이틀 동안 진행했어요. 둘째 날은 첫날 그림을 받은 분이 가족을 데리고 다시 오시기도 했고, 어르신 부부 그림을 그려 드릴 때 반응이 특히 좋았습니다.',
      photos: ['images/live-drawing-02.jpg', 'images/site-friends-01.jpg'] },
    { id: 's4', job: 'j6', a: 'a1', at: '2026-10-11 17:20', state: 'private', subj: true, count: 38,
      title: 'VIP 고객 감사 행사', guests: '50명 이하', tags: ['VIP', '실내'],
      mood: '라운지에서 차분한 분위기로 진행했어요. 한 분씩 대화를 나누며 천천히 그렸습니다.',
      photos: ['images/site-single-01.jpg'] },
    { id: 's5', job: 'j7', a: 'a7', at: '2026-10-18 18:30', state: 'pending', subj: true, count: 120,
      title: '창립 10주년 파티 라이브 드로잉', guests: '100~200명', tags: ['기업행사', '파티', '실내'],
      mood: '루프탑 파티장에서 진행했어요. 팀 단위로 와서 단체 캐리커처를 요청하는 분이 많았고, 완성작을 사무실에 걸겠다며 좋아해 주셨어요.',
      photos: ['images/work-single-02.jpg', 'images/work-couple-03.jpg'] },
    { id: 's6', job: 'j8', a: 'a3', at: '2026-10-24 12:20', state: 'pending', subj: true, count: 64,
      title: '어린이집 가을 운동회 페이스페인팅', guests: '50~100명', tags: ['어린이', '야외', '운동회'],
      mood: '운동장 그늘막 아래에서 진행했어요. 경기 중간 쉬는 시간에 아이들이 몰려와서 짧고 귀여운 도안 위주로 빠르게 그렸고, 부모님들 사진 촬영이 이어졌어요.',
      photos: ['images/fp-octopus.jpg', 'images/site-kid-01.jpg', 'images/fp-jellyfish.jpg'] },
    { id: 's7', job: 'j1', a: 'a4', at: '2026-09-06 18:30', state: 'published', subj: true, count: 142,
      title: '가족의 날 두 번째 부스 캐리커처', guests: '100~200명', tags: ['기업행사', '가족'],
      mood: '두 번째 부스는 커플과 부부 손님이 많았어요. 사내 커플이 함께 그림을 받아 가며 사원증 사진으로 쓰겠다고 해서 다 같이 웃었습니다.',
      photos: ['images/work-family-03.jpg', 'images/work-couple-02.jpg'] },
    { id: 's8', job: 'j2', a: 'a6', at: '2026-09-13 18:55', state: 'hidden', subj: true, count: 188,
      title: '축제 부스 반짝이 페이스페인팅', guests: '200명 이상', tags: ['대학축제', '야외'],
      mood: '해 질 무렵부터는 글리터 포인트를 찾는 학생이 많았어요. 잠자리와 아이스크림 도안이 특히 인기였습니다.',
      photos: ['images/fp-dragonfly.jpg', 'images/fp-icecream.jpg'] },
    { id: 's9', job: 'j4', a: 'a10', at: '2026-09-28 18:40', state: 'published', subj: true, count: 231,
      title: '구민 축제 가족 캐리커처', guests: '200명 이상', tags: ['지역축제', '가족'],
      mood: '자매·형제를 함께 그려 달라는 요청이 많았어요. 둘째 날 오후에는 대기 번호표를 나눠 드려 줄 서는 시간을 줄였습니다.',
      photos: ['images/work-sisters.jpg', 'images/work-couple-03.jpg'] }
  ],

  /* 행사별 작가 평가 (운영자 내부용, 작가에게 공개하지 않음)
     s: work 작품 완성도 / time 시간 준수 / cs 고객 응대 / manner 현장 매너 (1~5)
     rehire: yes 재섭외 추천 / ok 보통 / no 재섭외 보류 */
  reviews: [
    { job: 'j1', a: 'a1', at: '2026-09-07 10:20', s: { work: 5, time: 5, cs: 5, manner: 5 }, rehire: 'yes', tags: ['손이 빠름', '고객 반응 좋음'], note: '대기 줄이 길었는데 속도 조절 잘함. 담당자 칭찬.' },
    { job: 'j1', a: 'a4', at: '2026-09-07 10:24', s: { work: 4, time: 5, cs: 4, manner: 5 }, rehire: 'yes', tags: ['준비물 완벽'], note: '' },
    { job: 'j2', a: 'a3', at: '2026-09-14 09:40', s: { work: 5, time: 4, cs: 5, manner: 5 }, rehire: 'yes', tags: ['아이들 응대 좋음'], note: '도안 샘플판 준비해 와서 선택이 빨랐음.' },
    { job: 'j2', a: 'a6', at: '2026-09-14 09:45', s: { work: 4, time: 3, cs: 4, manner: 4 }, rehire: 'ok', tags: ['지각'], note: '20분 늦게 도착. 사전 연락은 있었음.' },
    { job: 'j3', a: 'a2', at: '2026-09-21 11:00', s: { work: 5, time: 5, cs: 4, manner: 5 }, rehire: 'yes', tags: ['작품 퀄리티 높음'], note: '' },
    { job: 'j4', a: 'a7', at: '2026-09-29 10:10', s: { work: 5, time: 5, cs: 5, manner: 5 }, rehire: 'yes', tags: ['손이 빠름'], note: '이틀 연속인데 컨디션 유지 좋음.' },
    { job: 'j4', a: 'a10', at: '2026-09-29 10:15', s: { work: 4, time: 4, cs: 3, manner: 4 }, rehire: 'ok', tags: [], note: '응대가 다소 무뚝뚝하다는 현장 피드백.' },
    { job: 'j5', a: 'a9', at: '2026-10-05 09:30', s: { work: 4, time: 5, cs: 5, manner: 5 }, rehire: 'yes', tags: ['아이들 응대 좋음'], note: '' },
    { job: 'j6', a: 'a1', at: '2026-10-12 10:00', s: { work: 5, time: 5, cs: 5, manner: 4 }, rehire: 'yes', tags: ['고객 반응 좋음'], note: '' }
  ],

  /* 고객 담당자에게 보내는 결과 리포트 (키: 공고ID)
     state: draft 발송 대기 / sent 발송 완료 · token: 리포트 주소용 임의 문자열 */
  reports: {
    j1: { state: 'sent', token: 'r7k2m9qa', sentAt: '2026-09-08 10:30', openedAt: '2026-09-08 11:02', to: '인사팀 김OO 매니저', intro: '추석을 앞두고 임직원 가족분들께 특별한 추억을 선물해 드릴 수 있어 기뻤습니다. 당일 현장 기록을 정리해 보내드립니다.', rating: 5, review: '대기 줄이 길었는데도 끝까지 웃으며 그려 주셔서 직원들 반응이 정말 좋았어요. 내년에도 부탁드릴게요.' },
    j2: { state: 'sent', token: 'p3x8n1vd', sentAt: '2026-09-15 09:50', openedAt: '', to: '총학생회 박OO', intro: '축제 첫날 페이스페인팅 부스 운영 결과를 정리해 보내드립니다.' },
    j4: { state: 'draft', token: 'h6w4c2ze', to: '문화체육과 이OO 주무관', intro: '이틀간의 가을 문화 축제 캐리커처 부스 운영 결과를 정리해 보내드립니다.' }
  },

  /* 홈페이지 견적 문의 (공고로 전환 전) */
  quotes: [
    { id: 'q1', at: '2026-10-31 21:14', client: 'OO화학 총무팀', skill: 'caricature', start: '2026-12-12', end: '2026-12-12', time: '18:00~21:00', place: '서울 강서구 OO컨벤션', region: '서울', need: 3, photoOk: true, memo: '송년회 2부, 예상 손님 150명' },
    { id: 'q2', at: '2026-11-01 08:40', client: 'OO유치원', skill: 'balloon', start: '2026-12-23', end: '2026-12-23', time: '10:00~12:00', place: '경기 일산 OO유치원', region: '경기 북부', need: 1, photoOk: false, memo: '크리스마스 파티, 원아 60명' }
  ]
};
