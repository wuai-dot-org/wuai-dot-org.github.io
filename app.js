gsap.registerPlugin(ScrollTrigger);



// 首屏入场动画
const tlHero = gsap.timeline();
tlHero.to('.hero .text-reveal span', { y: 0, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.2 })
      .to('.hero .draw-line', { width: '100%', duration: 1.5, ease: "power3.inOut" }, "-=0.8");

// 滚动模块动画
const sections = document.querySelectorAll('.content-section');
sections.forEach((sec) => {
    const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: "top 75%", toggleActions: "play none none reverse" }
    });
    tl.to(sec.querySelectorAll('.text-reveal span'), { y: 0, duration: 1, stagger: 0.15, ease: "power3.out" })
      .to(sec.querySelector('.draw-line'), { width: '100%', duration: 1.2, ease: "power3.inOut" }, "-=0.8")
      .to(sec.querySelector('.reveal-overlay'), { scaleY: 0, duration: 1.5, ease: "power4.inOut" }, "-=1.2");
});

// 【新增 2】底部 CTA 板块的动画
const ctaSection = document.querySelector('.cta-section');
const tlCta = gsap.timeline({
    scrollTrigger: {
        trigger: ctaSection,
        start: "top 80%", // 当板块进入视口 80% 时触发
        toggleActions: "play none none reverse"
    }
});
tlCta.to(ctaSection.querySelectorAll('.text-reveal span'), {
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
        duration: 0 // 持续时间设为0，实现跟手级别的实时响应
    });
});

// 2. 悬停放大变毛玻璃效果
const interactives = document.querySelectorAll('.image-block, .cta-button');

interactives.forEach((el) => {
    // 鼠标移入：加上变大和毛玻璃的 class
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-active');
    });
    
    // 鼠标移出：移除 class，恢复成小圆点
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-active');
    });
});
