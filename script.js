document.addEventListener('DOMContentLoaded', () => {
    // 图片/视频轮播功能
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    // 动态创建 img 或 video 元素并加载内容
    function loadMedia(item, src, type) {
        // 清空现有内容
        item.innerHTML = ''; 

        if (type === 'image') {
            const img = document.createElement('img');
            img.src = src;
            img.alt = "个人审美图片";
            item.appendChild(img);
        } else if (type === 'video') {
            const video = document.createElement('video');
            video.src = src;
            video.autoplay = true; // 自动播放
            video.loop = true;     // 循环播放
            video.muted = true;    // 静音 (自动播放通常需要静音)
            video.playsInline = true; // 移动设备内联播放
            item.appendChild(video);
            // 确保视频加载并开始播放
            video.load();
            video.play().catch(error => console.error("Video autoplay failed:", error));
        }
    }

    // 初始化加载第一个媒体
    const firstItem = carouselItems[currentIndex];
    loadMedia(firstItem, firstItem.dataset.src, firstItem.dataset.type);
    firstItem.classList.add('active');


    function showNextMedia() {
        const prevItem = carouselItems[currentIndex];
        // 如果是视频，暂停它
        const prevMedia = prevItem.querySelector('video');
        if (prevMedia) {
            prevMedia.pause();
        }
        prevItem.classList.remove('active');

        currentIndex = (currentIndex + 1) % carouselItems.length;
        const currentItem = carouselItems[currentIndex];
        
        // 加载并显示当前媒体
        loadMedia(currentItem, currentItem.dataset.src, currentItem.dataset.type);
        currentItem.classList.add('active');
    }

    // 每3秒切换一次媒体
    setInterval(showNextMedia, 3000);

    // 平滑滚动功能
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offset = 80; 
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                document.querySelectorAll('.main-nav ul li a').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // 页面滚动时检测当前活动区块，更新导航链接状态
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.main-nav ul li a[data-target]');

    function updateActiveNavLink() {
        let currentActive = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; 
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                currentActive = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === currentActive + '-section') { 
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // 页面加载时执行一次，设置初始状态

    // 内容区动画效果 (滚动时渐入)
    const contentSections = document.querySelectorAll('.content-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    contentSections.forEach(section => {
        sectionObserver.observe(section);
    });

});
