document.addEventListener('DOMContentLoaded', function() {
    let outfitData = null;
    
    const state = {
        gender: 'female',
        age: 'young',
        scene: 'daily',
        optionIndex: 0
    };

    const labelMap = {
        gender: { female: '女生', male: '男生' },
        age: { teen: '青少年 (13-17岁)', young: '青年 (18-30岁)', adult: '中年 (31-50岁)', senior: '成熟 (50岁+)' },
        scene: { daily: '日常', business: '商务', date: '约会', party: '派对', play: '玩耍', game: '游戏' }
    };

    const sceneInfoMap = {
        daily: { title: '日常穿搭', desc: '舒适自在，轻松应对日常生活' },
        business: { title: '商务穿搭', desc: '专业干练，展现职场魅力' },
        date: { title: '约会穿搭', desc: '优雅迷人，展现个人魅力' },
        party: { title: '派对穿搭', desc: '闪耀夺目，成为焦点' },
        play: { title: '玩耍穿搭', desc: '活力四射，舒适自在' },
        game: { title: '游戏穿搭', desc: '个性潮流，展现电竞风格' }
    };

    function init() {
        try {
            const dataElement = document.getElementById('outfitData');
            if (dataElement) {
                outfitData = JSON.parse(dataElement.textContent);
                console.log('穿搭数据加载成功！');
            }
        } catch (e) {
            console.error('数据解析错误:', e);
            return;
        }

        bindEvents();
        updateDisplay();
    }

    function bindEvents() {
        document.querySelectorAll('.gender-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                updateFilter('gender', this.getAttribute('data-gender'));
                setActiveButton('.gender-btn', this);
            });
        });

        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                updateFilter('age', this.getAttribute('data-age'));
                setActiveButton('.age-btn', this);
            });
        });

        document.querySelectorAll('.scene-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                updateFilter('scene', this.getAttribute('data-scene'));
                setActiveButton('.scene-btn', this);
            });
        });

        window.addEventListener('scroll', handleScroll);
    }

    function handleScroll() {
        const filtersSection = document.querySelector('.filters-section');
        if (!filtersSection) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            filtersSection.classList.add('scrolled');
        } else {
            filtersSection.classList.remove('scrolled');
        }
    }

    function setActiveButton(selector, activeBtn) {
        document.querySelectorAll(selector).forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    function updateFilter(type, value) {
        if (state[type] !== value) {
            state[type] = value;
            if (type !== 'optionIndex') {
                state.optionIndex = 0;
            }
            updateDisplay();
        }
    }

    function getCurrentData() {
        if (!outfitData) return null;
        
        try {
            return outfitData[state.gender][state.age][state.scene];
        } catch (e) {
            console.error('获取数据错误:', e);
            return null;
        }
    }

    function updateDisplay() {
        const data = getCurrentData();
        if (!data) {
            console.error('无法获取当前数据');
            return;
        }

        const options = data.options || [];
        if (options.length === 0) {
            console.error('没有穿搭方案');
            return;
        }

        if (state.optionIndex >= options.length) {
            state.optionIndex = 0;
        }

        updateOptionCards(options);
        updateSceneInfo(data);
        updateCurrentTags();
        renderOutfitItems(options[state.optionIndex]);
    }

    function updateOptionCards(options) {
        const container = document.getElementById('outfitOptions');
        if (!container) return;

        container.innerHTML = '';

        options.forEach((option, index) => {
            const card = document.createElement('div');
            card.className = `option-card ${index === state.optionIndex ? 'active' : ''}`;
            card.innerHTML = `
                <h4>${option.name}</h4>
                <p>${option.subtitle || ''}</p>
            `;
            card.addEventListener('click', () => {
                state.optionIndex = index;
                updateDisplay();
            });
            container.appendChild(card);
        });
    }

    function updateSceneInfo(data) {
        const titleEl = document.getElementById('currentSceneTitle');
        const descEl = document.getElementById('currentSceneDesc');
        
        const sceneInfo = data.sceneInfo || sceneInfoMap[state.scene];
        
        if (titleEl && sceneInfo) {
            titleEl.textContent = sceneInfo.title;
        }
        if (descEl && sceneInfo) {
            descEl.textContent = sceneInfo.desc;
        }
    }

    function updateCurrentTags() {
        const container = document.getElementById('currentFilters');
        if (!container) return;

        const optionData = getCurrentData()?.options?.[state.optionIndex];
        const optionName = optionData?.name || `方案 ${String.fromCharCode(65 + state.optionIndex)}`;

        container.innerHTML = `
            <span class="filter-tag">👤 ${labelMap.gender[state.gender]}</span>
            <span class="filter-tag">🎂 ${labelMap.age[state.age]}</span>
            <span class="filter-tag">📍 ${labelMap.scene[state.scene]}</span>
            <span class="filter-tag">✨ ${optionName}</span>
        `;
    }

    function renderOutfitItems(option) {
        const container = document.getElementById('outfitGrid');
        if (!container) return;

        container.innerHTML = '';

        const items = option.items;
        const order = ['jewelry', 'top', 'bottom', 'outerwear', 'shoes'];
        const categoryNames = {
            jewelry: '首饰',
            top: '上衣',
            bottom: '下装',
            outerwear: '外套',
            shoes: '鞋子'
        };

        order.forEach((key, index) => {
            const item = items[key];
            if (!item) return;

            const itemEl = document.createElement('div');
            itemEl.className = 'outfit-item';
            itemEl.style.animationDelay = `${index * 0.1}s`;
            
            itemEl.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <h3>${item.category || categoryNames[key]}</h3>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-reason">${item.reason}</div>
                </div>
            `;

            itemEl.addEventListener('click', function() {
                this.classList.toggle('selected');
                
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    if (this.classList.contains('selected')) {
                        this.style.transform = 'scale(1.02)';
                    } else {
                        this.style.transform = 'translateY(-5px)';
                    }
                }, 100);
            });

            itemEl.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected')) {
                    this.style.transform = 'translateY(-5px)';
                }
            });

            itemEl.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.transform = 'translateY(0)';
                }
            });

            container.appendChild(itemEl);
        });
    }

    init();
});
