/**
 * 导航UI面板组件
 * 提供用户友好的导览点选择和导航控制界面
 */
class NavigationUI {
    constructor(viewpointManager) {
        this.viewpointManager = viewpointManager;
        this.isPanelVisible = false;
        this.isAutoTourRunning = false;
        this.currentTourIndex = 0;
        this.tourInterval = null;
        
        console.log('🎨 初始化导航UI面板');
        this.createNavigationPanel();
        this.setupEventListeners();
        this.updateViewpointsList();
    }

    /**
     * 创建导航面板
     */
    createNavigationPanel() {
        // 移除已存在的面板
        const existingPanel = document.getElementById('navigation-ui-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // 创建主面板
        this.panel = document.createElement('div');
        this.panel.id = 'navigation-ui-panel';
        this.panel.className = 'navigation-panel';
        this.panel.innerHTML = this.getPanelHTML();
        
        document.body.appendChild(this.panel);
        
        console.log('✅ 导航UI面板创建完成');
    }

    getPanelHTML() {
        return `
            <div class="navigation-header">
                <h3>🗺️ 场景导航</h3>
                <button class="close-btn" onclick="navigationUI.hidePanel()">×</button>
            </div>
            
            <div class="navigation-content">
                <!-- 当前导览点信息 -->
                <div class="current-viewpoint-section">
                    <h4>当前位置</h4>
                    <div id="current-viewpoint-info" class="current-viewpoint-info">
                        <div class="viewpoint-name">未选择导览点</div>
                        <div class="viewpoint-description">请选择一个导览点开始导航</div>
                    </div>
                </div>

                <!-- 导览点列表 -->
                <div class="viewpoints-section">
                    <h4>导览点列表</h4>
                    <div id="viewpoints-container" class="viewpoints-container">
                        <div class="loading-viewpoints">加载中...</div>
                    </div>
                </div>

                <!-- 自动漫游控制 -->
                <div class="autotour-section">
                    <h4>自动漫游</h4>
                    <div class="autotour-controls">
                        <button id="start-autotour-btn" class="autotour-btn primary" onclick="navigationUI.startAutoTour()">
                            🚀 开始自动漫游
                        </button>
                        <button id="stop-autotour-btn" class="autotour-btn secondary" onclick="navigationUI.stopAutoTour()" disabled>
                            ⏸️ 停止漫游
                        </button>
                    </div>
                    <div class="autotour-progress">
                        <div class="progress-info">
                            <span>进度:</span>
                            <span id="tour-progress">0/0</span>
                        </div>
                        <div class="progress-bar">
                            <div id="tour-progress-bar" class="progress-fill" style="width: 0%"></div>
                        </div>
                    </div>
                </div>

                <!-- 导航控制 -->
                <div class="navigation-controls">
                    <button class="nav-control-btn prev" onclick="navigationUI.previousViewpoint()" title="上一个导览点">
                        ◀️ 上一个
                    </button>
                    <button class="nav-control-btn next" onclick="navigationUI.nextViewpoint()" title="下一个导览点">
                        下一个 ▶️
                    </button>
                </div>
            </div>
            
            <div class="navigation-footer">
                <div class="shortcut-hints">
                    <span>💡 提示: 按 <kbd>空格键</kbd> 控制自动漫游</span>
                </div>
            </div>
        `;
    }

    /**
     * 显示导航面板
     */
    showPanel() {
        if (this.panel) {
            this.panel.classList.add('active');
            this.isPanelVisible = true;
            this.updateViewpointsList();
            this.updateCurrentViewpointInfo();
            console.log('📱 显示导航面板');
        }
    }

    /**
     * 隐藏导航面板
     */
    hidePanel() {
        if (this.panel) {
            this.panel.classList.remove('active');
            this.isPanelVisible = false;
            console.log('📱 隐藏导航面板');
        }
    }

    /**
     * 切换面板显示状态
     */
    togglePanel() {
        if (this.isPanelVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }

    /**
     * 更新导览点列表
     */
    updateViewpointsList() {
        const container = document.getElementById('viewpoints-container');
        if (!container) return;

        const viewpoints = this.viewpointManager.getAllViewpoints();
        
        if (viewpoints.length === 0) {
            container.innerHTML = '<div class="no-viewpoints">暂无导览点</div>';
            return;
        }

        const currentViewpoint = this.viewpointManager.getCurrentViewpoint();
        
        container.innerHTML = viewpoints.map((viewpoint, index) => `
            <div class="viewpoint-item ${currentViewpoint && currentViewpoint.id === viewpoint.id ? 'active' : ''}" 
                 onclick="navigationUI.goToViewpoint('${viewpoint.id}')">
                <div class="viewpoint-number">${index + 1}</div>
                <div class="viewpoint-content">
                    <div class="viewpoint-title">${viewpoint.name}</div>
                    <div class="viewpoint-desc">${viewpoint.description}</div>
                </div>
                <div class="viewpoint-actions">
                    ${currentViewpoint && currentViewpoint.id === viewpoint.id ? '✅' : '👉'}
                </div>
            </div>
        `).join('');
    }

    /**
     * 更新当前导览点信息
     */
    updateCurrentViewpointInfo() {
        const container = document.getElementById('current-viewpoint-info');
        if (!container) return;

        const currentViewpoint = this.viewpointManager.getCurrentViewpoint();
        
        if (currentViewpoint) {
            container.innerHTML = `
                <div class="viewpoint-name">${currentViewpoint.name}</div>
                <div class="viewpoint-description">${currentViewpoint.description}</div>
            `;
        } else {
            container.innerHTML = `
                <div class="viewpoint-name">未选择导览点</div>
                <div class="viewpoint-description">请选择一个导览点开始导航</div>
            `;
        }
    }

    /**
     * 切换到指定导览点
     */
    async goToViewpoint(viewpointId) {
        console.log(`🎯 UI: 切换到导览点 ${viewpointId}`);
        
        await this.viewpointManager.goToViewpoint(viewpointId);
        
        // 更新UI状态
        this.updateViewpointsList();
        this.updateCurrentViewpointInfo();
        this.updateTourProgress();
    }

    /**
     * 切换到下一个导览点
     */
    async nextViewpoint() {
        const viewpoints = this.viewpointManager.getAllViewpoints();
        if (viewpoints.length === 0) return;

        const currentViewpoint = this.viewpointManager.getCurrentViewpoint();
        let currentIndex = 0;
        
        if (currentViewpoint) {
            currentIndex = viewpoints.findIndex(v => v.id === currentViewpoint.id);
        }
        
        const nextIndex = (currentIndex + 1) % viewpoints.length;
        await this.goToViewpoint(viewpoints[nextIndex].id);
    }

    /**
     * 切换到上一个导览点
     */
    async previousViewpoint() {
        const viewpoints = this.viewpointManager.getAllViewpoints();
        if (viewpoints.length === 0) return;

        const currentViewpoint = this.viewpointManager.getCurrentViewpoint();
        let currentIndex = 0;
        
        if (currentViewpoint) {
            currentIndex = viewpoints.findIndex(v => v.id === currentViewpoint.id);
        }
        
        const prevIndex = (currentIndex - 1 + viewpoints.length) % viewpoints.length;
        await this.goToViewpoint(viewpoints[prevIndex].id);
    }

    /**
     * 开始自动漫游
     */
    startAutoTour() {
        const viewpoints = this.viewpointManager.getAllViewpoints();
        if (viewpoints.length === 0) {
            this.showMessage('暂无导览点可供漫游', 'warning');
            return;
        }

        this.isAutoTourRunning = true;
        this.currentTourIndex = 0;
        
        // 更新按钮状态
        this.updateAutoTourButtons();
        
        console.log('🚀 开始自动漫游');
        this.showMessage('自动漫游已开始', 'success');
        
        // 开始漫游
        this.runAutoTourStep();
    }

    /**
     * 停止自动漫游
     */
  /*   stopAutoTour() {
        this.isAutoTourRunning = false;
        
        // 清除定时器
        if (this.tourInterval) {
            clearTimeout(this.tourInterval);
            this.tourInterval = null;
        }
        
        // 更新按钮状态
        this.updateAutoTourButtons();
        
        console.log('🛑 停止自动漫游');
        this.showMessage('自动漫游已停止', 'info');
    }
 */

    // 在 NavigationUI 类的 stopAutoTour 方法中
stopAutoTour() {
    console.log('🛑 NavigationUI: 停止自动漫游');
    
    // 停止当前的自动漫游
    this.isAutoTourRunning = false;
    
    // 清除定时器
    if (this.tourInterval) {
        clearTimeout(this.tourInterval);
        this.tourInterval = null;
        console.log('✅ 清除 NavigationUI tourInterval');
    }
    
    // 🆕 同时停止 autoTourSystem
    if (window.autoTourSystem && typeof autoTourSystem.stopAutoTour === 'function') {
        console.log('🛑 同时停止 autoTourSystem');
        window.autoTourSystem.stopAutoTour();
    }
    
    // 🆕 同时停止 autoSpacebarTrigger 的简单导览
    if (window.autoSpacebarTrigger && window.autoSpacebarTrigger.stopAutoTour) {
        console.log('🛑 同时停止 autoSpacebarTrigger 导览');
        window.autoSpacebarTrigger.stopAutoTour();
    }
    
    // 更新按钮状态
    this.updateAutoTourButtons();
    
    console.log('🛑 自动漫游已停止');
    this.showMessage('自动漫游已停止', 'info');
}
    /**
     * 执行自动漫游步骤
     */
    async runAutoTourStep() {
        if (!this.isAutoTourRunning) return;

        const viewpoints = this.viewpointManager.getAllViewpoints();
        
        if (this.currentTourIndex >= viewpoints.length) {
            // 漫游完成，重新开始
            this.currentTourIndex = 0;
        }

        const viewpoint = viewpoints[this.currentTourIndex];
        await this.goToViewpoint(viewpoint.id);
        
        // 更新进度
        this.currentTourIndex++;
        this.updateTourProgress();
        
        if (this.isAutoTourRunning) {
            // 设置下一个步骤的延迟
            const delay = (viewpoint.duration || 3) * 1000;
            this.tourInterval = setTimeout(() => this.runAutoTourStep(), delay);
        }
    }

    /**
     * 更新自动漫游进度
     */
    updateTourProgress() {
        const viewpoints = this.viewpointManager.getAllViewpoints();
        const progressElement = document.getElementById('tour-progress');
        const progressBar = document.getElementById('tour-progress-bar');
        
        if (progressElement && progressBar) {
            const currentViewpoint = this.viewpointManager.getCurrentViewpoint();
            let currentIndex = 0;
            
            if (currentViewpoint) {
                currentIndex = viewpoints.findIndex(v => v.id === currentViewpoint.id);
            }
            
            const progress = ((currentIndex + 1) / viewpoints.length) * 100;
            
            progressElement.textContent = `${currentIndex + 1}/${viewpoints.length}`;
            progressBar.style.width = `${progress}%`;
        }
    }

    /**
     * 更新自动漫游按钮状态
     */
    updateAutoTourButtons() {
        const startBtn = document.getElementById('start-autotour-btn');
        const stopBtn = document.getElementById('stop-autotour-btn');
        
        if (startBtn && stopBtn) {
            if (this.isAutoTourRunning) {
                startBtn.disabled = true;
                startBtn.textContent = '🚀 漫游中...';
                stopBtn.disabled = false;
            } else {
                startBtn.disabled = false;
                startBtn.textContent = '🚀 开始自动漫游';
                stopBtn.disabled = true;
            }
        }
    }

    /**
     * 显示消息提示
     */
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `navigation-message ${type}`;
        messageDiv.textContent = message;
        
        // 添加到面板
        const content = document.querySelector('.navigation-content');
        if (content) {
            content.insertBefore(messageDiv, content.firstChild);
            
            // 3秒后自动移除
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 3000);
        }
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 监听导览点变化
        if (this.viewpointManager) {
            // 保存原始回调
            const originalStart = this.viewpointManager.onViewpointChangeStart;
            const originalComplete = this.viewpointManager.onViewpointChangeComplete;
            
            // 重写回调以包含UI更新
            this.viewpointManager.onViewpointChangeStart = (viewpoint) => {
                if (originalStart) originalStart.call(this.viewpointManager, viewpoint);
                this.onViewpointChangeStart(viewpoint);
            };
            
            this.viewpointManager.onViewpointChangeComplete = (viewpoint) => {
                if (originalComplete) originalComplete.call(this.viewpointManager, viewpoint);
                this.onViewpointChangeComplete(viewpoint);
            };
        }

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                this.togglePanel();
            }
        });
    }

    /**
     * 导览点切换开始回调
     */
    onViewpointChangeStart(viewpoint) {
        console.log('🎯 UI: 导览点切换开始');
    }

    /**
     * 导览点切换完成回调
     */
    onViewpointChangeComplete(viewpoint) {
        console.log('🎯 UI: 导览点切换完成');
        this.updateViewpointsList();
        this.updateCurrentViewpointInfo();
        this.updateTourProgress();
    }

    /**
     * 销毁清理
     */
    destroy() {
        this.stopAutoTour();
        
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
        
        this.isPanelVisible = false;
        console.log('🧹 导航UI面板已清理');
    }
}

// 导出到全局
window.NavigationUI = NavigationUI;
console.log('✅ NavigationUI.js 加载完成');