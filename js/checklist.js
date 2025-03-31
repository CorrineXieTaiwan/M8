function createAddButton() {
  const addButton = document.createElement('button');
  addButton.id = 'addEquipmentBtn';
  addButton.className = 'btn btn-primary';
  addButton.innerHTML = '<i class="fas fa-plus"></i> 新增单位设备';
  
  // ... 其他代码 ...
  
  return addButton;
} 

// 修改删除设备功能，添加防呆机制
function deleteEquipment(equipmentName) {
    // 检查设备是否已分配到床位
    let isAssigned = false;
    
    // 遍历所有床位，检查是否有该设备
    for (let i = 1; i <= 36; i++) {
        const equipmentList = document.querySelector(`.bed-equipment-list[data-bed-number="${i}"]`);
        if (equipmentList) {
            const equipmentTags = equipmentList.querySelectorAll('.bed-equipment-tag');
            equipmentTags.forEach(tag => {
                if (tag.dataset.name === equipmentName) {
                    isAssigned = true;
                }
            });
        }
        if (isAssigned) break;
    }
    
    // 如果设备已分配到床位，显示错误提示
    if (isAssigned) {
        showNotification('此設備已分配到床位，無法刪除', 'error');
        return;
    }
    
    // 二次确认
    if (!confirm(`確定要刪除「${equipmentName}」設備嗎？此操作無法恢復。`)) {
        return; // 用户取消删除
    }
    
    // 从设备列表中删除
    const index = defaultEquipment.findIndex(e => e.name === equipmentName);
    if (index !== -1) {
        defaultEquipment.splice(index, 1);
        initializeEquipmentList();
        showNotification('設備已刪除');
        
        // 保存点班清单数据
        saveChecklistData();
    }
}

// 修改库存项目点击事件，防止误触删除按钮
function updateInventoryGrid() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    inventoryGrid.innerHTML = '';
    
    // 只显示有库存的设备
    defaultEquipment.forEach(item => {
        // 创建库存项
        const inventoryItem = document.createElement('div');
        inventoryItem.className = 'inventory-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'inventory-item-name';
        nameSpan.textContent = item.name;
        nameSpan.title = item.name; // 添加悬停提示，显示完整名称
        
        const countSpan = document.createElement('span');
        countSpan.className = 'inventory-count';
        countSpan.textContent = `${item.available}/${item.total}`;
        
        // 如果没有可用设备，显示灰色
        if (item.available <= 0) {
            inventoryItem.style.opacity = '0.5';
            countSpan.style.backgroundColor = '#999';
        }
        
        inventoryItem.appendChild(nameSpan);
        inventoryItem.appendChild(countSpan);
        
        // 点击库存项也可以选择设备
        inventoryItem.addEventListener('click', function() {
            if (item.available > 0) {
                document.querySelectorAll('.equipment-item').forEach(elem => {
                    elem.classList.remove('selected');
                });
                
                const equipmentItem = document.querySelector(`.equipment-item[data-name="${item.name}"]`);
                if (equipmentItem) {
                    equipmentItem.classList.add('selected');
                }
                
                selectedEquipment = item.name;
            }
        });
        
        inventoryGrid.appendChild(inventoryItem);
    });
}

// 修改设备项目生成，添加删除确认
function initializeEquipmentList() {
    const equipmentContainer = document.getElementById('equipmentItems');
    equipmentContainer.innerHTML = '';
    
    defaultEquipment.forEach(item => {
        const equipmentDiv = document.createElement('div');
        equipmentDiv.className = 'equipment-item';
        equipmentDiv.dataset.name = item.name;
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        nameSpan.style.flex = '1';
        
        const countSpan = document.createElement('span');
        countSpan.className = 'equipment-item-count';
        countSpan.textContent = `${item.available}/${item.total}`;
        
        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            deleteEquipment(item.name);
        });
        
        equipmentDiv.appendChild(nameSpan);
        equipmentDiv.appendChild(countSpan);
        equipmentDiv.appendChild(deleteBtn);
        
        // 如果没有可用设备，禁用选择
        if (item.available <= 0) {
            equipmentDiv.classList.add('disabled');
            equipmentDiv.style.opacity = '0.5';
            equipmentDiv.style.cursor = 'not-allowed';
        } else {
            equipmentDiv.addEventListener('click', function() {
                // 取消之前选中的设备
                document.querySelectorAll('.equipment-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // 选中当前设备
                this.classList.add('selected');
                selectedEquipment = this.dataset.name;
            });
        }
        
        equipmentContainer.appendChild(equipmentDiv);
    });
    
    // 更新库存区域
    updateInventoryGrid();
    
    // 更新统计数据
    updateStatistics();
} 