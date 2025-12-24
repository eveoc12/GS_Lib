// 修复的场景信息更新函数
  function updateSceneInfo() {
      // 获取当前页面名称，而不是mode参数
      const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
      console.log('当前页面:', currentPage); // 调试信息
      
      // 根据页面名称配置场景信息
      const sceneConfig = {
          'lobby': {
              title: '图书馆大厅',
              description: '宏伟的图书馆大厅，展现了现代建筑美学与实用功能的完美结合。这里是读者进入知识世界的第一站，宽敞的空间和精心设计的光线营造出庄重而温馨的氛围。'
          },
          'reading-area': {
              title: '阅读区',
              description: '安静舒适的阅读区域，配备专业的阅读灯光和符合人体工学的座椅。这里是深度阅读和思考的理想空间，阳光透过窗户洒在书页上，营造出宁静的阅读体验。'
          },
          'study-area': {
              title: '自习区', 
              description: '北印学子勤奋学习的核心区域。整齐排列的学习桌椅、充足的电源接口和稳定的网络环境，为学生们提供了高效的学习空间。这里见证了无数梦想的孕育和实现。'
          }
      };
  
      const config = sceneConfig[currentPage] || sceneConfig['lobby'];
      
      console.log('更新场景信息:', config.title); // 调试信息
      
      // 更新页面元素
      document.getElementById('current-scene-title').textContent = config.title;
      document.getElementById('info-title').textContent = config.title;
      document.getElementById('info-description').textContent = config.description;
  }
  
  // 导航函数
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
  
  // UI控制函数
  function toggleInfoPanel() {
      const panel = document.getElementById('info-panel');
      panel.classList.toggle('active');
  }
  
  function toggleScenesMenu() {
      const menu = document.getElementById('scenes-menu');
      menu.classList.toggle('active');
  }
  
  // 显示加载状态
  function showLoading() {
      const overlay = document.getElementById('loading-overlay');
      overlay.classList.remove('hidden');
  }
  
  // 隐藏加载状态
  function hideLoading() {
      const overlay = document.getElementById('loading-overlay');
      overlay.classList.add('hidden');
  }
  
  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
      console.log('DOM加载完成，初始化场景信息'); // 调试信息
      updateSceneInfo();
      showLoading();
      initModelKeyboardNav(); // 初始化键盘导航
  });
  
  // 点击外部关闭菜单和面板
  document.addEventListener('click', function(event) {
      const scenesMenu = document.getElementById('scenes-menu');
      const infoPanel = document.getElementById('info-panel');
      
      if (scenesMenu && scenesMenu.classList.contains('active') && 
          !event.target.closest('.scenes-menu') && 
          !event.target.closest('.scenes-btn')) {
          scenesMenu.classList.remove('active');
      }
      
      if (infoPanel && infoPanel.classList.contains('active') && 
          !event.target.closest('.info-panel') && 
          !event.target.closest('.info-btn')) {
          infoPanel.classList.remove('active');
      }
  });