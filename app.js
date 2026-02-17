// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

// 1. 视差背景动画 (Parallax Effect)
// 选中所有 class 为 parallax-bg 的图片
const parallaxBgs = document.querySelectorAll('.parallax-bg');

parallaxBgs.forEach((bg) => {
    gsap.to(bg, {
        y: "30%", // 当向下滚动时，图片本身在容器内相对向下移动 30%
        ease: "none",
        scrollTrigger: {
            trigger: bg.parentElement, // 触发器是包裹它的容器
            start: "top bottom",       // 当容器顶部碰到视口底部时开始
            end: "bottom top",         // 当容器底部碰到视口顶部时结束
            scrub: true                // 开启平滑跟随滚动条
        }
    });
});

// 2. 文字丝滑浮现动画 (Fade Up)
// 选中所有需要浮现的文字容器
const fadeElements = document.querySelectorAll('.fade-up');

fadeElements.forEach((el) => {
    // 设定初始状态：透明且靠下
    gsap.set(el, { opacity: 0, y: 50 });

    // 设定滚动触发时的动画
    gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out", // 苹果味十足的阻尼缓动曲线
        scrollTrigger: {
            trigger: el,
            start: "top 85%", // 当元素顶部到达视口高度的 85% 时触发
            toggleActions: "play none none reverse" // 往下滚播放，往上滚反向播放
        }
    });
});
