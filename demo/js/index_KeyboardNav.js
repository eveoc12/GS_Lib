

/* // 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    // 数字键1-3快速选择场景
    if (e.key >= '1' && e.key <= '3') {
        const index = parseInt(e.key) - 1;
        const cards = document.querySelectorAll('.scene-card');
        if (cards[index]) {
            cards[index].querySelector('.view-btn').click();
        }
    }
    
    // ESC键返回首页
    if (e.key === 'Escape') {
        if (window.location.pathname !== '/index.html') {
            window.location.href = 'index.html';
        }
    }
});

 */
        
function openDemo(page, params) {
    let url = page + '.html';
    if (params && params.length > 0) {
        let index = 0;
        for (let param of params) {
            url += (index === 0 ? "?" : "&");
            url += param[0] + "=" + param[1];
            index++;
        }
    }
    window.location = url;
}


 // 添加键盘快捷键
 function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // 数字键1-3快速进入场景
        if (e.key >= '1' && e.key <= '3') {
            const index = parseInt(e.key) - 1;
            const cards = document.querySelectorAll('.scene-card');
            if (cards[index]) {
                e.preventDefault();
                cards[index].querySelector('.view-btn').click();
            }
        }
        
        // ESC键显示提示
        if (e.key === 'Escape') {
            showQuickHelp();
        }
        
        // H键显示完整帮助
        if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            showKeyboardHelp();
        }
    });
}

function showQuickHelp() {
    // 简单的底部提示
    const help = document.createElement('div');
    help.innerHTML = '💡 提示: 按 1、2、3 快速选择场景 | H 显示帮助';
    help.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    document.body.appendChild(help);
    setTimeout(() => help.remove(), 3000);
}

function showKeyboardHelp() {
    const helpHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10,10,10,0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 15px;
            padding: 2rem;
            color: white;
            z-index: 10000;
            max-width: 400px;
            width: 90%;
        ">
            <h3 style="margin-bottom: 1.5rem; text-align: center; color: #4facfe;">键盘快捷键</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <kbd style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; min-width: 30px; text-align: center;">1</kbd>
                    <span>进入图书馆大厅</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <kbd style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; min-width: 30px; text-align: center;">2</kbd>
                    <span>进入阅读区</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <kbd style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; min-width: 30px; text-align: center;">3</kbd>
                    <span>进入自习区</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <kbd style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; min-width: 30px; text-align: center;">H</kbd>
                    <span>显示帮助</span>
                </div>
            </div>
            <div style="text-align: center; margin-top: 1.5rem; opacity: 0.7;">
                点击任意位置关闭
            </div>
        </div>
    `;
    
    const helpElement = document.createElement('div');
    helpElement.innerHTML = helpHTML;
    helpElement.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;';
    
    helpElement.addEventListener('click', () => {
        helpElement.remove();
    });
    
    document.body.appendChild(helpElement);
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initKeyboardNavigation);




// 在键盘导航代码中添加自动提示
function initKeyboardNavigation() {
    // 原有的键盘导航代码...
    
    document.addEventListener('keydown', (e) => {
        // 数字键1-3快速进入场景
        if (e.key >= '1' && e.key <= '3') {
            const index = parseInt(e.key) - 1;
            const cards = document.querySelectorAll('.scene-card');
            if (cards[index]) {
                e.preventDefault();
                cards[index].querySelector('.view-btn').click();
            }
        }
        
        // ESC键显示提示
        if (e.key === 'Escape') {
            showQuickHelp();
        }
        
        // H键显示完整帮助
        if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            showKeyboardHelp();
        }
    });
    // 添加自动提示
    showAutoHint();
}

function showAutoHint() {
    // 检查是否已经显示过提示
    if (sessionStorage.getItem('hintShown')) return;
    
    const hint = document.createElement('div');
    hint.innerHTML = `
        <div style="
            background: rgba(0,0,0,0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(79, 172, 254, 0.5);
            border-radius: 15px;
            padding: 1.5rem;
            color: white;
            text-align: center;
            max-width: 400px;
            margin: 0 auto;
        ">
            <div style="font-size: 2rem; margin-bottom: 1rem;">⌨️</div>
            <h3 style="margin-bottom: 1rem; color: #4facfe;">键盘快捷键</h3>
            <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem;">
                    <kbd style="background: rgba(79, 172, 254, 0.2); padding: 4px 12px; border-radius: 6px; border: 1px solid #4facfe;">1</kbd>
                    <kbd style="background: rgba(79, 172, 254, 0.2); padding: 4px 12px; border-radius: 6px; border: 1px solid #4facfe;">2</kbd>
                    <kbd style="background: rgba(79, 172, 254, 0.2); padding: 4px 12px; border-radius: 6px; border: 1px solid #4facfe;">3</kbd>
                    <span>快速选择场景</span>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem;">
                    <kbd style="background: rgba(79, 172, 254, 0.2); padding: 4px 12px; border-radius: 6px; border: 1px solid #4facfe;">H</kbd>
                    <span>随时显示帮助</span>
                </div>
            </div>
            <button onclick="closeHint()" style="
                background: linear-gradient(45deg, #4facfe, #00f2fe);
                border: none;
                padding: 8px 20px;
                border-radius: 20px;
                color: white;
                cursor: pointer;
                font-size: 14px;
            ">开始探索</button>
        </div>
    `;
    
    hint.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        width: 90%;
        max-width: 450px;
        animation: hintEntrance 0.5s ease-out;
    `;
    
    // 背景遮罩
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(hint);
    
    // 标记为已显示
    sessionStorage.setItem('hintShown', 'true');
    
    // 点击遮罩层也关闭
    overlay.addEventListener('click', closeHint);
}

function closeHint() {
    const hint = document.querySelector('[style*="hintEntrance"]');
    const overlay = document.querySelector('[style*="fadeIn"]');
    
    if (hint) hint.remove();
    if (overlay) overlay.remove();
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes hintEntrance {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* 底部常驻提示 */
    .floating-hint {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(79, 172, 254, 0.3);
        border-radius: 20px;
        padding: 10px 20px;
        color: white;
        font-size: 14px;
        z-index: 100;
        animation: slideUp 0.5s ease-out;
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(style);



// 在键盘导航代码中添加底部常驻提示

// 在关闭主提示后显示底部常驻提示
function showFloatingHint() {
    const floatingHint = document.createElement('div');
    floatingHint.className = 'floating-hint';
    floatingHint.innerHTML = '💡 快捷键: 按 <kbd style="background: rgba(79, 172, 254, 0.2); padding: 2px 8px; border-radius: 4px; border: 1px solid #4facfe; margin: 0 4px;">1</kbd><kbd style="background: rgba(79, 172, 254, 0.2); padding: 2px 8px; border-radius: 4px; border: 1px solid #4facfe; margin: 0 4px;">2</kbd><kbd style="background: rgba(79, 172, 254, 0.2); padding: 2px 8px; border-radius: 4px; border: 1px solid #4facfe; margin: 0 4px;">3</kbd> 快速选择场景 | <kbd style="background: rgba(79, 172, 254, 0.2); padding: 2px 8px; border-radius: 4px; border: 1px solid #4facfe; margin: 0 4px;">H</kbd> 显示帮助';
    
    document.body.appendChild(floatingHint);
    
    // 10秒后自动淡出
    setTimeout(() => {
        floatingHint.style.transition = 'all 0.5s ease';
        floatingHint.style.opacity = '0';
        floatingHint.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => floatingHint.remove(), 500);
    }, 10000);
}

// 修改closeHint函数
function closeHint() {
    const hint = document.querySelector('[style*="hintEntrance"]');
    const overlay = document.querySelector('[style*="fadeIn"]');
    
    if (hint) hint.remove();
    if (overlay) overlay.remove();
    
    // 显示底部常驻提示
    showFloatingHint();
}

    