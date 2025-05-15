// 定数
const CONSTANTS = {
  FADE_OUT_DURATION: 300,
  SCROLL_THRESHOLD: 300,
  WAVE: {
    UNIT: 80,
    SPEED: 0.005,
    HEIGHT: 100,
  },
};

// ローディングアニメーション管理クラス
class LoadingManager {
  static init() {
    document.querySelectorAll('.loading').forEach((el) => {
      el.style.transition = `opacity ${CONSTANTS.FADE_OUT_DURATION / 1000}s`;
      el.style.opacity = 0;
      el.addEventListener(
        'transitionend',
        () => {
          el.style.display = 'none';
        },
        { once: true }
      );
    });
  }
}

// ヘッダー管理クラス
class HeaderManager {
  constructor() {
    this.header = document.querySelector('.l-header');
    this.pagetop = document.querySelector('.c-pagetop');
    this.headerHeight = this.header?.offsetHeight || 0;
    this.bindEvents();
  }

  bindEvents() {
    this.updateHeaderPosition = this.updateHeaderPosition.bind(this);
    window.addEventListener('scroll', this.updateHeaderPosition);
    this.updateHeaderPosition();
  }

  updateHeaderPosition() {
    const scrollTop = window.scrollY;
    if (this.pagetop) {
      this.pagetop.classList.toggle('show', scrollTop > CONSTANTS.SCROLL_THRESHOLD);
      const blog = document.querySelector('.blog-area');
      const blogPosition = blog?.getBoundingClientRect().top + window.scrollY || 0;
      const scrollPosition = window.scrollY + window.innerHeight;
      this.pagetop.classList.toggle('on-footer', scrollPosition >= blogPosition);
    }
  }
}

// スムーススクロール管理クラス
class SmoothScrollManager {
  constructor(headerHeight) {
    this.headerHeight = headerHeight;
    this.bindEvents();
    this.handleInitialHash();
  }

  bindEvents() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
    });
  }

  handleSmoothScroll(event) {
    const anchor = event.currentTarget;
    if (!anchor.matches('.l-header__link a')) {
      event.preventDefault();
    }

    const href = anchor.getAttribute('href');
    const target = document.querySelector(href === '#' || href === '' ? 'html' : href);
    const position = (target?.offsetTop || 0) - this.headerHeight;

    window.scrollTo({
      top: position,
      behavior: 'smooth',
    });
  }

  handleInitialHash() {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      const position = (target?.offsetTop || 0) - this.headerHeight;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  }
}

// 添付ファイル管理クラス
class AttachmentManager {
  static init() {
    document.querySelectorAll('.attachment-fileinput').forEach((input) => {
      input.addEventListener('change', () => {
        const file = input.files[0];
        const filenameElement = input.closest('.attachment')?.querySelector('.attachment-filename');
        if (filenameElement && file) {
          filenameElement.textContent = file.name;
        }
      });
    });
  }
}

// 波アニメーション管理クラス
class WaveAnimationManager {
  constructor() {
    this.canvasList = [];
    this.colorList = [];
    this.info = { seconds: 0, t: 0 };
    this.animationFrameId = null;
    this.resizeTimeout = null;
    this.init();
  }

  init() {
    const waveCanvas = document.getElementById('waveCanvas');
    if (waveCanvas) {
      this.canvasList.push(waveCanvas);
      this.colorList.push(['#f36b0a', '#f36b0a', '#f36b0a']);
      waveCanvas.contextCache = waveCanvas.getContext('2d');
      this.updateCanvasSize(waveCanvas);
    }

    if (this.canvasList.length > 0) {
      this.update();
      this.bindEvents();
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      cancelAnimationFrame(this.animationFrameId);
      this.resizeTimeout = setTimeout(() => {
        this.canvasList.forEach((canvas) => this.updateCanvasSize(canvas));
        this.info.seconds = 0;
        this.update();
      }, 200);
    });
  }

  updateCanvasSize(canvas) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = CONSTANTS.WAVE.HEIGHT;
  }

  draw(canvas, color) {
    const context = canvas.contextCache;
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawWave(canvas, color[0], 1, 3, 0);
    this.drawWave(canvas, color[1], 0.6, 2, 250);
    this.drawWave(canvas, color[2], 0.3, 1.6, 100);
  }

  drawWave(canvas, color, alpha, zoom, delay) {
    const context = canvas.contextCache;
    context.fillStyle = color;
    context.globalAlpha = alpha;
    context.beginPath();
    this.drawSine(canvas, this.info.t / 0.5, zoom, delay);
    context.lineTo(canvas.width + 10, canvas.height);
    context.lineTo(0, canvas.height);
    context.closePath();
    context.fill();
  }

  drawSine(canvas, t, zoom, delay) {
    const context = canvas.contextCache;
    const xAxis = Math.floor(canvas.height / 2);
    let x = t;
    let y = Math.sin(x) / zoom;
    context.moveTo(0, CONSTANTS.WAVE.UNIT * y + xAxis);

    for (let i = 0; i <= canvas.width + 10; i += 10) {
      x = t + (i - 0) / CONSTANTS.WAVE.UNIT / zoom;
      y = Math.sin(x - delay) / 3;
      context.lineTo(i, CONSTANTS.WAVE.UNIT * y + xAxis);
    }
  }

  update() {
    this.canvasList.forEach((canvas, index) => this.draw(canvas, this.colorList[index]));
    this.info.seconds += CONSTANTS.WAVE.SPEED;
    this.info.t = this.info.seconds * Math.PI;
    this.animationFrameId = requestAnimationFrame(() => this.update());
  }
}

// メディアクエリ管理クラス
class MediaQueryManager {
  static init() {
    const handleResize = () => {
      if (window.matchMedia('(min-width: 1041px)').matches) {
        // PC用の処理
      } else if (window.matchMedia('(max-width: 1040px)').matches) {
        // スマートフォン用の処理
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
  }
}

// アプリケーション初期化
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    LoadingManager.init();
    const headerManager = new HeaderManager();
    new SmoothScrollManager(headerManager.headerHeight);
    AttachmentManager.init();
    new WaveAnimationManager();
    MediaQueryManager.init();
  });
}
