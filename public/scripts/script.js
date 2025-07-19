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

// ヘッダー管理クラス
class HeaderManager {
  constructor() {
    this.header = document.querySelector('.l-header');
    this.headerHeight = this.header?.offsetHeight || 0;
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
      const canvas = waveCanvas;
      const colors = ['#f36b0a', '#f36b0a', '#f36b0a'];
      this.canvasList.push(canvas);
      this.colorList.push(colors);
      waveCanvas.contextCache = waveCanvas.getContext('2d');
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
        this.info.seconds = 0;
        this.update();
      }, 200);
    });
  }

  draw(canvas, color) {
    const context = canvas.contextCache;
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawWave(canvas, color[0], 1, 3, 0);
    this.drawWave(canvas, color[1], 0.6, 2, 250);
    this.drawWave(canvas, color[2], 0.3, 1.6, 100);
  }

  drawWave(canvas, color, alpha, zoom, delay) {
    const context = canvas.contextCache;
    if (!context) return;

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
    if (!context) return;

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
  // DOMContentLoadedを待ってからスクリプトを実行
  document.addEventListener('DOMContentLoaded', () => {
    const headerManager = new HeaderManager();
    new SmoothScrollManager(headerManager.headerHeight);
    AttachmentManager.init();
    new WaveAnimationManager();
    MediaQueryManager.init();
  });
}
