class VisitStats {
    constructor() {
        this.stats = this.loadStats();
        this.trackCurrentVisit();
        console.log('✅ VisitStats 初始化完成');
    }

    loadStats() {
        const defaultStats = {
            totalVisits: 0,
            uniqueVisitors: 0,
            sceneVisits: {},
            visitDuration: 0,
            firstVisit: new Date().toISOString()
        };
        
        try {
            return JSON.parse(localStorage.getItem('visitStats')) || defaultStats;
        } catch {
            return defaultStats;
        }
    }

    saveStats() {
        localStorage.setItem('visitStats', JSON.stringify(this.stats));
    }

    trackCurrentVisit() {
        this.stats.totalVisits++;
        this.visitStartTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const duration = Date.now() - this.visitStartTime;
            this.stats.visitDuration += duration;
            this.saveStats();
        });
        
        this.saveStats();
    }

    recordSceneVisit(sceneName) {
        if (!this.stats.sceneVisits[sceneName]) {
            this.stats.sceneVisits[sceneName] = 0;
        }
        this.stats.sceneVisits[sceneName]++;
        this.saveStats();
        
        console.log(`📍 场景访问记录: ${sceneName} (${this.stats.sceneVisits[sceneName]}次)`);
    }

    getStatsSummary() {
        let mostPopularScene = '暂无';
        let maxVisits = 0;

        Object.entries(this.stats.sceneVisits).forEach(([scene, visits]) => {
            if (visits > maxVisits) {
                maxVisits = visits;
                mostPopularScene = this.getSceneDisplayName(scene);
            }
        });

        return {
            totalVisits: this.stats.totalVisits,
            mostPopularScene: mostPopularScene,
            sceneDetails: this.stats.sceneVisits
        };
    }

    getSceneDisplayName(sceneKey) {
        const sceneNames = {
            'lobby': '图书馆大厅',
            'reading-area': '阅读区', 
            'study-area': '自习区'
        };
        return sceneNames[sceneKey] || sceneKey;
    }
}

// 全局初始化
window.visitStats = new VisitStats();
window.trackSceneVisit = (sceneName) => window.visitStats.recordSceneVisit(sceneName);