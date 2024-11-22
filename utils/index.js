'use client';

window.addEventListener('load', function () {
	$('.loading').addClass('loaded');

	// 固定要素の設定
	const header = $('.l-header');
	const pagetop = $('.c-pagetop');
	const headerDiv = $('<div class="scroll l-header">').append(header.clone().contents());
	let headerHeight = header.innerHeight();
	headerDiv.appendTo('body');

	// スクロール時
	const updateHeaderPosition = function () {
		const scrollTop = $(window).scrollTop();
		headerDiv.css('top', scrollTop > 300 ? 0 : -headerHeight);
		scrollTop > 300 ? pagetop.fadeIn() : pagetop.fadeOut();

		const blog = $('.blog');

		// フッターの位置を取得
		const blogPosition = blog.offset().top;
		const scrollPosition = $(window).scrollTop() + $(window).height();

		// スクロール位置がフッターに達したかどうかを確認
		if (scrollPosition >= blogPosition) {
			pagetop.addClass('on-white');
		} else {
			pagetop.removeClass('on-white');
		}
	};
	updateHeaderPosition();
	$(window).on('scroll', updateHeaderPosition);

	// ページ内リンク
	const scrollAnimate = function (ele) {
		$(ele).on('click', function (event) {
			event.preventDefault();
			const href = $(this).attr('href');
			const target = $(href === '#' || href === '' ? 'html' : href);
			const position = target.offset().top - headerHeight;
			$('html, body').animate({ scrollTop: position }, 500, 'swing');
		});
	};
	scrollAnimate('a[href^="#"]');

	// ページ遷移の位置
	const hash = $(location).attr('hash');
	if (hash) {
		const target = $(hash).offset().top - headerHeight;
		$('html, body').animate({ scrollTop: target }, 0, 'swing');
	}

	// アコーディオン
	$('.accordion__detail').hide();
	$('.accordion__title').on('click', function () {
		$(this).next().slideToggle();
		$(this).children('.accordion__title-icon').toggleClass('open');
	});

	// ナビゲーションのカレント
	const currentUrl = window.location.href;
	const currentPath = window.location.pathname;

	$('.l-header__navigation a, .l-footer__navigation a').each(function () {
		const linkUrl = $(this).attr('href');
		const linkPath = new URL(linkUrl, window.location.origin).pathname;

		if (linkUrl === currentUrl) {
			$(this).addClass('current');
		} else {
			const linkPathParts = linkPath.split('/').filter((part) => part !== '');
			const currentPathParts = currentPath.split('/').filter((part) => part !== '');

			if (
				linkPathParts.length > 1 &&
				currentPath.startsWith(linkPath) &&
				currentPathParts.length > linkPathParts.length
			) {
				$(this).addClass('current');
			}
		}
	});

	// 添付ファイル
	$('.attachment-fileinput').on('change', function () {
		const file = $(this).prop('files')[0];
		$(this).closest('.attachment').find('.attachment-filename').text(file.name);
	});

	// 波打つ
	var unit = 80,
		canvasList, // キャンバスの配列
		info = {}, // 全キャンバス共通の描画情報
		colorList; // 各キャンバスの色情報

	function init() {
		info.seconds = 0;
		info.t = 0;
		canvasList = [];
		colorList = [];
		// canvas1個めの色指定
		canvasList.push(document.getElementById('waveCanvas'));
		colorList.push(['#f36b0a', '#f36b0a', '#f36b0a']);
		// 各キャンバスの初期化
		for (var canvasIndex in canvasList) {
			var canvas = canvasList[canvasIndex];
			canvas.width = document.documentElement.clientWidth;
			canvas.height = 100;
			canvas.contextCache = canvas.getContext('2d');
		}

		update();
	}

	function update() {
		for (var canvasIndex in canvasList) {
			var canvas = canvasList[canvasIndex];
			// 各キャンバスの描画
			draw(canvas, colorList[canvasIndex]);
		}
		// 共通の描画情報の更新
		info.seconds = info.seconds + 0.014;
		info.t = info.seconds * Math.PI;
		// 自身の再起呼び出し
		setTimeout(update, 35);
	}

	function draw(canvas, color) {
		// 対象のcanvasのコンテキストを取得
		var context = canvas.contextCache;
		// キャンバスの描画をクリア
		context.clearRect(0, 0, canvas.width, canvas.height);

		//波の重なりを描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ )
		drawWave(canvas, color[0], 1, 3, 0); //0.5⇒透過具合50%、3⇒数字が大きいほど波がなだらか
		drawWave(canvas, color[1], 0.6, 2, 250);
		drawWave(canvas, color[2], 0.3, 1.6, 100);
	}

	/**
	 * 波を描画
	 * drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
	 */
	function drawWave(canvas, color, alpha, zoom, delay) {
		var context = canvas.contextCache;
		context.fillStyle = color; //塗りの色
		context.globalAlpha = alpha;
		context.beginPath(); //パスの開始
		drawSine(canvas, info.t / 0.5, zoom, delay);
		context.lineTo(canvas.width + 10, canvas.height); //パスをCanvasの右下へ
		context.lineTo(0, canvas.height); //パスをCanvasの左下へ
		context.closePath(); //パスを閉じる
		context.fill(); //波を塗りつぶす
	}

	/**
	 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
	 */
	function drawSine(canvas, t, zoom, delay) {
		var xAxis = Math.floor(canvas.height / 2);
		var yAxis = 0;
		var context = canvas.contextCache;
		// Set the initial x and y, starting at 0,0 and translating to the origin on
		// the canvas.
		var x = t; //時間を横の位置とする
		var y = Math.sin(x) / zoom;
		context.moveTo(yAxis, unit * y + xAxis); //スタート位置にパスを置く

		// Loop to draw segments (横幅の分、波を描画)
		for (i = yAxis; i <= canvas.width + 10; i += 10) {
			x = t + (-yAxis + i) / unit / zoom;
			y = Math.sin(x - delay) / 3;
			context.lineTo(i, unit * y + xAxis);
		}
	}

	init();

	// PC向け
	function initPCMenu() {}

	function initSPMenu() {
		const menuBtn = $('.l-header__menuBtn,.l-header__link a');

		menuBtn.off('click').on('click', function () {
			$('body').toggleClass('no-scroll');
			$(this).closest('.l-header').find('.l-header__link').toggleClass('menu-open');

			if (menuBtn.hasClass('open')) {
				menuBtn.removeClass('open').addClass('close');
			} else {
				menuBtn.removeClass('close').addClass('open');
			}
		});
	}

	function handleResize() {
		const mediaQueryListPC = window.matchMedia('(min-width: 1041px)');
		const mediaQueryListSP = window.matchMedia('(max-width: 1040px)');

		// PC用メニューの設定
		if (mediaQueryListPC.matches) {
			initPCMenu();
		}

		// SP用メニューの設定
		if (mediaQueryListSP.matches) {
			initSPMenu();
		}
	}

	// 初期化
	handleResize();

	// ウィンドウサイズ変更時に再度イベントバインド
	$(window).on('resize', function () {
		handleResize();
	});
});
