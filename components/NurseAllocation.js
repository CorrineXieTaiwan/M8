import React, { useState } from 'react';

const NurseAllocation = () => {
  // 原有的狀態
  const [beds, setBeds] = useState(Array(30).fill(false));  // 假設有30張床
  const [nurseGroups, setNurseGroups] = useState([
    { name: '組別1', nurse: '', beds: [] },
    { name: '組別2', nurse: '', beds: [] },
    { name: '組別3', nurse: '', beds: [] },
    // ... 其他組別
  ]);

  // 新增三個班別的狀態
  const [shifts, setShifts] = useState({
    '白班': [...nurseGroups],
    '小夜班': [...nurseGroups],
    '大夜班': [...nurseGroups]
  });

  // 新增床位變動的狀態
  const [bedChanges, setBedChanges] = useState({
    '白班': {},
    '小夜班': {},
    '大夜班': {}
  });

  // 處理床位變化的函數
  const handleBedChange = (shift, groupIndex, type, value) => {
    setBedChanges(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [groupIndex]: {
          ...prev[shift][groupIndex],
          [type]: value
        }
      }
    }));
  };

  // 原有的床位選擇處理函數
  const handleBedClick = (index) => {
    const newBeds = [...beds];
    newBeds[index] = !newBeds[index];
    setBeds(newBeds);
  };

  // 分配床位給護理師的函數
  const assignBedsToNurse = (groupIndex, selectedBeds) => {
    const newNurseGroups = [...nurseGroups];
    newNurseGroups[groupIndex].beds = selectedBeds;
    setNurseGroups(newNurseGroups);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">護理師床位分配系統</h1>
      
      {/* 顯示三個班別的分配結果 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {['白班', '小夜班', '大夜班'].map((shift) => (
          <div key={shift} className="border rounded p-4">
            <h2 className="text-xl font-bold mb-2">{shift}</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">照護組別</th>
                  <th className="border p-2">護理師</th>
                  <th className="border p-2">分配床位</th>
                  <th className="border p-2">出院床數</th>
                  <th className="border p-2">預入床數</th>
                </tr>
              </thead>
              <tbody>
                {nurseGroups.map((group, index) => (
                  <tr key={index}>
                    <td className="border p-2">{group.name}</td>
                    <td className="border p-2">
                      <input
                        type="text"
                        className="w-full border rounded p-1"
                        value={group.nurse}
                        onChange={(e) => {
                          const newGroups = [...nurseGroups];
                          newGroups[index].nurse = e.target.value;
                          setNurseGroups(newGroups);
                        }}
                      />
                    </td>
                    <td className="border p-2">{group.beds.join(', ')}</td>
                    <td className="border p-2">
                      <input 
                        type="number" 
                        className="w-full border rounded p-1"
                        min="0"
                        placeholder="0"
                        value={bedChanges[shift][index]?.out || ''}
                        onChange={(e) => handleBedChange(shift, index, 'out', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <input 
                        type="number" 
                        className="w-full border rounded p-1"
                        min="0"
                        placeholder="0"
                        value={bedChanges[shift][index]?.in || ''}
                        onChange={(e) => handleBedChange(shift, index, 'in', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* 床位選擇區域 */}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">床位選擇</h2>
        <div className="grid grid-cols-10 gap-2">
          {beds.map((isSelected, index) => (
            <button
              key={index}
              className={`p-2 border rounded ${isSelected ? 'bg-blue-500 text-white' : 'bg-white'}`}
              onClick={() => handleBedClick(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NurseAllocation; 