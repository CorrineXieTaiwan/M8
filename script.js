// script.js
let nurses = [
  { id: 1, name: '謝靜伊' },
  { id: 2, name: '王護理師' },
  { id: 3, name: '林護理師' },
  { id: 4, name: '李護理師' },
  { id: 5, name: '李護理師' },
  { id: 6, name: '陳護理師' },
  { id: 7, name: '李護理師' },
  { id: 8, name: '李護理師' },
  { id: 9, name: '李護理師' },
];

// 改為使用固定的床號陣列
const bedNumbers = [
    '8831', '8832-1', '8832-2', '8833', '8834', '8835',
    '8836', '8837', '8838', '8839', '8840', '8841',
    '8842', '8843', '8844', '8845', '8846', '8847',
    '8848', '8849', '8850', '8851', '8852', '8853',
    '8854', '8855', '8856', '8857', '8858', '8859',
    '8860', '8861', '8862', '8863', '8864', '8865'
];

// 初始化床位資料
let beds = bedNumbers.map((number, index) => ({
    id: index + 1,
    number: number,
    nurseId: null
}));

let currentShift = 'day';
let selectedNurses = [];
let selectedNurseIdForBed = null;
let nurseAttributes = {}; // store nurseId => {level, code}


function updateNurseAssignmentInfo() {
  const info = document.getElementById('nurseAssignmentInfo');
  info.innerHTML = '';
  const actual = selectedNurses.filter(Boolean);
  if (actual.length === 0) return;

  actual.forEach(nurse => {
    const assigned = beds.filter(b => b.nurseId === nurse.id).map(b => b.number).sort((a, b) => a - b);
    if (assigned.length === 0) return;

    const row = document.createElement('div');
    row.className = 'nurse-assignment';

    const header = document.createElement('div');
    header.className = 'assignment-header';

    const name = document.createElement('div');
    name.className = 'assignment-nurse-name';
    name.textContent = nurse.name;

    const attr = nurseAttributes[nurse.id] || { level: '', code: '' };
    const meta = document.createElement('div');
    meta.className = 'assignment-meta';
    meta.textContent = `點班：${attr.level} / 消防編組：${attr.code}`;

    header.appendChild(name);
    header.appendChild(meta);

    const blocks = document.createElement('div');
    blocks.className = 'assignment-bed-blocks';
    assigned.forEach(bedNum => {
      const block = document.createElement('div');
      block.className = 'bed-block';
      block.textContent = `${bedNum}`;
      blocks.appendChild(block);
    });

    row.appendChild(header);
    row.appendChild(blocks);
    info.appendChild(row);
  });
}

  

function manageNurses() {
  const inputBox = document.createElement('div');
  inputBox.className = 'nurse-input-overlay';
  inputBox.innerHTML = `
    <p>請輸入新護理師姓名：</p>
    <input type="text" id="newNurseName" placeholder="輸入護理師姓名" />
    <div class="button-group">
      <button class="add">新增</button>
      <button class="cancel">取消</button>
    </div>
  `;

  const backdrop = document.createElement('div');
  backdrop.className = 'nurse-input-backdrop';
  backdrop.onclick = () => {
    document.body.removeChild(inputBox);
    document.body.removeChild(backdrop);
  };

  document.body.appendChild(backdrop);
  document.body.appendChild(inputBox);

  inputBox.querySelector('.add').onclick = () => {
    const name = document.getElementById('newNurseName').value.trim();
    if (!name) return;
    const exists = nurses.some(n => n.name === name);
    if (exists) return;
    const newId = Math.max(...nurses.map(n => n.id)) + 1;
    nurses.push({ id: newId, name });
    updateAllDropdowns();
    document.body.removeChild(inputBox);
    document.body.removeChild(backdrop);
  };

  inputBox.querySelector('.cancel').onclick = () => {
    document.body.removeChild(inputBox);
    document.body.removeChild(backdrop);
  };
}
  
  function updateAllDropdowns() {
    selectedNurses.forEach((nurse, index) => {
      const select = document.getElementById(`nurse-select-${index}`);
      if (!select) return;
      const currentValue = select.value;
      select.innerHTML = '';
      const emptyOption = new Option('-- 請選擇護理師 --', '');
      select.appendChild(emptyOption);
      nurses.forEach(n => {
        const option = new Option(n.name, n.id);
        select.appendChild(option);
      });
      select.value = currentValue;
    });
  }
  
  function addNurseGroup() {
    const container = document.getElementById('nurseSelectionContainer');
    const index = selectedNurses.length;
    selectedNurses.push(null);
  
    
    const row = document.createElement('div');
    row.className = 'nurse-selection-row';
    row.dataset.index = index;
  
    const label = document.createElement('div');
    label.className = 'nurse-label';
    label.textContent = `組別 ${container.children.length + 1}：`;
  
    const select = document.createElement('select');
    select.id = `nurse-select-${index}`;
    select.className = 'modern-select';
    const emptyOption = new Option('-- 請選擇護理師 --', '');
    select.appendChild(emptyOption);
    nurses.forEach(nurse => {
      const option = new Option(nurse.name, nurse.id);
      select.appendChild(option);
    });
  
    const levelSelect = document.createElement('select');
    levelSelect.className = 'modern-select';
    ['A本', 'B本', 'C本', 'D本'].forEach(level => {
      levelSelect.appendChild(new Option(level, level));
    });
  
    const codeSelect = document.createElement('select');
    codeSelect.className = 'modern-select';
    ['通報班', '滅火班', '安全守護班', '保護病人班', '避難引導班'].forEach(code => {
      codeSelect.appendChild(new Option(code, code));
    });
  
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '&#10005;';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => {
      const nurse = selectedNurses[index];
      if (nurse) {
        beds.forEach(b => {
          if (b.nurseId === nurse.id) b.nurseId = null;
        });
        delete nurseAttributes[nurse.id];
      }
      selectedNurses[index] = null;
      row.remove();
      updateGroupLabels();
      updateNurseAssignmentInfo();
      renderBeds();
    };
  
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'active-nurse';
    radio.disabled = true;
    radio.addEventListener('change', () => {
      selectedNurseIdForBed = selectedNurses[index]?.id || null;
    });
  
    select.addEventListener('change', () => {
      const nurseId = parseInt(select.value);
      if (!select.value) {
        selectedNurses[index] = null;
        radio.disabled = true;
        if (radio.checked) selectedNurseIdForBed = null;
      } else {
        if (selectedNurses.some((n, i) => i !== index && n && n.id === nurseId)) {
          select.value = '';
          return;
        }
        const nurse = nurses.find(n => n.id === nurseId);
        selectedNurses[index] = nurse;
        nurseAttributes[nurse.id] = {
          level: levelSelect.value,
          code: codeSelect.value
        };
        radio.disabled = false;
        if (radio.checked) selectedNurseIdForBed = nurseId;
      }
      updateNurseAssignmentInfo();
    });
  
    levelSelect.addEventListener('change', () => {
      const nurse = selectedNurses[index];
      if (nurse) {
        nurseAttributes[nurse.id] = nurseAttributes[nurse.id] || {};
        nurseAttributes[nurse.id].level = levelSelect.value;
        updateNurseAssignmentInfo();
      }
    });
  
    codeSelect.addEventListener('change', () => {
      const nurse = selectedNurses[index];
      if (nurse) {
        nurseAttributes[nurse.id] = nurseAttributes[nurse.id] || {};
        nurseAttributes[nurse.id].code = codeSelect.value;
        updateNurseAssignmentInfo();
      }
    });
  
    row.appendChild(label);
    row.appendChild(select);
    row.appendChild(levelSelect);
    row.appendChild(codeSelect);
    row.appendChild(deleteBtn);
    row.appendChild(radio);
    container.appendChild(row);
  }
  
  function updateGroupLabels() {
    const rows = document.querySelectorAll('#nurseSelectionContainer .nurse-selection-row');
    rows.forEach((row, i) => {
      const label = row.querySelector('.nurse-label');
      label.textContent = `組別 ${i + 1}：`;
    });
  }
  
  function updateCurrentShiftDisplay() {
    const shiftNames = { day: '白班', evening: '小夜班', night: '大夜班' };
    document.getElementById('currentShiftDisplay').textContent = `目前班別：${shiftNames[currentShift]}`;
    document.querySelectorAll('.shift-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-shift') === currentShift) {
        btn.classList.add('active');
      }
    });
  }
  
  function initNurseDropdowns() {
    selectedNurses = [];
    selectedNurseIdForBed = null;
    nurseAttributes = {};
    document.getElementById('nurseSelectionContainer').innerHTML = '';
  }
  
  function renderBeds() {
    const container = document.getElementById('bedContainer');
    container.innerHTML = '';
    beds.forEach(bed => {
      const div = document.createElement('div');
      div.className = 'bed';
      div.textContent = bed.number;
  
      if (bed.nurseId) {
        const nurse = nurses.find(n => n.id === bed.nurseId);
        div.style.backgroundColor = '#3498db';
        div.style.color = 'white';
        div.title = nurse.name;
      } else {
        div.style.backgroundColor = '#f8f8f8';
        div.style.color = '#333';
        div.title = '';
      }
  
      div.addEventListener('click', () => {
        if (!selectedNurseIdForBed) return;
        const isDuplicate = bed.nurseId && bed.nurseId !== selectedNurseIdForBed;
        if (isDuplicate) {
          div.classList.add('duplicate');
          setTimeout(() => div.classList.remove('duplicate'), 1000);
          return;
        }
  
        if (bed.nurseId === selectedNurseIdForBed) {
          bed.nurseId = null;
        } else {
          bed.nurseId = selectedNurseIdForBed;
        }
        renderBeds();
        updateNurseAssignmentInfo();
      });
  
      container.appendChild(div);
    });
  }
  
  function updateNurseAssignmentInfo() {
    const info = document.getElementById('nurseAssignmentInfo');
    info.innerHTML = '';
    const actual = selectedNurses.filter(Boolean);
    if (actual.length === 0) {
      return;
    }
    actual.forEach(nurse => {
      const assigned = beds.filter(b => b.nurseId === nurse.id).map(b => b.number).sort((a, b) => a - b);
      if (assigned.length === 0) return;
      const row = document.createElement('div');
      row.className = 'nurse-assignment';
  
      const name = document.createElement('div');
      name.className = 'assignment-nurse-name';
      const attr = nurseAttributes[nurse.id] || { level: '', code: '' };
      name.textContent = `${nurse.name}　｜點班：${attr.level} ， 消防編組：${attr.code}`;
  

      
      const blocks = document.createElement('div');
      blocks.className = 'assignment-bed-blocks';
      assigned.forEach(bedNum => {
        const block = document.createElement('div');
        block.className = 'bed-block';
        block.textContent = `${bedNum}`;
        blocks.appendChild(block);
      });
  
      row.appendChild(name);
      row.appendChild(blocks);
      info.appendChild(row);
      
    });
  }
  
  function showConfirmBox(newShift) {
    const existingBox = document.getElementById('confirmBox');
    if (existingBox) existingBox.remove();
  
    const box = document.createElement('div');
    box.id = 'confirmBox';
    box.className = 'confirm-overlay';
    box.innerHTML = `
      <p>是否切換到「${{ day: '白班', evening: '小夜班', night: '大夜班' }[newShift] }」？目前資料將被清除。</p>
      <div class="confirm-buttons">
        <button class="confirm">確定</button>
        <button class="cancel">取消</button>
      </div>
    `;
    const backdrop = document.createElement('div');
    backdrop.className = 'confirm-backdrop';
    backdrop.onclick = () => {
      box.remove();
      backdrop.remove();
    };
  
    document.body.appendChild(backdrop);
    document.body.appendChild(box);
  
    box.querySelector('.confirm').onclick = () => {
      currentShift = newShift;
      selectedNurses = [];
      selectedNurseIdForBed = null;
      beds.forEach(b => b.nurseId = null);
      updateCurrentShiftDisplay();
      initNurseDropdowns();
      renderBeds();
      updateNurseAssignmentInfo();
      box.remove();
      backdrop.remove();
    };
  
    box.querySelector('.cancel').onclick = () => {
      box.remove();
      backdrop.remove();
    };
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    function updateDateDisplay() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const dateStr = `${year}/${month}/${day} ${hours}:${minutes}`;
      const formattedDate = dateStr.split('').map(char => `<span>${char}</span>`).join('');
      
      document.getElementById('currentDate').innerHTML = formattedDate;
    }
    
    // 初始化時間
    updateDateDisplay();
    
    // 每分鐘更新一次
    setInterval(updateDateDisplay, 60000);
    
    
    document.querySelectorAll('.shift-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const newShift = btn.getAttribute('data-shift');
        if (newShift !== currentShift) {
          showConfirmBox(newShift);
        }
      });
    });
  
    updateCurrentShiftDisplay();
    initNurseDropdowns();
    renderBeds();
  
    const btnContainer = document.createElement('div');
    btnContainer.className = 'top-bar';
    btnContainer.style.marginTop = '30px';
    const manageBtn = document.createElement('button');
    manageBtn.className = 'manage-nurse-btn';
    manageBtn.textContent = '管理護理師';
    manageBtn.onclick = manageNurses;
    const addBtn = document.createElement('button');
    addBtn.className = 'add-group-btn';
    addBtn.textContent = '➕ 新增照護組別';
    addBtn.onclick = addNurseGroup;
    btnContainer.appendChild(manageBtn);
    btnContainer.appendChild(addBtn);
    document.querySelector('.container').appendChild(btnContainer);
  });
  



  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
  
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
  
      document.querySelectorAll('.tab-content').forEach(div => div.classList.add('hidden'));
      document.getElementById(`tab-${tab}`).classList.remove('hidden');
    });
  });
  


  const headerRow = document.createElement('div');
headerRow.className = 'assignment-header';

const name = document.createElement('div');
name.className = 'assignment-nurse-name';
name.textContent = nurse.name;

const meta = document.createElement('div');
meta.className = 'assignment-meta';
meta.textContent = `點班：${attr.level} ， 消防編組：${attr.code}`;

headerRow.appendChild(name);
headerRow.appendChild(meta);
row.appendChild(headerRow);


// 載入外部 HTML 區塊
function loadExternalHTML(id, url) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    })
    .catch(err => {
      document.getElementById(id).innerHTML = '<p>載入失敗</p>';
      console.error(err);
    });
}

// 當頁面載入完畢後載入 tab-report 區塊
document.addEventListener('DOMContentLoaded', () => {
  loadExternalHTML('reportContent', 'pages/environment.html');
});
