/**
 * main.js — 포트폴리오 메인 스크립트 (순수 Vanilla JavaScript)
 *
 * 구현 방식: 이벤트 핸들러 안에서 상태(state)를 갱신하고,
 *           바로 그 자리에서 DOM을 직접 조작하는 전통적인 방식입니다.
 *
 *  1. 공통 헬퍼 / 상태(state)
 *  2. 다크 모드
 *  3. 햄버거 메뉴
 *  4. 스크롤 (헤더 스타일 / 스크롤탑 버튼 / 부드러운 스크롤)
 *  5. 스크롤 애니메이션 (Intersection Observer)
 *  6. 스킬바 애니메이션
 *  7. 타이핑 효과
 *  8. GitHub API & Projects 렌더링
 *  9. 프로젝트 필터링
 * 10. 폼 유효성 검사 & EmailJS 전송
 * 11. 프로필 이미지 대체 처리
 * 12. 푸터 연도
 * 13. 초기화
 */

'use strict';

/* ============================================================
   1. 공통 헬퍼 / 상태(state)
   ============================================================ */

// DOM 선택 헬퍼
const qs = (selector, parent = document) => parent.querySelector(selector);
const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/**
 * 현재 화면 상태를 담아두는 단순 저장소입니다.
 * (값을 여기서 갱신한 뒤, 각 핸들러가 DOM을 직접 조작합니다.)
 */
const state = {
  theme: 'light', // 'light' | 'dark'
  menuOpen: false,
  scrolled: false,
  showScrollTop: false,
  projectStatus: 'idle', // 'idle' | 'loading' | 'success' | 'error' | 'empty'
  repos: [],
  currentFilter: 'all',
  formStatus: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
};

/* ============================================================
   2. 다크 모드
   클릭 → state.theme 갱신 → data-theme 속성 변경 → localStorage 저장
   ============================================================ */

const themeToggle = qs('#theme-toggle');
const themeIcon = qs('#theme-icon');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  themeToggle.setAttribute('aria-label', isDark ? '라이트 모드 전환' : '다크 모드 전환');
};

const initTheme = () => {
  const saved = localStorage.getItem('theme');
  state.theme = saved ?? (prefersDark.matches ? 'dark' : 'light');
  applyTheme(state.theme);

  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
    localStorage.setItem('theme', state.theme);
  });

  // 시스템 설정 변경 시 실시간 반영 (사용자가 직접 고른 값이 없을 때만)
  prefersDark.addEventListener('change', (e) => {
    if (localStorage.getItem('theme')) return;
    state.theme = e.matches ? 'dark' : 'light';
    applyTheme(state.theme);
  });
};

/* ============================================================
   3. 햄버거 메뉴
   클릭 → state.menuOpen 갱신 → 클래스/속성 직접 토글
   ============================================================ */

const hamburger = qs('#hamburger');
const navMenu = qs('#nav-menu');

const setMenu = (open) => {
  state.menuOpen = open;
  navMenu.classList.toggle('active', open);
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
};

const initMenu = () => {
  hamburger.addEventListener('click', () => setMenu(!state.menuOpen));

  // 메뉴 항목 클릭 시 닫기
  qsa('.nav__link').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // 메뉴 바깥 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!state.menuOpen) return;
    if (navMenu.contains(e.target) || hamburger.contains(e.target)) return;
    setMenu(false);
  });
};

/* ============================================================
   4. 스크롤 (헤더 스타일 / 스크롤탑 버튼 / 부드러운 스크롤)
   scroll → state 갱신 → 클래스/속성 직접 토글
   ============================================================ */

const header = qs('#header');
const scrollTopBtn = qs('#scroll-top');

const handleScroll = () => {
  const y = window.scrollY;

  const scrolled = y >= CONFIG.SCROLL_HEADER_THRESHOLD;
  if (scrolled !== state.scrolled) {
    state.scrolled = scrolled;
    header.classList.toggle('scrolled', scrolled);
  }

  const showScrollTop = y >= CONFIG.SCROLL_TOP_THRESHOLD;
  if (showScrollTop !== state.showScrollTop) {
    state.showScrollTop = showScrollTop;
    scrollTopBtn.toggleAttribute('hidden', !showScrollTop);
  }
};

const initScroll = () => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // 초기 상태 반영

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 앵커 링크 부드러운 스크롤
  qsa('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = qs(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};

/* ============================================================
   5. 스크롤 애니메이션 — Intersection Observer
   .reveal 요소가 화면에 들어오면 .visible 클래스 추가
   ============================================================ */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: CONFIG.OBSERVER_THRESHOLD }
);

const observeReveal = (elements) => {
  elements.forEach((el) => revealObserver.observe(el));
};

/* ============================================================
   6. 스킬바 애니메이션
   Skills 섹션이 보이면 모든 스킬바에 .animate 추가
   ============================================================ */

const initSkillBars = () => {
  const skillsSection = qs('#skills');
  if (!skillsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        qsa('.skill-bar__fill').forEach((bar) => bar.classList.add('animate'));
        observer.unobserve(entry.target);
      });
    },
    { threshold: CONFIG.OBSERVER_THRESHOLD }
  );

  observer.observe(skillsSection);
};

/* ============================================================
   7. 타이핑 효과
   Hero 섹션 — 한 글자씩 타이핑 후 지우고 다음 문자열 반복
   ============================================================ */

const initTyping = () => {
  const el = qs('#typing-text');
  if (!el) return;

  const { STRINGS, TYPE_SPEED, DELETE_SPEED, PAUSE_MS, NEXT_DELAY } = CONFIG.TYPING;
  let stringIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = STRINGS[stringIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = current.slice(0, charIndex);

    let delay = deleting ? DELETE_SPEED : TYPE_SPEED;

    if (!deleting && charIndex === current.length) {
      deleting = true;
      delay = PAUSE_MS;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      stringIndex = (stringIndex + 1) % STRINGS.length;
      delay = NEXT_DELAY;
    }

    setTimeout(tick, delay);
  };

  tick();
};

/* ============================================================
   8. GitHub API & Projects 렌더링
   fetch → state.projectStatus / state.repos 갱신 → renderProjects()
   ============================================================ */

const projectsContainer = qs('#projects-container');
const projectsFilters = qs('#projects-filters');

// 현재 필터에 맞는 저장소 목록
const getFilteredRepos = () =>
  state.currentFilter === 'all'
    ? state.repos
    : state.repos.filter((repo) => repo.language === state.currentFilter);

// 상태 박스(로딩/에러/빈 상태) 공통 마크업
const statusBox = ({ icon, spinner, title, desc, retry }) => `
  <div class="status-box">
    ${spinner ? '<div class="spinner" role="status" aria-label="로딩 중"></div>' : ''}
    ${icon ? `<div class="status-box__icon" aria-hidden="true">${icon}</div>` : ''}
    ${title ? `<p class="status-box__title">${title}</p>` : ''}
    <p class="status-box__desc">${desc}</p>
    ${retry
      ? '<button class="btn btn--primary" id="retry-btn"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> 다시 시도</button>'
      : ''}
  </div>`;

// 저장소 1개 → 카드 마크업
const repoCard = (repo) => {
  const {
    name, description, html_url, homepage, language,
    stargazers_count, forks_count, updated_at,
  } = repo;

  const updated = new Date(updated_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const langBadge = language ? `<span class="project-card__lang">${language}</span>` : '';
  const demoLink = homepage
    ? `<a href="${homepage}" class="project-card__link" target="_blank" rel="noopener noreferrer">
         <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> 데모
       </a>`
    : '';

  return `
    <article class="project-card reveal">
      <div class="project-card__header">
        <i class="fa-brands fa-github project-card__icon" aria-hidden="true"></i>
        <h3 class="project-card__name">${name}</h3>
      </div>
      <p class="project-card__desc">${description || '설명이 없습니다.'}</p>
      <div class="project-card__meta">
        ${langBadge}
        <span class="project-card__meta-item"><i class="fa-solid fa-star" aria-hidden="true"></i> ${stargazers_count}</span>
        <span class="project-card__meta-item"><i class="fa-solid fa-code-branch" aria-hidden="true"></i> ${forks_count}</span>
        <span class="project-card__meta-item"><i class="fa-regular fa-clock" aria-hidden="true"></i> ${updated}</span>
      </div>
      <div class="project-card__footer">
        <a href="${html_url}" class="project-card__link" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-github" aria-hidden="true"></i> GitHub
        </a>
        ${demoLink}
      </div>
    </article>`;
};

// state.projectStatus 값에 따라 Projects 섹션을 다시 그림
const renderProjects = () => {
  switch (state.projectStatus) {
    case 'loading':
      projectsContainer.innerHTML = statusBox({
        spinner: true,
        desc: '저장소를 불러오는 중입니다...',
      });
      break;

    case 'error':
      projectsContainer.innerHTML = statusBox({
        icon: '⚠️',
        title: '프로젝트를 불러올 수 없습니다',
        desc: '네트워크 오류이거나 API 요청 횟수 제한(Rate Limit)에 걸렸을 수 있습니다.',
        retry: true,
      });
      qs('#retry-btn').addEventListener('click', fetchRepos);
      break;

    case 'empty':
      projectsContainer.innerHTML = statusBox({
        icon: '📭',
        title: '표시할 프로젝트가 없습니다',
        desc: '선택한 조건에 맞는 공개 저장소가 없습니다.',
      });
      break;

    case 'success': {
      const cards = getFilteredRepos().map(repoCard).join('');
      projectsContainer.innerHTML = `<div class="projects__grid">${cards}</div>`;
      // 새로 생성된 카드도 등장 애니메이션 대상으로 등록
      observeReveal(qsa('.project-card.reveal', projectsContainer));
      break;
    }
  }
};

// 언어별 필터 버튼 생성
const renderFilters = () => {
  const langs = [
    ...new Set(state.repos.map((repo) => repo.language).filter(Boolean)),
  ].sort();

  projectsFilters.innerHTML = ['all', ...langs]
    .map((lang) => {
      const active = lang === state.currentFilter;
      const label = lang === 'all' ? 'All' : lang;
      return `<button class="filter-btn${active ? ' filter-btn--active' : ''}"
                data-lang="${lang}" aria-pressed="${active}">${label}</button>`;
    })
    .join('');
};

// GitHub API 호출
async function fetchRepos() {
  state.projectStatus = 'loading';
  renderProjects();

  try {
    const res = await fetch(GITHUB_API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    state.repos = data
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);

    state.projectStatus = state.repos.length > 0 ? 'success' : 'empty';
    renderFilters();
    renderProjects();
  } catch (err) {
    console.error('[GitHub API Error]', err);
    state.projectStatus = 'error';
    renderProjects();
  }
}

/* ============================================================
   9. 프로젝트 필터링
   필터 클릭 → state.currentFilter 갱신 → 재렌더링
   ============================================================ */

const initFilters = () => {
  // 이벤트 위임으로 필터 클릭 처리
  projectsFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn || btn.dataset.lang === state.currentFilter) return;

    state.currentFilter = btn.dataset.lang;
    state.projectStatus = getFilteredRepos().length > 0 ? 'success' : 'empty';
    renderFilters();
    renderProjects();
  });
};

/* ============================================================
   10. 폼 유효성 검사 & EmailJS 전송
   submit → 검증 → state.formStatus 갱신 → 버튼/성공메시지 직접 조작
   ============================================================ */

const contactForm = qs('#contact-form');
const formSuccess = qs('#form-success');
const submitBtn = qs('#submit-btn');
const FIELD_IDS = ['name', 'email', 'message'];

const fieldValue = (id) => qs(`#${id}`).value.trim();

const showFieldError = (id, message) => {
  qs(`#${id}`).classList.add('error');
  qs(`#${id}-error`).innerHTML =
    `<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>${message}`;
};

const clearFieldError = (id) => {
  qs(`#${id}`).classList.remove('error');
  qs(`#${id}-error`).textContent = '';
};

// 전체 폼 검증 → 유효하면 true
const validateForm = () => {
  const name = fieldValue('name');
  const email = fieldValue('email');
  const message = fieldValue('message');
  let valid = true;

  if (!name) {
    showFieldError('name', '이름을 입력해 주세요.');
    valid = false;
  }

  if (!email) {
    showFieldError('email', '이메일을 입력해 주세요.');
    valid = false;
  } else if (!EMAIL_REGEX.test(email)) {
    showFieldError('email', '올바른 이메일 형식이 아닙니다.');
    valid = false;
  }

  if (!message) {
    showFieldError('message', '메시지를 입력해 주세요.');
    valid = false;
  }

  return valid;
};

// 제출 버튼 로딩 상태 표시
const setSubmitting = (submitting) => {
  submitBtn.disabled = submitting;
  submitBtn.innerHTML = submitting
    ? '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> 전송 중...'
    : '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> 메시지 보내기';
};

// 성공 메시지 표시 후 자동 숨김
const showFormSuccess = () => {
  formSuccess.removeAttribute('hidden');
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => {
    formSuccess.setAttribute('hidden', '');
    state.formStatus = 'idle';
  }, 5000);
};

// EmailJS 설정 여부 (placeholder 'xxx'가 남아있으면 미설정으로 간주)
const isEmailConfigured = () => {
  if (typeof emailjs === 'undefined') return false;
  const { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } = CONFIG.EMAILJS;
  return [SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY].every(
    (v) => v && !v.includes('xxx')
  );
};

// 실제 이메일 전송
const sendEmail = () =>
  emailjs.send(
    CONFIG.EMAILJS.SERVICE_ID,
    CONFIG.EMAILJS.TEMPLATE_ID,
    {
      from_name: fieldValue('name'),
      from_email: fieldValue('email'),
      message: fieldValue('message'),
    },
    { publicKey: CONFIG.EMAILJS.PUBLIC_KEY }
  );

const initForm = () => {
  // 입력 시 해당 필드 에러 즉시 제거
  FIELD_IDS.forEach((id) => {
    qs(`#${id}`).addEventListener('input', () => clearFieldError(id));
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (state.formStatus === 'submitting') return; // 중복 제출 방지
    if (!validateForm()) return;

    state.formStatus = 'submitting';
    setSubmitting(true);

    try {
      if (isEmailConfigured()) {
        await sendEmail();
      } else {
        // EmailJS 미설정 시: 개발용 전송 시뮬레이션
        console.warn('[EmailJS] 미설정 상태입니다. config.js의 EMAILJS 값을 입력하세요. (전송 시뮬레이션)');
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      contactForm.reset();
      state.formStatus = 'success';
      setSubmitting(false);
      showFormSuccess();
    } catch (err) {
      console.error('[EmailJS Error]', err);
      state.formStatus = 'error';
      setSubmitting(false);
      showFieldError('message', '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  });
};

/* ============================================================
   11. 프로필 이미지 대체 처리
   이미지 로드 실패 시 플레이스홀더 표시 (인라인 onerror 대체)
   ============================================================ */

const initProfileImage = () => {
  const img = qs('.about__image');
  const placeholder = qs('.about__image-placeholder');
  if (!img || !placeholder) return;

  const showPlaceholder = () => {
    img.classList.add('about__image--hidden');
    placeholder.classList.add('is-visible');
  };

  img.addEventListener('error', showPlaceholder);
  // 스크립트 로드 전 이미 로드 실패한 경우 대비
  if (img.complete && img.naturalWidth === 0) showPlaceholder();
};

/* ============================================================
   12. 푸터 연도
   ============================================================ */

const initFooterYear = () => {
  const el = qs('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
};

/* ============================================================
   13. 초기화 (defer 로 DOM 파싱 완료 후 실행 보장됨)
   ============================================================ */

const init = () => {
  initTheme();
  initMenu();
  initScroll();
  observeReveal(qsa('.reveal'));
  initSkillBars();
  initTyping();
  initFilters();
  initForm();
  initProfileImage();
  initFooterYear();
  fetchRepos();
};

init();
