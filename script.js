document.addEventListener('DOMContentLoaded', function() {
    // 场景切换功能
    const sceneButtons = document.querySelectorAll('.scene-btn');
    const sceneSections = document.querySelectorAll('.scene-section');
    
    sceneButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的活动状态
            sceneButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的活动状态
            this.classList.add('active');
            
            // 获取目标场景
            const targetScene = this.getAttribute('data-scene');
            
            // 隐藏所有场景
            sceneSections.forEach(section => section.classList.remove('active'));
            // 显示目标场景
            const targetSection = document.getElementById(targetScene);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // 滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // 穿搭卡片点击选中效果
    const outfitItems = document.querySelectorAll('.outfit-item');
    
    outfitItems.forEach(item => {
        item.addEventListener('click', function() {
            // 切换选中状态
            this.classList.toggle('selected');
            
            // 添加点击动画效果
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                if (this.classList.contains('selected')) {
                    this.style.transform = 'scale(1.02)';
                } else {
                    this.style.transform = 'translateY(-5px)';
                }
            }, 100);
        });
        
        // 鼠标悬停效果增强
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-5px)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        const activeButton = document.querySelector('.scene-btn.active');
        const buttonArray = Array.from(sceneButtons);
        const currentIndex = buttonArray.indexOf(activeButton);
        
        // 左右箭头切换场景
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            let newIndex;
            
            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % buttonArray.length;
            } else {
                newIndex = (currentIndex - 1 + buttonArray.length) % buttonArray.length;
            }
            
            buttonArray[newIndex].click();
        }
    });
    
    // 页面滚动时导航栏样式变化
    let lastScrollTop = 0;
    const scenesNav = document.querySelector('.scenes-nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            scenesNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            scenesNav.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            scenesNav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            scenesNav.style.background = 'white';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 初始化页面加载动画
    const animateOnLoad = function() {
        const activeSection = document.querySelector('.scene-section.active');
        if (activeSection) {
            const items = activeSection.querySelectorAll('.outfit-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    };
    
    // 设置初始状态
    outfitItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // 延迟执行动画
    setTimeout(animateOnLoad, 300);
    
    // 场景切换时重新触发动画
    sceneButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                const activeSection = document.querySelector('.scene-section.active');
                if (activeSection) {
                    const items = activeSection.querySelectorAll('.outfit-item');
                    items.forEach((item, index) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100 + 100);
                    });
                }
            }, 50);
        });
    });
    
    console.log('时尚穿搭指南页面已加载完成！');
    console.log('支持功能：场景切换、卡片点击选中、键盘导航（左右箭头）');
});