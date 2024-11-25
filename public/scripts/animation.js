'use client';

function fadeAnime() {
  // ふわっと表示するトリガーの処理
  document.querySelectorAll('.fadeInTrigger').forEach((element) => {
    const elemPos = element.getBoundingClientRect().top + window.pageYOffset - 100;
    const scroll = window.scrollY;
    const windowHeight = window.innerHeight;
    if (scroll >= elemPos - windowHeight) {
      element.classList.add('fadeIn');
    } else {
      element.classList.remove('fadeIn');
    }
  });

  // その他のアニメーション処理も同様に変換
  const animationTypes = [
    { selector: '.fadeUpTrigger', classToAdd: 'fadeUp', offset: 150 },
    { selector: '.fadeDownTrigger', classToAdd: 'fadeDown', offset: 100 },
    { selector: '.fadeLeftTrigger', classToAdd: 'fadeLeft', offset: 100 },
    { selector: '.fadeRightTrigger', classToAdd: 'fadeRight', offset: 40 },
    { selector: '.flipDownTrigger', classToAdd: 'flipDown', offset: 200 },
    { selector: '.flipLeftTrigger', classToAdd: 'flipLeft', offset: -50 },
    { selector: '.flipLeftTopTrigger', classToAdd: 'flipLeftTop', offset: -50 },
    { selector: '.flipRightTrigger', classToAdd: 'flipRight', offset: -50 },
    { selector: '.flipRightTopTrigger', classToAdd: 'flipRightTop', offset: -50 },
    { selector: '.rotateXTrigger', classToAdd: 'rotateX', offset: -50 },
    { selector: '.rotateYTrigger', classToAdd: 'rotateY', offset: -50 },
    { selector: '.rotateLeftZTrigger', classToAdd: 'rotateLeftZ', offset: -50 },
    { selector: '.rotateRightZTrigger', classToAdd: 'rotateRightZ', offset: -50 },
  ];

  animationTypes.forEach((type) => {
    document.querySelectorAll(type.selector).forEach((element) => {
      const elemPos = element.getBoundingClientRect().top + window.pageYOffset + type.offset;
      const scroll = window.scrollY;
      const windowHeight = window.innerHeight;
      if (scroll >= elemPos - windowHeight) {
        element.classList.add(type.classToAdd);
      } else {
        element.classList.remove(type.classToAdd);
      }
    });
  });
}

// スクロールとロードイベントにリスナーを追加
window.addEventListener('scroll', fadeAnime);
window.addEventListener('load', fadeAnime);
