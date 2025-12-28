document.addEventListener("DOMContentLoaded", function() {

  // 兵種IDを付与して管理
  const categories = [
    {id: 'cat1', name: '歩兵'},
    {id: 'cat2', name: '軍需品'},
    {id: 'cat3', name: '戦車'},
    {id: 'cat4', name: '秘密'}
  ];

  // 兵器をIDベースで紐付け
  const weaponsByCategoryId = {
    cat1: [{id:'w1', name:'歩兵'}],
    cat2: [{id:'w2', name:'砲兵'}],
    cat3: [{id:'w3', name:'駆逐戦車'}],
    cat4: [{id:'w4', name:'ロケット砲'}]
  };

  // 兵器ステータス（名前ベース）
  const weaponStats = {
    歩兵: {1:{attack:{non:4,light:2,heavy:1.5},defense:{non:6,light:3,heavy:2.3}},2:{attack:{non:4,light:2,heavy:1.5},defense:{non:6,light:3,heavy:2.3}},3:{attack:{non:5.5,light:2.7,heavy:2},defense:{non:8.3,light:4.1,heavy:3}},4:{attack:{non:7,light:4,heavy:3},defense:{non:10.5,light:6,heavy:4.5}},5:{attack:{non:9,light:5,heavy:4},defense:{non:13.5,light:7.5,heavy:6}},6:{attack:{non:12,light:7,heavy:5.3},defense:{non:18,light:10.5,heavy:8}}},
    砲兵: {1:{attack:{non:1.5,light:2.7,heavy:2},defense:{non:0.4,light:0.7,heavy:0.5}},2:{attack:{non:2,light:4,heavy:3},defense:{non:0.5,light:1,heavy:0.8}},3:{attack:{non:2.8,light:5.5,heavy:4},defense:{non:0.7,light:1.4,heavy:1}},4:{attack:{non:3.8,light:0.9,heavy:7.5},defense:{non:0.9,light:1.9,heavy:1.4}},5:{attack:{non:5,light:10.3,heavy:7.5},defense:{non:1.3,light:2.6,heavy:1.9}}},
    駆逐戦車: {1:{attack:{non:0.7,light:4,heavy:6},defense:{non:1.1,light:6,heavy:9}},2:{attack:{non:1,light:5.3,heavy:8},defense:{non:1.5,light:7.9,heavy:12}},3:{attack:{non:1.5,light:7,heavy:11},defense:{non:2.3,light:10.5,heavy:16.5}},4:{attack:{non:2.3,light:9.3,heavy:5},defense:{non:3.5,light:13.9,heavy:22.5}},5:{attack:{non:3.5,light:12,heavy:20},defense:{non:5.3,light:18,heavy:30}}},
    ロケット砲: {1:{attack:{non:3.5,light:2.2,heavy:1.5},defense:{non:0.9,light:0.6,heavy:0.4}},2:{attack:{non:6.6,light:4.5,heavy:2.5},defense:{non:1.5,light:1.1,heavy:0.6}},3:{attack:{non:10.3,light:7,heavy:4.5},defense:{non:2.6,light:1.7,heavy:1.1}}}
  };

  const categorySelect = document.getElementById("category");
  const weaponSelect = document.getElementById("weapon");
  const levelSelect = document.getElementById("level");
  const addBtn = document.getElementById("add");
  const calcBtn = document.getElementById("calc");
  const listDiv = document.getElementById("list");
  const resultDiv = document.getElementById("result");

  let selectedWeapons = [];

  // 兵種セレクト初期化
  function initCategorySelect() {
    categories.forEach(c=>{
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      categorySelect.appendChild(opt);
    });
  }

  // 兵器更新（兵種IDベース）
  function updateWeapons() {
    const catId = categorySelect.value;
    weaponSelect.innerHTML = "";
    weaponsByCategoryId[catId].forEach(w=>{
      const opt = document.createElement("option");
      opt.value = w.name;
      opt.textContent = w.name;
      weaponSelect.appendChild(opt);
    });
    updateLevelOptions();
  }

  // レベル更新
  function updateLevelOptions() {
    const weapon = weaponSelect.value;
    if(!weaponStats[weapon]) return;
    const maxLevel = Math.max(...Object.keys(weaponStats[weapon]).map(Number));
    levelSelect.innerHTML = "";
    for(let i=1;i<=maxLevel;i++){
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      levelSelect.appendChild(opt);
    }
  }

  addBtn.addEventListener("click", function(){
    selectedWeapons.push({
      categoryId: categorySelect.value,
      weapon: weaponSelect.value,
      count: Number(document.getElementById("count").value),
      level: Number(levelSelect.value)
    });
    renderList();
  });

  function renderList(){
    listDiv.innerHTML = "";
    selectedWeapons.forEach((w,i)=>{
      const div = document.createElement("div");
      div.className = "weapon";
      const catName = categories.find(c=>c.id===w.categoryId).name;
      div.innerHTML = `${catName} / ${w.weapon} 数:${w.count} Lv:${w.level} <button data-index="${i}">削除</button>`;
      listDiv.appendChild(div);
    });
    listDiv.querySelectorAll("button").forEach(btn=>{
      btn.addEventListener("click", function(){
        selectedWeapons.splice(Number(this.dataset.index),1);
        renderList();
      });
    });
  }

  function calculate(selectedWeapons, mode){
    const result={non:0,light:0,heavy:0};
    selectedWeapons.forEach(w=>{
      const stats = weaponStats[w.weapon][w.level];
      ['non','light','heavy'].forEach(k=>{
        result[k]+= stats[mode][k]*w.count;
      });
    });
    return result;
  }

  calcBtn.addEventListener("click", function(){
    const mode = document.getElementById("mode").value;
    const res = calculate(selectedWeapons, mode);
    resultDiv.innerHTML = `非装甲: ${res.non.toFixed(1)}<br>軽装甲: ${res.light.toFixed(1)}<br>重装甲: ${res.heavy.toFixed(1)}`;
  });

  categorySelect.addEventListener("change", updateWeapons);
  weaponSelect.addEventListener("change", updateLevelOptions);

  initCategorySelect();
  updateWeapons();

});
