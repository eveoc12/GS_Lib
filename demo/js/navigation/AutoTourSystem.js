/**
 * 自动漫游系统
 */
class AutoTourSystem {
    constructor(viewpointManager, navigationUI) {
        this.viewpointManager = viewpointManager;
        this.navigationUI = navigationUI;
        this.isAutoTourRunning = false;
        this.currentTourIndex = 0;
        this.tourInterval = null;
        this.tourTimeout = null;
        
        console.log('🚀 自动漫游系统初始化');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 监听空格键
        document.addEventListener('keydown', this.handleSpaceKey.bind(this));
        console.log('✅ 自动漫游事件监听器已设置');
    }

    handleSpaceKey(e) {
        // 只在非输入框状态下处理空格键
        if (e.key === ' ' && !this.isInputFocused()) {
            e.preventDefault();
            this.toggleAutoTour();
        }
    }

    isInputFocused() {
        const active = document.activeElement;
        const tagName = active.tagName.toLowerCase();
        return tagName === 'input' || tagName === 'textarea' || active.isContentEditable;
    }

    toggleAutoTour() {
        if (this.isAutoTourRunning) {
            this.stopAutoTour();
        } else {
            this.startAutoTour();
        }
    }

    startAutoTour() {
        const viewpointManager = this.getViewpointManager();
        if (!viewpointManager) {
            this.showMessage('导览点系统未就绪', 'error');
            return;
        }

        const viewpoints = viewpointManager.getAllViewpoints();
        if (!viewpoints || viewpoints.length === 0) {
            this.showMessage('暂无导览点可供漫游', 'warning');
            return;
        }

        this.isAutoTourRunning = true;
        this.currentTourIndex = 0;
        
        console.log('🚀 开始自动漫游，导览点数量:', viewpoints.length);
        this.showMessage('自动漫游已开始 🚀 按空格键停止', 'success');
        this.updateAutoTourStatus();
        
        // 开始漫游
        this.runAutoTourStep();
    }

    // 🆕 修复停止功能 - 彻底清理所有定时器
    stopAutoTour() {
        console.log('🛑 停止自动漫游 - 清理所有定时器');
        
        this.isAutoTourRunning = false;
        
        // 清除所有可能的定时器
        if (this.tourInterval) {
            clearTimeout(this.tourInterval);
            this.tourInterval = null;
            console.log('✅ 清除 tourInterval');
        }
        
        if (this.tourTimeout) {
            clearTimeout(this.tourTimeout);
            this.tourTimeout = null;
            console.log('✅ 清除 tourTimeout');
        }
        
        // 额外清理可能存在的其他定时器
        this.cleanupAllTimers();
        
        console.log('🛑 停止自动漫游完成');
        this.showMessage('自动漫游已停止', 'info');
        this.updateAutoTourStatus();
    }

    // 🆕 清理所有可能的定时器
    cleanupAllTimers() {
        // 获取所有可能的定时器ID并清理
        const maxTimerId = setTimeout(() => {}, 0);
        for (let i = maxTimerId; i > 0; i--) {
            clearTimeout(i);
            clearInterval(i);
        }
        console.log('🧹 清理所有定时器完成');
    }

    async runAutoTourStep() {
        if (!this.isAutoTourRunning) {
            console.log('⏹️ 自动漫游已停止，退出运行循环');
            return;
        }

        const viewpointManager = this.getViewpointManager();
        if (!viewpointManager) {
            this.stopAutoTour();
            return;
        }

        const viewpoints = viewpointManager.getAllViewpoints();
        if (!viewpoints || viewpoints.length === 0) {
            this.stopAutoTour();
            return;
        }
        
        // 检查是否完成一轮漫游
        if (this.currentTourIndex >= viewpoints.length) {
            this.currentTourIndex = 0; // 重新开始
        }

        const viewpoint = viewpoints[this.currentTourIndex];
        
        try {
            console.log(`🎯 自动漫游步骤 ${this.currentTourIndex + 1}/${viewpoints.length}:`, viewpoint.name);
            await viewpointManager.goToViewpoint(viewpoint.id);
            
            // 只有在仍然运行的情况下才继续
            if (this.isAutoTourRunning) {
                // 更新进度
                this.currentTourIndex++;
                this.updateTourProgress();
                
                // 设置下一个步骤的延迟
                const delay = (viewpoint.duration || 2) * 1000 + 2000;
                this.tourInterval = setTimeout(() => this.runAutoTourStep(), delay);
            }
            
        } catch (error) {
            console.error('❌ 自动漫游步骤执行失败:', error);
            if (this.isAutoTourRunning) {
                // 出错时也继续下一个
                this.currentTourIndex++;
                this.tourTimeout = setTimeout(() => this.runAutoTourStep(), 2000);
            }
        }
    }

    getViewpointManager() {
        return window.viewpointManager;
    }

    updateTourProgress() {
        const viewpointManager = this.getViewpointManager();
        if (!viewpointManager) return;

        const viewpoints = viewpointManager.getAllViewpoints();
        const progressElement = document.getElementById('tour-progress');
        const progressBar = document.getElementById('tour-progress-bar');
        
        if (progressElement && progressBar && viewpoints) {
            const progress = ((this.currentTourIndex) / viewpoints.length) * 100;
            progressElement.textContent = `${this.currentTourIndex}/${viewpoints.length}`;
            progressBar.style.width = `${progress}%`;
        }
    }

    updateAutoTourStatus() {
        const startBtn = document.getElementById('start-autotour-btn');
        const stopBtn = document.getElementById('stop-autotour-btn');
        
        if (startBtn && stopBtn) {
            if (this.isAutoTourRunning) {
                startBtn.disabled = true;
                startBtn.innerHTML = '🚀 漫游中...';
                stopBtn.disabled = false;
            } else {
                startBtn.disabled = false;
                startBtn.innerHTML = '🚀 开始自动漫游';
                stopBtn.disabled = true;
            }
        }
    }

    showMessage(message, type = 'info') {
        // 移除旧消息
        const oldMessage = document.querySelector('.autotour-message');
        if (oldMessage) {
            oldMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `autotour-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getMessageColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            font-family: 'Microsoft YaHei', sans-serif;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                messageDiv.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 300);
            }
        }, 3000);
    }

    getMessageColor(type) {
        const colors = {
            'info': 'rgba(79, 172, 254, 0.9)',
            'success': 'rgba(81, 207, 102, 0.9)',
            'warning': 'rgba(255, 213, 59, 0.9)',
            'error': 'rgba(255, 107, 107, 0.9)'
        };
        return colors[type] || colors.info;
    }

    // 🆕 获取系统状态（用于调试）
    getStatus() {
        return {
            isAutoTourRunning: this.isAutoTourRunning,
            currentTourIndex: this.currentTourIndex,
            tourInterval: !!this.tourInterval,
            tourTimeout: !!this.tourTimeout,
            viewpointManager: !!this.getViewpointManager()
        };
    }

    // 🆕 强制停止（供外部调用）
    forceStop() {
        console.log('🛑 强制停止自动漫游');
        this.stopAutoTour();
    }

    // 🆕 销毁清理
    destroy() {
        this.stopAutoTour();
        console.log('🧹 自动漫游系统已清理');
    }
}

// 创建全局实例
console.log('🚀 创建自动漫游系统...');
window.autoTourSystem = new AutoTourSystem();

console.log('✅ AutoTourSystem.js 加载完成');







