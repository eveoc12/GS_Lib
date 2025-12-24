class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            loadTime: 0,
            memory: null
        };
        this.init();
    }

    init() {
        this.startTime = performance.now();
        this.frameCount = 0;
        this.lastTime = this.startTime;
        
        // 监听页面加载完成
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now() - this.startTime;
            this.startFPSMonitoring();
        });

        // 内存监控（如果可用）
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memory = performance.memory;
            }, 5000);
        }
    }

    startFPSMonitoring() {
        const calculateFPS = () => {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - this.lastTime >= 1000) {
                this.metrics.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
            
            requestAnimationFrame(calculateFPS);
        };
        
        calculateFPS();
    }
}

// 立即初始化
window.performanceMonitor = new PerformanceMonitor();
console.log('✅ PerformanceMonitor 已初始化');