/**
 * 导览点管理系统 - 修复版
 * 兼容 GaussianSplats3D 查看器
 */
class ViewpointManager {
    constructor(viewer) {
        this.viewer = viewer; // Gaussian Splatting 查看器实例
        this.viewpoints = new Map(); // 存储所有导览点
        this.currentViewpoint = null; // 当前导览点
        this.isAnimating = false; // 是否正在动画中
        this.animationFrameId = null; // 动画帧ID
        
        this.init();
    }

    init() {
        console.log('🎯 导览点系统初始化');
        this.loadViewpointsConfig();
        this.setupEventListeners();
    }

    /**
     * 加载导览点配置
     */
  


    loadViewpointsConfig() {
        // 导览点配置数据
        this.viewpointsConfig = {
            'lobby': [
                {
                    id: 'lobby-entrance',
                    name: '入口视角',
                    description: '从主入口观看图书馆大厅的全貌',
                    position:    [-2.14, -0.398, 4.783],
                    lookAt:  [-0.943, 0.644, -0.706],
                    up: [0, -0.87991, -0.47515],
                    duration: 2.0 // 过渡时间（秒）
                },
                {
                    id: 'lobby-center', 
                    name: '中心环视',
                    description: '站在大厅中心环视四周建筑结构',
                    position:    [-2.14, -0.398, -4.783],
                    lookAt:  [-0.943, 0.644, -0.706],
                    up: [0, -0.87991, -0.47515],
                    duration: 2.5
                },
                {
                    id: 'lobby-detail',
                    name: '细节观察',
                    description: '近距离观察建筑细节和装饰',
                    position: [-2.14, 0.398, 4.783],
                    lookAt: [-1.943, -1.644, -1.706],
                    up: [0, -0.87991, -0.47515],
                    duration: 1.8
                }
            ],
            'reading-area': [
                {
                    id: 'reading-overview',
                    name: '全景概览',
                    description: '阅读区整体布局和氛围',
                    position:[9.14278, -0.41128, -5.20773],
                    lookAt: [6.15587, -0.03902, -4.71245],
                    up: [-0.20945, -0.97763, 0.01916],
                    duration: 2.0
                },
                {
                    id: 'reading-desk',
                    name: '书桌视角',
                    description: '模拟坐在书桌前阅读的视角',
                    position: [1.15120, -0.14341, 2.74021],
                    lookAt: [	0.70176, 0.03571, -5.11253],
                    up: [0.00488, -0.99860, 0.05260],
                    duration: 2.2
                }

            ],
            'study-area': [
                {
                    id: 'study-entrance',
                    name: '自习区入口',
                    description: '从入口观看自习区整体环境',
                    position: [6.11151, -0.60631, 3.36090],
                    lookAt: [3.19620, 0.11160, 0.03988],
                    up: [-0.09570, -0.98395, -0.15059],
                    duration: 2.0
                },
                {
                    id: 'study-center',
                    name: '学习氛围',
                    description: '感受自习区的学习氛围和空间布局',
                    position: [	-8.83510, -1.60124, -0.98596],
                    lookAt: [	1.32427, 1.17378, 3.50545],
                    up: [		-0.16831, -0.98206, -0.08504],
                    duration: 2.3
                }
            ]
        };

        console.log('✅ 导览点配置加载完成');
    }

    /**
     * 根据当前场景获取导览点
     */
    getViewpointsForCurrentScene() {
        const currentScene = this.getCurrentSceneName();
        const viewpoints = this.viewpointsConfig[currentScene] || [];
        console.log(`📊 获取场景 ${currentScene} 的导览点:`, viewpoints.length);
        return viewpoints;
    }

    /**
     * 获取当前场景名称
     */
    getCurrentSceneName() {
        const path = window.location.pathname;
        const sceneName = path.split('/').pop().replace('.html', '');
        console.log('📍 当前场景:', sceneName);
        return sceneName;
    }

    /**
     * 切换到指定导览点
     */
    async goToViewpoint(viewpointId) {
        if (this.isAnimating) {
            console.warn('⚠️ 正在执行动画，请稍候');
            return;
        }

        const viewpoints = this.getViewpointsForCurrentScene();
        const viewpoint = viewpoints.find(v => v.id === viewpointId);
        
        if (!viewpoint) {
            console.error('❌ 未找到导览点:', viewpointId);
            return;
        }

        console.log(`🎯 切换到导览点: ${viewpoint.name}`, viewpoint);
        this.isAnimating = true;
        this.currentViewpoint = viewpoint;

        // 更新UI状态
        this.onViewpointChangeStart(viewpoint);

        try {
            // 执行相机动画
            await this.animateCameraToViewpoint(viewpoint);
            
            // 动画完成
            this.onViewpointChangeComplete(viewpoint);
            
        } catch (error) {
            console.error('❌ 导览点切换失败:', error);
            this.onViewpointChangeError(error);
        } finally {
            this.isAnimating = false;
        }
    }

    /**
     * 相机动画到导览点 - 修复版
     * 兼容 GaussianSplats3D 查看器
     */
    async animateCameraToViewpoint(viewpoint) {
        return new Promise((resolve, reject) => {
            try {
                // 获取当前相机状态
                const currentPosition = this.getCurrentCameraPosition();
                const currentTarget = this.getCurrentCameraTarget();
                
                console.log('📷 相机动画开始:', {
                    from: currentPosition,
                    to: viewpoint.position,
                    target: viewpoint.lookAt
                });

                // 设置动画参数
                const duration = viewpoint.duration || 2.0;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = (currentTime - startTime) / 1000;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // 使用缓动函数
                    const easeProgress = this.easeInOutCubic(progress);
                    
                    // 插值计算当前位置和目标
                    const newPosition = this.interpolateVector(
                        currentPosition, 
                        viewpoint.position, 
                        easeProgress
                    );
                    const newTarget = this.interpolateVector(
                        currentTarget,
                        viewpoint.lookAt,
                        easeProgress
                    );
                    
                    // 更新相机
                    this.setCameraView(newPosition, newTarget, viewpoint.up);
                    
                    if (progress < 1) {
                        this.animationFrameId = requestAnimationFrame(animate);
                    } else {
                        // 动画完成
                        console.log('✅ 相机动画完成');
                        this.animationFrameId = null;
                        resolve();
                    }
                };
                
                this.animationFrameId = requestAnimationFrame(animate);
                
            } catch (error) {
                console.error('❌ 相机动画错误:', error);
                this.animationFrameId = null;
                reject(error);
            }
        });
    }

    /**
     * 获取当前相机位置 - 兼容性方法
     */
    getCurrentCameraPosition() {
        try {
            // 方法1: 尝试 viewer 的方法
            if (this.viewer && this.viewer.getCameraPosition) {
                const position = this.viewer.getCameraPosition();
                if (position && Array.isArray(position)) {
                    return position;
                }
            }
            
            // 方法2: 尝试 camera 属性
            if (this.viewer && this.viewer.camera) {
                const camera = this.viewer.camera;
                if (camera.position) {
                    return [camera.position.x, camera.position.y, camera.position.z];
                }
            }
            
            // 方法3: 使用默认值
            console.warn('⚠️ 无法获取相机位置，使用默认值');
            return [-3.15634, -0.16946, -0.51552]; // 默认位置
            
        } catch (error) {
            console.error('❌ 获取相机位置失败:', error);
            return [-3.15634, -0.16946, -0.51552];
        }
    }

    /**
     * 获取当前相机目标 - 兼容性方法
     */
    getCurrentCameraTarget() {
        try {
            // 方法1: 尝试 viewer 的方法
            if (this.viewer && this.viewer.getCameraLookAt) {
                const target = this.viewer.getCameraLookAt();
                if (target && Array.isArray(target)) {
                    return target;
                }
            }
            
            // 方法2: 基于位置计算简单目标
            const position = this.getCurrentCameraPosition();
            return [position[0], position[1], position[2] - 1]; // 简单的向前看
            
        } catch (error) {
            console.error('❌ 获取相机目标失败:', error);
            const position = this.getCurrentCameraPosition();
            return [position[0], position[1], position[2] - 1];
        }
    }

    /**
     * 设置相机视图 - 统一方法
     */
    setCameraView(position, target, up = [0, -1, -0.54]) {
        try {
            console.log('🎥 设置相机视图:', { position, target, up });
            
            // 方法1: 使用 viewer 的专用方法
            if (this.viewer && this.viewer.setCameraPosition && this.viewer.setCameraLookAt) {
                this.viewer.setCameraPosition(position);
                this.viewer.setCameraLookAt(target);
                return;
            }
            
            // 方法2: 直接操作 camera（如果可用）
            if (this.viewer && this.viewer.camera) {
                const camera = this.viewer.camera;
                
                // 设置位置
                if (camera.position) {
                    camera.position.set(position[0], position[1], position[2]);
                }
                
                // 设置目标
                if (camera.lookAt && typeof camera.lookAt === 'function') {
                    camera.lookAt(target[0], target[1], target[2]);
                }
                
                // 设置向上向量
                if (camera.up && up) {
                    camera.up.set(up[0], up[1], up[2]);
                }
                
                // 更新矩阵
                if (camera.updateMatrixWorld) {
                    camera.updateMatrixWorld();
                }
                
                return;
            }
            
            console.warn('⚠️ 无法设置相机视图: 不支持的查看器');
            
        } catch (error) {
            console.error('❌ 设置相机视图失败:', error);
        }
    }

    /**
     * 缓动函数 - 平滑的加速和减速
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * 向量插值
     */
    interpolateVector(start, end, progress) {
        return [
            start[0] + (end[0] - start[0]) * progress,
            start[1] + (end[1] - start[1]) * progress,
            start[2] + (end[2] - start[2]) * progress
        ];
    }

    /**
     * 导览点切换开始回调
     */
    onViewpointChangeStart(viewpoint) {
        console.log(`🚀 开始切换到: ${viewpoint.name}`);
        
        // 更新UI显示
        if (window.navigationUI) {
            window.navigationUI.onViewpointChangeStart(viewpoint);
        }
        
        // 显示加载状态
        this.showNavigationOverlay(`正在切换到: ${viewpoint.name}`);
    }

    /**
     * 导览点切换完成回调
     */
    onViewpointChangeComplete(viewpoint) {
        console.log(`✅ 已到达导览点: ${viewpoint.name}`);
        
        // 更新UI显示
        if (window.navigationUI) {
            window.navigationUI.onViewpointChangeComplete(viewpoint);
        }
        
        // 隐藏加载状态
        this.hideNavigationOverlay();
        
        // 显示导览点信息
        this.showViewpointInfo(viewpoint);
    }

    /**
     * 导览点切换错误回调
     */
    onViewpointChangeError(error) {
        console.error('❌ 导览点切换错误:', error);
        
        if (window.navigationUI) {
            window.navigationUI.onViewpointChangeError(error);
        }
        
        this.hideNavigationOverlay();
        this.showError('导航失败，请重试');
    }

    /**
     * 显示导航遮罩层
     */
    showNavigationOverlay(message) {
        let overlay = document.getElementById('navigation-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'navigation-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
                z-index: 10000;
                backdrop-filter: blur(5px);
                font-family: 'Microsoft YaHei', sans-serif;
            `;
            document.body.appendChild(overlay);
        }
        
        overlay.innerHTML = `
            <div class="navigation-loading" style="text-align: center;">
                <div class="loading-spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top: 3px solid #4facfe;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                "></div>
                <p style="font-size: 1.1rem; margin: 0; opacity: 0.9;">${message}</p>
                <p style="font-size: 0.9rem; margin: 0.5rem 0 0 0; opacity: 0.7;">请稍候...</p>
            </div>
        `;
        overlay.style.display = 'flex';
        
        // 添加CSS动画
        this.addNavigationStyles();
    }

    /**
     * 隐藏导航遮罩层
     */
    hideNavigationOverlay() {
        const overlay = document.getElementById('navigation-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    /**
     * 显示导览点信息
     */
    showViewpointInfo(viewpoint) {
        // 移除旧的信息面板
        const oldPanel = document.getElementById('viewpoint-info-panel');
        if (oldPanel) {
            oldPanel.remove();
        }

        // 创建新的信息面板
        const infoPanel = document.createElement('div');
        infoPanel.id = 'viewpoint-info-panel';
        infoPanel.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(79, 172, 254, 0.5);
            border-radius: 10px;
            padding: 1rem 1.5rem;
            color: white;
            z-index: 1000;
            max-width: 400px;
            text-align: center;
            animation: slideUp 0.3s ease;
            font-family: 'Microsoft YaHei', sans-serif;
        `;
        
        infoPanel.innerHTML = `
            <h4 style="margin: 0 0 0.5rem 0; color: #4facfe; font-size: 1.1rem;">${viewpoint.name}</h4>
            <p style="margin: 0; font-size: 0.9rem; opacity: 0.9; line-height: 1.4;">${viewpoint.description}</p>
        `;
        
        document.body.appendChild(infoPanel);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            if (infoPanel && infoPanel.parentNode) {
                infoPanel.style.opacity = '0';
                infoPanel.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    if (infoPanel && infoPanel.parentNode) {
                        infoPanel.parentNode.removeChild(infoPanel);
                    }
                }, 300);
            }
        }, 3000);
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            font-family: 'Microsoft YaHei', sans-serif;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    /**
     * 添加导航样式
     */
    addNavigationStyles() {
        if (document.getElementById('navigation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'navigation-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
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
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 监听场景变化
        window.addEventListener('popstate', () => {
            this.onSceneChange();
        });
    }

    /**
     * 场景变化处理
     */
    onSceneChange() {
        console.log('🔄 场景变化，重置导览点状态');
        this.currentViewpoint = null;
        this.isAnimating = false;
        
        // 取消动画
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * 获取当前导览点
     */
    getCurrentViewpoint() {
        return this.currentViewpoint;
    }

    /**
     * 检查是否正在动画中
     */
    getIsAnimating() {
        return this.isAnimating;
    }

    /**
     * 获取所有导览点
     */
    getAllViewpoints() {
        return this.getViewpointsForCurrentScene();
    }

    /**
     * 销毁清理
     */
    destroy() {
        console.log('🧹 清理导览点系统');
        
        this.viewpoints.clear();
        this.currentViewpoint = null;
        this.isAnimating = false;
        
        // 取消动画
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // 移除UI元素
        this.hideNavigationOverlay();
        const infoPanel = document.getElementById('viewpoint-info-panel');
        if (infoPanel && infoPanel.parentNode) {
            infoPanel.parentNode.removeChild(infoPanel);
        }
        
        const overlay = document.getElementById('navigation-overlay');
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ViewpointManager;
} else {
    window.ViewpointManager = ViewpointManager;
}

console.log('✅ ViewpointManager.js 加载完成');