/**
 * main.js — 포트폴리오 메인 스크립트 (순수 Vanilla JavaScript)
 *
 *  1.  상수 / 설정
 *  2.  다크 모드
 *  3.  햄버거 메뉴
 *  4.  스크롤 이벤트 (헤더 스타일 변경 / 스크롤탑 버튼)
 *  5.  스크롤 애니메이션 (Intersection Observer)
 *  6.  스킬바 애니메이션 (Intersection Observer)
 *  7.  타이핑 효과 (Bonus)
 *  8.  GitHub API & Projects 렌더링
 *  9.  프로젝트 필터링 (Bonus)
 * 10.  폼 유효성 검사 & 전송
 * 11.  푸터 연도
 * 12.  초기화
 */

'use strict';

/* ============================================================
   1. 상수 / 설정
   ============================================================ */

const GITHUB_USERNAME = 'yourusername';
const GITHUB_API_URL  = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

// README 명시값
const SCROLL_HEADER_THRESHOLD = 60;   // 헤더 스타일 변경 기준 (px)
const SCROLL_TOP_THRESHOLD    = 300;  // 스크롤탑 버튼 표시 기준 (px)
const OBSERVER_THRESHOLD      = 0.2;  // Intersection Observer threshold

const TYPING_STRINGS = [
  '프론트엔드 개발자',
  'UI / UX 탐구자',
  '코드로 가치를 만드는 사람',
];

// Formspree 엔드포인트 (Bonus — 연동 시 본인 ID로 교체, 비우면 시뮬레이션)
const FORMSPREE_ENDPOINT = '';

/* ============================================================
   2. 다크 모드
   상태 흐름: 클릭 → isDark 반전 → data-theme 변경 → 아이콘 변경 → localStorage 저장
   ============================================================ */

const htmlEl        = document.documentElement;
const themeToggleEl = document.getElementById('theme-toggle');
const themeIconEl   = document.getElementById('theme-icon');

function applyTheme(isDark) {
  htmlEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIconEl.className  = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  themeToggleEl.setAttribute('aria-label', isDark ? '라이트 모드 전환' : '다크 모드 전환');
}

function loadInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved === 'dark');
    return;
  }
  // Bonus: 시스템 다크 모드 감지 (prefers-color-scheme)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark);
}

themeToggleEl.addEventListener('click', function () {
  const isDark = htmlEl.getAttribute('data-theme') === 'dark';
  applyTheme(!isDark);
  localStorage.setItem('theme', !isDark ? 'dark' : 'light');
});

// Bonus: 시스템 설정 변경 실시간 반영 (localStorage 값이 없을 때만)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches);
  }
});

/* ============================================================
   3. 햄버거 메뉴
   상태 흐름: 클릭 → active 클래스 토글 → 메뉴 표시/숨김
   ============================================================ */

const hamburgerEl = document.getElementById('hamburger');
const navMenuEl   = document.getElementById('nav-menu');

function closeMenu() {
  navMenuEl.classList.remove('active');
  hamburgerEl.classList.remove('active');
  hamburgerEl.setAttribute('aria-expanded', 'false');
  hamburgerEl.setAttribute('aria-label', '메뉴 열기');
}

function openMenu() {
  navMenuEl.classList.add('active');
  hamburgerEl.classList.add('active');
  hamburgerEl.setAttribute('aria-expanded', 'true');
  hamburgerEl.setAttribute('aria-label', '메뉴 닫기');
}

hamburgerEl.addEventListener('click', function () {
  const isOpen = navMenuEl.classList.contains('active');
  isOpen ? closeMenu() : openMenu();
});

// 메뉴 링크 클릭 시 닫기
document.querySelectorAll('.nav__link').forEach(function (link) {
  link.addEventListener('click', closeMenu);
});

// 메뉴 바깥 클릭 시 닫기
document.addEventListener('click', function (e) {
  if (
    navMenuEl.classList.contains('active') &&
    !navMenuEl.contains(e.target) &&
    !hamburgerEl.contains(e.target)
  ) {
    closeMenu();
  }
});

/* ============================================================
   4. 스크롤 이벤트
   - 60px 이상: 헤더에 .scrolled 추가 → 배경색 변경
   - 300px 이상: 스크롤탑 버튼 표시
   ============================================================ */

const headerEl    = document.getElementById('header');
const scrollTopEl = document.getElementById('scroll-top');

function handleScroll() {
  const scrollY = window.scrollY;

  // 헤더 스타일 변경
  if (scrollY >= SCROLL_HEADER_THRESHOLD) {
    headerEl.classList.add('scrolled');
  } else {
    headerEl.classList.remove('scrolled');
  }

  // 스크롤탑 버튼 표시/숨김
  if (scrollY >= SCROLL_TOP_THRESHOLD) {
    scrollTopEl.removeAttribute('hidden');
  } else {
    scrollTopEl.setAttribute('hidden', '');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });

scrollTopEl.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 앵커 링크 부드러운 스크롤 (scroll-behavior: smooth 미지원 브라우저 대응)
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ============================================================
   5. 스크롤 애니메이션 — Intersection Observer
   threshold: 0.2 (README 명시)
   .reveal 요소가 화면에 20% 이상 들어오면 .visible 추가
   ============================================================ */

const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: OBSERVER_THRESHOLD }
);

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});

/* ============================================================
   6. 스킬바 애니메이션 — Intersection Observer
   스킬 섹션이 뷰포트에 들어오면 .skill-bar__fill에 .animate 추가
   ============================================================ */

const skillsSection = document.getElementById('skills');

const skillBarObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        document.querySelectorAll('.skill-bar__fill').forEach(function (bar) {
          bar.classList.add('animate');
        });
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: OBSERVER_THRESHOLD }
);

if (skillsSection) {
  skillBarObserver.observe(skillsSection);
}

/* ============================================================
   7. 타이핑 효과 (Bonus)
   Hero 섹션 — 한 글자씩 타이핑 후 지우고 다음 문자열 반복
   ============================================================ */

const typingTextEl = document.getElementById('typing-text');

function startTypingEffect() {
  let stringIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  const TYPE_SPEED   = 90;
  const DELETE_SPEED = 50;
  const PAUSE_MS     = 2000;

  function tick() {
    const current = TYPING_STRINGS[stringIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typingTextEl.textContent = current.slice(0, charIndex);

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      delay = PAUSE_MS;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % TYPING_STRINGS.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* ============================================================
   8. GitHub API & Projects 렌더링
   상태: 'loading' | 'success' | 'error' | 'empty'
   상태 흐름: fetchRepos() → 상태 설정 → renderProjects(state, data)
   ============================================================ */

const projectsContainerEl = document.getElementById('projects-container');
const projectsFiltersEl   = document.getElementById('projects-filters');

let allRepos      = [];
let currentFilter = 'all';

function renderProjects(state, repos) {
  switch (state) {
    case 'loading':
      projectsContainerEl.innerHTML = `
        <div class="status-box">
          <div class="spinner" role="status" aria-label="로딩 중"></div>
          <p class="status-box__desc">저장소를 불러오는 중입니다...</p>
        </div>`;
      break;

    case 'error':
      projectsContainerEl.innerHTML = `
        <div class="status-box">
          <div class="status-box__icon" aria-hidden="true">⚠️</div>
          <p class="status-box__title">프로젝트를 불러올 수 없습니다</p>
          <p class="status-box__desc">
            네트워크 오류이거나 API 요청 횟수 제한(Rate Limit)에 걸렸을 수 있습니다.
          </p>
          <button class="btn btn--primary" id="retry-btn">
            <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> 다시 시도
          </button>
        </div>`;
      document.getElementById('retry-btn').addEventListener('click', fetchRepos);
      break;

    case 'empty':
      projectsContainerEl.innerHTML = `
        <div class="status-box">
          <div class="status-box__icon" aria-hidden="true">📭</div>
          <p class="status-box__title">표시할 프로젝트가 없습니다</p>
          <p class="status-box__desc">선택한 조건에 맞는 공개 저장소가 없습니다.</p>
        </div>`;
      break;

    case 'success': {
      const cardsHTML = repos.map(function (repo) {
        const { name, description, html_url, homepage, language, stargazers_count, forks_count, updated_at } = repo;
        const updatedDate  = new Date(updated_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
        const desc         = description || '설명이 없습니다.';
        const langBadge    = language ? `<span class="project-card__lang">${language}</span>` : '';
        const homepageLink = homepage
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
            <p class="project-card__desc">${desc}</p>
            <div class="project-card__meta">
              ${langBadge}
              <span class="project-card__meta-item">
                <i class="fa-solid fa-star" aria-hidden="true"></i> ${stargazers_count}
              </span>
              <span class="project-card__meta-item">
                <i class="fa-solid fa-code-branch" aria-hidden="true"></i> ${forks_count}
              </span>
              <span class="project-card__meta-item">
                <i class="fa-regular fa-clock" aria-hidden="true"></i> ${updatedDate}
              </span>
            </div>
            <div class="project-card__footer">
              <a href="${html_url}" class="project-card__link" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-github" aria-hidden="true"></i> GitHub
              </a>
              ${homepageLink}
            </div>
          </article>`;
      }).join('');

      projectsContainerEl.innerHTML = `<div class="projects__grid">${cardsHTML}</div>`;

      // 새로 생성된 카드를 reveal Observer에 등록
      projectsContainerEl.querySelectorAll('.project-card.reveal').forEach(function (el) {
        revealObserver.observe(el);
      });
      break;
    }
  }
}

async function fetchRepos() {
  renderProjects('loading');

  try {
    const response = await fetch(GITHUB_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // fork 제외, 별점 내림차순 정렬
    allRepos = data
      .filter(function (repo) { return !repo.fork; })
      .sort(function (a, b) { return b.stargazers_count - a.stargazers_count; });

    renderFilterButtons(allRepos);

    const filtered = getFilteredRepos(allRepos, currentFilter);
    renderProjects(filtered.length > 0 ? 'success' : 'empty', filtered);

  } catch (err) {
    console.error('[GitHub API Error]', err);
    renderProjects('error');
  }
}

/* ============================================================
   9. 프로젝트 필터링 (Bonus)
   상태 흐름: 필터 클릭 → currentFilter 변경 → renderProjects 재호출
   ============================================================ */

function getFilteredRepos(repos, lang) {
  if (lang === 'all') return repos;
  return repos.filter(function (repo) { return repo.language === lang; });
}

function renderFilterButtons(repos) {
  const langs = [...new Set(
    repos.map(function (repo) { return repo.language; }).filter(Boolean)
  )].sort();

  projectsFiltersEl.innerHTML = '';

  ['all', ...langs].forEach(function (lang) {
    const btn = document.createElement('button');
    btn.className    = 'filter-btn' + (lang === currentFilter ? ' filter-btn--active' : '');
    btn.dataset.lang = lang;
    btn.textContent  = lang === 'all' ? 'All' : lang;
    btn.setAttribute('aria-pressed', lang === currentFilter ? 'true' : 'false');
    projectsFiltersEl.appendChild(btn);
  });
}

// 이벤트 위임으로 필터 클릭 처리
projectsFiltersEl.addEventListener('click', function (e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn || btn.dataset.lang === currentFilter) return;

  currentFilter = btn.dataset.lang;

  document.querySelectorAll('.filter-btn').forEach(function (b) {
    const isActive = b.dataset.lang === currentFilter;
    b.classList.toggle('filter-btn--active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  const filtered = getFilteredRepos(allRepos, currentFilter);
  renderProjects(filtered.length > 0 ? 'success' : 'empty', filtered);
});

/* ============================================================
   10. 폼 유효성 검사 & 전송
   상태 흐름:
     submit → 각 필드 검증(상태) → 에러 표시/숨김(DOM) → 성공 시 전송
   ============================================================ */

const contactFormEl = document.getElementById('contact-form');
const formSuccessEl = document.getElementById('form-success');
const submitBtnEl   = document.getElementById('submit-btn');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showFieldError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add('error');
  document.getElementById(errorId).textContent = message;
}

function clearFieldError(inputId, errorId) {
  document.getElementById(inputId).classList.remove('error');
  document.getElementById(errorId).textContent = '';
}

// 입력 시 즉시 에러 제거
['name', 'email', 'message'].forEach(function (id) {
  document.getElementById(id).addEventListener('input', function () {
    clearFieldError(id, id + '-error');
  });
});

function validateForm() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  let isValid   = true;

  if (!name) {
    showFieldError('name', 'name-error', '이름을 입력해 주세요.');
    isValid = false;
  }

  if (!email) {
    showFieldError('email', 'email-error', '이메일을 입력해 주세요.');
    isValid = false;
  } else if (!EMAIL_REGEX.test(email)) {
    showFieldError('email', 'email-error', '올바른 이메일 형식이 아닙니다.');
    isValid = false;
  }

  if (!message) {
    showFieldError('message', 'message-error', '메시지를 입력해 주세요.');
    isValid = false;
  }

  return isValid;
}

contactFormEl.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  submitBtnEl.disabled    = true;
  submitBtnEl.innerHTML   = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> 전송 중...';

  try {
    if (FORMSPREE_ENDPOINT) {
      // Bonus: Formspree 실제 전송
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error('전송 실패');
    } else {
      // 미연동 시 성공 시뮬레이션
      await new Promise(function (resolve) { setTimeout(resolve, 1000); });
    }

    contactFormEl.reset();
    formSuccessEl.removeAttribute('hidden');
    formSuccessEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(function () {
      formSuccessEl.setAttribute('hidden', '');
    }, 5000);

  } catch (err) {
    console.error('[Form Submit Error]', err);
    showFieldError('message', 'message-error', '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
  } finally {
    submitBtnEl.disabled  = false;
    submitBtnEl.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> 메시지 보내기';
  }
});

/* ============================================================
   11. 푸터 연도 자동 업데이트
   ============================================================ */

const footerYearEl = document.getElementById('footer-year');
if (footerYearEl) {
  footerYearEl.textContent = new Date().getFullYear();
}

/* ============================================================
   12. 초기화 (script defer 로 DOMContentLoaded 보장됨)
   ============================================================ */

function init() {
  loadInitialTheme();
  handleScroll();
  startTypingEffect();
  fetchRepos();
}

init();
