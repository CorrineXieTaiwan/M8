function createAddButton() {
  const addButton = document.createElement('button');
  addButton.id = 'addEquipmentBtn';
  addButton.className = 'btn btn-primary';
  addButton.innerHTML = '<i class="fas fa-plus"></i> 新增单位设备';
  
  // ... 其他代码 ...
  
  return addButton;
} 