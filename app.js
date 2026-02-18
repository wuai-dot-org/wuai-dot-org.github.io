gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. 首屏入场动画 (仅在包含 .hero 的页面生效)
// ==========================================
const hero = document.querySelector('.hero');
if (hero) {
    const tlHero = gsap.timeline();
    tlHero.to('.hero .text-reveal > span', { y: 0, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.2 })
          .to('.hero .draw-line', { width: '100%', duration: 1.5, ease: "power3.inOut" }, "-=0.8");
}

// ==========================================
// 2. 社区头部入场动画 (仅在 community.html 生效)
// ==========================================
const communityHeader = document.querySelector('.community-header');
if (communityHeader) {
    const tlComm = gsap.timeline();
    tlComm.to('.community-header .text-reveal > span', { y: 0, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.2 });
}

// ==========================================
// 3. 滚动模块动画 (安全遍历)
// ==========================================
const sections = document.querySelectorAll('.content-section');
sections.forEach((sec) => {
    const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: "top 75%", toggleActions: "play none none reverse" }
    });
    tl.to(sec.querySelectorAll('.text-reveal > span'), { y: 0, duration: 1, stagger: 0.15, ease: "power3.out" })
      .to(sec.querySelector('.draw-line'), { width: '100%', duration: 1.2, ease: "power3.inOut" }, "-=0.8")
      .to(sec.querySelector('.reveal-overlay'), { scaleY: 0, duration: 1.5, ease: "power4.inOut" }, "-=1.2");
});

// ==========================================
// 4. 底部 CTA 板块的动画 (仅当存在时生效)
// ==========================================
const ctaSection = document.querySelector('.cta-section');
if (ctaSection) {
    const tlCta = gsap.timeline({
        scrollTrigger: {
            trigger: ctaSection,
            start: "top 80%", 
            toggleActions: "play none none reverse"
        }
    });
    tlCta.to(ctaSection.querySelectorAll('.text-reveal > span'), {
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
}

// ==========================================
// 5. 视差背景跟随
// ==========================================
const parallaxBgs = document.querySelectorAll('.parallax-bg');
parallaxBgs.forEach((bg) => {
    gsap.to(bg, {
        y: "30%", ease: "none",
        scrollTrigger: { trigger: bg.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
});

// ==========================================
// 6. 极简光标跟随与互动逻辑
// ==========================================
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
    });

    const interactives = document.querySelectorAll('.image-block, .cta-button, .nav-links a');
    interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });
}

// ==========================================
// 7. 校友社区交互逻辑 (仅在 community.html 生效)
// ==========================================
const modal = document.getElementById('submitModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

if (modal && openModalBtn && closeModalBtn) {
    openModalBtn.addEventListener('mouseenter', () => cursor && cursor.classList.add('is-active'));
    openModalBtn.addEventListener('mouseleave', () => cursor && cursor.classList.remove('is-active'));
    closeModalBtn.addEventListener('mouseenter', () => cursor && cursor.classList.add('is-active'));
    closeModalBtn.addEventListener('mouseleave', () => cursor && cursor.classList.remove('is-active'));

    openModalBtn.addEventListener('click', () => modal.classList.add('active'));
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

// 动态读取内容并生成瀑布流卡片
const galleryGrid = document.getElementById('gallery-grid');
if (galleryGrid) {
    // 【修改点】：以后这里填你的 R2 JSON 直链地址
    const r2DataUrl = null; 

    // 预置的骨架内容
    const mockData = [
        {
            name: "李华",
            story: "还记得当时为了调试自动跟随行李箱，我们在实验室熬了三个通宵，最后它终于能跟着我走的时候，那种成就感无可替代。",
            imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            name: "匿名校友",
            story: "做上海和东京文化对比研究的那段时间，查阅了无数文献。现在回想起来，那是视野真正被打开的时刻。",
            imageUrl: "https://images.unsplash.com/photo-1542931287-023b922fa89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    function renderCards(data) {
        galleryGrid.innerHTML = ''; 
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <img src="${item.imageUrl}" alt="记忆碎片">
                <h3>${item.name}</h3>
                <p>${item.story}</p>
            `;
            galleryGrid.appendChild(card);
            
            // 给生成的卡片加上鼠标互动放大效果
            if(cursor) {
                card.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
                card.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
            }
        });

        // 瀑布流图片依次平滑浮现
        gsap.to('.gallery-card', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: galleryGrid, start: "top 85%" }
        });
    }

    if (r2DataUrl) {
        fetch(r2DataUrl)
            .then(response => response.json())
            .then(data => renderCards(data))
            .catch(err => {
                console.error("加载 R2 数据失败", err);
                renderCards(mockData);
            });
    } else {
        setTimeout(() => renderCards(mockData), 300); 
    }
}
