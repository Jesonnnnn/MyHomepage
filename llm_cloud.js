class LLMWordCloud {
    constructor(containerId, txtPath) {
        this.container = document.getElementById(containerId);
        this.txtPath = txtPath;
        this.width = 1200;
        this.height = 800;
        this.cachedWords = null;
    }

    async loadText() {
        try {
            const response = await fetch('./llm.txt');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error('加载文本文件出错:', error);
            return '';
        }
    }
    
    processText(text) {
        this.showLoadingIndicator();
    
        const wordArray = text.toLowerCase().match(/\b[\w']+\b/g) || [];
        const topWords = wordArray.slice(0, 800);
        let selectedWords = [];
        const wordSet = new Set();
    
        while (selectedWords.length < 150 && topWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * topWords.length);
            const word = topWords[randomIndex];
    
            if (!wordSet.has(word) && word.length > 2) {
                wordSet.add(word);
                selectedWords.push(word);
            }
    
            topWords.splice(randomIndex, 1);
        }
    
        while (selectedWords.length < 450) {
            selectedWords.push(selectedWords[Math.floor(Math.random() * selectedWords.length)]);
        }
    
        return selectedWords.map(word => ({
            text: word,
            size: Math.random() * 50 + 10,
            count: Math.random() * 10 + 1
        }));
    }
    
    getRandomWords(words, n) {
        const shuffled = words.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    }
    
    showLoadingIndicator() {
        d3.select(this.container).selectAll("*").remove();
        
        d3.select(this.container)
            .append("div")
            .attr("class", "loading-indicator")
            .style("text-align", "center")
            .style("padding-top", "200px")
            .text("正在生成词云...");
    }
    
    draw(words) {
        d3.select(this.container).selectAll(".loading-indicator").remove();
        
        d3.layout.cloud()
            .size([this.width, this.height])
            .words(words)
            .padding(3)
            .rotate(() => 0)
            .font("Impact")
            .fontSize(d => d.size)
            .timeInterval(20)
            .spiral("archimedean")
            .canvas(() => {
                const canvas = document.createElement('canvas');
                canvas.willReadFrequently = true;
                return canvas;
            })
            .on("end", this.render.bind(this))
            .start();
    }

    render(words) {
        d3.select(this.container).select("svg").remove();
        
        const vis = d3.select(this.container)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            
        const wordGroup = vis.append("g")
            .attr("transform", `translate(${this.width/2},${this.height/2})`);
        
        const colors = [
            '#A8D8FF',
            '#FF6F61', 
            '#7FDBA8',
            '#FFB84D',
            '#9E7BFF'
        ];
            
        wordGroup.selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", d => `${d.size}px`)
            .style("font-family", "Impact")
            .style("font-weight", d => d.weight)
            .style("fill", (d, i) => colors[i % colors.length])
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .text(d => d.text);
    }

    async init() {
        try {
            if (this.cachedWords) {
                console.log("使用缓存的词云数据");
                this.draw(this.cachedWords);
                return;
            }
            
            this.showLoadingIndicator();
            
            const text = await this.loadText();
            if (!text) {
                console.error("加载文本为空或失败");
                d3.select(this.container).select(".loading-indicator").text("加载文本失败");
                return;
            }
            
            setTimeout(() => {
                const words = this.processText(text);
                if (words.length < 100) {
                    console.warn(`词云中只有${words.length}个词，少于要求的100个词`);
                }
                
                this.cachedWords = words;
                
                this.draw(words);
            }, 100);
            
        } catch (error) {
            console.error("初始化词云出错:", error);
            d3.select(this.container).select(".loading-indicator").text("生成词云时出错");
        }
    }
}

// 修改最后一行初始化代码为：
function initLLMCloud() {
    const llmCloud = new LLMWordCloud('llm-container', 'llm.txt');
    llmCloud.init();
}

// 确保DOM加载后执行
if (document.readyState === 'complete') {
    initLLMCloud();
} else {
    window.addEventListener('load', initLLMCloud);
}

