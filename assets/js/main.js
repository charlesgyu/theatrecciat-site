// 극단 씨앗 — 공통 동작
(function () {
  var header = document.querySelector('.header');
  var topBtn = document.querySelector('.quick__top');

  // 스크롤 시 헤더 배경, TOP 버튼
  function onScroll() {
    var y = window.scrollY;
    header && header.classList.toggle('is-scrolled', y > 60);
    topBtn && topBtn.classList.toggle('is-show', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  topBtn && topBtn.addEventListener('click', function () { window.scrollTo({ top: 0 }); });

  // 메인 영상: 장면에 맞춰 공연 종류 표시
  var heroVideo = document.querySelector('.mv video[data-cues]');
  var nowLabel = document.querySelector('.mv__now b');
  if (heroVideo && nowLabel) {
    var cues = heroVideo.dataset.cues.split(',');
    var sec = parseFloat(heroVideo.dataset.cueSec) || 2;
    var last = -1;
    heroVideo.addEventListener('timeupdate', function () {
      var i = Math.min(cues.length - 1, Math.floor(heroVideo.currentTime / sec));
      if (i === last) return;
      last = i;
      nowLabel.textContent = cues[i];
      nowLabel.classList.remove('is-change');
      void nowLabel.offsetWidth;
      nowLabel.classList.add('is-change');
    });
  }

  // 모바일 메뉴
  var mNav = document.querySelector('.m-nav');
  var menuBtn = document.querySelector('.menu-btn');
  function setMenu(open) {
    mNav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) mNav.querySelector('.m-nav__close').focus(); else menuBtn.focus();
  }
  menuBtn && menuBtn.addEventListener('click', function () { setMenu(true); });
  mNav && mNav.querySelector('.m-nav__close').addEventListener('click', function () { setMenu(false); });

  // 스크롤 등장 효과
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // 분류 탭 (ALL / 분류별 보기)
  document.querySelectorAll('[data-tabs]').forEach(function (tabs) {
    var grid = document.getElementById(tabs.dataset.tabs);
    tabs.addEventListener('click', function (e) {
      var btn = e.target.closest('.tab');
      if (!btn) return;
      tabs.querySelectorAll('.tab').forEach(function (t) {
        t.classList.toggle('is-active', t === btn);
        t.setAttribute('aria-pressed', t === btn);
      });
      var f = btn.dataset.filter;
      grid.querySelectorAll('.card').forEach(function (c) {
        c.hidden = f !== 'all' && c.dataset.group !== f;
      });
    });
    // 주소 끝의 #분류 로 들어오면 해당 탭을 연다 (예: puppet.html#edu)
    var hashTab = location.hash && tabs.querySelector('[data-filter="' + location.hash.slice(1) + '"]');
    if (hashTab) hashTab.click();
  });

  // 작품 상세 모달
  var modal = document.querySelector('.modal');
  if (!modal) return;
  var lastFocus = null;
  function openModal(id) {
    var tpl = document.getElementById('detail-' + id);
    if (!tpl) return;
    modal.querySelector('.modal__cat').textContent = tpl.dataset.cat || '';
    modal.querySelector('.modal__title').textContent = tpl.dataset.title;
    var body = modal.querySelector('.modal__body');
    body.innerHTML = '';
    body.appendChild(tpl.content.cloneNode(true));
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__box').scrollTop = 0;
    modal.querySelector('.modal__close').focus();
  }
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var card = e.target.closest('[data-detail]');
    if (card) { e.preventDefault(); openModal(card.dataset.detail); }
  });
  modal.querySelector('.modal__close').addEventListener('click', closeModal);
  modal.querySelector('.modal__dim').addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('is-open')) closeModal();
    else if (mNav && mNav.classList.contains('is-open')) setMenu(false);
  });
})();
