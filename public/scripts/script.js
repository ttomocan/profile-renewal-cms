window.addEventListener('load', function () {
  // ロード後にクラスを追加
  document.querySelector('.loading')?.classList.add('loaded');

  // 固定要素の設定
  const header = document.querySelector('.l-header');
  const pagetop = document.querySelector('.c-pagetop');
  const headerClone = header?.cloneNode(true);
  const headerDiv = document.createElement('div');
  headerDiv.className = 'scroll l-header';
  headerDiv.appendChild(headerClone?.firstChild);
  document.body.appendChild(headerDiv);
  const headerHeight = header?.offsetHeight || 0;

  // スクロール時
  const updateHeaderPosition = function () {
    const scrollTop = window.scrollY;

    // ヘッダーの表示切り替え
    headerDiv.style.top = scrollTop > 300 ? '0' : `-${headerHeight}px`;

    // ページトップボタンの表示切り替え
    if (scrollTop > 300) {
      pagetop?.classList.add('show');
    } else {
      pagetop?.classList.remove('show');
    }

    // フッターの位置を確認
    const blog = document.querySelector('.blog');
    const blogPosition = blog?.getBoundingClientRect().top + window.scrollY || 0;
    const scrollPosition = window.scrollY + window.innerHeight;

    if (scrollPosition >= blogPosition) {
      pagetop?.classList.add('on-white');
    } else {
      pagetop?.classList.remove('on-white');
    }
  };

  updateHeaderPosition();
  window.addEventListener('scroll', updateHeaderPosition);

  // ページ内リンク
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const href = this.getAttribute('href');
      const target = document.querySelector(href === '#' || href === '' ? 'html' : href);
      const position = (target?.offsetTop || 0) - headerHeight;
      window.scrollTo({ top: position, behavior: 'smooth' });
    });
  });

  // ページ遷移時の位置
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    const position = (target?.offsetTop || 0) - headerHeight;
    window.scrollTo({ top: position, behavior: 'smooth' });
  }

  // アコーディオン
  document.querySelectorAll('.accordion__detail').forEach((detail) => {
    detail.style.display = 'none';
  });

  document.querySelectorAll('.accordion__title').forEach((title) => {
    title.addEventListener('click', function () {
      const detail = this.nextElementSibling;
      detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
      this.querySelector('.accordion__title-icon')?.classList.toggle('open');
    });
  });

  // ナビゲーションのカレント
  const currentUrl = window.location.href;
  const currentPath = window.location.pathname;

  document.querySelectorAll('.l-header__navigation a, .l-footer__navigation a').forEach((link) => {
    const linkUrl = link.getAttribute('href');
    if (!linkUrl) return;

    const linkPath = new URL(linkUrl, window.location.origin).pathname;
    if (linkUrl === currentUrl) {
      link.classList.add('current');
    } else {
      const linkPathParts = linkPath.split('/').filter((part) => part !== '');
      const currentPathParts = currentPath.split('/').filter((part) => part !== '');

      if (linkPathParts.length > 1 && currentPath.startsWith(linkPath) && currentPathParts.length > linkPathParts.length) {
        link.classList.add('current');
      }
    }
  });

  // 添付ファイル
  document.querySelectorAll('.attachment-fileinput').forEach((input) => {
    input.addEventListener('change', function () {
      const file = this.files[0];
      const filenameElement = this.closest('.attachment')?.querySelector('.attachment-filename');
      if (filenameElement) {
        filenameElement.textContent = file.name;
      }
    });
  });

  // 波のアニメーション
  const unit = 80;
  const canvasList = [];
  const colorList = [];
  const info = { seconds: 0, t: 0 };

  const waveCanvas = document.getElementById('waveCanvas');
  if (waveCanvas) {
    canvasList.push(waveCanvas);
    colorList.push(['#f36b0a', '#f36b0a', '#f36b0a']);
    waveCanvas.width = document.documentElement.clientWidth;
    waveCanvas.height = 100;
    waveCanvas.contextCache = waveCanvas.getContext('2d');
  }

  function draw(canvas, color) {
    const context = canvas.contextCache;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawWave(canvas, color[0], 1, 3, 0);
    drawWave(canvas, color[1], 0.6, 2, 250);
    drawWave(canvas, color[2], 0.3, 1.6, 100);
  }

  function drawWave(canvas, color, alpha, zoom, delay) {
    const context = canvas.contextCache;
    context.fillStyle = color;
    context.globalAlpha = alpha;
    context.beginPath();
    drawSine(canvas, info.t / 0.5, zoom, delay);
    context.lineTo(canvas.width + 10, canvas.height);
    context.lineTo(0, canvas.height);
    context.closePath();
    context.fill();
  }

  function drawSine(canvas, t, zoom, delay) {
    const context = canvas.contextCache;
    const xAxis = Math.floor(canvas.height / 2);
    let x = t;
    let y = Math.sin(x) / zoom;
    context.moveTo(0, unit * y + xAxis);
    for (let i = 0; i <= canvas.width + 10; i += 10) {
      x = t + (i - 0) / unit / zoom;
      y = Math.sin(x - delay) / 3;
      context.lineTo(i, unit * y + xAxis);
    }
  }

  function update() {
    canvasList.forEach((canvas, index) => draw(canvas, colorList[index]));
    info.seconds += 0.014;
    info.t = info.seconds * Math.PI;
    setTimeout(update, 35);
  }

  if (canvasList.length > 0) update();

  // メニュー設定
  function initSPMenu() {
    const menuButtons = document.querySelectorAll('.l-header__menuBtn,.l-header__link a');
    menuButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        document.body.classList.toggle('no-scroll');
        document.querySelector('.l-header__link')?.classList.toggle('menu-open');
        btn.classList.toggle('open');
        btn.classList.toggle('close');
      });
    });
  }

  function handleResize() {
    if (window.matchMedia('(min-width: 1041px)').matches) {
      // PCメニューの初期化
    } else if (window.matchMedia('(max-width: 1040px)').matches) {
      initSPMenu();
    }
  }

  handleResize();
  window.addEventListener('resize', handleResize);
});
