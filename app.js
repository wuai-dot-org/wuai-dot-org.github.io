gsap.registerPlugin(ScrollTrigger);

// 1. 首屏入场动画 (页面加载时触发)
const tlHero = gsap.timeline();
tlHero.to('.hero .text-reveal span', {
    y: 0,
    duration: 1,
    stagger: 0.2, // 依次出现，间隔0.2秒
    ease: "power4.out",
    delay: 0.2
})
.to('.hero .draw-line', {
    width: '100%',
    duration: 1.5,
    ease: "power3.inOut"
}, "-=0.8"); // 提前0.8秒与上一个动画重叠执行


// 2. 滚动模块动画 (遍历每个 section)
const sections = document.querySelectorAll('.content-section');

sections.forEach((sec) => {
    // 创建一个滚动触发的时间轴
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sec,
            start: "top 75%", // 当模块顶部到达屏幕75%时触发
            toggleActions: "play none none reverse"
        }
    });

    // A. 文本依次上浮
    tl.to(sec.querySelectorAll('.text-reveal span'), {
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
    })
    // B. 线条自动绘制
    .to(sec.querySelector('.draw-line'), {
        width: '100%',
        duration: 1.2,
        ease: "power3.inOut"
    }, "-=0.8")
    // C. 图片遮罩像幕布一样拉开 (高度收缩为0)
    .to(sec.querySelector('.reveal-overlay'), {
        scaleY: 0,
        duration: 1.5,
        ease: "power4.inOut"
    }, "-=1.2");
});

// 3. 经典的视差背景跟随
const parallaxBgs = document.querySelectorAll('.parallax-bg');
parallaxBgs.forEach((bg) => {
    gsap.to(bg, {
        y: "30%", 
        ease: "none",
        scrollTrigger: {
            trigger: bg.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});
