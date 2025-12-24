
//NEW 在模型页的script标签中添加
function initModelKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // ESC键返回首页
      /*   if (e.key === 'Escape') {
            e.preventDefault();
            openDemo('index', []);
        } */
        
        // 数字键1-3快速切换场景
        if (e.key >= '1' && e.key <= '3') {
            e.preventDefault();
            const scenes = { '1': 'lobby', '2': 'reading-area', '3': 'study-area' };
            const targetScene = scenes[e.key];
            if (targetScene) {
                openDemo(targetScene, [['mode', '0']]);
            }
        }
        
        // I键切换信息面板
        if (e.key === 'i' || e.key === 'I') {
            e.preventDefault();
            if (typeof toggleInfoPanel === 'function') {
                toggleInfoPanel();
            }
        }
        
        // H键显示帮助
        if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            showModelHelp();
        }
    });
}


function showModelHelp() {
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
            <h3 style="margin-bottom: 1.5rem; text-align: center; color: #4facfe;">场景控制</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
                    <kbd style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; min-width: 40px; text-align: center;">1-3</kbd>
                    <span>快速切换场景</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <kbd style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; min-width: 40px; text-align: center;">N</kbd>
                    <span>显示导航</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <kbd style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; min-width: 40px; text-align: center;">I</kbd>
                    <span>显示/隐藏信息</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <kbd style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; min-width: 40px; text-align: center;">H</kbd>
                    <span>显示帮助</span>
                </div>
                 <div style="display: flex; align-items: center; gap: 1rem;">
                    <kbd style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; min-width: 40px; text-align: center;">P</kbd>
                    <span>切换点云</span>
                </div>
            
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                <h4 style="margin-bottom: 0.5rem; color: #4facfe;">鼠标控制</h4>
                <p style="font-size: 0.9rem; opacity: 0.8;">左键拖动旋转 · 滚轮缩放 · 右键拖动平移</p>
            </div>
              <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                <h4 style="margin-bottom: 0.5rem; color: #4facfe;">位置控制</h4>
                <p style="font-size: 0.9rem; opacity: 0.8;">WASD 移动 · ← → 方向键旋转视角</p>
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











