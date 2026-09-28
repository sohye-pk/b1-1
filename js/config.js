/**
 * config.js — 사이트 전역 설정
 *
 * 동작 기준값과 외부 연동 값을 이 파일 한 곳에서만 관리합니다.
 * (defer 클래식 스크립트로 main.js보다 먼저 로드되어 전역 상수로 공유됩니다.)
 */

const CONFIG = {
  // GitHub 사용자명 (Projects 섹션 API 호출에 사용)
  GITHUB_USERNAME: 'sohye-pk',

  // 스크롤 기준값 (px)
  SCROLL_HEADER_THRESHOLD: 60, // 헤더 배경 스타일 변경
  SCROLL_TOP_THRESHOLD: 300, // 스크롤탑 버튼 표시

  // Intersection Observer 임계값
  OBSERVER_THRESHOLD: 0.2,

  // Hero 타이핑 효과
  TYPING: {
    STRINGS: [
      'Full-Stack Developer',
      '서비스의 흐름을 설계하는 사람',
      '아이디어를 코드로 구현하는 사람',
    ],
    TYPE_SPEED: 90,
    DELETE_SPEED: 50,
    PAUSE_MS: 2000,
    NEXT_DELAY: 400,
  },

  /**
   * EmailJS 설정 (https://www.emailjs.com/)
   *
   * ⚠️ PUBLIC_KEY는 이름 그대로 "공개용" 키입니다.
   *    브라우저에서 동작하도록 설계되어 노출되어도 안전합니다.
   *    다만 남용 방지를 위해 EmailJS 대시보드 →
   *    Account → Security 에서 "Allowed Domains"(허용 도메인)을
   *    본인 배포 주소로 제한하는 것을 권장합니다.
   *
   * 설정 순서:
   *   1. Email Services → 서비스 연결 → SERVICE_ID 확인
   *   2. Email Templates → 템플릿 작성({{from_name}} {{from_email}} {{message}})
   *      → TEMPLATE_ID 확인
   *   3. Account → General → PUBLIC_KEY 확인
   *
   * 아래 값이 placeholder('xxx' 포함) 상태이면
   * 폼은 실제 전송 대신 성공 시뮬레이션으로 동작합니다.
   */
  EMAILJS: {
    SERVICE_ID: 'service_rrjtv5w',
    TEMPLATE_ID: 'template_4zj8kom',
    PUBLIC_KEY: 'T9m5MzGxjYsIQ174T',
  },
};

const GITHUB_API_URL = `https://api.github.com/users/${CONFIG.GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
