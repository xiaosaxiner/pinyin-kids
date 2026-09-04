/* 拼音小乐园 - 逻辑 */
"use strict";

/* ==================== 数据 ==================== */
// 每个字母：{ l:字母, ex:示例词(带文字), pic:表情, sound:发音描述, c:颜色class }
const SHENG = [
  {l:"b", ex:"b 玻", pic:"🐌", sound:"b·玻"},{l:"p", ex:"p 坡", pic:"🍇", sound:"p·坡"},
  {l:"m", ex:"m 摸", pic:"🐱", sound:"m·摸"},{l:"f", ex:"f 佛", pic:"🦊", sound:"f·佛"},
  {l:"d", ex:"d 得", pic:"🐶", sound:"d·得"},{l:"t", ex:"t 特", pic:"🐢", sound:"t·特"},
  {l:"n", ex:"n 讷", pic:"🐮", sound:"n·讷"},{l:"l", ex:"l 勒", pic:"🐱", sound:"l·勒"},
  {l:"g", ex:"g 哥", pic:"🐔", sound:"g·哥"},{l:"k", ex:"k 科", pic:"🐸", sound:"k·科"},
  {l:"h", ex:"h 喝", pic:"🐵", sound:"h·喝"},{l:"j", ex:"j 鸡", pic:"🐥", sound:"j·鸡"},
  {l:"q", ex:"q 七", pic:"🐧", sound:"q·七"},{l:"x", ex:"x 西", pic:"🐘", sound:"x·西"},
  {l:"zh", ex:"zh 知", pic:"🐷", sound:"zh·知"},{l:"ch", ex:"ch 吃", pic:"🐹", sound:"ch·吃"},
  {l:"sh", ex:"sh 诗", pic:"🐑", sound:"sh·诗"},{l:"r", ex:"r 日", pic:"🐯", sound:"r·日"},
  {l:"z", ex:"z 资", pic:"🦓", sound:"z·资"},{l:"c", ex:"c 雌", pic:"🐱", sound:"c·雌"},
  {l:"s", ex:"s 思", pic:"🐍", sound:"s·思"},{l:"y", ex:"y 衣", pic:"🐟", sound:"y·衣"},
  {l:"w", ex:"w 乌", pic:"🐺", sound:"w·乌"}
];

const YUN = [
  {l:"a", ex:"a 啊", pic:"😊", sound:"a·啊"},{l:"o", ex:"o 喔", pic:"🦉", sound:"o·喔"},
  {l:"e", ex:"e 鹅", pic:"🦢", sound:"e·鹅"},{l:"i", ex:"i 衣", pic:"🐜", sound:"i·衣"},
  {l:"u", ex:"u 乌", pic:"🐦", sound:"u·乌"},{l:"ü", ex:"ü 迂", pic:"🐟", sound:"ü·迂"},
  {l:"ai", ex:"ai 挨", pic:"👋", sound:"ai·挨"},{l:"ei", ex:"ei 诶", pic:"😲", sound:"ei·诶"},
  {l:"ui", ex:"ui 威", pic:"😮", sound:"ui·威"},{l:"ao", ex:"ao 熬", pic:"🦅", sound:"ao·熬"},
  {l:"ou", ex:"ou 欧", pic:"🤭", sound:"ou·欧"},{l:"iu", ex:"iu 优", pic:"🌲", sound:"iu·优"},
  {l:"ie", ex:"ie 耶", pic:"🌿", sound:"ie·耶"},{l:"üe", ex:"üe 约", pic:"🎈", sound:"üe·约"},
  {l:"er", ex:"er 儿", pic:"👶", sound:"er·儿"},{l:"an", ex:"an 安", pic:"🛡️", sound:"an·安"},
  {l:"en", ex:"en 恩", pic:"💝", sound:"en·恩"},{l:"in", ex:"in 因", pic:"🍬", sound:"in·因"},
  {l:"un", ex:"un 温", pic:"🧣", sound:"un·温"},{l:"ün", ex:"ün 晕", pic:"💫", sound:"ün·晕"},
  {l:"ang", ex:"ang 昂", pic:"🦁", sound:"ang·昂"},{l:"eng", ex:"eng 亨", pic:"🔔", sound:"eng·亨"},
  {l:"ing", ex:"ing 英", pic:"🦋", sound:"ing·英"},{l:"ong", ex:"ong 轰", pic:"🐝", sound:"ong·轰"}
];

const ZHENG = [
  {l:"zhi", ex:"zhi 知", pic:"🐷", sound:"zhī·知"},{l:"chi", ex:"chi 吃", pic:"🍲", sound:"chī·吃"},
  {l:"shi", ex:"shi 诗", pic:"📜", sound:"shī·诗"},{l:"ri", ex:"ri 日", pic:"🌞", sound:"rì·日"},
  {l:"zi", ex:"zi 资", pic:"📚", sound:"zī·资"},{l:"ci", ex:"ci 雌", pic:"🦚", sound:"cī·雌"},
  {l:"si", ex:"si 思", pic:"💭", sound:"sī·思"},{l:"yi", ex:"yi 衣", pic:"👕", sound:"yī·衣"},
  {l:"wu", ex:"wu 乌", pic:"🌑", sound:"wū·乌"},{l:"yu", ex:"yu 鱼", pic:"🐟", sound:"yú·鱼"},
  {l:"ye", ex:"ye 叶", pic:"🍃", sound:"yè·叶"},{l:"yue", ex:"yue 月", pic:"🌙", sound:"yuè·月"},
  {l:"yuan", ex:"yuan 圆", pic:"⭕", sound:"yuán·圆"},{l:"yin", ex:"yin 音", pic:"🎵", sound:"yīn·音"},
  {l:"yun", ex:"yun 云", pic:"☁️", sound:"yún·云"},{l:"ying", ex:"ying 鹰", pic:"🦅", sound:"yīng·鹰"}
];

const COLORS = ["c-pink","c-blue","c-yellow","c-green","c-purple","c-orange"];
// 分类对应的颜色分配
const CAT_COLOR = { sheng:["c-pink","c-blue","c-yellow","c-green","c-purple","c-orange"],
                    yun:["c-blue","c-green","c-yellow","c-orange","c-pink"],
                    zheng:["c-yellow","c-orange","c-green","c-blue","c-pink"] };

const CATS = { sheng:{def:SHENG, name:"声母"}, yun:{def:YUN, name:"韵母"}, zheng:{def:ZHENG, name:"整体认读"} };

/* ==================== 发音（播放真实标准拼音音频） ==================== */
// 使用 edge-tts 生成的标准拼音 mp3
let currentAudio = null;

// 音频文件名与拼音一致（含 ü 系列直接用 ü.mp3 / üe.mp3 / ün.mp3）
function audioUrl(py){
  return "audio/" + py + ".mp3";
}

// 播放音频，返回播放结束的 promise
function playAudio(py){
  return new Promise((resolve)=>{
    try{
      if(currentAudio){ currentAudio.pause(); currentAudio.currentTime = 0; }
      const a = new Audio(audioUrl(py));
      currentAudio = a;
      a.onended = ()=> resolve(true);
      a.onerror = ()=> { console.warn("音频加载失败: " + py); resolve(false); };
      a.play().catch(()=> resolve(false));
    }catch(e){ resolve(false); }
  });
}

function stopAudio(){
  if(currentAudio){ currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; }
}

/* ==================== 铺网格 ==================== */
function buildGrid(cat){
  const g = document.getElementById("grid-" + cat);
  const def = CATS[cat].def;
  const cols = CAT_COLOR[cat];
  g.innerHTML = "";
  def.forEach((item,i)=>{
    const col = cols[i % cols.length];
    const t = document.createElement("div");
    t.className = "tile " + col;
    t.dataset.cat = cat;
    t.dataset.idx = i;
    t.innerHTML = `
      <div class="letter">${item.l}</div>
      <div class="example"><b>${item.ex.split(" ")[0]}</b> ${item.ex.split(" ")[1]||""}</div>
      <div class="sound">${item.sound}</div>
    `;
    t.addEventListener("click", ()=> openBig(cat, i));
    g.appendChild(t);
  });
}

/* ==================== 大图展示 ==================== */
let current = null;
let soundTimer = null;
function openBig(cat, idx){
  current = {cat,idx};
  const item = CATS[cat].def[idx];
  const col = (CAT_COLOR[cat][idx % CAT_COLOR[cat].length]).replace("c-","");
  const letterEl = document.getElementById("big-letter");
  letterEl.textContent = item.l;
  // 用固定好看的颜色
  letterEl.style.color = {pink:"#ff5c9e",blue:"#2fa6e6",yellow:"#e0a800",green:"#4fbf2f",purple:"#8e5bff",orange:"#ff9a1f"}[col] || "#5b4a6b";
  document.getElementById("big-pic").textContent = item.pic;
  document.getElementById("big-example").textContent = item.ex;
  document.getElementById("big-sound").textContent = "读音：" + item.sound;
  document.getElementById("overlay").classList.add("show");
  playSound();
}
function playSound(){
  if(!current) return;
  const item = CATS[current.cat].def[current.idx];
  // 播放标准拼音音频
  const fill = document.getElementById("sound-fill");
  clearInterval(soundTimer);
  fill.style.width = "0%";
  playAudio(item.l).then(()=>{ clearInterval(soundTimer); fill.style.width = "100%"; setTimeout(()=>fill.style.width="0%",300); });
  // 模拟波形
  soundTimer = setInterval(()=>{
    const w = parseFloat(fill.style.width) || 0;
    if(w < 92) fill.style.width = Math.min(92, w + 6) + "%";
  }, 60);
}
function closeBig(){
  document.getElementById("overlay").classList.remove("show");
  stopAudio();
  clearInterval(soundTimer);
  current = null;
}

/* ==================== 视图切换 ==================== */
function showView(name){
  document.querySelectorAll(".view").forEach(v=> v.style.display="none");
  const el = document.getElementById("view-" + name);
  if(el) el.style.display = "block";
  // 高亮导航
  document.querySelectorAll(".nav button").forEach(b=> b.classList.toggle("active", b.dataset.nav===name));
  window.scrollTo({top:0, behavior:"smooth"});
  // 首次进入铺网格
  if(name==="sheng") buildGrid("sheng");
  if(name==="yun") buildGrid("yun");
  if(name==="zheng") buildGrid("zheng");
  if(name==="quiz") buildQuiz();
  if(name==="home"){ document.querySelectorAll(".tile").forEach(t=>t.classList.remove("pop")); }
}

/* ==================== 小测验 ==================== */
let quizPool = [];     // 题目源
let quizQueue = [];    // 当前题目序列
let qPos = 0;
let qScore = 0;
let qTotal = 0;
let qAnswer = null;

function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function buildQuiz(){
  // 出题池：从声母+韵母里挑，题目 = "哪个是 X？" 选项含正确答案
  const pool = [];
  SHENG.forEach(x=> pool.push({cat:"sheng", ...x}));
  YUN.forEach(x=> pool.push({cat:"yun", ...x}));
  // 混合，从中抽取
  quizPool = pool;
  qScore = 0; qPos = 0;
  qTotal = 10;
  quizQueue = shuffle(pool).slice(0, qTotal);
  renderQuiz();
}

function renderQuiz(){
  const box = document.getElementById("quiz-box");
  box.classList.remove("celeb");
  if(qPos >= qTotal){
    // 结束
    const pct = Math.round(qScore / qTotal * 100);
    const emo = pct===100?"🏆":pct>=80?"🎉":pct>=60?"👍":"💪";
    const msg = pct===100?"全对！你太棒啦！":pct>=80?"非常厉害！":pct>=60?"不错哦，再练练更好！":"别灰心，多认识几次就会啦！";
    box.classList.add("celeb");
    box.innerHTML = `
      <div class="emo">${emo}</div>
      <h3>${msg}</h3>
      <p style="font-size:1.4rem;font-weight:800;">得分：${qScore} / ${qTotal}</p>
      <p style="color:var(--ink-soft);">点击下面的按钮再来一次吧！</p>
    `;
    return;
  }
  const q = quizQueue[qPos];
  qAnswer = q.l;
  box.innerHTML = `
    <div class="quiz-top">
      <span class="q">第 ${qPos+1} / ${qTotal} 题</span>
      <span class="score">⭐ ${qScore}</span>
    </div>
    <button class="listen-btn" id="listen-btn">🔊 听一听，选对的</button>
    <div class="quiz-options" id="quiz-opts"></div>
  `;
  // 听音按钮
  const lb = document.getElementById("listen-btn");
  lb.addEventListener("click", ()=> playAudio(q.l));
  lb.classList.add("wobble");
  // 自动播一次
  setTimeout(()=> playAudio(q.l), 400);
  // 生成选项（1对 + 3个干扰）
  const opts = [q, ...shuffle(quizPool.filter(x=> x.l!==q.l)).slice(0,3)];
  opts.sort(()=>Math.random()-0.5);
  const holder = document.getElementById("quiz-opts");
  opts.forEach(o=>{
    const b = document.createElement("button");
    b.className = "quiz-opt";
    b.textContent = o.l;
    b.addEventListener("click", ()=> answerQuiz(b, o));
    holder.appendChild(b);
  });
}

function colorOf(item){
  // 根据分类分配颜色（用于题目target）
  const cat = quizPool.find(x=>x.l===item.l && x.cat===item.cat);
  return "#ff5c9e";
}

function answerQuiz(btn, o){
  const btns = [...document.querySelectorAll(".quiz-opt")];
  btns.forEach(b=> b.disabled = true);
  const correct = o.l === qAnswer;
  if(correct){
    btn.classList.add("good");
    qScore++;
    confetti(10);
    playAudio(qAnswer); // 答对时播放标准音强化记忆
  } else {
    btn.classList.add("bad");
    // 高亮正确项
    btns.forEach(b=>{ if(b.textContent===qAnswer) b.classList.add("good"); });
    playAudio(qAnswer);
  }
  setTimeout(()=>{ qPos++; renderQuiz(); }, 1000);
}

/* 撒彩带 */
function confetti(n){
  const colors = ["#ff7eb3","#5ec8ff","#ffd54f","#7ed957","#b388ff","#ffb74d"];
  for(let i=0;i<n;i++){
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random()*100 + "vw";
    c.style.width = (8+Math.random()*8)+"px";
    c.style.height = (8+Math.random()*8)+"px";
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDuration = (1.5+Math.random()*1.5)+"s";
    c.style.borderRadius = Math.random()>.5 ? "50%" : "2px";
    document.body.appendChild(c);
    setTimeout(()=> c.remove(), 3200);
  }
}

/* ==================== 事件绑定 ==================== */
// 导航
document.querySelectorAll(".nav button").forEach(b=>{
  b.addEventListener("click", ()=> showView(b.dataset.nav));
});
// 首页卡片跳转
document.querySelectorAll("[data-goto]").forEach(el=>{
  el.addEventListener("click", ()=> showView(el.dataset.goto));
});
// 大弹窗
document.getElementById("close-big").addEventListener("click", closeBig);
document.getElementById("replay-big").addEventListener("click", playSound);
document.getElementById("overlay").addEventListener("click", e=>{ if(e.target.id==="overlay") closeBig(); });
// 重新开始
document.getElementById("quiz-restart").addEventListener("click", ()=>{ buildQuiz(); });
// 返回顶部
const bt = document.getElementById("back-top");
window.addEventListener("scroll", ()=>{
  bt.classList.toggle("show", window.scrollY > 400);
});
bt.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));

// 初始化：进入首页即预载网格
window.addEventListener("load", ()=>{
  buildGrid("sheng");
  buildGrid("yun");
  buildGrid("zheng");
});