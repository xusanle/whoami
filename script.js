document.addEventListener('DOMContentLoaded', () => {
    // 图片轮播功能
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function showNextImage() {
        carouselItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % carouselItems.length;
        carouselItems[currentIndex].classList.add('active');
    }

    // 每3秒切换一次图片
    setInterval(showNextImage, 3000);

    // 平滑滚动功能
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // 计算滚动位置，考虑固定头部的高度（如果需要）
                // 由于我们的小屏幕已经取消了固定头部，这里可以简化
                // 但为了保险，还是可以加上偏移量
                const offset = 80; // 根据你的设计调整，确保标题不会被遮挡
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // 更新导航链接的激活状态 (可选，但推荐)
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
            const sectionTop = section.offsetTop - 100; // 稍微提前激活
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                currentActive = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === currentActive + '-section') { // 对应data-target的值
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
        threshold: 0.1 // 当元素10%可见时触发
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // 一旦动画完成就停止观察
            }
        });
    }, observerOptions);

    contentSections.forEach(section => {
        sectionObserver.observe(section);
    });

});
