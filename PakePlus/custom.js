window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ========== PakePlus 注入脚本：修复顶部安全区 + 高度压缩 ==========

(function () {
    'use strict'

    // 1. 确保 viewport-fit=cover
    const ensureViewport = () => {
        let meta = document.querySelector('meta[name="viewport"]')
        if (!meta) {
            meta = document.createElement('meta')
            meta.name = 'viewport'
            document.head.appendChild(meta)
        }
        const content = meta.getAttribute('content') || ''
        if (!content.includes('viewport-fit=cover')) {
            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover')
        }
    }

    // 2. 核心修复：强制全屏 + 修复高度
    const fixFullscreen = () => {
        const style = document.createElement('style')
        style.id = 'pakeplus-fullscreen-fix'
        style.textContent = `
            /* 强制铺满，无视安全区 */
            html {
                height: 100% !important;
                height: 100dvh !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
            }
            
            body {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
                height: 100dvh !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                /* 关键：让内容从屏幕最顶部开始渲染 */
                padding-top: 0px !important;
                padding-bottom: 0px !important;
            }
            
            /* 你的 App 根容器 - 强制铺满 */
            #app, #root, .app, [id*="app"], [class*="app"] {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                height: 100dvh !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: auto !important;
            }
            
            /* 覆盖可能的安全区 padding */
            * {
                -webkit-padding-start: 0 !important;
            }
            
            /* 特别处理：如果网站用了 safe-area-inset-top */
            @supports (padding-top: env(safe-area-inset-top)) {
                html, body, #app, #root {
                    padding-top: 0px !important;
                    padding-bottom: 0px !important;
                }
            }
        `
        document.head.appendChild(style)
    }

    // 3. 修复 iOS 特有的 WKWebView 高度问题
    const fixIOSHeight = () => {
        // iOS 上 100vh 不等于实际可视高度，需要手动计算
        const setRealHeight = () => {
            const vh = window.innerHeight
            document.documentElement.style.setProperty('--real-vh', `${vh}px`)
            
            const app = document.querySelector('#app') || document.querySelector('#root') || document.body
            if (app) {
                app.style.height = `${vh}px`
                app.style.minHeight = `${vh}px`
                app.style.maxHeight = `${vh}px`
            }
        }
        
        setRealHeight()
        window.addEventListener('resize', setRealHeight)
        window.addEventListener('orientationchange', setRealHeight)
    }

    // 4. 强制滚动位置到顶部（防止被安全区推下去）
    const forceScrollTop = () => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        
        const app = document.querySelector('#app') || document.querySelector('#root')
        if (app) {
            app.scrollTop = 0
            // 强制 translate 修正位置
            app.style.transform = 'translateY(0px)'
            app.style.webkitTransform = 'translateY(0px)'
        }
    }

    // 5. 移除可能存在的顶部 padding/margin
    const removeTopSpacing = () => {
        // 遍历所有直接子元素，移除顶部间距
        const allElements = document.querySelectorAll('body, body > *')
        allElements.forEach(el => {
            const computed = getComputedStyle(el)
            if (parseInt(computed.paddingTop) > 0 || parseInt(computed.marginTop) > 0) {
                el.style.paddingTop = '0px'
                el.style.marginTop = '0px'
            }
        })
    }

    // 执行
    const init = () => {
        ensureViewport()
        fixFullscreen()
        fixIOSHeight()
        forceScrollTop()
        removeTopSpacing()
        console.log('[PakePlus] 全屏修复 v2 已注入')
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init)
    } else {
        init()
    }
    
    // 多次执行确保生效
    setTimeout(init, 100)
    setTimeout(init, 500)
    setTimeout(init, 1000)
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
