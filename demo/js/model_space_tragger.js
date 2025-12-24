
  // ==================== 修复版自动空格键触发系统 ====================
  
  class AutoSpacebarTrigger {
      constructor() {
          this.hasTriggered = false;
          this.maxAttempts = 25;
          this.attemptCount = 0;
          this.checkInterval = null;
          this.init();
      }
  
      init() {
          console.log('🎯 初始化自动空格键触发系统');
          this.checkAndTrigger();
      }
  
      checkAndTrigger() {
          const shouldTrigger = localStorage.getItem('autoTriggerSpacebar') === 'true';
          const scene = localStorage.getItem('autoTriggerScene');
          const triggerTime = parseInt(localStorage.getItem('autoTriggerTime') || '0');
          
          const isRecent = Date.now() - triggerTime < 3 * 60 * 1000;
          
          console.log('触发检查:', {
              shouldTrigger,
              scene,
              triggerTime: new Date(triggerTime).toLocaleTimeString(),
              isRecent,
              timeDiff: Date.now() - triggerTime
          });
  
          if (shouldTrigger && isRecent) {
              console.log('🚀 检测到需要自动触发空格键，开始触发流程');
              this.startTriggerProcess();
          } else {
              console.log('ℹ️ 无需自动触发空格键');
              this.cleanupTrigger();
          }
      }
  
      startTriggerProcess() {
          console.log('🔄 开始自动触发空格键流程...');
          
          setTimeout(() => {
              this.startContinuousChecking();
          }, 3000);
      }
  
      startContinuousChecking() {
          console.log('🔍 开始持续检查系统状态...');
          
          this.checkInterval = setInterval(() => {
              this.attemptTrigger();
          }, 1500);
          
          setTimeout(() => {
              if (this.checkInterval) {
                  clearInterval(this.checkInterval);
                  this.checkInterval = null;
              }
              if (!this.hasTriggered) {
                  console.error('❌ 自动触发超时：系统未在30秒内就绪');
                  this.showTriggerError();
              }
          }, 30000);
      }
  
      attemptTrigger() {
          if (this.hasTriggered || this.attemptCount >= this.maxAttempts) {
              if (this.attemptCount >= this.maxAttempts && !this.hasTriggered) {
                  console.error('❌ 自动触发失败：超过最大尝试次数');
                  this.showTriggerError();
                  this.stopChecking();
              }
              return;
          }
  
          this.attemptCount++;
          console.log(`🔄 尝试触发空格键 (${this.attemptCount}/${this.maxAttempts})`);
  
          if (this.isSystemFullyReady()) {
              console.log('✅ 所有系统就绪，模拟按下空格键');
              this.stopChecking();
              this.simulateSpacebarPress();
              this.hasTriggered = true;
              this.cleanupTrigger();
              this.showSuccessMessage();
          } else {
              const status = this.getSystemStatus();
              console.log('⏳ 系统未就绪，等待后重试...');
              console.log('当前系统状态:', status);
          }
      }
  
      stopChecking() {
          if (this.checkInterval) {
              clearInterval(this.checkInterval);
              this.checkInterval = null;
          }
      }
  
      isSystemFullyReady() {
          const isViewerReady = window.viewer && typeof viewer.start === 'function';
          const hasViewpointManager = window.viewpointManager && typeof viewpointManager.getAllViewpoints === 'function';
          const viewpoints = hasViewpointManager ? window.viewpointManager.getAllViewpoints() : [];
          const hasViewpoints = viewpoints && viewpoints.length > 0;
  
          console.log('系统就绪检查:', {
              viewer: isViewerReady,
              viewpointManager: hasViewpointManager,
              viewpointsCount: viewpoints ? viewpoints.length : 0,
              hasViewpoints: hasViewpoints
          });
  
          return isViewerReady && hasViewpointManager && hasViewpoints;
      }
  
      getSystemStatus() {
          const hasViewpointManager = window.viewpointManager && typeof viewpointManager.getAllViewpoints === 'function';
          const viewpoints = hasViewpointManager ? window.viewpointManager.getAllViewpoints() : [];
          
          return {
              viewer: !!window.viewer,
              viewerStart: window.viewer ? typeof viewer.start : 'undefined',
              viewpointManager: !!window.viewpointManager,
              viewpointsCount: viewpoints ? viewpoints.length : 0,
              navigationUI: !!window.navigationUI,
              autoTourSystem: !!window.autoTourSystem
          };
      }
  
      simulateSpacebarPress() {
          console.log('⌨️ 模拟按下空格键...');
          
          if (this.triggerDirectStart()) {
              return;
          }
          
          this.dispatchSpacebarEvent();
      }
  
      triggerDirectStart() {
          console.log('🔍 寻找可用的导览系统...');
              // 🆕 立即显示成功提示
         this.showSuccessMessage();
         // 尝试通过 autoTourSystem 启动
    if (window.autoTourSystem && typeof autoTourSystem.startAutoTour === 'function') {
        console.log('✅ 通过 autoTourSystem.startAutoTour() 启动');
        
        // 🆕 先停止可能正在运行的导览
        if (window.autoTourSystem.isAutoTourRunning) {
            console.log('🛑 检测到正在运行的导览，先停止');
            window.autoTourSystem.stopAutoTour();
        }
        
        setTimeout(() => {
            try {
                window.autoTourSystem.startAutoTour();
                console.log('🎉 自动导览成功启动');
            } catch (error) {
                console.error('❌ autoTourSystem 启动失败:', error);
                this.fallbackToSpacebar();
            }
        }, 500);
        return true;
    }
          
          if (window.navigationUI && typeof navigationUI.startAutoTour === 'function') {
              console.log('✅ 通过 navigationUI.startAutoTour() 启动');
              setTimeout(() => {
                  try {
                      window.navigationUI.startAutoTour();
                      console.log('🎉 自动导览成功启动');
                  } catch (error) {
                      console.error('❌ navigationUI 启动失败:', error);
                      this.fallbackToSpacebar();
                  }
              }, 500);
              return true;
          }
          
          if (window.viewpointManager && typeof viewpointManager.getAllViewpoints === 'function') {
              const viewpoints = window.viewpointManager.getAllViewpoints();
              if (viewpoints && viewpoints.length > 0) {
                  console.log('✅ 通过 viewpointManager 启动简单导览');
                  this.startSimpleAutoTour();
                  return true;
              }
          }
          
          console.log('❌ 未找到可用的导览系统，使用空格键事件');
          return false;
      }

      fallbackToSpacebar() {
          console.log('🔄 回退到空格键触发');
          this.dispatchSpacebarEvent();
      }
  
      dispatchSpacebarEvent() {
          console.log('⌨️ 分发空格键键盘事件');
          
          try {
              const spaceDownEvent = new KeyboardEvent('keydown', {
                  key: ' ',
                  code: 'Space',
                  keyCode: 32,
                  which: 32,
                  bubbles: true,
                  cancelable: true
              });
              
              const spaceUpEvent = new KeyboardEvent('keyup', {
                  key: ' ',
                  code: 'Space', 
                  keyCode: 32,
                  which: 32,
                  bubbles: true,
                  cancelable: true
              });
              
              document.dispatchEvent(spaceDownEvent);
              setTimeout(() => {
                  document.dispatchEvent(spaceUpEvent);
                  console.log('✅ 空格键事件分发完成');
              }, 100);
          } catch (error) {
              console.error('❌ 空格键事件分发失败:', error);
          }
      }
  
      startSimpleAutoTour() {
          const viewpoints = window.viewpointManager.getAllViewpoints();
          if (!viewpoints || viewpoints.length === 0) {
              console.warn('⚠️ 没有可用的导览点');
              return;
          }
          
          console.log(`🚀 启动简单自动导览，共 ${viewpoints.length} 个导览点`);
          
          const startTime = Date.now();
          let currentIndex = 0;
          
          function nextViewpoint() {
              if (currentIndex >= viewpoints.length) {
                  const totalTime = (Date.now() - startTime) / 1000;
                  console.log(`🏁 导览完成，总耗时: ${totalTime.toFixed(1)}秒`);
                  return;
              }
              
              const viewpoint = viewpoints[currentIndex];
              console.log(`📍 切换到导览点 ${currentIndex + 1}/${viewpoints.length}: ${viewpoint.name}`);
              
              window.viewpointManager.goToViewpoint(viewpoint.id)
                  .then(() => {
                      currentIndex++;
                      const stayTime = (viewpoint.duration || 3) * 1000;
                      setTimeout(nextViewpoint, stayTime);
                  })
                  .catch(error => {
                      console.error('❌ 导览点切换失败:', error);
                      currentIndex++;
                      setTimeout(nextViewpoint, 2000);
                  });
          }
          
          setTimeout(nextViewpoint, 1000);
      }
  
   /**
 * 立即显示成功提示 - 简化版
 */
showSuccessMessage() {
    // 立即创建并显示提示
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(81, 207, 102, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            font-family: 'Microsoft YaHei', sans-serif;
            animation: slideInRight 0.3s ease;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2rem;">✅</span>
                <div>
                    <div style="font-weight: 600;">自动导览已启动</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">系统将带您游览场景</div>
                </div>
            </div>
        </div>
        <style>
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        </style>
    `;
    document.body.appendChild(message);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (message.parentNode) {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }
    }, 3000);
}
  
      showTriggerError() {
          const error = document.createElement('div');
          error.innerHTML = `
              <div style="
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
                  text-align: center;
                  max-width: 400px;
              ">
                  <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">❌</div>
                  <div style="font-weight: 600; margin-bottom: 0.5rem;">自动导览启动失败</div>
                  <div style="font-size: 0.9rem; opacity: 0.9;">请手动按空格键启动导览</div>
              </div>
          `;
          document.body.appendChild(error);
          
          setTimeout(() => {
              if (error.parentNode) {
                  error.remove();
              }
          }, 8000);
          
          this.cleanupTrigger();
      }
  
      cleanupTrigger() {
          localStorage.removeItem('autoTriggerSpacebar');
          localStorage.removeItem('autoTriggerScene');
          localStorage.removeItem('autoTriggerTime');
          console.log('🧹 已清理自动触发标记');
      }


// 在 AutoSpacebarTrigger 类中添加
stopAutoTour() {
    console.log('🛑 AutoSpacebarTrigger: 停止简单自动导览');
    this.isTourRunning = false;
    
    // 清理定时器
    if (this.tourTimer) {
        clearTimeout(this.tourTimer);
        this.tourTimer = null;
    }
}

// 修改 startSimpleAutoTour 方法
startSimpleAutoTour() {
    const viewpoints = window.viewpointManager.getAllViewpoints();
    if (!viewpoints || viewpoints.length === 0) {
        console.warn('⚠️ 没有可用的导览点');
        return;
    }
    
    console.log(`🚀 启动简单自动导览，共 ${viewpoints.length} 个导览点`);
    
    this.isTourRunning = true; // 🆕 添加运行状态
    const startTime = Date.now();
    let currentIndex = 0;
    
    const nextViewpoint = () => {
        // 🆕 检查是否应该停止
        if (!this.isTourRunning) {
            console.log('🛑 简单自动导览已停止');
            return;
        }
        
        if (currentIndex >= viewpoints.length) {
            const totalTime = (Date.now() - startTime) / 1000;
            console.log(`🏁 导览完成，总耗时: ${totalTime.toFixed(1)}秒`);
            this.isTourRunning = false;
            return;
        }
        
        const viewpoint = viewpoints[currentIndex];
        console.log(`📍 切换到导览点 ${currentIndex + 1}/${viewpoints.length}: ${viewpoint.name}`);
        
        window.viewpointManager.goToViewpoint(viewpoint.id)
            .then(() => {
                currentIndex++;
                // 🆕 检查是否应该继续
                if (this.isTourRunning) {
                    const stayTime = (viewpoint.duration || 3) * 1000;
                    this.tourTimer = setTimeout(nextViewpoint, stayTime);
                }
            })
            .catch(error => {
                console.error('❌ 导览点切换失败:', error);
                currentIndex++;
                // 🆕 检查是否应该继续
                if (this.isTourRunning) {
                    this.tourTimer = setTimeout(nextViewpoint, 2000);
                }
            });
    };
    
    // 开始导览
    this.tourTimer = setTimeout(nextViewpoint, 1000);
}



  }
  
  document.addEventListener('DOMContentLoaded', function() {
      console.log('📄 DOM加载完成，初始化自动空格键触发');
      window.autoSpacebarTrigger = new AutoSpacebarTrigger();
  });
  
  window.addEventListener('load', function() {
      console.log('🔄 页面完全加载，检查自动触发');
      if (window.autoSpacebarTrigger && !window.autoSpacebarTrigger.hasTriggered) {
          console.log('🔄 页面加载完成，重新检查自动触发');
      }
  });


