// 添加自动保存功能
function setupAutoSave() {
  // 获取所有输入字段
  const formInputs = document.querySelectorAll('#equipmentForm input, #equipmentForm select, #equipmentForm textarea');
  
  // 为每个输入字段添加失去焦点事件监听器
  formInputs.forEach(input => {
    input.addEventListener('blur', () => {
      saveFormDataToLocalStorage();
    });
    
    // 为文本输入添加键盘事件（输入后延迟保存）
    if (input.type === 'text' || input.type === 'textarea') {
      let saveTimeout;
      input.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          saveFormDataToLocalStorage();
        }, 1000); // 输入停止1秒后保存
      });
    }
  });
  
  // 定时自动保存（每分钟）
  setInterval(() => {
    saveFormDataToLocalStorage();
  }, 60000);
  
  // 页面加载时恢复数据
  loadFormDataFromLocalStorage();
}

// 保存表单数据到本地存储
function saveFormDataToLocalStorage() {
  const formData = {
    equipmentName: document.getElementById('equipmentName').value,
    equipmentType: document.getElementById('equipmentType').value,
    serialNumber: document.getElementById('serialNumber').value,
    purchaseDate: document.getElementById('purchaseDate').value,
    status: document.getElementById('status').value,
    // ... 其他字段 ...
  };
  
  localStorage.setItem('equipmentAddFormData', JSON.stringify(formData));
  
  // 显示自动保存提示（可选）
  showAutoSaveNotification();
}

// 显示自动保存提示
function showAutoSaveNotification() {
  const notification = document.createElement('div');
  notification.className = 'auto-save-notification';
  notification.textContent = '数据已自动保存';
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 15px';
  notification.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
  notification.style.color = 'white';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '9999';
  
  document.body.appendChild(notification);
  
  // 2秒后移除提示
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 2000);
}

// 从本地存储加载表单数据
function loadFormDataFromLocalStorage() {
  const savedData = localStorage.getItem('equipmentAddFormData');
  if (savedData) {
    const formData = JSON.parse(savedData);
    
    document.getElementById('equipmentName').value = formData.equipmentName || '';
    document.getElementById('equipmentType').value = formData.equipmentType || '';
    document.getElementById('serialNumber').value = formData.serialNumber || '';
    document.getElementById('purchaseDate').value = formData.purchaseDate || '';
    document.getElementById('status').value = formData.status || '';
    // ... 设置其他字段 ...
  }
}

// 提交表单成功后清除本地存储
function clearSavedFormData() {
  localStorage.removeItem('equipmentAddFormData');
}

// 在页面加载完成后初始化自动保存
document.addEventListener('DOMContentLoaded', () => {
  setupAutoSave();
  
  // 修改原有提交处理函数，添加清除本地存储
  const form = document.getElementById('equipmentForm');
  const originalSubmit = form.onsubmit;
  
  form.onsubmit = function(e) {
    const result = originalSubmit ? originalSubmit.call(this, e) : true;
    if (result !== false) {
      // 如果表单验证通过，清除保存的数据
      clearSavedFormData();
    }
    return result;
  };
}); 