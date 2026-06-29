window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ========== 强制全屏：覆盖安全区 ==========

(function () {
    'use strict'

    // 1. 动态注入 viewport-fit=cover（如果页面没有）
    const ensureViewport = () => {
        let meta = document.querySelector('meta[name="viewport"]')
        if (!meta) {
            meta = document.createElement('meta')
            meta.name = 'viewport'
            document.head.appendChild(meta)
        }
        const content = meta.getAttribute('content') || ''
        if (!content.includes('viewport-fit=cover')) {
            meta.setAttribute('content', content + ', viewport-fit=cover')
        }
    }

    // 2. 强制 body/html 铺满全屏，无视安全区
    const injectFullScreenCSS = () => {
        const style = document.createElement('style')
        style.id = 'pakeplus-fullscreen-fix'
        style.textContent = `
            /* 强制铺满全屏 */
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: 100% !important;
                min-height: 100vh !important;
                min-height: 100dvh !important;
                overflow: hidden !important;
            }
            
            /* 你的 App 根容器强制全屏 */
            #app, #root, .app, [id*="app"], [class*="app"] {
                width: 100% !important;
                height: 100vh !important;
                height: 100dvh !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* 强制背景延伸到安全区 */
            html {
                background-color: #0a0a0a !important; /* 改成你的深色背景 */
            }
        `
        document.head.appendChild(style)
    }

    // 3. 移除 iOS 可能添加的 padding/margin
    const removeSafeAreaInsets = () => {
        const style = document.createElement('style')
        style.id = 'pakeplus-safearea-override'
        style.textContent = `
            /* 覆盖 env(safe-area-inset-*) 为 0 */
            * {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
            }
            
            /* 如果有特定的安全区样式类，强制移除 */
            .safe-area-top, .safe-area-bottom, 
            [class*="safe-area"], [class*="safearea"] {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
            }
        `
        document.head.appendChild(style)
    }

    // 4. 强制滚动视图顶到边缘
    const fixScrollView = () => {
        document.documentElement.style.scrollPaddingTop = '0px'
        document.body.style.scrollPaddingTop = '0px'
        
        // 针对你的具体布局，找到主容器
        const possibleContainers = [
            document.querySelector('#app'),
            document.querySelector('#root'),
            document.querySelector('.app'),
            document.body.firstElementChild
        ]
        
        possibleContainers.forEach(el => {
            if (el) {
                el.style.position = 'fixed'
                el.style.top = '0'
                el.style.left = '0'
                el.style.right = '0'
                el.style.bottom = '0'
                el.style.width = '100%'
                el.style.height = '100%'
                el.style.margin = '0'
                el.style.padding = '0'
            }
        })
    }

    // 执行
    const init = () => {
        ensureViewport()
        injectFullScreenCSS()
        removeSafeAreaInsets()
        fixScrollView()
        console.log('[PakePlus] 全屏修复已注入')
    }

    // DOM 准备好后立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init)
    } else {
        init()
    }
    
    // 延迟再执行一次（应对动态加载）
    setTimeout(init, 500)
    setTimeout(init, 1500)
})()

// ========== 保留原有的 hookClick ==========

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
