// 创建并添加左下角导航按钮
function createBottomNavigation() {
    // 移除现有的顶部导航按钮（如果存在）
    const existingNav = document.querySelector('.nav-buttons');
    if (existingNav && existingNav.parentElement.className === 'header') {
        existingNav.remove();
    }
    
    // 获取当前页面路径，用于设置活动按钮
    const currentPage = localStorage.getItem('currentPage') || window.location.pathname.split('/').pop();
    
    // 创建底部导航容器
    const bottomNav = document.createElement('div');
    bottomNav.className = 'bottom-nav-buttons';
    
    // 创建导航按钮容器
    const navButtons = document.createElement('div');
    navButtons.className = 'nav-buttons';
    
    // 定义导航项
    const navItems = [
        { text: '護理排班', page: 'index.html' },
        { text: '設備點班', page: 'checklist.html' },
        { text: '系統設定', page: 'admin.html' },
        { text: '環境介紹', page: '#' },
        { text: '消防編組', page: '#' },
        { text: '使用說明', page: '#' }
    ];
    
    // 创建导航按钮
    navItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'nav-button';
        button.textContent = item.text;
        
        // 设置活动状态
        if (currentPage.includes(item.page)) {
            button.classList.add('active');
        }
        
        // 添加点击事件
        if (item.page !== '#') {
            button.onclick = function() {
                navigateTo(item.page);
            };
        }
        
        navButtons.appendChild(button);
    });
    
    // 组装导航
    bottomNav.appendChild(navButtons);
    document.body.appendChild(bottomNav);
}

// 页面导航函数
function navigateTo(page) {
    localStorage.setItem('currentPage', page);
    window.location.href = page;
}

// 在页面加载完成后初始化导航
document.addEventListener('DOMContentLoaded', function() {
    createBottomNavigation();
    
    // 添加必要的CSS样式
    if (!document.querySelector('style#nav-styles')) {
        const style = document.createElement('style');
        style.id = 'nav-styles';
        style.textContent = `
            .bottom-nav-buttons {
                position: fixed;
                left: 20px;
                bottom: 20px;
                z-index: 900;
            }
            
            .bottom-nav-buttons .nav-buttons {
                display: flex;
                gap: 12px;
            }
            
            .bottom-nav-buttons .nav-button {
                padding: 12px 20px;
                border: none;
                border-radius: 6px;
                background-color: #f0f0f0;
                cursor: pointer;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            
            .bottom-nav-buttons .nav-button:hover {
                background-color: #e0e0e0;
            }
            
            .bottom-nav-buttons .nav-button.active {
                background-color: #42a5f5;
                color: white;
            }
            
            .action-buttons {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                flex-direction: row;
                gap: 10px;
                z-index: 1000;
            }
        `;
        document.head.appendChild(style);
    }
}); 