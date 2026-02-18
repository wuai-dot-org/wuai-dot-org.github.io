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

// ==========================================
// 8. 动态读取内容 + 小红书式详情弹窗逻辑
// ==========================================
const galleryGrid = document.getElementById('gallery-grid');

if (galleryGrid) {
    // 模拟数据：注意 images 现在是一个数组
    const mockData = [
        {
            name: "李华",
            story: "还记得当时为了调试自动跟随行李箱，我们在实验室熬了三个通宵。图1是第一版原型，图2是我们累倒在椅子上，图3是比赛获奖的瞬间。那种成就感无可替代。",
            // 支持多张图片链接
            images: [
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
                "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]
        },
        {
            name: "匿名校友",
            story: "做上海和东京文化对比研究的那段时间，查阅了无数文献。现在回想起来，那是视野真正被打开的时刻。",
            images: [
                "https://images.unsplash.com/photo-1542931287-023b922fa89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]
        }
    ];

    // 渲染网格卡片
    function renderCards(data) {
        galleryGrid.innerHTML = ''; 
        
        data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            // 封面图默认只展示第一张
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${item.images[0]}" alt="封面">
                    ${item.images.length > 1 ? '<span class="multi-icon"></span>' : ''}
                </div>
                <h3>${item.name}</h3>
                <p>${item.story.substring(0, 40)}...</p>
            `;
            
            // 点击卡片 -> 打开详情弹窗
            card.addEventListener('click', () => openDetailModal(item));
            
            // 光标交互
            if(cursor) {
                card.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
                card.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
            }

            galleryGrid.appendChild(card);
        });

        // 浮现动画
        gsap.to('.gallery-card', {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: galleryGrid, start: "top 85%" }
        });
    }

    // 初始化渲染 (此处直接用 mockData，后续换成 fetch)
    renderCards(mockData);
}

// ==========================================
// 9. 详情弹窗逻辑 (核心部分)
// ==========================================
const detailModal = document.getElementById('detailModal');
const closeDetailBtn = document.getElementById('closeDetailBtn');
let currentSlideIndex = 0;
let currentImages = [];

function openDetailModal(item) {
    if (!detailModal) return;

    // 1. 填充文字信息
    document.getElementById('detailName').textContent = item.name;
    document.getElementById('detailStory').textContent = item.story;
    document.getElementById('detailAvatar').style.backgroundImage = `url('https://ui-avatars.com/api/?name=${item.name}&background=random&color=fff')`;

    // 2. 准备图片轮播
    currentImages = item.images;
    currentSlideIndex = 0;
    renderSlider();

    // 3. 显示弹窗
    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 禁止背景滚动
}

function closeDetail() {
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
}

// 关闭事件绑定
if(closeDetailBtn) closeDetailBtn.addEventListener('click', closeDetail);
if(detailModal) {
    detailModal.addEventListener('click', (e) => {
        if(e.target === detailModal) closeDetail();
    });
}

// --- 轮播图控制 ---
const sliderContainer = document.getElementById('detailSlider');
const sliderDots = document.getElementById('sliderDots');

function renderSlider() {
    if (!sliderContainer) return;
    
    // 清空旧图
    sliderContainer.innerHTML = '';
    sliderDots.innerHTML = '';

    // 生成图片 DOM
    currentImages.forEach((imgUrl, idx) => {
        const div = document.createElement('div');
        div.className = 'slide-item';
        div.innerHTML = `<img src="${imgUrl}">`;
        sliderContainer.appendChild(div);

        // 生成点点
        if (currentImages.length > 1) {
            const dot = document.createElement('div');
            dot.className = `dot ${idx === 0 ? 'active' : ''}`;
            sliderDots.appendChild(dot);
        }
    });

    updateSliderPosition();
}

function updateSliderPosition() {
    sliderContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    // 更新点的状态
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        if(idx === currentSlideIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });

    // 只有一张图时隐藏按钮
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    if (currentImages.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }
}

// 轮播按钮点击事件
document.getElementById('sliderPrev')?.addEventListener('click', () => {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSliderPosition();
    }
});
document.getElementById('sliderNext')?.addEventListener('click', () => {
    if (currentSlideIndex < currentImages.length - 1) {
        currentSlideIndex++;
        updateSliderPosition();
    }
});
