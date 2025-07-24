function fadeAnime() {
  // クライアントサイドのみで実行されることを確認
  if (typeof window === 'undefined') return;

  const handleAnimation = (elements, classToAdd, offset = 0) => {
    elements.forEach((element) => {
      // すでにクラスが追加されている場合はスキップ
      if (element.classList.contains(classToAdd)) return;

      const elemPos = element.getBoundingClientRect().top + window.pageYOffset + offset;
      const scroll = window.scrollY;
      const windowHeight = window.innerHeight;
      if (scroll >= elemPos - windowHeight) {
        element.classList.add(classToAdd);
      }
    });
  };

  const animationTypes = [
    { selector: '.fadeInTrigger', classToAdd: 'fadeIn', offset: -100 },
    { selector: '.fadeUpTrigger', classToAdd: 'fadeUp', offset: 150 },
    { selector: '.fadeDownTrigger', classToAdd: 'fadeDown', offset: 100 },
    { selector: '.fadeLeftTrigger', classToAdd: 'fadeLeft', offset: 100 },
    { selector: '.fadeRightTrigger', classToAdd: 'fadeRight', offset: 40 },
    { selector: '.flipDownTrigger', classToAdd: 'flipDown', offset: 150 },
    { selector: '.flipLeftTrigger', classToAdd: 'flipLeft', offset: -50 },
    { selector: '.flipLeftTopTrigger', classToAdd: 'flipLeftTop', offset: -50 },
    { selector: '.flipRightTrigger', classToAdd: 'flipRight', offset: -50 },
    { selector: '.flipRightTopTrigger', classToAdd: 'flipRightTop', offset: -50 },
    { selector: '.rotateXTrigger', classToAdd: 'rotateX', offset: -50 },
    { selector: '.rotateYTrigger', classToAdd: 'rotateY', offset: -50 },
    { selector: '.rotateLeftZTrigger', classToAdd: 'rotateLeftZ', offset: -50 },
    { selector: '.rotateRightZTrigger', classToAdd: 'rotateRightZ', offset: -50 },
  ];

  animationTypes.forEach(({ selector, classToAdd, offset }) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      handleAnimation(elements, classToAdd, offset);
    }
  });
}

// クライアントサイドでのみスクリプトを実行
if (typeof window !== 'undefined') {
  // DOMContentLoadedを待ってからイベントリスナーを設定
  document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', fadeAnime);
    // 初期表示時にもアニメーションを適用
    setTimeout(fadeAnime, 100);
  });
}
