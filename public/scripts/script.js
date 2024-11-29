if (typeof window !== 'undefined') {
  window.addEventListener('load', function () {
    // Loadingアニメーション
    document.querySelectorAll('.loading').forEach((el) => {
      const fadeOutDuration = 300;

      el.style.transition = `opacity ${fadeOutDuration / 1000}s`;
      el.style.opacity = 0;

      // フェードアウト後に非表示
      el.addEventListener(
        'transitionend',
        () => {
          el.style.display = 'none';
        },
        { once: true }
      );
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

    // スムーススクロール処理
    function handleSmoothScroll(event) {
      const anchor = event.currentTarget;

      // スムーススクロールのキャンセルを処理
      if (!anchor.matches('.l-header__link a')) {
        event.preventDefault();
      }

      const href = anchor.getAttribute('href');
      const target = document.querySelector(href === '#' || href === '' ? 'html' : href);
      const position = (target?.offsetTop || 0) - headerHeight;

      window.scrollTo({
        top: position,
        behavior: 'smooth',
      });
    }

    // スムーススクロール処理を特定のアンカーリンクに適用
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    // ページ遷移時の位置
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      const position = (target?.offsetTop || 0) - headerHeight;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }

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
      waveCanvas.contextCache = waveCanvas.getContext('2d');
      updateCanvasSize(waveCanvas); // 初期サイズの設定
    }

    let animationFrameId; // アニメーションのIDを保持
    let resizeTimeout; // リサイズ処理をデバウンスするためのタイマー

    // キャンバスのサイズを更新
    function updateCanvasSize(canvas) {
      canvas.width = document.documentElement.clientWidth;
      canvas.height = 100;
    }

    // 描画処理
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

    // アニメーションの更新処理
    function update() {
      canvasList.forEach((canvas, index) => draw(canvas, colorList[index]));
      info.seconds += 0.005; // 波の速さをゆっくりに（元は0.014）
      info.t = info.seconds * Math.PI;
      animationFrameId = requestAnimationFrame(update); // アニメーションフレームを使用
    }

    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId); // アニメーションを一時停止
      resizeTimeout = setTimeout(() => {
        canvasList.forEach((canvas) => updateCanvasSize(canvas)); // キャンバスのサイズ更新
        info.seconds = 0; // アニメーションをリセット
        update(); // アニメーション再開
      }, 200); // 200msのデバウンス
    });

    // アニメーションの開始
    if (canvasList.length > 0) update();

    // メディアクエリ
    function handleResize() {
      if (window.matchMedia('(min-width: 1041px)').matches) {
      } else if (window.matchMedia('(max-width: 1040px)').matches) {
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
  });
}
