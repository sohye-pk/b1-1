# 포트폴리오 웹사이트 — Park SoHye

순수 HTML / CSS / JavaScript(Vanilla JS)로 제작한 반응형 개인 포트폴리오 사이트입니다.  
외부 UI 라이브러리(React, Vue, jQuery, Bootstrap, Tailwind 등) 없이 웹의 기본 동작 원리를 직접 구현하는 데 초점을 맞췄습니다.

---

## 🔗 배포 URL

**GitHub Pages:** [https://sohye-pk.github.io/b1-1/](https://sohye-pk.github.io/b1-1/)

---

## 🖼️ 스크린샷

| 데스크톱 (라이트) | 데스크톱 (다크) | 모바일 |
|:---:|:---:|:---:|
| ![desktop-light](images/desktop-light.png) | ![desktop-dark](images/desktop-dark.png) | ![mobile](images/mobile.png) |

---

## 🛠️ 사용 기술

| 분류 | 내용 |
|---|---|
| 마크업 | HTML5 (시맨틱 태그) |
| 스타일 | CSS3 (Flexbox, Grid, CSS 변수, 미디어 쿼리, 모바일 퍼스트) |
| 스크립트 | JavaScript ES6+ (Vanilla, async/await, Intersection Observer) |
| 폰트 | Google Fonts — Noto Sans KR, Fira Code |
| 아이콘 | Font Awesome 6 |
| 이메일 전송 | EmailJS |
| API | GitHub REST API v3 |
| 배포 | GitHub Pages |

---

## 📁 폴더 구조

\`\`\`
b1-1/
├── index.html          # 메인 페이지 (시맨틱 마크업)
├── css/
│   └── style.css       # 전체 스타일시트 (모바일 퍼스트)
├── js/
│   ├── config.js       # 전역 설정 상수 (GitHub ID, 임계값, EmailJS 등)
│   └── main.js         # 전체 스크립트 (Vanilla JS)
├── images/
│   ├── profile.png          # 프로필 이미지
│   ├── desktop-light.png    # 스크린샷 — 데스크톱 라이트
│   ├── desktop-dark.png     # 스크린샷 — 데스크톱 다크
│   └── mobile.png           # 스크린샷 — 모바일
└── README.md
\`\`\`

---

## ✅ 구현 기능

### 필수 기능

#### HTML — 시맨틱 마크업
- \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<footer>\` 시맨틱 태그 사용
- **Hero · About · Skills · Projects · Contact · Footer** 6개 섹션 구성
- 네비게이션 앵커 링크(\`#about\`, \`#skills\`, \`#projects\`, \`#contact\`)로 각 섹션 이동
- 모든 이미지에 의미 있는 \`alt\` 속성 작성
- 폼 요소 \`<label>\`의 \`for\`/\`id\` 매칭 완료, \`aria-*\` 접근성 속성 적용

#### CSS — 레이아웃 & 반응형
- **모바일 퍼스트** 방식으로 작성 (기본 → 768px → 1024px)
- \`:root\` CSS 변수로 색상 · 폰트 · 간격 · 반경 일괄 관리
- \`[data-theme="dark"]\`로 다크 모드 전용 변수 분리 (노을/황혼 컬러 팔레트)
- **Flexbox**: 네비게이션(로고 왼쪽 / 메뉴 오른쪽), About · Contact 레이아웃
- **Grid**: Projects 카드 (\`repeat(auto-fit, minmax(280px, 1fr))\`)
- 버튼 · 카드 \`hover\` 효과 + \`transition\`, 카드 \`box-shadow\` 적용
- 모바일에서 네비게이션 메뉴 숨김 → 햄버거 버튼 표시 (768px 이상 복원)

#### JavaScript — DOM & 이벤트
- \`defer\` 속성으로 스크립트 로드 (\`config.js\` → \`main.js\` 순서 보장)
- \`const\` / \`let\`만 사용, \`var\` 미사용
- HTML \`onclick\` 속성 미사용, 모든 이벤트는 \`addEventListener\`로 연결
- \`querySelector\` · \`querySelectorAll\` · \`classList\` · \`textContent\` · \`innerHTML\` 활용
- \`click\`, \`submit\`, \`scroll\`, \`input\` 이벤트 처리, \`event.preventDefault()\` 적용

#### 인터랙션
| 기능 | 동작 방식 |
|---|---|
| 햄버거 메뉴 | \`classList.toggle('active')\` — 모바일에서 메뉴 열기/닫기, 외부 클릭 시 자동 닫힘 |
| 부드러운 스크롤 | \`scrollIntoView({ behavior: 'smooth' })\` |
| 스크롤탑 버튼 | 스크롤 **300px** 이상 시 표시, 클릭 시 최상단 이동 |
| 헤더 스타일 변경 | 스크롤 **60px** 이상 시 \`.scrolled\` 클래스 추가 → 배경색 · 그림자 변경 |
| 다크 모드 | 토글 클릭 → \`data-theme\` 변경 → \`localStorage\` 저장 → 새로고침 후에도 유지 |
| 스크롤 애니메이션 | \`IntersectionObserver\` (threshold **0.2**), \`.reveal\` → \`.visible\` 클래스 전환 |
| 스킬바 애니메이션 | Skills 섹션 진입 시 \`scaleX(0 → 1)\` CSS 트랜지션 실행 |

#### 폼 UX
- 이름 / 이메일 / 메시지 필수값 검증 + 이메일 형식 정규식(\`/^[^\s@]+@[^\s@]+\.[^\s@]+$/\`) 검증
- 에러 메시지 입력 필드 바로 하단 표시, \`input\` 이벤트 발생 시 즉시 제거
- \`event.preventDefault()\`로 기본 제출 방지, 성공 시 인라인 성공 메시지 5초 후 자동 숨김
- 중복 제출 방지 (\`state.formStatus === 'submitting'\` 가드)
- **EmailJS 연동**: 실제 이메일 전송 (미설정 시 성공 시뮬레이션으로 폴백)

#### GitHub API 연동
- \`fetch\` + \`async/await\` + \`try/catch\`
- 엔드포인트: \`https://api.github.com/users/sohye-pk/repos?per_page=100&sort=updated\`
- fork 저장소 제외, star 수 기준 내림차순 정렬
- **로딩** 상태: CSS 스피너 표시
- **성공** 상태: \`map\` + 템플릿 리터럴로 저장소 카드 렌더링
- **에러** 상태: 에러 메시지 + 재시도 버튼 (403 Rate Limit 포함)
- **빈** 상태: 안내 메시지 표시

#### ES6+ 문법
- 화살표 함수 전반 활용
- 템플릿 리터럴로 카드 HTML 동적 생성
- 구조분해 할당으로 API 응답 데이터 추출
- \`map\` (카드 변환) · \`filter\` (필터링, fork 제외) · \`forEach\` (이벤트 등록) 배열 메서드 활용

#### 상태 관리 흐름 (이벤트 → 상태 → 렌더링)
| # | 이벤트 | 상태(\`state\`) 변경 | 화면 업데이트 |
|---|---|---|---|
| 1 | 테마 토글 클릭 | \`state.theme\` 반전 | \`data-theme\` 변경 → 전체 CSS 변수 전환 |
| 2 | GitHub API 호출 | \`state.projectStatus\`: \`loading → success / error / empty\` | Projects 섹션 내용 교체 |
| 3 | 폼 제출 | \`state.formStatus\`: \`idle → submitting → success / error\` | 버튼 비활성화 · 에러/성공 메시지 표시 |
| 4 | 필터 버튼 클릭 | \`state.currentFilter\` 변경 | 프로젝트 카드 목록 재렌더링 |

---

### 🌟 보너스 기능

#### 프로젝트 언어별 필터링
- GitHub 저장소에서 사용 언어를 자동으로 추출, 필터 버튼 동적 생성
- \`Array.filter()\`로 선택 언어에 맞는 카드만 렌더링
- 이벤트 위임(\`projectsFilters.addEventListener\`)으로 처리

#### 타이핑 효과
- Hero 섹션에서 \`CONFIG.TYPING.STRINGS\` 배열을 순환하며 한 글자씩 타이핑 · 삭제
- \`setTimeout\` 재귀로 구현 (외부 라이브러리 없음)

#### EmailJS 실제 전송
- \`config.js\`의 \`EMAILJS\` 설정값 입력 시 폼 제출 → 실제 이메일 수신
- 설정값이 없으면 자동으로 성공 시뮬레이션으로 폴백

#### 시스템 다크 모드 감지
- \`window.matchMedia('(prefers-color-scheme: dark)')\` 로 초기 테마 자동 설정
- \`change\` 이벤트로 실시간 반영 (\`localStorage\`에 명시적 선택값이 없을 때만)

---

## ⚙️ 설정값 안내

\`js/config.js\` 파일 한 곳에서 모든 동작 기준값을 변경할 수 있습니다.

\`\`\`js
const CONFIG = {
  GITHUB_USERNAME: 'sohye-pk',   // GitHub 아이디

  SCROLL_HEADER_THRESHOLD: 60,   // 헤더 배경 스타일 변경 기준 (px)
  SCROLL_TOP_THRESHOLD: 300,     // 스크롤탑 버튼 표시 기준 (px)
  OBSERVER_THRESHOLD: 0.2,       // IntersectionObserver 임계값

  TYPING: {
    STRINGS: [...],              // Hero 타이핑 문자열 목록
    TYPE_SPEED: 90,              // 타이핑 속도 (ms/글자)
    DELETE_SPEED: 50,            // 삭제 속도 (ms/글자)
    PAUSE_MS: 2000,              // 완성 후 대기 시간 (ms)
    NEXT_DELAY: 400,             // 다음 문자열 시작 전 딜레이 (ms)
  },

  EMAILJS: {
    SERVICE_ID: '...',           // EmailJS 서비스 ID
    TEMPLATE_ID: '...',          // EmailJS 템플릿 ID
    PUBLIC_KEY: '...',           // EmailJS 공개 키
  },
};
\`\`\`

> 스크롤 기준값(\`SCROLL_HEADER_THRESHOLD\`, \`SCROLL_TOP_THRESHOLD\`)이나 \`OBSERVER_THRESHOLD\`를 변경했다면 이 README의 인터랙션 표도 함께 수정해 주세요.

---

## 🚀 GitHub Pages 배포 방법

\`\`\`bash
# 1. 저장소 생성 후 push
git init
git add .
git commit -m "init: 포트폴리오 초기 커밋"
git remote add origin https://github.com/sohye-pk/b1-1.git
git push -u origin main

# 2. GitHub 저장소 → Settings → Pages
#    Source: Deploy from a branch → Branch: main / (root) → Save
\`\`\`

배포 후 \`https://sohye-pk.github.io/b1-1/\` 에서 접속 가능합니다.

---

## 💻 개발 환경

- **에디터**: VS Code + Live Server 확장
- **브라우저**: 최신 Chrome 기준 동작 확인
- **제약**: 외부 UI 라이브러리 사용 없음 (Font Awesome, Google Fonts만 허용)

---

## 📝 GitHub API 주의사항

- 인증 없이 호출 시 **시간당 60회** 요청 제한(Rate Limit)이 있습니다.
- 짧은 시간 내 반복 새로고침을 피해 주세요.
- Rate Limit 발생(403 응답) 시 에러 상태 UI + 재시도 버튼이 표시됩니다.
