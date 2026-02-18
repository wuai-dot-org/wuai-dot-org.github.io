gsap.registerPlugin(ScrollTrigger);

// 首屏入场动画：修改选择器为直接子代 > span
const tlHero = gsap.timeline();
tlHero.to('.hero .text-reveal > span', { y: 0, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.2 })
      .to('.hero .draw-line', { width: '100%', duration: 1.5, ease: "power3.inOut" }, "-=0.8");

// 滚动模块动画：修改选择器为直接子代 > span
const sections = document.querySelectorAll('.content-section');
sections.forEach((sec) => {
    const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: "top 75%", toggleActions: "play none none reverse" }
    });
    tl.to(sec.querySelectorAll('.text-reveal > span'), { y: 0, duration: 1, stagger: 0.15, ease: "power3.out" })
      .to(sec.querySelector('.draw-line'), { width: '100%', duration: 1.2, ease: "power3.inOut" }, "-=0.8")
      .to(sec.querySelector('.reveal-overlay'), { scaleY: 0, duration: 1.5, ease: "power4.inOut" }, "-=1.2");
});

// 底部 CTA 板块的动画：修改选择器为直接子代 > span
const ctaSection = document.querySelector('.cta-section');
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

// 视差背景跟随
const parallaxBgs = document.querySelectorAll('.parallax-bg');
parallaxBgs.forEach((bg) => {
    gsap.to(bg, {
        y: "30%", ease: "none",
        scrollTrigger: { trigger: bg.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
});

// --- 极简光标跟随与互动逻辑 ---

const cursor = document.querySelector('.custom-cursor');

// 强制让 GSAP 处理居中对齐
gsap.set(cursor, { xPercent: -50, yPercent: -50 });

// 1. 鼠标瞬间跟随（0延迟，完全没有拖拽感）
window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0 
    });
});

// 2. 悬停放大变毛玻璃效果 (增加 .nav-links a 让导航栏也有交互效果)
const interactives = document.querySelectorAll('.image-block, .cta-button, .nav-links a');

interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-active');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-active');
    });
});

/* =========================================
   校友社区交互逻辑 (仅在 community.html 生效)
   ========================================= */

// 1. 弹窗控制逻辑
const modal = document.getElementById('submitModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

if (modal && openModalBtn && closeModalBtn) {
    // 修复原有的 interactives 光标绑定，把新按钮加进去
    openModalBtn.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    openModalBtn.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    closeModalBtn.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    closeModalBtn.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));

    openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // 点击背景也能关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

// 2. 动态读取 R2 内容并生成瀑布流卡片
const galleryGrid = document.getElementById('gallery-grid');

if (galleryGrid) {
    // 【替换这里】：未来这里换成你部署在 R2 上的 JSON 文件直链地址
    // 比如：const r2DataUrl = "https://your-custom-domain.com/community-data.json";
    const r2DataUrl = null; 

    // 预置的 Mock 数据（当没有 R2 链接时展示）
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
        galleryGrid.innerHTML = ''; // 清空加载骨架
        
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <img src="${item.imageUrl}" alt="记忆碎片">
                <h3>${item.name}</h3>
                <p>${item.story}</p>
            `;
            galleryGrid.appendChild(card);
            
            // 给卡片加上光标交互
            card.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
            card.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
        });

        // 给生成的卡片加上 GSAP 滚动浮现动画
        gsap.to('.gallery-card', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: galleryGrid,
                start: "top 85%"
            }
        });
    }

    // 尝试获取 R2 数据，如果失败或没配置，就加载预置的 Mock 数据
    if (r2DataUrl) {
        fetch(r2DataUrl)
            .then(response => response.json())
            .then(data => renderCards(data))
            .catch(err => {
                console.error("加载 R2 数据失败，加载预置内容", err);
                renderCards(mockData);
            });
    } else {
        // 直接渲染预置内容
        setTimeout(() => renderCards(mockData), 500); // 假装有个加载延迟
    }
}
