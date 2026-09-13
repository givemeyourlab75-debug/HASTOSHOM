const screens=[...document.querySelectorAll(".screen")];
const noBtn=document.getElementById("noBtn");
const noMessage=document.getElementById("noMessage");
const yesBtn=document.getElementById("yesBtn");
const nextBtn=document.getElementById("nextBtn");
const goBtn=document.getElementById("goBtn");
const dateInput=document.getElementById("dateInput");
const timeInput=document.getElementById("timeInput");
const calendar=document.getElementById("calendar");
const calendarDays=document.getElementById("calendarDays");
const monthTitle=document.getElementById("monthTitle");
const finalDate=document.getElementById("finalDate");
const lastMessage=document.getElementById("lastMessage");
const finalLoveBg=document.getElementById("finalLoveBg");
const sparkles=document.getElementById("sparkles");
const hearts=document.getElementById("hearts");
const loveWords=document.getElementById("loveWords");
const stars=document.getElementById("stars");
const petals=document.getElementById("petals");
const bubbles=document.getElementById("bubbles");
const surpriseTransition=document.getElementById("surpriseTransition");

let noClicks=0,selectedFood="",selectedISO="",viewJ={jy:1405,jm:1};
let touchEffectCount=0;

const jMonths=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const weekNames=["ش","ی","د","س","چ","پ","ج"];


function typeImportantText(element, text, speed=42){
  if(!element)return;
  element.textContent="";
  let i=0;
  const tick=()=>{
    element.textContent=text.slice(0,i++);
    if(i<=text.length)setTimeout(tick,speed);
  };
  tick();
}

function show(n){
  screens.forEach((s,i)=>s.classList.toggle("active",i===n));
  if(n!==3){
    finalLoveBg.classList.remove("show");
    finalLoveBg.setAttribute("aria-hidden","true");
    lastMessage.classList.remove("show");
  }
}

noBtn.onclick=()=>{
  noClicks++;
  const sizes=[.88,.74,.60,.46,.27];
  noBtn.style.transform=`scale(${sizes[Math.min(noClicks-1,4)]})`;
  noMessage.textContent=["مطمئنی؟ 🥺","یه بار دیگه فکر کن...","نه رو چرا می‌زنی؟ 😭","این دکمه داره کوچیک میشه!","دیگه خیلی کوچیک شد..."][Math.min(noClicks-1,4)];
};

yesBtn.onclick=()=>show(1);

function div(a,b){return Math.floor(a/b)}

function gregorianToJalali(gy,gm,gd){
  const gdm=[0,31,59,90,120,151,181,212,243,273,304,334];
  let gy2=gm>2?gy+1:gy;
  let days=355666+365*gy+div(gy2+3,4)-div(gy2+99,100)+div(gy2+399,400)+gd+gdm[gm-1];
  let jy=-1595+33*div(days,12053);days%=12053;
  jy+=4*div(days,1461);days%=1461;
  if(days>365){jy+=div(days-1,365);days=(days-1)%365}
  let jm=days<186?1+div(days,31):7+div(days-186,30);
  let jd=1+(days<186?days%31:(days-186)%30);
  return [jy,jm,jd];
}

function jalaliToGregorian(jy,jm,jd){
  jy+=1595;
  let days=-355668+365*jy+div(jy,33)*8+div((jy%33)+3,4)+jd+(jm<7?(jm-1)*31:(jm-7)*30+186);
  let gy=400*div(days,146097);days%=146097;
  if(days>36524){gy+=100*div(--days,36524);days%=36524;if(days>=365)days++}
  gy+=4*div(days,1461);days%=1461;
  if(days>365){gy+=div(days-1,365);days=(days-1)%365}
  let gd=days+1;
  const sal_a=[0,31,(gy%4===0&&gy%100!==0)||gy%400===0?29:28,31,30,31,30,31,31,30,31,30,31];
  let gm=0;
  while(gd>sal_a[gm+1]){gd-=sal_a[gm+1];gm++}
  return [gy,gm+1,gd];
}

function isoFromJalali(jy,jm,jd){
  const [gy,gm,gd]=jalaliToGregorian(jy,jm,jd);
  return `${gy}-${String(gm).padStart(2,"0")}-${String(gd).padStart(2,"0")}`;
}

function jalaliFromISO(iso){
  const [gy,gm,gd]=iso.split("-").map(Number);
  return gregorianToJalali(gy,gm,gd);
}

function todayJ(){
  const d=new Date();
  return gregorianToJalali(d.getFullYear(),d.getMonth()+1,d.getDate());
}

function daysInJalaliMonth(jy,jm){
  if(jm<=6)return 31;
  if(jm<=11)return 30;
  const g=jalaliToGregorian(jy,12,1);
  const next=jalaliToGregorian(jy+1,1,1);
  const a=new Date(g[0],g[1]-1,g[2]),b=new Date(next[0],next[1]-1,next[2]);
  return Math.round((b-a)/86400000);
}

function renderCalendar(){
  monthTitle.textContent=`${jMonths[viewJ.jm-1]} ${viewJ.jy}`;
  calendarDays.innerHTML="";
  const firstISO=isoFromJalali(viewJ.jy,viewJ.jm,1);
  const [gy,gm,gd]=firstISO.split("-").map(Number);
  const first=new Date(gy,gm-1,gd);
  const start=(first.getDay()+1)%7;
  const total=daysInJalaliMonth(viewJ.jy,viewJ.jm);

  for(let i=0;i<start;i++){
    const b=document.createElement("button");
    b.className="empty";
    b.disabled=true;
    calendarDays.appendChild(b);
  }

  const today=todayJ();

  for(let day=1;day<=total;day++){
    const b=document.createElement("button");
    b.type="button";
    b.textContent=day;
    const iso=isoFromJalali(viewJ.jy,viewJ.jm,day);

    if(today[0]===viewJ.jy&&today[1]===viewJ.jm&&today[2]===day)b.classList.add("today");
    if(selectedISO===iso)b.classList.add("selected-day");

    b.onclick=()=>{
      selectedISO=iso;
      dateInput.value=`${jMonths[viewJ.jm-1]} ${day} ${viewJ.jy}`;
      calendar.classList.remove("open");
      calendar.setAttribute("aria-hidden","true");
      renderCalendar();
    };

    calendarDays.appendChild(b);
  }
}

function openCalendar(){
  if(selectedISO){
    const j=jalaliFromISO(selectedISO);
    viewJ={jy:j[0],jm:j[1]};
  }else{
    const t=todayJ();
    viewJ={jy:t[0],jm:t[1]};
  }
  renderCalendar();
  calendar.classList.add("open");
  calendar.setAttribute("aria-hidden","false");
}

dateInput.onclick=openCalendar;

document.getElementById("prevMonth").onclick=()=>{
  viewJ.jm--;
  if(viewJ.jm<1){viewJ.jm=12;viewJ.jy--}
  renderCalendar();
};

document.getElementById("nextMonth").onclick=()=>{
  viewJ.jm++;
  if(viewJ.jm>12){viewJ.jm=1;viewJ.jy++}
  renderCalendar();
};

nextBtn.onclick=()=>{
  if(!selectedISO||!timeInput.value){
    noMessage.textContent="لطفاً تاریخ و ساعت رو انتخاب کن 🥺";
    return;
  }
  show(2);
};

document.querySelectorAll(".food").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".food").forEach(x=>x.classList.remove("selected"));
  b.classList.add("selected");
  selectedFood=b.dataset.food;
  createSelectionGlow(b);
});

function createSelectionGlow(element){
  const rect=element.getBoundingClientRect();
  const r=document.createElement("span");
  r.className="tap-ripple";
  r.style.left=`${rect.left+rect.width/2}px`;
  r.style.top=`${rect.top+rect.height/2}px`;
  document.body.appendChild(r);
  setTimeout(()=>r.remove(),600);
}

function launchSparkles(){
  sparkles.innerHTML="";
  const count=62;
  for(let i=0;i<count;i++){
    const s=document.createElement("span");
    s.className="spark";
    const angle=Math.random()*Math.PI*2;
    const distance=60+Math.random()*145;
    s.style.left="50%";
    s.style.top="50%";
    s.style.setProperty("--dx",`${Math.cos(angle)*distance}px`);
    s.style.setProperty("--dy",`${Math.sin(angle)*distance}px`);
    s.style.animationDelay=`${Math.random()*0.12}s`;
    s.style.width=s.style.height=`${2+Math.random()*3}px`;
    sparkles.appendChild(s);
  }
  setTimeout(()=>sparkles.innerHTML="",1200);
}

function showFinalBg(){
  const title=finalLoveBg.querySelector("span");
  if(title) title.textContent="اگه گفتی چقد دوستت دارمممممم 👀💗";
  finalLoveBg.classList.remove("show");
  void finalLoveBg.offsetWidth;
  finalLoveBg.classList.add("show");
  finalLoveBg.setAttribute("aria-hidden","false");
}

function runSurpriseTransition(){
  surpriseTransition.classList.add("show");
  surpriseTransition.setAttribute("aria-hidden","false");

  setTimeout(()=>{
    show(3);
    launchSparkles();
    showFinalBg();
    const finalTitle=finalLoveBg.querySelector("span");
    if(finalTitle){
      finalTitle.textContent="";
      const titleText="اگه گفتی چقد دوستت دارمممممم 👀💗";
      let ti=0;
      const typeTitle=()=>{
        finalTitle.textContent=titleText.slice(0,ti++);
        if(ti<=titleText.length)setTimeout(typeTitle,38);
      };
      typeTitle();
    }

    setTimeout(()=>{
      lastMessage.textContent="میـבونے کـہ زنـבگیت همیشـہ با من قرارـہ سوپرایز کننـבـہ بشـہ برات عشقـہ من 😝 💖";
      lastMessage.classList.add("show");
    },900);

    setTimeout(()=>{
      surpriseTransition.classList.remove("show");
      surpriseTransition.setAttribute("aria-hidden","true");
    },180);
  },520);
}

goBtn.onclick=()=>{
  if(!selectedFood)return;
  const [jy,jm,jd]=jalaliFromISO(selectedISO);
  const weekdays=["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"];
  const [gy,gm,gd]=selectedISO.split("-").map(Number);
  const weekday=weekdays[new Date(gy,gm-1,gd).getDay()];
  finalDate.textContent=`پس ${weekday} ${jd} ${jMonths[jm-1]} ساعت ${timeInput.value} میام دنبالت، برای ${selectedFood} 🥂`;
  runSurpriseTransition();
};

function randomBetween(min,max){return min+Math.random()*(max-min)}

function makeFloatingHearts(){
  hearts.innerHTML="";
  const heartTypes=["❤️","💕","💗","💖","💓","💞"];
  const count=26;

  for(let i=0;i<count;i++){
    const e=document.createElement("span");
    e.className=`floating-heart${i%7===0?" pair":""}`;
    e.textContent=heartTypes[Math.random()*heartTypes.length|0];

    const edge=i%2===0
      ? randomBetween(2,24)
      : randomBetween(76,98);

    e.style.cssText=
      `--left:${edge}%;`+
      `--size:${randomBetween(12,30).toFixed(1)}px;`+
      `--opacity:${randomBetween(.12,.30).toFixed(2)};`+
      `--duration:${randomBetween(9,17).toFixed(1)}s;`+
      `--drift:${randomBetween(-38,38).toFixed(1)}px;`+
      `--blur:${randomBetween(0,.55).toFixed(2)}px;`+
      `animation-delay:-${randomBetween(0,15).toFixed(1)}s`;
    hearts.appendChild(e);
  }
}

function makeFloatingWords(){
  loveWords.innerHTML="";
  const wordTypes=[
    "🙈 𝙻𝙾𝚅𝙴 𝚈𝙾𝚄 𝙼𝚈 𝙷𝙰𝚂𝚃𝙸",
    "تو تو خیلی خوشگلی 😰"
  ];

  const count=10;

  for(let i=0;i<count;i++){
    const e=document.createElement("span");
    e.className="floating-word";
    e.textContent=wordTypes[i%2];

    const left=i%2===0
      ? randomBetween(1,25)
      : randomBetween(75,96);

    e.style.cssText=
      `--left:${left.toFixed(1)}%;`+
      `--size:${randomBetween(13,17).toFixed(1)}px;`+
      `--opacity:${randomBetween(.13,.22).toFixed(2)};`+
      `--duration:${randomBetween(11,18).toFixed(1)}s;`+
      `--drift:${randomBetween(-28,28).toFixed(1)}px;`+
      `--delay:-${randomBetween(0,15).toFixed(1)}s`;
    loveWords.appendChild(e);
  }
}

function makeStars(){
  stars.innerHTML="";
  for(let i=0;i<16;i++){
    const e=document.createElement("span");
    e.className="floating-star";
    const left=i%2===0?randomBetween(1,28):randomBetween(72,98);
    e.style.cssText=
      `--left:${left.toFixed(1)}%;`+
      `--top:${randomBetween(5,95).toFixed(1)}%;`+
      `--size:${randomBetween(2,4).toFixed(1)}px;`+
      `--duration:${randomBetween(3.5,6.5).toFixed(1)}s;`+
      `--delay:-${randomBetween(0,6).toFixed(1)}s`;
    stars.appendChild(e);
  }
}

function makePetals(){
  petals.innerHTML="";
  for(let i=0;i<8;i++){
    const e=document.createElement("span");
    e.className="floating-petal";
    const left=i%2===0?randomBetween(1,30):randomBetween(70,98);
    e.style.cssText=
      `--left:${left.toFixed(1)}%;`+
      `--size:${randomBetween(11,17).toFixed(1)}px;`+
      `--duration:${randomBetween(12,19).toFixed(1)}s;`+
      `--delay:-${randomBetween(0,12).toFixed(1)}s;`+
      `--drift:${randomBetween(-35,35).toFixed(1)}px;`+
      `--rotation:${randomBetween(-35,35).toFixed(1)}deg`;
    if(i%3===0)e.style.background="rgba(246,190,216,.58)";
    petals.appendChild(e);
  }
}

function makeBubbles(){
  bubbles.innerHTML="";
  for(let i=0;i<7;i++){
    const e=document.createElement("span");
    e.className="floating-bubble";
    const left=i%2===0?randomBetween(3,27):randomBetween(73,97);
    e.style.cssText=
      `--left:${left.toFixed(1)}%;`+
      `--size:${randomBetween(16,35).toFixed(1)}px;`+
      `--duration:${randomBetween(13,21).toFixed(1)}s;`+
      `--delay:-${randomBetween(0,14).toFixed(1)}s;`+
      `--drift:${randomBetween(-25,25).toFixed(1)}px`;
    bubbles.appendChild(e);
  }
}

makeFloatingHearts();
makeFloatingWords();
makeStars();
makePetals();
makeBubbles();

function spawnTouchEffect(x,y){
  if(touchEffectCount>=20)return;
  touchEffectCount++;

  const ripple=document.createElement("span");
  ripple.className="tap-ripple";
  ripple.style.left=`${x}px`;
  ripple.style.top=`${y}px`;
  document.body.appendChild(ripple);

  const heartTypes=["❤️","💕","💗","💖","💓","💞"];
  const count=3+Math.floor(Math.random()*2);

  for(let i=0;i<count;i++){
    const h=document.createElement("span");
    h.className="tap-heart";
    h.textContent=heartTypes[Math.random()*heartTypes.length|0];
    const angle=(Math.PI*2*i/count)+randomBetween(-.35,.35);
    const distance=randomBetween(24,48);

    h.style.left=`${x}px`;
    h.style.top=`${y}px`;
    h.style.setProperty("--size",`${randomBetween(9,15).toFixed(1)}px`);
    h.style.setProperty("--dx",`${Math.cos(angle)*distance}px`);
    h.style.setProperty("--dy",`${Math.sin(angle)*distance-12}px`);
    h.style.animationDelay=`${randomBetween(0,.06).toFixed(2)}s`;
    document.body.appendChild(h);

    setTimeout(()=>h.remove(),900);
  }

  setTimeout(()=>{
    ripple.remove();
    touchEffectCount=Math.max(0,touchEffectCount-1);
  },650);
}

document.addEventListener("pointerdown",e=>{
  if(e.pointerType==="mouse" && e.button!==0)return;
  spawnTouchEffect(e.clientX,e.clientY);
},{passive:true});
