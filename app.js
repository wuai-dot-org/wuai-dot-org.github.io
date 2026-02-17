gsap.registerPlugin(ScrollTrigger);

// 【新增 1】背景元素缓慢旋转动画，增加呼吸感
gsap.to('.shape-1', {
    rotation: 360,
    duration: 120, // 非常慢的旋转，120秒一圈
    repeat: -1,    // 无限循环
    ease: "none"   // 线性匀速
});

gsap.to('.shape-2', {
    rotation: -360, // 反向旋转
    duration: 150,
    repeat: -1,
    ease: "none"
});


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
