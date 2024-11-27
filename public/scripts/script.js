if (typeof window !== 'undefined') {
  window.addEventListener('load', function () {
    // Loadingアニメーション
    document.querySelectorAll('.loading').forEach((el) => {
      el.style.transition = 'opacity 0.3s';
      el.style.opacity = 0;
      setTimeout(() => (el.style.display = 'none'), 300);
    });

    // 固定要素の設定
    const header = document.querySelector('.l-header');
    const pagetop = document.querySelector('.c-pagetop');
    // const headerClone = header?.cloneNode(true);
    // const headerDiv = document.createElement('div');
    // headerDiv.className = 'scroll l-header';
    // if (headerClone?.firstChild) headerDiv.appendChild(headerClone.firstChild);
    const headerHeight = header?.offsetHeight || 0;

    // スクロール時
    const updateHeaderPosition = () => {
      const scrollTop = window.scrollY;

      // ページトップボタンの表示切り替え
      if (pagetop) {
        pagetop.classList.toggle('show', scrollTop > 300);

        const blog = document.querySelector('.blog-area');
        const blogPosition = blog?.getBoundingClientRect().top + window.scrollY || 0;
        const scrollPosition = window.scrollY + window.innerHeight;

        pagetop.classList.toggle('on-footer', scrollPosition >= blogPosition);
      }
    };
    updateHeaderPosition();
    window.addEventListener('scroll', updateHeaderPosition);

    // ページ内リンク
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        event.preventDefault();
        const href = anchor.getAttribute('href');
        const target = document.querySelector(href === '#' || href === '' ? 'html' : href);
        const position = (target?.offsetTop || 0) - headerHeight;

        window.scrollTo({
          top: position,
          behavior: 'smooth',
        });
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
      title.addEventListener('click', () => {
        const detail = title.nextElementSibling;
        if (detail) {
          detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
        }
        const icon = title.querySelector('.accordion__title-icon');
        if (icon) {
          icon.classList.toggle('open');
        }
      });
    });

    // 添付ファイル
    document.querySelectorAll('.attachment-fileinput').forEach((input) => {
      input.addEventListener('change', () => {
        const file = input.files[0];
        const filenameElement = input.closest('.attachment')?.querySelector('.attachment-filename');
        if (filenameElement && file) {
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
      const menuButtons = document.querySelectorAll('.l-header__menuBtn, .l-header__link a');

      // イベント処理関数
      function handleMenuToggle(event) {
        // デフォルトの挙動をキャンセル（タッチデバイスでクリックを防ぐため）
        if (event.type === 'touchstart') {
          event.preventDefault();
        }

        // メニュー開閉処理
        document.body.classList.toggle('no-scroll');
        document.querySelector('.l-header__link')?.classList.toggle('menu-open');

        const menuBtn = document.querySelector('.l-header__menuBtn');
        if (menuBtn.classList.contains('open')) {
          menuBtn.classList.remove('open');
          menuBtn.classList.add('close');
        } else {
          menuBtn.classList.remove('close');
          menuBtn.classList.add('open');
        }
      }

      // イベントの追加処理
      menuButtons.forEach((btn) => {
        if ('ontouchstart' in window) {
          // タッチデバイスの場合
          btn.addEventListener('touchstart', handleMenuToggle);
        } else {
          // 非タッチデバイスの場合
          btn.addEventListener('click', handleMenuToggle);
        }
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
}
