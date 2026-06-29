window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })

// ===================== 强力修复顶部白边+全屏铺满 =====================
document.addEventListener('DOMContentLoaded', () => {
    const fixStyle = document.createElement('style');
    fixStyle.textContent = `
        /* 强制页面根元素无视所有默认边距、顶部安全偏移 */
        html,body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            background: #000 !important;
            /* 重点：取消顶部刘海/安全区强制留白 */
            padding-top: 0 !important;
            margin-top: 0 !important;
        }
        /* 登录弹窗+根容器 强制顶到屏幕最顶部，不留缝隙 */
        body>div, #app, .login-box, div[class*="login"] {
            width: 100% !important;
            height: 100% !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
            top: 0 !important;
            position: absolute !important;
        }
        /* 消除Electron窗口圆角带来的顶部圆弧白边 */
        body {
            border-radius: 0 !important;
        }
        /* 隐藏所有滚动条、侧边缝隙 */
        ::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
        }
        body {
            overscroll-behavior: none;
        }
    `;
    document.head.appendChild(fixStyle);

    // 额外延时兜底，Vue页面渲染完成后二次压顶，防止Vue渲染延迟出现顶部留白
    setTimeout(()=>{
        window.scrollTo(0,0);
        document.body.scrollTop = 0;
    }, 300)
});