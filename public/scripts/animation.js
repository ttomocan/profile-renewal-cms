'use client';

// アニメーションを適用する汎用関数
function applyAnimation(triggerClass, animationClass, offset = 0) {
  $(triggerClass).each(function () {
    const elemPos = $(this).offset().top + offset;
    const scroll = $(window).scrollTop();
    const windowHeight = $(window).height();
    if (scroll >= elemPos - windowHeight) {
      $(this).addClass(animationClass);
    } else {
      $(this).removeClass(animationClass);
    }
  });
}

// 動きのきっかけの起点となるアニメーションの名前を定義
function fadeAnime() {
  // トリガーとアニメーションの対応表
  const animations = [
    { trigger: '.circle', animation: 'circle-on', offset: -100 },
    { trigger: '.fadeInTrigger', animation: 'fadeIn', offset: -100 },
    { trigger: '.fadeUpTrigger', animation: 'fadeUp', offset: 150 },
    { trigger: '.fadeDownTrigger', animation: 'fadeDown', offset: 100 },
    { trigger: '.fadeLeftTrigger', animation: 'fadeLeft', offset: 100 },
    { trigger: '.fadeRightTrigger', animation: 'fadeRight', offset: 40 },
    { trigger: '.flipDownTrigger', animation: 'flipDown', offset: -50 },
    { trigger: '.flipLeftTrigger', animation: 'flipLeft', offset: -50 },
    { trigger: '.flipLeftTopTrigger', animation: 'flipLeftTop', offset: -50 },
    { trigger: '.flipRightTrigger', animation: 'flipRight', offset: -50 },
    { trigger: '.flipRightTopTrigger', animation: 'flipRightTop', offset: -50 },
    { trigger: '.rotateXTrigger', animation: 'rotateX', offset: -50 },
    { trigger: '.rotateYTrigger', animation: 'rotateY', offset: -50 },
    { trigger: '.rotateLeftZTrigger', animation: 'rotateLeftZ', offset: -50 },
    { trigger: '.rotateRightZTrigger', animation: 'rotateRightZ', offset: -50 },
    { trigger: '.zoomInTrigger', animation: 'zoomIn', offset: -50 },
    { trigger: '.zoomOutTrigger', animation: 'zoomOut', offset: -50 },
    { trigger: '.blurTrigger', animation: 'blur', offset: -50 },
    { trigger: '.smoothTrigger', animation: 'smooth', offset: -50 },
    { trigger: '.lineTrigger', animation: 'lineanime', offset: -50 },
    { trigger: '.bgLRextendTrigger', animation: 'bgLRextend', offset: -50 },
    { trigger: '.bgRLextendTrigger', animation: 'bgRLextend', offset: -50 },
    { trigger: '.bgDUextendTrigger', animation: 'bgDUextend', offset: -50 },
    { trigger: '.bgUDextendTrigger', animation: 'bgUDextend', offset: -50 },
    { trigger: '.bgappearTrigger', animation: 'bgappear', offset: -50 },
  ];

  // 各トリガーに対してアニメーションを適用
  animations.forEach(({ trigger, animation, offset }) => {
    applyAnimation(trigger, animation, offset);
  });
}

// 画面をスクロールしたらアニメーションを実行
$(window).scroll(function () {
  fadeAnime();
});

// 画面が読み込まれたらアニメーションを実行
$(window).on('load', function () {
  fadeAnime();
});
