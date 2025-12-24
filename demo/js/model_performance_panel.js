
  // 性能面板显示控制
  class PerformancePanel {
      constructor() {
          this.isVisible = false;
          this.panelElement = null;
          this.updateInterval = null;
          this.createToggleButton();
          console.log('✅ PerformancePanel 实例已创建');
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
          console.log('🔄 显示性能面板');
          console.log('全局对象检查:');
          console.log('- performanceMonitor:', window.performanceMonitor);
          console.log('- visitStats:', window.visitStats);
          
          const panel = document.createElement('div');
          panel.className = 'performance-panel';
          panel.innerHTML = this.getPanelContent();
          
          document.body.appendChild(panel);
          this.panelElement = panel;
          this.isVisible = true;
          
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
              console.log('🔄 获取性能面板内容...');
              
              let fps = 0;
              let loadTime = 0;
              let memory = null;
              let stats = {
                  totalVisits: 0,
                  mostPopularScene: '暂无数据',
                  sceneDetails: {}
              };
  
              // 检查全局对象
              const hasPerformanceMonitor = window.performanceMonitor && window.performanceMonitor.metrics;
              const hasVisitStats = window.visitStats && typeof window.visitStats.getStatsSummary === 'function';
  
              console.log('对象状态:', {
                  hasPerformanceMonitor,
                  hasVisitStats,
                  performanceMonitor: window.performanceMonitor,
                  visitStats: window.visitStats
              });
  
              if (hasPerformanceMonitor) {
                  fps = window.performanceMonitor.metrics.fps || 0;
                  loadTime = window.performanceMonitor.metrics.loadTime || 0;
                  memory = window.performanceMonitor.metrics.memory || null;
                  console.log('📊 性能数据:', { fps, loadTime, memory: !!memory });
              } else {
                  console.warn('⚠️ performanceMonitor 未找到，使用模拟数据');
                  fps = Math.floor(Math.random() * 30) + 30;
                  loadTime = 1200;
              }
  
              if (hasVisitStats) {
                  stats = window.visitStats.getStatsSummary();
                  console.log('📈 访问统计数据:', stats);
              } else {
                  console.warn('⚠️ visitStats 未找到，使用默认数据');
                  // 尝试从 localStorage 直接读取
                  try {
                      const storedStats = localStorage.getItem('visitStats');
                      if (storedStats) {
                          const parsed = JSON.parse(storedStats);
                          stats.totalVisits = parsed.totalVisits || 0;
                          stats.sceneDetails = parsed.sceneVisits || {};
                          
                          // 计算最受欢迎场景
                          let maxVisits = 0;
                          let popularScene = '暂无';
                          Object.entries(stats.sceneDetails).forEach(([scene, visits]) => {
                              if (visits > maxVisits) {
                                  maxVisits = visits;
                                  popularScene = scene;
                              }
                          });
                          stats.mostPopularScene = popularScene;
                          console.log('📦 从 localStorage 读取的数据:', stats);
                      }
                  } catch (e) {
                      console.error('❌ 从 localStorage 读取失败:', e);
                  }
              }
  
              // 确定FPS颜色
              let fpsColor = '#ff6b6b';
              if (fps > 50) fpsColor = '#51cf66';
              else if (fps > 30) fpsColor = '#ffd43b';
  
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
  
              if (memory && memory.used) {
                  const memoryMB = (memory.used / 1024 / 1024).toFixed(1);
                  content += `
                      <div style="display: flex; justify-content: space-between;">
                          <span>内存使用:</span>
                          <span>${memoryMB}MB</span>
                      </div>`;
              }
  
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
                          </div>`;
  
              // 显示各场景访问详情（调试用）
              if (stats.sceneDetails && Object.keys(stats.sceneDetails).length > 0) {
                  content += `
                          <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 0.5rem; padding-top: 0.5rem;">
                              <div style="font-size: 0.8rem; opacity: 0.7; margin-bottom: 0.3rem;">各场景访问:</div>`;
                  
                  Object.entries(stats.sceneDetails).forEach(([scene, visits]) => {
                      const displayName = this.getSceneDisplayName(scene);
                      content += `
                              <div style="display: flex; justify-content: space-between; font-size: 0.7rem; opacity: 0.8;">
                                  <span>${displayName}:</span>
                                  <span>${visits}次</span>
                              </div>`;
                  });
                  
                  content += `</div>`;
              }
  
              content += `
                      </div>
                  </div>
                  
                  <div style="margin-top: 0.8rem; font-size: 10px; opacity: 0.6; text-align: center;">
                      数据更新于: ${new Date().toLocaleTimeString()}
                      ${!hasPerformanceMonitor || !hasVisitStats ? '<br>⚠️ 使用备用数据' : ''}
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
  
      getSceneDisplayName(sceneKey) {
          const sceneNames = {
              'lobby': '大厅',
              'reading-area': '阅读区', 
              'study-area': '自习区',
              'model': '默认'
          };
          return sceneNames[sceneKey] || sceneKey;
      }
  }
  
  // 初始化性能面板
  function initPerformancePanel() {
      console.log('🔄 开始初始化性能面板...');
      
      // 等待更长时间确保所有脚本加载
      setTimeout(() => {
          try {
              window.performancePanelInstance = new PerformancePanel();
              console.log('✅ 性能面板初始化完成');
              
              // 最终检查全局对象
              console.log('🎯 最终全局对象检查:');
              console.log('- performanceMonitor:', window.performanceMonitor);
              console.log('- visitStats:', window.visitStats);
              console.log('- performancePanelInstance:', window.performancePanelInstance);
              
          } catch (error) {
              console.error('❌ 性能面板初始化失败:', error);
          }
      }, 2000);
  }
  
  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', initPerformancePanel);
  window.addEventListener('load', initPerformancePanel);
  
  // 暴露到全局用于调试
  window.PerformancePanel = PerformancePanel;
  window.initPerformancePanel = initPerformancePanel;



