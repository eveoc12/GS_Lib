// 性能面板显示控制
class PerformancePanel {
    constructor() {
        this.isVisible = false;
        this.panelElement = null;
        this.updateInterval = null;
        this.createToggleButton();
    }
  
    createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '📊';
        toggleBtn.className = 'performance-toggle';
        toggleBtn.title = '显示性能面板';
        toggleBtn.addEventListener('click', () => this.togglePanel());
        document.body.appendChild(toggleBtn);
        console.log('✅ 性能面板按钮已创建');
    }

    togglePanel() {
        console.log('🔄 点击性能面板按钮');
        if (this.isVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }

    showPanel() {
        console.log('🔄 尝试显示性能面板');
        
        // 检查全局对象
        console.log('performanceMonitor:', window.performanceMonitor);
        console.log('visitStats:', window.visitStats);
        
        // 创建面板
        const panel = document.createElement('div');
        panel.className = 'performance-panel';
        panel.innerHTML = this.getPanelContent();
        
        document.body.appendChild(panel);
        this.panelElement = panel;
        this.isVisible = true;
        
        // 每秒更新面板内容
        this.updateInterval = setInterval(() => {
            if (this.panelElement && this.panelElement.isConnected) {
                this.panelElement.innerHTML = this.getPanelContent();
            }
        }, 1000);

        console.log('✅ 性能面板已显示');
    }

    hidePanel() {
        console.log('🔄 隐藏性能面板');
        if (this.panelElement) {
            this.panelElement.remove();
            this.panelElement = null;
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.isVisible = false;
    }

    getPanelContent() {
        try {
            let fps = 0;
            let loadTime = 0;
            let memory = null;
            let stats = {
                totalVisits: 0,
                mostPopularScene: '暂无数据'
            };

            // 安全地获取 performanceMonitor 数据
            if (window.performanceMonitor && window.performanceMonitor.metrics) {
                fps = window.performanceMonitor.metrics.fps || 0;
                loadTime = window.performanceMonitor.metrics.loadTime || 0;
                memory = window.performanceMonitor.metrics.memory || null;
            } else {
                console.warn('⚠️ performanceMonitor 未找到，使用模拟数据');
                // 模拟数据用于测试
                fps = Math.floor(Math.random() * 30) + 30; // 30-60 FPS
                loadTime = 1200; // 1.2秒
            }

            // 安全地获取 visitStats 数据
            if (window.visitStats && typeof window.visitStats.getStatsSummary === 'function') {
                stats = window.visitStats.getStatsSummary();
            } else {
                console.warn('⚠️ visitStats 未找到，使用默认数据');
            }

            // 确定FPS颜色
            let fpsColor = '#ff6b6b'; // 红色 - 低
            if (fps > 50) fpsColor = '#51cf66'; // 绿色 - 高
            else if (fps > 30) fpsColor = '#ffd43b'; // 黄色 - 中

            // 构建面板内容
            let content = `
                <div style="margin-bottom: 0.8rem; font-weight: bold; color: #4facfe;">性能监控</div>
                
                <div style="display: grid; gap: 0.5rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>帧率:</span>
                        <span style="color: ${fpsColor}">${fps} FPS</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between;">
                        <span>页面加载:</span>
                        <span>${loadTime ? loadTime.toFixed(0) + 'ms' : '计算中...'}</span>
                    </div>`;

            // 内存使用信息（如果可用）
            if (memory && memory.used) {
                const memoryMB = (memory.used / 1024 / 1024).toFixed(1);
                content += `
                    <div style="display: flex; justify-content: space-between;">
                        <span>内存使用:</span>
                        <span>${memoryMB}MB</span>
                    </div>`;
            }

            // 访问统计信息
            content += `
                    <div style="border-top: 1px solid rgba(255,255,255,0.2); margin-top: 0.5rem; padding-top: 0.5rem;">
                        <div style="font-weight: bold; color: #4facfe; margin-bottom: 0.5rem;">访问统计</div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>总访问:</span>
                            <span>${stats.totalVisits}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>最受欢迎:</span>
                            <span>${stats.mostPopularScene}</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 0.8rem; font-size: 10px; opacity: 0.6; text-align: center;">
                    数据更新于: ${new Date().toLocaleTimeString()}
                </div>
            `;

            return content;
        } catch (error) {
            console.error('❌ 生成性能面板内容时出错:', error);
            return `
                <div style="color: #ff6b6b; text-align: center;">
                    <div>❌ 性能数据加载失败</div>
                    <div style="font-size: 10px; margin-top: 0.5rem;">错误: ${error.message}</div>
                </div>
            `;
        }
    }
}

// 初始化性能面板
function initPerformancePanel() {
    try {
        console.log('🔄 开始初始化性能面板...');
        
        // 等待一段时间确保其他脚本已加载
        setTimeout(() => {
            window.performancePanelInstance = new PerformancePanel();
            console.log('✅ 性能面板初始化完成');
            
            // 调试信息
            console.log('全局对象检查:');
            console.log('- performanceMonitor:', window.performanceMonitor);
            console.log('- visitStats:', window.visitStats);
            console.log('- performancePanelInstance:', window.performancePanelInstance);
            
        }, 1500);
    } catch (error) {
        console.error('❌ 性能面板初始化失败:', error);
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformancePanel);
} else {
    initPerformancePanel();
}

// 备用初始化方法
window.addEventListener('load', () => {
    console.log('📄 页面完全加载，再次检查性能面板');
    if (!window.performancePanelInstance) {
        console.log('🔄 重新初始化性能面板');
        initPerformancePanel();
    }
});
