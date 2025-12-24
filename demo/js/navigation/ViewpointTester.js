/**
 * 导览点功能测试器
 */
class ViewpointTester {
    constructor(viewpointManager) {
        this.viewpointManager = viewpointManager;
        this.currentViewpointIndex = 0;
        this.testResults = [];
        this.init();
    }

    init() {
        console.log('🧪 导览点测试器初始化');
        this.updateTestPanel();
        this.runInitialTests();
    }

    /**
     * 运行初始测试
     */
    runInitialTests() {
        console.log('🔍 运行初始测试...');
        
        // 测试1: 检查导览点管理器是否正常
        this.test('导览点管理器实例', () => {
            return this.viewpointManager !== null && this.viewpointManager !== undefined;
        });

        // 测试2: 检查当前场景检测
        this.test('当前场景检测', () => {
            const sceneName = this.viewpointManager.getCurrentSceneName();
            return sceneName && ['lobby', 'reading-area', 'study-area'].includes(sceneName);
        });

        // 测试3: 检查导览点配置加载
        this.test('导览点配置加载', () => {
            const viewpoints = this.viewpointManager.getViewpointsForCurrentScene();
            return viewpoints && viewpoints.length > 0;
        });

        this.updateTestPanel();
    }

    /**
     * 单个测试
     */
    test(name, testFunction) {
        try {
            const result = testFunction();
            this.testResults.push({ name, result, error: null });
            console.log(`${result ? '✅' : '❌'} ${name}: ${result ? '通过' : '失败'}`);
            return result;
        } catch (error) {
            this.testResults.push({ name, result: false, error: error.message });
            console.error(`❌ ${name}: 错误 - ${error.message}`);
            return false;
        }
    }

    /**
     * 更新测试面板显示
     */
    updateTestPanel() {
        // 更新当前场景显示
        const sceneDisplay = document.getElementById('current-scene-display');
        if (sceneDisplay) {
            const sceneName = this.viewpointManager.getCurrentSceneName();
            sceneDisplay.textContent = sceneName || '未知场景';
            sceneDisplay.style.color = sceneName ? '#51cf66' : '#ff6b6b';
        }

        // 更新导览点列表
        this.updateViewpointsList();

        // 更新状态显示
        this.updateStatusDisplay();
    }

    /**
     * 更新导览点列表
     */
    updateViewpointsList() {
        const listContainer = document.getElementById('viewpoints-list');
        if (!listContainer) return;

        const viewpoints = this.viewpointManager.getViewpointsForCurrentScene();
        
        if (viewpoints.length === 0) {
            listContainer.innerHTML = '<div style="color: #ff6b6b; font-size: 0.8rem;">未找到导览点</div>';
            return;
        }

        listContainer.innerHTML = viewpoints.map((viewpoint, index) => `
            <button onclick="testGoToViewpoint('${viewpoint.id}')" 
                    style="
                        background: ${index === this.currentViewpointIndex ? 'rgba(81, 207, 102, 0.3)' : 'rgba(255,255,255,0.1)'};
                        border: 1px solid ${index === this.currentViewpointIndex ? '#51cf66' : 'rgba(255,255,255,0.3)'};
                        color: white;
                        padding: 0.5rem;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 0.8rem;
                        width: 100%;
                        margin-bottom: 0.3rem;
                        text-align: left;
                    "
                    ${this.viewpointManager.getIsAnimating() ? 'disabled' : ''}>
                ${index + 1}. ${viewpoint.name}
                ${index === this.currentViewpointIndex ? ' ✅' : ''}
            </button>
        `).join('');
    }

    /**
     * 更新状态显示
     */
    updateStatusDisplay() {
        const statusDisplay = document.getElementById('navigation-status');
        if (!statusDisplay) return;

        const isAnimating = this.viewpointManager.getIsAnimating();
        const currentViewpoint = this.viewpointManager.getCurrentViewpoint();
        const viewpoints = this.viewpointManager.getViewpointsForCurrentScene();

        let statusText = '';
        let statusColor = '#ffffff';

        if (isAnimating) {
            statusText = '🔄 导航中...';
            statusColor = '#ffd43b';
        } else if (currentViewpoint) {
            statusText = `✅ 位于: ${currentViewpoint.name}`;
            statusColor = '#51cf66';
        } else if (viewpoints.length > 0) {
            statusText = `📊 就绪 - ${viewpoints.length} 个导览点`;
            statusColor = '#4facfe';
        } else {
            statusText = '❌ 未找到导览点';
            statusColor = '#ff6b6b';
        }

        statusDisplay.textContent = statusText;
        statusDisplay.style.color = statusColor;
    }

    /**
     * 切换到指定导览点
     */
    async goToViewpoint(viewpointId) {
        console.log(`🧪 测试切换到导览点: ${viewpointId}`);
        
        await this.viewpointManager.goToViewpoint(viewpointId);
        
        // 更新当前索引
        const viewpoints = this.viewpointManager.getViewpointsForCurrentScene();
        this.currentViewpointIndex = viewpoints.findIndex(v => v.id === viewpointId);
        
        this.updateTestPanel();
    }

    /**
     * 切换到下一个导览点
     */
    async nextViewpoint() {
        const viewpoints = this.viewpointManager.getViewpointsForCurrentScene();
        if (viewpoints.length === 0) return;

        this.currentViewpointIndex = (this.currentViewpointIndex + 1) % viewpoints.length;
        await this.goToViewpoint(viewpoints[this.currentViewpointIndex].id);
    }

    /**
     * 切换到上一个导览点
     */
    async previousViewpoint() {
        const viewpoints = this.viewpointManager.getViewpointsForCurrentScene();
        if (viewpoints.length === 0) return;

        this.currentViewpointIndex = (this.currentViewpointIndex - 1 + viewpoints.length) % viewpoints.length;
        await this.goToViewpoint(viewpoints[this.currentViewpointIndex].id);
    }

    /**
     * 运行完整测试套件
     */
    async runCompleteTestSuite() {
        console.log('🧪 开始完整测试套件...');
        
        const viewpoints = this.viewpointManager.getViewpointsForCurrentScene();
        const testResults = [];

        // 测试每个导览点
        for (let i = 0; i < viewpoints.length; i++) {
            const viewpoint = viewpoints[i];
            
            console.log(`🧪 测试导览点 ${i + 1}/${viewpoints.length}: ${viewpoint.name}`);
            
            const startTime = performance.now();
            
            try {
                await this.goToViewpoint(viewpoint.id);
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                testResults.push({
                    viewpoint: viewpoint.name,
                    success: true,
                    duration: duration,
                    error: null
                });
                
                console.log(`✅ 导览点测试通过: ${viewpoint.name} (${duration.toFixed(0)}ms)`);
                
                // 在每个导览点停留一会儿
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                testResults.push({
                    viewpoint: viewpoint.name,
                    success: false,
                    duration: null,
                    error: error.message
                });
                
                console.error(`❌ 导览点测试失败: ${viewpoint.name}`, error);
            }
        }

        // 显示测试结果
        this.showTestResults(testResults);
    }

    /**
     * 显示测试结果
     */
    showTestResults(results) {
        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;
        const successRate = (successCount / totalCount * 100).toFixed(1);

        const resultsHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(79, 172, 254, 0.5);
                border-radius: 15px;
                padding: 2rem;
                color: white;
                z-index: 10000;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <h3 style="margin: 0 0 1rem 0; color: #4facfe; text-align: center;">🧪 测试结果</h3>
                
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    text-align: center;
                ">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">
                        ${successRate}%
                    </div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">
                        通过率 (${successCount}/${totalCount})
                    </div>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    ${results.map(result => `
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 0.5rem;
                            border-bottom: 1px solid rgba(255,255,255,0.1);
                        ">
                            <span>${result.viewpoint}</span>
                            <div>
                                <span style="color: ${result.success ? '#51cf66' : '#ff6b6b'};">
                                    ${result.success ? '✅' : '❌'}
                                </span>
                                ${result.success ? `<span style="font-size: 0.8rem; opacity: 0.7; margin-left: 0.5rem;">${result.duration.toFixed(0)}ms</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <button onclick="this.parentElement.remove()" style="
                    background: #4facfe;
                    border: none;
                    color: white;
                    padding: 0.7rem 1.5rem;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 100%;
                ">
                    关闭
                </button>
            </div>
        `;

        const resultsElement = document.createElement('div');
        resultsElement.innerHTML = resultsHTML;
        document.body.appendChild(resultsElement);
    }
}

// 全局测试函数
window.testGoToViewpoint = (viewpointId) => {
    if (window.viewpointTester) {
        window.viewpointTester.goToViewpoint(viewpointId);
    }
};

window.testNextViewpoint = () => {
    if (window.viewpointTester) {
        window.viewpointTester.nextViewpoint();
    }
};

window.testPreviousViewpoint = () => {
    if (window.viewpointTester) {
        window.viewpointTester.previousViewpoint();
    }
};

window.runAllTests = () => {
    if (window.viewpointTester) {
        window.viewpointTester.runCompleteTestSuite();
    }
};