// 添加自动保存功能
function setupAutoSave() {
  // 获取所有输入字段
  const formInputs = document.querySelectorAll('#borrowForm input, #borrowForm select, #borrowForm textarea');
  
  // 为每个输入字段添加失去焦点事件监听器
  formInputs.forEach(input => {
    input.addEventListener('blur', () => {
      saveFormDataToLocalStorage();
    });
  });
  
  // 定时自动保存（每30秒）
  setInterval(() => {
    saveFormDataToLocalStorage();
  }, 30000);
  
  // 页面加载时恢复数据
  loadFormDataFromLocalStorage();
}

// 保存表单数据到本地存储
function saveFormDataToLocalStorage() {
  const formData = {
    equipmentId: document.getElementById('equipmentId').value,
    borrowType: document.querySelector('input[name="borrowType"]:checked').value,
    borrowDate: document.getElementById('borrowDate').value,
    borrowPerson: document.getElementById('borrowPerson').value,
    // ... 其他字段 ...
  };
  
  localStorage.setItem('equipmentBorrowFormData', JSON.stringify(formData));
  console.log('表单数据已自动保存');
}

// 从本地存储加载表单数据
function loadFormDataFromLocalStorage() {
  const savedData = localStorage.getItem('equipmentBorrowFormData');
  if (savedData) {
    const formData = JSON.parse(savedData);
    
    document.getElementById('equipmentId').value = formData.equipmentId || '';
    
    // 设置单选按钮
    if (formData.borrowType) {
      document.querySelector(`input[name="borrowType"][value="${formData.borrowType}"]`).checked = true;
    }
    
    document.getElementById('borrowDate').value = formData.borrowDate || '';
    document.getElementById('borrowPerson').value = formData.borrowPerson || '';
    // ... 设置其他字段 ...
  }
}

// 提交表单成功后清除本地存储
function clearSavedFormData() {
  localStorage.removeItem('equipmentBorrowFormData');
}

// 在页面加载完成后初始化自动保存
document.addEventListener('DOMContentLoaded', () => {
  setupAutoSave();
  
  // 修改原有提交处理函数，添加清除本地存储
  const originalSubmitHandler = document.getElementById('submitBtn').onclick;
  document.getElementById('submitBtn').onclick = function(e) {
    const result = originalSubmitHandler.call(this, e);
    if (result !== false) {
      clearSavedFormData();
    }
    return result;
  };
}); 