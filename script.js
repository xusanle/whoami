$(document).ready(function() {
    // 预加载器
    setTimeout(function() {
        $('#loader').addClass('hidden'); // 淡出隐藏
    }, 500); // 0.5秒后隐藏

    const $mainMenuLinks = $('.main-menu .nav-link');
    const $homeListScrollItems = $('.home-list-scroll .scrollie');
    const $homeListTriggerItems = $('.home-list .hi'); // 左侧用于触发滚动的元素

    // 初始化加载第一个图片/视频
    function loadMedia(item) {
        if (!$(item).data('loaded')) {
            const src = $(item).data('src');
            const type = $(item).data('type');
            $(item).empty(); // 清空原有内容

            if (type === 'image') {
                const img = $('<img>').attr('src', src).attr('alt', '作品展示');
                $(item).append(img);
            } else if (type === 'video') {
                const video = $('<video>').attr({
                    'src': src,
                    'autoplay': true,
                    'loop': true,
                    'muted': true,
                    'playsinline': true // 移动设备内联播放
                });
                $(item).append(video);
                video[0].load();
                video[0].play().catch(e => console.error("Video autoplay error:", e));
            }
            $(item).data('loaded', true);
        }
    }

    // 默认加载第一个图片
    if ($homeListScrollItems.length > 0 && $homeListScrollItems.eq(0).hasClass('media-item')) {
        loadMedia($homeListScrollItems.eq(0));
        $homeListScrollItems.eq(0).addClass('active');
    } else if ($homeListScrollItems.length > 0 && $homeListScrollItems.eq(0).hasClass('content-text-block')) {
        // 如果第一个是文本区块，默认也激活它
        $homeListScrollItems.eq(0).addClass('active');
    }


    // 监听页面滚动，根据滚动位置激活对应的图片或文本区块
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // 当50%的元素进入视口时触发
    };

    const scrollieObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 确保只有一个 active 图片/文本
                $homeListScrollItems.removeClass('active');
                // 暂停所有视频，除了当前活跃的
                $('.home-list-scroll .media-item video').each(function() {
                    this.pause();
                });

                $(entry.target).addClass('active');
                
                // 加载当前活跃的媒体
                if ($(entry.target).hasClass('media-item')) {
                    loadMedia(entry.target);
                    const video = $(entry.target).find('video')[0];
                    if (video) video.play().catch(e => console.error("Video autoplay error:", e));
                }

                // 激活主导航链接
                let targetId = $(entry.target).attr('id');
                if (targetId === 'hero-intro') { // 如果在顶部介绍区，导航激活 About me
                     targetId = 'about';
                }

                $mainMenuLinks.removeClass('active');
                $mainMenuLinks.filter(`[href="#${targetId}"]`).addClass('active');
            }
        });
    }, observerOptions);

    // 观察 home-list-scroll 中的所有 scrollie 元素
    $homeListScrollItems.each(function() {
        scrollieObserver.observe(this);
    });

    // 导航链接点击平滑滚动
    $mainMenuLinks.on('click', function(e) {
        const targetHref = $(this).attr('href');
        if (targetHref.startsWith('#')) { // 内部链接
            e.preventDefault();
            const targetId = targetHref.substring(1);
            const $targetElement = $(`#${targetId}`);
            if ($targetElement.length) {
                // 滚动到对应的 home-list-scroll 里的 scrollie 元素
                $('html, body').animate({
                    scrollTop: $targetElement.offset().top
                }, 800);
            }
        }
        // 外部链接不阻止默认行为
    });

    // 小屏幕下，导航链接点击时，为了模拟大屏的滚动效果，也滚动到对应的内容
    // (因为小屏幕下 home-list 是隐藏的，需要手动处理)
    if ($(window).width() <= 1024) {
         $('.main-menu').on('click', '.nav-link', function(e) {
            const targetHref = $(this).attr('href');
            if (targetHref.startsWith('#')) {
                e.preventDefault();
                const targetId = targetHref.substring(1);
                const $targetElement = $(`#${targetId}`);
                if ($targetElement.length) {
                    $('html, body').animate({
                        scrollTop: $targetElement.offset().top - $('#header').outerHeight() // 减去头部高度
                    }, 800);
                }
            }
        });
    }

});
