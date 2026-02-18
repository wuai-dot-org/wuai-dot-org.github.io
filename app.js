gsap.registerPlugin(ScrollTrigger);

// 1. 首屏入场
const hero = document.querySelector('.hero');
if (hero) {
    const tlHero = gsap.timeline();
    tlHero.to('.hero .text-reveal > span', { y: 0, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.2 })
          .to('.hero .draw-line', { width: '100%', duration: 1.5, ease: "power3.inOut" }, "-=0.8");
}

// 2. 社区头部
const communityHeader = document.querySelector('.community-header');
if (communityHeader) {
    gsap.to('.community-header .text-reveal > span', { y: 0, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.2 });
}

// 3. 滚动动画
const sections = document.querySelectorAll('.content-section');
sections.forEach((sec) => {
    const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: "top 75%", toggleActions: "play none none reverse" }
    });
    tl.to(sec.querySelectorAll('.text-reveal > span'), { y: 0, duration: 1, stagger: 0.15, ease: "power3.out" })
      .to(sec.querySelector('.draw-line'), { width: '100%', duration: 1.2, ease: "power3.inOut" }, "-=0.8")
      .to(sec.querySelector('.reveal-overlay'), { scaleY: 0, duration: 1.5, ease: "power4.inOut" }, "-=1.2");
});

// 4. CTA
const ctaSection = document.querySelector('.cta-section');
if (ctaSection) {
    gsap.to(ctaSection.querySelectorAll('.text-reveal > span'), {
        y: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: ctaSection, start: "top 80%", toggleActions: "play none none reverse" }
    });
}

// 5. 视差背景
document.querySelectorAll('.parallax-bg').forEach((bg) => {
    gsap.to(bg, {
        y: "30%", ease: "none",
        scrollTrigger: { trigger: bg.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
});

// 6. 光标逻辑 (增强版)
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
    });

    // 修复：把所有可交互的按钮都加进来，包括轮播图按钮、关闭按钮、表单输入框
    const interactiveSelectors = [
        '.image-block', '.cta-button', '.nav-links a', 
        '.gallery-card', '.close-btn', '.close-detail-btn',
        '.submit-btn', '.slider-nav', '.dot',
        'input', 'textarea'
    ];
    
    // 使用事件委托处理动态生成的元素（比如瀑布流卡片和轮播点）
    document.addEventListener('mouseover', (e) => {
        if (e.target.matches(interactiveSelectors.join(',')) || e.target.closest(interactiveSelectors.join(','))) {
            cursor.classList.add('is-active');
        } else {
            cursor.classList.remove('is-active');
        }
    });
}

// 7. 投稿弹窗
const modal = document.getElementById('submitModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

if (modal && openModalBtn && closeModalBtn) {
    openModalBtn.addEventListener('click', () => modal.classList.add('active'));
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
}

// 8. 社区展示与详情弹窗
const galleryGrid = document.getElementById('gallery-grid');
if (galleryGrid) {
    const mockData = [
        {
            name: "李华",
            story: "还记得当时为了调试自动跟随行李箱，我们在实验室熬了三个通宵。图1是第一版原型，图2是我们累倒在椅子上，图3是比赛获奖的瞬间。那种成就感无可替代。",
            images: [
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
                "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]
        },
        {
            name: "匿名校友",
            story: "做上海和东京文化对比研究的那段时间，查阅了无数文献。现在回想起来，那是视野真正被打开的时刻。",
            images: ["https://images.unsplash.com/photo-1542931287-023b922fa89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
        }
    ];

    function renderCards(data) {
        galleryGrid.innerHTML = ''; 
        data.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${item.images[0]}" alt="封面">
                    ${item.images.length > 1 ? '<span class="multi-icon"></span>' : ''}
                </div>
                <h3>${item.name}</h3>
                <p>${item.story.substring(0, 40)}...</p>
            `;
            card.addEventListener('click', () => openDetailModal(item));
            galleryGrid.appendChild(card);
        });
        
        gsap.to('.gallery-card', {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: galleryGrid, start: "top 85%" }
        });
    }
    renderCards(mockData);
}

// 9. 详情弹窗逻辑
const detailModal = document.getElementById('detailModal');
const closeDetailBtn = document.getElementById('closeDetailBtn');
let currentSlideIndex = 0;
let currentImages = [];

function openDetailModal(item) {
    if (!detailModal) return;
    document.getElementById('detailName').textContent = item.name;
    document.getElementById('detailStory').textContent = item.story;
    document.getElementById('detailAvatar').style.backgroundImage = `url('https://ui-avatars.com/api/?name=${item.name}&background=random&color=fff')`;

    currentImages = item.images;
    currentSlideIndex = 0;
    renderSlider();

    detailModal.classList.add('active');
}

function closeDetail() {
    detailModal.classList.remove('active');
}

if(closeDetailBtn) closeDetailBtn.addEventListener('click', closeDetail);
if(detailModal) detailModal.addEventListener('click', (e) => { if(e.target === detailModal) closeDetail(); });

// 轮播图渲染与控制
const sliderContainer = document.getElementById('detailSlider');
const sliderDots = document.getElementById('sliderDots');

function renderSlider() {
    if (!sliderContainer) return;
    sliderContainer.innerHTML = '';
    sliderDots.innerHTML = '';

    currentImages.forEach((imgUrl, idx) => {
        const div = document.createElement('div');
        div.className = 'slide-item';
        div.innerHTML = `<img src="${imgUrl}">`;
        sliderContainer.appendChild(div);

        if (currentImages.length > 1) {
            const dot = document.createElement('div');
            dot.className = `dot ${idx === 0 ? 'active' : ''}`;
            // 修复：给圆点添加点击切换功能
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止冒泡
                currentSlideIndex = idx;
                updateSliderPosition();
            });
            sliderDots.appendChild(dot);
        }
    });
    updateSliderPosition();
}

function updateSliderPosition() {
    sliderContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, idx) => {
        if(idx === currentSlideIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });

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
