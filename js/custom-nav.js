// 使用 window 挂载或 var 声明，避免 PJAX 重复加载时报 SyntaxError
window.initMainSiteHold = window.initMainSiteHold || function() {
    // 增加选择器兼容性，匹配包含主站地址的链接
    const mainSiteBtn = document.querySelector('a[href*="1ikcu.github.io"]');

    // 只有找到按钮且未绑定过逻辑时才执行
    if (mainSiteBtn && !mainSiteBtn.dataset.holdBound) {
        mainSiteBtn.dataset.holdBound = "true"; 
        mainSiteBtn.style.position = 'relative';

        // 注入进度条 SVG
        if (!mainSiteBtn.querySelector('.hold-progress-wrap')) {
            mainSiteBtn.insertAdjacentHTML('beforeend', `
                <div class="hold-progress-wrap">
                    <svg viewBox="0 0 36 36" style="width:26px; height:26px;">
                        <path class="hold-progress-circle" 
                    	    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                </div>
            `);
        }

        const progressWrap = mainSiteBtn.querySelector('.hold-progress-wrap');
        let pressTimer;

        const startPress = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return;
            progressWrap.classList.add('active');
            pressTimer = setTimeout(() => {
                window.location.href = mainSiteBtn.getAttribute('href');
            }, 2500);
        };

        const cancelPress = () => {
            clearTimeout(pressTimer);
            progressWrap.classList.remove('active');
        };

        // 拦截点击：由双击或长按接管
        mainSiteBtn.onclick = (e) => {
            e.preventDefault();
            return false;
        };

        // 双击逻辑
        //mainSiteBtn.addEventListener('dblclick', (e) => {
        //    e.preventDefault();
        //    window.location.href = mainSiteBtn.getAttribute('href');
        //});

        // 绑定交互事件
        mainSiteBtn.addEventListener('mousedown', startPress);
        mainSiteBtn.addEventListener('mouseup', cancelPress);
        mainSiteBtn.addEventListener('mouseleave', cancelPress);
        mainSiteBtn.addEventListener('touchstart', startPress);
        mainSiteBtn.addEventListener('touchend', cancelPress);
    }
};

// 立即执行并注册到 PJAX 回调
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initMainSiteHold);
} else {
    window.initMainSiteHold();
}

// 针对 Keep 主题内置的 PJAX 事件进行监听
document.addEventListener('pjax:complete', window.initMainSiteHold);
