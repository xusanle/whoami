document.addEventListener('DOMContentLoaded', () => {

    const textSections = document.querySelectorAll('.text-content-column .content-section');
    const galleryItems = document.querySelectorAll('.image-gallery .gallery-item');
    const navLinks = document.querySelectorAll('.main-nav-center .nav-link');
    
    // 用于加载图片或视频
    function loadMedia(item, src, type) {
        if (!item.dataset.loaded) { // 防止重复加载
            item.innerHTML = ''; // 清空占位内容
            if (type === 'image') {
                const img = document.createElement('img');
                img.src = src;
                img.alt = "作品展示";
                item.appendChild(img);
            } else if (type === 'video') {
                const video = document.createElement('video');
                video.src = src;
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                item.appendChild(video);
                video.load();
                video.play().catch(e => console.error("Video autoplay error:", e));
            }
            item.dataset.loaded = 'true';
        }
    }

    // Intersection Observer for Text Sections
    const sectionObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // 当30%的区块可见时触发
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const targetId = entry.target.id;

            // 内容渐入动画
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // 如果内容离开视口，可以考虑重置动画，或者只在进入时触发
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
            }

            // 更新导航链接的激活状态和图片显示
            if (entry.isIntersecting) {
                // 激活当前区块对应的导航链接
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.add('active');
                    } else if (targetId === 'hero-intro' && link.getAttribute('href') === '#about') {
                        // 如果在第一个介绍区，导航默认激活About
                        link.classList.add('active');
                    }
                });

                // 根据当前活跃的文本区块，显示对应的图片
                // 假设每个文本区块对应一个图片，或者按顺序对应
                let imageIndex = Array.from(textSections).indexOf(entry.target);
                if (imageIndex >= 0 && imageIndex < galleryItems.length) {
                    galleryItems.forEach((item, idx) => {
                        item.classList.remove('active');
                        // 暂停非活跃视频
                        const video = item.querySelector('video');
                        if (video) video.pause();
                    });
                    const activeImage = galleryItems[imageIndex];
                    loadMedia(activeImage, activeImage.dataset.src, activeImage.dataset.type);
                    activeImage.classList.add('active');
                    // 播放活跃视频
                    const activeVideo = activeImage.querySelector('video');
                    if (activeVideo) activeVideo.play().catch(e => console.error("Video autoplay error:", e));
                }
            }
        });
    }, sectionObserverOptions);

    // 观察所有文本区块
    textSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 为导航链接添加平滑滚动和活跃状态切换
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) { // 内部链接
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offset = 0; // 调整滚动偏移，确保顶部对齐
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            } else { // 外部链接
                window.location.href = targetId;
            }
        });
    });

    // 初始加载第一个图片，防止页面加载时右侧空白
    if (galleryItems.length > 0) {
        loadMedia(galleryItems[0], galleryItems[0].dataset.src, galleryItems[0].dataset.type);
        galleryItems[0].classList.add('active');
    }
});
