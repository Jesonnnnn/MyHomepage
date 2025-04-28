function WordCloud(text, {
    size = group => group.length, // Given a grouping of words, returns the size factor for that word
    word = d => d, // Given an item of the data array, returns the word
    marginTop = 0, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 0, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    maxWords = 250, // maximum number of words to extract from the text
    fontFamily = "sans-serif", // font family
    fontScale = 15, // base font size
    fill = null, // text color, can be a constant or a function of the word
    padding = 0, // amount of padding between the words (in pixels)
    rotate = 0, // a constant or function to rotate the words
    invalidation // when this promise resolves, stop the simulation
  } = {}) {
    const words = typeof text === "string" 
      ? text.split(/[^\u4e00-\u9fa5a-zA-Z0-9._]+/g)  // 添加中文支持
          .filter(d => d)  // 过滤空字符串
      : Array.from(text);
    
    const data = d3.rollups(words, size, w => w)
      .sort(([, a], [, b]) => d3.descending(a, b))
      .slice(0, maxWords)
      .map(([key, size]) => ({text: word(key), size}));
    
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("font-family", fontFamily)
        .attr("text-anchor", "middle")
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    const g = svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`);
  
    const cloud = d3.layout.cloud()
        .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
        .words(data)
        .padding(padding)
        .rotate(rotate)
        .font(fontFamily)
        .fontSize(d => {
            const baseSize = Math.pow(d.size, 0.8) * fontScale; // 使用指数函数增强大小差异
            return baseSize * (0.7+ Math.random() * 0.6); // 70%-130%随机波动
        })
        .on("word", ({size, x, y, rotate, text}) => {
            g.append("text")
                .datum(text)
                .attr("font-size", size)
                .attr("fill", fill)
                .attr("font-weight", () => {
                    // 调整曲线：只有大于40px的字才会超过600粗细
                    return Math.min(900, 200 + Math.pow(size, 1.5)); 
                })
                .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
                .text(text);
        });
  
    cloud.start();
    invalidation && invalidation.then(() => cloud.stop());
    return svg.node();
  }


  // 在文件最后添加初始化函数
  function initWordCloud() {
      if (!window.d3?.layout?.cloud) {
          console.error('请确保已加载d3-cloud库');
          return;
      }
      
      const container = document.getElementById("wordcloud-container");
      if (!container) {
          console.error('容器元素不存在');
          return;
      }
      
      // 确保容器有明确尺寸
      container.style.width = '1000px';
      container.style.height = '400px';
      
      // 调用词云生成逻辑
      generateWordCloud(container);
  }
  
  // 确保DOM加载后执行
  if (document.readyState === 'complete') {
      initWordCloud();
  } else {
      window.addEventListener('load', initWordCloud);
  }
  
  function generateWordCloud(container) {
      const text = `弗洛伊德
      学术
      理论
      人类
      思想
      心理
      心理学
      研究
      理解
      突破
      精神
      精神分析
      探索
      冲突
      矛盾
      领域
      科学
      复杂
      困境
      勇气
      挑战
      内心
      潜意识
      传统
      坚韧
      人性
      梦境
      西格蒙德
      自由
      利亚
      宝贵
      奥秘
      巨木
      巨大
      压力
      智慧
      思想家
      严谨
      维也纳
      伟大
      盖伊
      雅各布
      细腻
      不懈
      温柔
      玛雅
      安娜
      道德
      热爱
      著名
      不同
      神经科学
      道德规范
      抗争
      文明
      乐观
      关怀
      严苛
      柔软
      敏感
      虔诚
      紧张
      显著
      巴黎
      捷克
      奥地利
      阿尔弗雷
      伯恩斯坦
      马丁
      卓越
      勾勒
      光辉
      弗赖堡`;
  
      const wordCloudSvg = WordCloud(text, {
          width: 1000,
          height: 400,
          fontFamily: "Microsoft YaHei",
          fontScale: 35,
          fill: (d, i) => d3.schemeCategory10[i % 10],
          padding: 2
      });
  
      container.innerHTML = '';
      container.style.background = 'transparent'; 
      container.appendChild(wordCloudSvg);
      return wordCloudSvg;
  }