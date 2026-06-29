window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ========== PakePlus 注入脚本 v4：React 专用，精准覆盖安全区 ==========

(function () {
    'use strict'

    // 1. viewport
    const ensureViewport = () => {
        let meta = document.querySelector('meta[name="viewport"]')
        if (!meta) {
            meta = document.createElement('meta')
            meta.name = 'viewport'
            document.head.appendChild(meta)
        }
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no')
    }

    // 2. 核心样式：只处理根容器，不动 React 内部布局
    const injectRootFix = () => {
        const style = document.createElement('style')
        style.id = 'pakeplus-react-fix'
        style.textContent = `
            /* 强制 html/body 无内边距 */
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
            }
            
            /* 关键：React 根节点强制铺满 */
            #root, #app {
                position: relative !important;
                width: 100% !important;
                min-height: 100vh !important;
                min-height: 100dvh !important;
                margin: 0 !important;
                padding: 0 !important;
                /* 覆盖安全区 */
                padding-top: 0px !important;
                padding-bottom: 0px !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
            }
            
            /* 覆盖所有可能的安全区 padding */
            @supports (padding: env(safe-area-inset-top)) {
                #root, #app, #root > *, #app > * {
                    padding-top: 0px !important;
                    padding-bottom: 0px !important;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                    margin-top: 0px !important;
                    margin-bottom: 0px !important;
                }
            }
            
            /* 如果 React 根节点内部有安全区相关 class */
            [class*="safe"], [class*="Safe"], [class*="notch"], [class*="Notch"] {
                padding-top: 0px !important;
                padding-bottom: 0px !important;
            }
        `
        document.head.appendChild(style)
    }

    // 3. 动态修正 React 根节点
    const fixReactRoot = () => {
        const root = document.querySelector('#root') || document.querySelector('#app')
        if (!root) {
            console.log('[PakePlus] 未找到 #root 或 #app，等待...')
            setTimeout(fixReactRoot, 300)
            return
        }
        
        console.log('[PakePlus] 找到 React 根节点:', root.id || root.className)
        
        // 强制修正根节点样式
        root.style.cssText += `
            position: relative !important;
            width: 100% !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
            padding-top: 0px !important;
            padding-bottom: 0px !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
        `
        
        // 关键：修正根节点的第一个子元素（通常是你的 App 组件）
        const firstChild = root.firstElementChild
        if (firstChild) {
            firstChild.style.marginTop = '0px'
            firstChild.style.paddingTop = '0px'
            console.log('[PakePlus] 已修正第一个子元素:', firstChild.className || firstChild.tagName)
        }
    }

    // 4. 监听 DOM 变化（React 是动态渲染的）
    const observeReact = () => {
        const root = document.querySelector('#root') || document.querySelector('#app')
        if (!root) return
        
        const observer = new MutationObserver((mutations) => {
            fixReactRoot()
        })
        
        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        })
        
        console.log('[PakePlus] 已监听 React 根节点变化')
    }

    // 5. 用 JS 强制移除所有安全区内边距
    const nukeSafeArea = () => {
        const style = document.createElement('style')
        style.id = 'pakeplus-nuke'
        style.textContent = `
            /* 终极覆盖：所有元素的安全区 padding 归零 */
            * {
                --safe-area-inset-top: 0px !important;
                --safe-area-inset-bottom: 0px !important;
                --safe-area-inset-left: 0px !important;
                --safe-area-inset-right: 0px !important;
            }
            
            /* 针对 env() 的覆盖 */
            @supports (padding-top: env(safe-area-inset-top)) {
                html, body, #root, #app, #root *, #app * {
                    padding-top: 0px !important;
                    padding-bottom: 0px !important;
                }
            }
        `
        document.head.appendChild(style)
    }

    // 执行
    const init = () => {
        ensureViewport()
        injectRootFix()
        fixReactRoot()
        observeReact()
        nukeSafeArea()
        console.log('[PakePlus] React 专用修复 v4 已注入')
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init)
    } else {
        init()
    }
    
    // 多次执行确保 React 渲染完成后生效
    setTimeout(init, 100)
    setTimeout(init, 500)
    setTimeout(init, 1500)
    setTimeout(fixReactRoot, 2000)
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
