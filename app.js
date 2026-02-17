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

// --- 自定义光标跟随与互动逻辑 ---

const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

// 1. 监听全局鼠标移动
window.addEventListener('mousemove', (e) => {
    // 小圆点：没有任何延迟，瞬间跟上鼠标，保证点击的精准度
    gsap.set(cursor, {
        x: e.clientX,
        y: e.clientY
    });

    // 大圆环：利用 gsap.to 制造 0.3 秒的延迟到达，产生高级的拖影和阻尼感
    gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power3.out"
    });
});

// 2. 设置互动放大效果
// 选中所有你希望鼠标移上去能产生变化的元素（比如大图片模块、底部的CTA按钮）
const interactives = document.querySelectorAll('.image-block, .cta-button');

interactives.forEach((el) => {
    // 鼠标进入时：给圆环加上 is-active 类，CSS 会自动处理放大和毛玻璃效果
    el.addEventListener('mouseenter', () => {
        follower.classList.add('is-active');
    });
    
    // 鼠标离开时：移除特效，恢复原状
    el.addEventListener('mouseleave', () => {
        follower.classList.remove('is-active');
    });
});
