(function(){
var $=function(s){return document.querySelector(s)};
var pad=function(n){return String(n).padStart(2,'0')};
var ymd=function(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
var inr=function(n){return '₹'+Math.round(n).toLocaleString('en-IN')};
var t12=function(m){var h=Math.floor(m/60)%24,mm=m%60,ap=h>=12?'pm':'am';h=h%12||12;return h+':'+pad(mm)+' '+ap};
var fd=function(s){return new Date(s+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})};
var ml=function(ym){return new Date(ym+'-01T00:00:00').toLocaleDateString('en-IN',{month:'long',year:'numeric'})};
var addDays=function(s,n){var d=new Date(s+'T00:00:00');d.setDate(d.getDate()+n);return ymd(d)};
var span=function(a,b){return Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/864e5)+1};
var H=function(h){return h.toFixed(2)+' h'};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function opts(list,sel){return list.map(function(x){return '<option'+(x===sel?' selected':'')+'>'+esc(x)+'</option>'}).join('')}
function num(n){return (Math.round(n*100)/100).toLocaleString('en-IN')}

/* ---------- icons ---------- */
var IC={
 home:'<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
 check:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.8a3.5 3.5 0 010 6.4M18 14.4c2.2.7 3.5 2.6 3.5 5.6"/>',
 team:'<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 8v4M12 12H5v4M12 12h7v4"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5 5l1.8 1.8M17.2 17.2L19 19M5 19l1.8-1.8M17.2 6.8L19 5"/>',
 wallet:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
 box:'<path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5L12 12l9-4.5M12 12v9"/>',
 tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
 file:'<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>',
 rupee:'<path d="M7 5h10M7 9h10M7 5c5 0 6 2.5 6 4s-1 4-6 4l7 6"/>',
 phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
 out:'<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
 cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 work:'<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V5h6v3"/>',
 clip:'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 pin:'<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
 undo:'<path d="M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3"/>'
};
function ic(n,s){s=s||18;return '<svg class="ic" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[n]+'</svg>'}

/* ---------- data ---------- */
var TEAMS=[
 {id:'mgmt',name:'Management',c:'var(--t-mgmt)'},
 {id:'design',name:'Design studio',c:'var(--t-design)'},
 {id:'carp',name:'Carpentry',c:'var(--t-carp)'},
 {id:'polish',name:'Polish & finishing',c:'var(--t-polish)'},
 {id:'house',name:'Housekeeping',c:'var(--t-house)'}];
function tm(id){return TEAMS.filter(function(t){return t.id===id})[0]||TEAMS[0]}
var CEO={id:0,name:'Avinash Rayudu',role:'CEO',team:'mgmt',photo:null};
var RAW=[
 ['Anand','Sr Carpenter · Team Leader','carp',1,140],['Surya','Manager & Sr Designer','design',1,180],['Rajesh Swamy','Manager','mgmt',1,170],
 ['Wasim','Designer','design',0,120],['Santosh','Sr Carpenter','carp',0,125],['Ghanshyam','Sr Carpenter','carp',0,125],
 ['Srinivas K','Carpenter','carp',0,100],['Srinivas Ch','Carpenter','carp',0,100],['Avdesh','Carpenter','carp',0,95],
 ['Devendra Pal','Carpenter','carp',0,95],['Sahabuddin','Carpenter','carp',0,95],['Amarjeet','Polish','polish',0,105],
 ['Sarvajeet','Polish','polish',0,100],['Brijesh','Polish','polish',0,100],['Bhavani','Cleaning','house',0,70],['Satyapal','Carpenter','carp',0,95]];
var EMPS=RAW.map(function(r,i){return {id:i+1,name:r[0],role:r[1],team:r[2],lead:!!r[3],rate:r[4],code:'AW-'+(101+i),active:true,photo:null,mgr:/Manager/.test(r[1])}});
var TASKS=['Cutting','Planing','Joinery','Carving','Assembly','Sanding','Polishing','Finishing','Design work','Supervision','Cleaning','Packing','Loading','Other'];
var TTASK={carp:['Cutting','Planing','Joinery','Carving','Assembly','Sanding'],polish:['Sanding','Polishing','Finishing'],design:['Design work','Supervision'],mgmt:['Supervision','Loading'],house:['Cleaning','Packing']};
var ITEMS=['Teak dining table (Order #214)','Teak chair set of 6 (Order #215)','Teak bed frame (Order #210)','Wardrobe door panels (Order #212)','Sofa frame (Order #217)'];
var DT={full:{u:1,l:'Full day',k:'P'},half:{u:.5,l:'Half day',k:'H'},double:{u:2,l:'Double shift',k:'D'},custom:{u:1,l:'Custom',k:'C'}};
function unitsOf(r){return r.dt==='custom'?(r.units||1):DT[r.dt||'full'].u}
function dayLabel(r){return r.dt==='custom'?num(unitsOf(r))+' days':DT[r.dt||'full'].l}
var S={screen:'login',work:[],wdate:null,wemp:'all',loginRole:'employee',role:null,uid:4,tab:'overview',etab:'today',
 device:'company',loc:'in',selfie:null,off:0,emps:EMPS,records:[],leaves:[],blocked:[],pairing:null,
 month:'2026-10',emonth:'2026-10',form:{type:'Casual',from:'',to:'',reason:''},
 q:'',tf:'all',addOpen:false,confirmDel:null,sunWeeks:[2,4],sun:{}};

function nowD(){return new Date(Date.now()+S.off*60000)}
function todayStr(){return ymd(nowD())}
function months(){var a=['2026-10',todayStr().slice(0,7)];return a.filter(function(x,i){return a.indexOf(x)===i})}
function emp(id){return S.emps.filter(function(e){return e.id===id})[0]}
function A(){return S.emps.filter(function(e){return e.active})}
function isSun(ds){return new Date(ds+'T00:00:00').getDay()===0}
function sunOff(ds){if(!isSun(ds))return false;if(ds in S.sun)return S.sun[ds];return S.sunWeeks.indexOf(Math.ceil(+ds.slice(8)/7))>=0}
function dtFor(h){return h>=11?'double':h<=5?'half':'full'}

/* ---------- sample data ---------- */
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function portrait(id){
  var c=document.createElement('canvas');c.width=c.height=96;var x=c.getContext('2d');
  var bg=[['#cfd8ea','#aebbd6'],['#e8dcc4','#d3bf98'],['#d5e4dc','#b3cbbf'],['#eadbe0','#d4b9c2'],['#dcdcea','#bebfd8']][id%5];
  var g=x.createLinearGradient(0,0,0,96);g.addColorStop(0,bg[0]);g.addColorStop(1,bg[1]);x.fillStyle=g;x.fillRect(0,0,96,96);
  var skin=['#c98f63','#a8714a','#d9a577','#8d5a3b','#b9825a'][id%5],shirt=['#1b2b52','#3a4a6b','#2e5a4f','#6a3b52','#4a4f5c','#7a5a22'][id%6];
  x.fillStyle=shirt;x.beginPath();x.ellipse(48,98,34,30,0,Math.PI,0);x.fill();
  x.fillStyle=skin;x.fillRect(42,52,12,14);x.beginPath();x.ellipse(48,40,15,18,0,0,7);x.fill();
  x.fillStyle=['#1f1a17','#2b2320','#16130f'][id%3];x.beginPath();x.ellipse(48,29,16,11,0,Math.PI,0);x.fill();
  return c.toDataURL('image/jpeg',.82);
}
function seed(){
  var rand=rng(2026),id=1,T=ymd(new Date()),d;
  S.emps.forEach(function(e){e.photo=portrait(e.id)});CEO.photo=portrait(11);
  for(d='2026-10-01';d<T;d=addDays(d,1)){
    var dow=new Date(d+'T00:00:00').getDay(),off=sunOff(d);
    S.emps.forEach(function(e){
      if(off)return;
      var r=rand();
      if(dow===0&&r<.22)return;
      if(r<.05)return;
      var dt=r<.12?'half':r<.18?'double':r<.2?'custom':'full',inM=530+Math.floor(rand()*40),outM,hrs;
      if(dt==='half'){outM=inM+240;hrs=4}
      else if(dt==='double'){outM=inM+900;hrs=14}
      else if(dt==='custom'){outM=inM+780;hrs=12}
      else{outM=1070+Math.floor(rand()*50);hrs=Math.round((outM-inM-60)/60*4)/4}
      S.records.push({id:id++,emp:e.id,date:d,inMin:inM,outMin:outM,hours:hrs,dt:dt,units:dt==='custom'?1.5:null,approved:d<=addDays(T,-3),dist:20+Math.floor(rand()*90),selfie:null});
    });
  }
  [[1,543],[5,560],[2,538],[12,545],[9,552]].forEach(function(p){
    S.records.push({id:id++,emp:p[0],date:T,inMin:p[1],outMin:null,hours:0,dt:'full',approved:false,dist:25+p[0]*5,selfie:null});
  });
  S.nextId=id+1;S.wid=1;
  S.records.forEach(function(r){
    if(r.outMin==null)return;
    var e=emp(r.emp),tl=TTASK[e.team],k=r.emp+r.id,h1=Math.round(r.hours*0.6*4)/4,h2=Math.round((r.hours-h1)*4)/4;
    var recent=r.date>=addDays(T,-6),starts=[-12,-9,-20,-3];
    var pool=recent?ITEMS.slice(0,4):ITEMS.slice(0,4).filter(function(x,i){return addDays(T,starts[i])<=r.date});
    var itm=function(n){return recent?ITEMS[n%4]:(pool.length?pool[n%pool.length]:'General workshop work')};
    S.work.push({id:S.wid++,emp:r.emp,date:r.date,task:tl[k%tl.length],item:itm(k),hours:h1,note:''});
    if(h2>0)S.work.push({id:S.wid++,emp:r.emp,date:r.date,task:tl[(k+1)%tl.length],item:itm(k+1),hours:h2,note:''});
  });
  [[1,'Joinery',3,2.5],[5,'Assembly',1,1.5],[2,'Design work',4,3],[12,'Polishing',0,2]].forEach(function(p){
    S.work.push({id:S.wid++,emp:p[0],date:T,task:p[1],item:ITEMS[p[2]],hours:p[3],note:''});
  });
  S.leaves=[
   {id:1,emp:15,type:'Casual',from:T,to:T,reason:'Family function',status:'approved'},
   {id:2,emp:14,type:'Sick',from:addDays(T,2),to:addDays(T,3),reason:'Fever and cold',status:'pending'},
   {id:3,emp:7,type:'Casual',from:addDays(T,8),to:addDays(T,8),reason:'Bank work',status:'pending'}];
  S.blocked=[
   {who:'Brijesh',dev:'Redmi Note 12 (personal)',when:'Sat 31 Oct, 9:14 am',why:'Device not registered'},
   {who:'Satyapal',dev:'Vivo Y22 (personal)',when:'Fri 30 Oct, 8:52 am',why:'Device not registered'}];
}

/* ---------- helpers ---------- */
function toast(msg,err){var t=$('#toast');t.textContent=msg;t.className='show'+(err?' err':'');clearTimeout(toast.k);toast.k=setTimeout(function(){t.className=''},2800)}
window.__avyaToast=toast;
function chip(t,k){return '<span class="chip '+(k||'')+'">'+t+'</span>'}
function tchip(id){var t=tm(id);return '<span class="tchip" style="--tc:'+t.c+'">'+t.name+'</span>'}
function avatar(e,rec,sz,ring){
  sz=sz||38;var st='width:'+sz+'px;height:'+sz+'px;font-size:'+Math.round(sz*.38)+'px;'+(ring?'--tc:'+tm(e.team).c+';':''),cls='av'+(ring?' ring':''),src=(rec&&rec.selfie)||e.photo;
  if(src)return '<img class="'+cls+'" style="'+st+'" src="'+src+'" alt="Photo of '+esc(e.name)+'">';
  var i=e.name.split(' ').map(function(w){return w[0]}).join('').slice(0,2);
  return '<span class="'+cls+'" style="'+st+'background:hsl('+(e.id*57%360)+' 38% 36%)" aria-hidden="true">'+i+'</span>';
}
function todayRec(id){var t=todayStr();return S.records.filter(function(r){return r.emp===id&&r.date===t})[0]}
function openRec(id){return S.records.filter(function(r){return r.emp===id&&r.outMin==null})[0]}
function onLeave(id,ds){ds=ds||todayStr();return S.leaves.some(function(l){return l.emp===id&&l.status==='approved'&&l.from<=ds&&ds<=l.to})}
function stats(id,ym){
  var o={days:0,units:0,half:0,dbl:0,ap:0,pe:0};
  S.records.forEach(function(r){
    if(r.emp!==id||r.date.indexOf(ym)!==0||r.outMin==null)return;
    o.days++;o.units+=unitsOf(r);if(r.dt==='half')o.half++;if(r.dt==='double')o.dbl++;
    if(r.approved)o.ap+=r.hours;else o.pe+=r.hours;
  });
  return o;
}
function pending(){return S.records.filter(function(r){return r.outMin!=null&&!r.approved})}
function monthSwitch(key,cur){
  return '<div class="mnav" role="group" aria-label="Month"><button data-act="mshift" data-key="'+key+'" data-d="-1" aria-label="Previous month">‹</button><span>'+ml(cur)+'</span><button data-act="mshift" data-key="'+key+'" data-d="1" aria-label="Next month">›</button></div>';
}
var LOGO='data:image/png;base64,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';
function logo(w,cls){return '<img class="logo '+(cls||'')+'" src="'+LOGO+'" alt="Avya Woodcraft LLP" width="'+w+'" height="'+Math.round(w*0.97)+'">'}

/* ---------- shared chrome ---------- */
function demoBar(){
  var ff=S.role==='employee'?'<button class="btn sm" data-act="ff" title="Moves the demo clock forward">+8 hours</button>':'';
  return '<div class="demo"><div class="in gut"><span class="tag">Demo controls</span>'+
   '<label>Phone <span class="seg" role="group" aria-label="Phone"><button data-act="dev" data-v="company" class="'+(S.device==='company'?'on':'')+'">Company mobile</button><button data-act="dev" data-v="personal" class="'+(S.device==='personal'?'on':'')+'">Personal phone</button></span></label>'+
   '<label>Location <span class="seg" role="group" aria-label="Location"><button data-act="loc" data-v="in" class="'+(S.loc==='in'?'on':'')+'">At workshop</button><button data-act="loc" data-v="out" class="'+(S.loc==='out'?'on':'')+'">380 m away</button></span></label>'+ff+'</div></div>';
}
function devLine(){
  return S.device==='company'?'<span class="mono">AVYA-MOB-01</span> '+chip('Authorized','good'):'<span class="mono">Redmi Note 12</span> '+chip('Not registered','bad');
}
function loginView(){
  var admin=S.loginRole==='admin';
  var form=admin
   ? '<div class="field"><span>Admin email</span><input id="lg-email" type="email" value="admin@avyawoodcraft.in" autocomplete="username"></div><div class="field"><span>Password</span><input id="lg-pass" type="password" value="demo-password" autocomplete="current-password"></div>'
   : '<div class="field"><span>Employee</span><select id="lg-emp">'+A().map(function(e){return '<option value="'+e.id+'"'+(e.id===S.uid?' selected':'')+'>'+esc(e.name)+' · '+e.code+'</option>'}).join('')+'</select></div><div class="field"><span>PIN</span><input id="lg-pin" type="password" inputmode="numeric" maxlength="6" value="1234"></div>';
  return '<main class="login"><section class="lbrand">'+logo(84,'')+'<div><span class="cap" style="color:#E8B958">Avya Woodcraft LLP</span><h1 style="margin-top:8px">Attendance, payroll and workshop operations in one place.</h1></div><p>Built for a teak furniture workshop: every hour is verified on the shared company mobile, approved by the admin and turned into salary.</p>'+
   '<ul class="feat"><li><i>'+ic('phone',16)+'</i><span><b>Authorized company mobile only.</b><br>Personal phones are blocked and logged.</span></li><li><i>'+ic('pin',16)+'</i><span><b>Selfie and GPS on every punch.</b><br>Location must be within the workshop radius.</span></li><li><i>'+ic('team',16)+'</i><span><b>Teams, leaders and leave.</b><br>Half days, double shifts and Sunday off handled in reports.</span></li></ul></section>'+
   '<section class="lform"><div class="card"><div class="seg" role="group" aria-label="Login as" style="margin-bottom:18px;display:flex"><button style="flex:1" data-act="lrole" data-v="employee" class="'+(!admin?'on':'')+'">Employee</button><button style="flex:1" data-act="lrole" data-v="admin" class="'+(admin?'on':'')+'">Main Admin</button></div>'+
   '<h2 style="margin-bottom:14px">'+(admin?'Admin login':'Employee login')+'</h2>'+form+
   '<button class="btn primary big" data-act="login">Log in</button>'+
   '<div class="devbox"><span class="muted">This phone</span><span>'+devLine()+'</span></div>'+
   '<p class="small muted" style="margin:10px 0 0">Sample data. Credentials are filled in for the demo. Employees can log in from any phone to see hours and request leave, but can mark attendance only from the company mobile.</p></div></section></main>';
}

/* ---------- employee app ---------- */
function gate(ok,title,sub){
  return '<div class="gate '+(ok===true?'ok':ok===false?'bad':'')+'"><span class="gi">'+(ok===true?ic('check',16):ok===false?'✕':'–')+'</span><div><b>'+title+'</b><span class="small muted">'+sub+'</span></div></div>';
}
function empToday(){
  var e=emp(S.uid),open=openRec(S.uid),tr=todayRec(S.uid),d=nowD(),status,sk;
  if(open){status='Checked in at '+t12(open.inMin);sk='good'}
  else if(tr){status='Day complete';sk=''}
  else if(onLeave(S.uid)){status='On approved leave';sk='warn'}
  else if(sunOff(todayStr())){status='Sunday off';sk=''}
  else{status='Not checked in';sk='warn'}
  var dist=S.loc==='in'?42:380,locOk=dist<=150;
  var hero='<div class="hero"><div style="display:flex;gap:12px;align-items:center">'+avatar(e,null,46)+'<div><b style="font-size:1.05rem">'+esc(e.name)+'</b><div class="small" style="color:#AEB9D6">'+esc(e.role)+' · '+tm(e.team).name+'</div></div></div><span class="cap" style="margin-top:10px">'+d.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})+'</span><div class="clock" id="clock">'+d.toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit',second:'2-digit'})+'</div><div class="row">'+chip(status,sk)+'<span class="small" style="color:#AEB9D6">'+inr(e.rate)+' per hour</span></div></div>';
  var gates='<div class="card"><div class="gates">'+
    gate(S.device==='company','Device',S.device==='company'?'Authorized company mobile (AVYA-MOB-01)':'This is a personal phone. Attendance is blocked.')+
    gate(locOk,'Location',locOk?'42 m from the workshop gate. Limit is 150 m.':'380 m from the workshop gate. Move within 150 m.')+
    gate(S.selfie?true:null,'Selfie',S.selfie?'Selfie ready for this punch.':'Take a fresh selfie before each punch.')+'</div></div>';
  var selfie='<div class="card"><div class="selfie-row"><div class="selfie-prev">'+(S.selfie?'<img src="'+S.selfie+'" alt="Your selfie preview">':'No selfie yet')+'</div><div class="grow" style="min-width:160px"><b>Selfie verification</b><p class="small muted" style="margin:2px 0 10px">The admin sees this photo with your punch.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="pickSelfie">'+ic('cam',14)+' Take selfie</button><button class="btn sm ghost" data-act="sampleSelfie">Use sample selfie</button></div></div></div></div>';
  var action=open?'<button class="btn primary big" data-act="checkout">Check out</button>'
    :(tr?'<button class="btn big" disabled>Attendance done for today</button>':'<button class="btn primary big" data-act="checkin">Check in</button>');
  var recs=S.records.filter(function(r){return r.emp===S.uid}).sort(function(a,b){return b.date.localeCompare(a.date)||b.id-a.id}).slice(0,3),log='';
  if(recs.length)log='<div class="card"><h3 style="margin-bottom:4px">Recent punches</h3>'+recs.map(function(r){
    return '<div class="logrow"><div class="grow"><b>'+fd(r.date)+'</b> '+(r.outMin!=null&&r.dt!=='full'?chip(dayLabel(r),'info'):'')+'<br><span class="small muted mono">'+t12(r.inMin)+' → '+(r.outMin!=null?t12(r.outMin):'working')+'</span></div><div style="text-align:right">'+(r.outMin!=null?'<span class="mono">'+H(r.hours)+'</span><br>':'')+(r.outMin==null?chip('Open','good'):r.approved?chip('Approved','good'):chip('Awaiting approval','warn'))+'</div></div>';
  }).join('')+'<div style="margin-top:12px"><button class="btn sm" data-act="etab" data-v="history">See my full record</button></div></div>';
  return '<div class="stack">'+hero+gates+selfie+action+payCard()+log+'</div>';
}
function payCard(){
  var e=emp(S.uid),st=stats(S.uid,S.emonth);
  return '<div class="card"><div class="head-row"><h3>Pay estimate</h3>'+monthSwitch('emonth',S.emonth)+'</div><div class="pay"><div><span class="cap">Payable for '+ml(S.emonth)+'</span><div class="big num">'+inr(st.ap*e.rate)+'</div></div><div class="formula">'+H(st.ap)+' approved × '+inr(e.rate)+'</div></div>'+
   '<p class="small muted" style="margin:10px 0 0">'+num(st.units)+' day'+(st.units===1?'':'s')+' counted ('+st.half+' half, '+st.dbl+' double shift). '+(st.pe>0?H(st.pe)+' still waiting for admin approval ('+inr(st.pe*e.rate)+').':'No hours waiting for approval.')+'</p></div>';
}
function empHistory(){return '<div class="stack">'+payCard()+myRecord()+'</div>'}
function empLeave(){
  var f=S.form,mine=S.leaves.filter(function(l){return l.emp===S.uid}).sort(function(a,b){return b.from.localeCompare(a.from)}),t=todayStr();
  return '<div class="stack"><div class="card"><h3 style="margin-bottom:12px">Request leave</h3>'+
   '<div class="field"><span>Type</span><select id="lv-type" data-chg="lvf" data-k="type">'+['Casual','Sick','Unpaid'].map(function(x){return '<option'+(f.type===x?' selected':'')+'>'+x+'</option>'}).join('')+'</select></div>'+
   '<div class="two"><div class="field"><span>From</span><input id="lv-from" type="date" min="'+t+'" value="'+f.from+'" data-chg="lvf" data-k="from"></div><div class="field"><span>To</span><input id="lv-to" type="date" min="'+t+'" value="'+f.to+'" data-chg="lvf" data-k="to"></div></div>'+
   '<div class="field"><span>Reason</span><input id="lv-reason" type="text" maxlength="120" placeholder="Short reason" value="'+esc(f.reason)+'" data-chg="lvf" data-k="reason"></div>'+
   '<button class="btn primary" data-act="submitLeave">Send for approval</button></div>'+
   '<div class="card"><h3 style="margin-bottom:4px">My requests</h3>'+(mine.length?mine.map(function(l){
    var n=span(l.from,l.to);
    return '<div class="logrow"><div class="grow"><b>'+l.type+' · '+n+' day'+(n>1?'s':'')+'</b><br><span class="small muted">'+fd(l.from)+(l.to!==l.from?' to '+fd(l.to):'')+' · '+esc(l.reason)+'</span></div>'+chip(l.status==='approved'?'Approved':l.status==='rejected'?'Rejected':'Pending',l.status==='approved'?'good':l.status==='rejected'?'bad':'warn')+'</div>';
   }).join(''):'<p class="muted">No requests yet.</p>')+'</div></div>';
}
function empWork(){
  var t=todayStr(),tr=todayRec(S.uid),mine=S.work.filter(function(w){return w.emp===S.uid}),
      ents=mine.filter(function(w){return w.date===t}),tot=ents.reduce(function(a,w){return a+w.hours},0);
  var form='<div class="card"><h3 style="margin-bottom:4px">What did you work on?</h3><p class="small muted" style="margin:0 0 12px">Add each job you did today. You can add several entries.</p>'+
   '<div class="field"><span>Kind of work</span><select id="wl-task">'+TASKS.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><span>Item or order</span><input id="wl-item" type="text" maxlength="80" list="wl-items" placeholder="Example: Teak dining table (Order #214)"><datalist id="wl-items">'+orderLabels().map(function(x){return '<option value="'+esc(x)+'">'}).join('')+'</datalist></div>'+
   '<div class="two"><div class="field"><span>Hours spent</span><input id="wl-hours" type="number" min="0.25" max="12" step="0.25" value="1"></div><div class="field"><span>Note (optional)</span><input id="wl-note" type="text" maxlength="100" placeholder="Short note"></div></div>'+
   '<button class="btn primary" data-act="addWork">Add to today’s log</button>'+(tr?'':'<p class="small muted" style="margin:10px 0 0">Check in first. You can add work only on days you are present.</p>')+'</div>';
  var today='<div class="card"><div class="head-row"><h3>Today’s work</h3><span class="chip '+(tot>0?'good':'')+'">'+H(tot)+' logged</span></div>'+(ents.length?ents.map(function(w){
    return '<div class="logrow"><div class="grow"><b>'+w.task+'</b><br><span class="small muted">'+esc(w.item)+(w.note?' · '+esc(w.note):'')+'</span></div><span class="mono">'+H(w.hours)+'</span><button class="btn sm no" data-act="delWork" data-id="'+w.id+'" aria-label="Remove entry">Remove</button></div>';
  }).join(''):'<p class="muted" style="margin:0">Nothing logged yet.</p>')+'</div>';
  var days=S.records.filter(function(r){return r.emp===S.uid}).map(function(r){return r.date}).concat(mine.map(function(w){return w.date})).filter(function(d,i,a){return d<t&&a.indexOf(d)===i}).sort().reverse().slice(0,10);
  var recent='<div class="card"><h3 style="margin-bottom:4px">Previous days</h3><span class="small muted">Last 10 days: when I came and what I worked on.</span>'+(days.length?days.map(myDay).join(''):'<p class="muted" style="margin:10px 0 0">No earlier entries.</p>')+'<div style="margin-top:12px"><button class="btn sm" data-act="etab" data-v="history">See full record</button></div></div>';
  return '<div class="stack">'+form+today+recent+'</div>';
}
function employeeView(){
  var e=emp(S.uid),tabs=[['today','Today','clock'],['work','Work','work'],['material','Material','box'],['history','My record','file'],['leave','Leave','sun']];
  var body=S.etab==='today'?empToday():S.etab==='work'?empWork():S.etab==='material'?empMaterial():S.etab==='history'?empHistory():empLeave();
  return '<header class="ehead"><div class="in gut" style="max-width:640px;margin:0 auto">'+logo(34,'')+'<div class="grow"><b>Avya Woodcraft LLP</b><small>'+esc(e.name)+' · '+e.code+'</small></div><button class="btn sm" data-act="logout">'+ic('out',14)+' Log out</button></div></header>'+
   '<main class="emp gut">'+body+'</main><nav class="bnav" aria-label="Sections"><div class="in">'+tabs.map(function(t){return '<button class="bn'+(S.etab===t[0]?' on':'')+'" data-act="etab" data-v="'+t[0]+'">'+ic(t[2],20)+t[1]+'</button>'}).join('')+'</div></nav>';
}

/* ---------- admin ---------- */
function todayStatus(e){
  var r=todayRec(e.id);
  if(onLeave(e.id))return {chip:chip('On leave','warn'),r:r,k:'leave'};
  if(r&&r.outMin==null)return {chip:chip(r.inMin>555?'Working · late':'Working','good'),r:r,k:'in'};
  if(r)return {chip:chip('Done','good'),r:r,k:'in'};
  if(sunOff(todayStr()))return {chip:chip('Sunday off',''),r:null,k:'off'};
  return {chip:chip('Not in yet',''),r:null,k:'out'};
}
function tile(icn,label,val,tc,extra){return '<div class="tile" style="--tc:'+tc+'"><span class="ti">'+ic(icn,19)+'</span><span class="cap">'+label+'</span><b class="num">'+val+'</b>'+(extra||'')+'</div>'}
function adminOverview(){
  var present=0,leave=0,notin=0,list=A();
  list.forEach(function(e){var s=todayStatus(e);if(s.k==='leave')leave++;else if(s.r)present++;else notin++});
  var pc=pending().length,t=Math.round(list.reduce(function(a,e){return a+stats(e.id,S.month).ap*e.rate},0));
  var tiles='<div class="tiles">'+tile('users','Present now',present+'<small> / '+list.length+'</small>','var(--good)')+tile('sun','On leave',leave,'var(--warn)')+tile('clock','Not in yet',notin,'var(--muted)')+tile('check','Hours to approve',pc,'var(--primary)')+'</div>';
  var rows=list.map(function(e){
    var s=todayStatus(e);
    return '<div class="logrow">'+avatar(e,s.r,40,1)+'<div class="grow"><b>'+esc(e.name)+(e.lead?' <span class="lead">LEAD</span>':'')+'</b><br><span class="small muted">'+esc(e.role)+(s.r?' · in '+t12(s.r.inMin)+' · '+s.r.dist+' m':'')+'</span></div>'+s.chip+'</div>';
  }).join('');
  var tp=TEAMS.map(function(T){
    var m=list.filter(function(e){return e.team===T.id});if(!m.length)return '';
    var p=m.filter(function(e){return !!todayRec(e.id)}).length;
    return '<div style="--tc:'+T.c+';margin-bottom:12px"><div class="head-row" style="margin:0 0 4px"><span class="tchip">'+T.name+'</span><span class="mono small">'+p+'/'+m.length+'</span></div><div class="track"><div class="bar" style="width:'+Math.round(p/m.length*100)+'%"></div></div></div>';
  }).join('');
  var side='<div class="stack"><div class="card"><span class="cap">Approved payroll · '+ml(S.month)+'</span><div class="pay" style="margin-top:6px"><div class="big num">'+inr(t)+'</div><button class="btn sm" data-act="tab" data-v="salary">Open report</button></div></div>'+
   '<div class="card"><h3 style="margin-bottom:12px">Team presence today</h3>'+tp+'</div>'+
   '<div class="card"><span class="cap">Device security</span><p style="margin:6px 0 10px"><b class="num">'+S.blocked.length+'</b> blocked attempts from unregistered phones.</p><button class="btn sm" data-act="tab" data-v="devices">Review devices</button></div>'+bizCards()+'</div>';
  return '<div class="stack">'+tiles+'<div class="cols"><div class="card"><h3 style="margin-bottom:4px">Today at the workshop</h3>'+rows+'</div>'+side+'</div></div>';
}
function adminAttendance(){
  var p=pending().sort(function(a,b){return b.date.localeCompare(a.date)||a.emp-b.emp});
  var rows=p.length?p.map(function(r){
    var e=emp(r.emp);
    return '<div class="pend">'+avatar(e,r,40,1)+'<div class="grow"><b>'+esc(e.name)+'</b><br><span class="small muted">'+fd(r.date)+' · <span class="mono">'+t12(r.inMin)+' → '+t12(r.outMin)+'</span> · '+r.dist+' m<br>Work logged: <b class="mono">'+H(workHrs(r.emp,r.date))+'</b></span></div>'+
     '<label class="small muted" style="display:flex;align-items:center;gap:6px">Day <select data-chg="dt" data-id="'+r.id+'" aria-label="Day type for '+esc(e.name)+'">'+Object.keys(DT).map(function(k){return '<option value="'+k+'"'+((r.dt||'full')===k?' selected':'')+'>'+DT[k].l+'</option>'}).join('')+'</select></label>'+
     '<label class="small muted" style="display:flex;align-items:center;gap:6px">Hours <input type="number" min="0" max="16" step="0.25" value="'+r.hours+'" data-chg="hrs" data-id="'+r.id+'" aria-label="Approved hours for '+esc(e.name)+'"></label>'+
     '<button class="btn sm ok" data-act="approve" data-id="'+r.id+'">Approve</button></div>';
  }).join(''):'<p class="muted" style="margin:6px 0 0">Everything is approved.</p>';
  return '<div class="card"><div class="head-row"><div><h3>Waiting for approval</h3><span class="small muted">Set the day type (full, half, double shift) and hours, then approve. Only approved hours count towards salary.</span></div>'+(p.length?'<button class="btn primary sm" data-act="approveAll">Approve all ('+p.length+')</button>':'')+'</div>'+rows+'</div>';
}
function adminEmployees(){
  var q=S.q.trim().toLowerCase(),act=A().filter(function(e){return (S.tf==='all'||e.team===S.tf)&&(!q||(e.name+' '+e.role+' '+e.code).toLowerCase().indexOf(q)>=0)});
  var gone=S.emps.filter(function(e){return !e.active});
  var tf='<select data-chg="tf" aria-label="Filter by team"><option value="all">All teams</option>'+TEAMS.map(function(t){return '<option value="'+t.id+'"'+(S.tf===t.id?' selected':'')+'>'+t.name+'</option>'}).join('')+'</select>';
  var tools='<div class="toolbar"><div class="search">'+ic('search',16)+'<input id="emp-q" type="search" placeholder="Search name, role or code" value="'+esc(S.q)+'" data-inp="q"></div>'+tf+'<span class="grow"></span><button class="btn primary" data-act="toggleAdd">'+ic('plus',16)+' Add employee</button></div>';
  var add=S.addOpen?'<div class="card"><h3 style="margin-bottom:12px">Add employee</h3><div class="rowform"><div class="field"><span>Full name</span><input id="ne-name" type="text" maxlength="60"></div><div class="field"><span>Role</span><input id="ne-role" type="text" maxlength="40" placeholder="Example: Carpenter"></div><div class="field"><span>Team</span><select id="ne-team">'+TEAMS.map(function(t){return '<option value="'+t.id+'">'+t.name+'</option>'}).join('')+'</select></div><div class="field"><span>Hourly rate ₹</span><input id="ne-rate" type="number" min="0" step="5"></div><div class="field"><span>Login PIN</span><input id="ne-pin" type="password" inputmode="numeric" maxlength="6" value="1234"></div><button class="btn primary" data-act="addEmp">Save employee</button></div><p class="small muted" style="margin:10px 0 0">A code is created automatically. Add a photo from the list after saving.</p></div>':'';
  var rows=act.map(function(e){
    var del=S.confirmDel===e.id?'<span class="inl"><span class="small">Remove?</span><button class="btn sm no" data-act="doDel" data-id="'+e.id+'">Yes, remove</button><button class="btn sm" data-act="cancelDel">Cancel</button></span>':'<div class="inl"><button class="btn sm" data-act="openEmp" data-id="'+e.id+'">'+ic('file',13)+' File</button><button class="btn sm" data-act="pickPhoto" data-id="'+e.id+'">'+ic('cam',13)+' Photo</button><button class="btn sm no" data-act="askDel" data-id="'+e.id+'">'+ic('trash',13)+' Remove</button></div>';
    return '<tr><td><div style="display:flex;gap:10px;align-items:center">'+avatar(e,null,38,1)+'<div><input class="nm" type="text" maxlength="60" value="'+esc(e.name)+'" data-chg="ename" data-id="'+e.id+'" aria-label="Name">'+(e.lead?' <span class="lead">LEAD</span>':'')+'<br><span class="small muted mono">'+e.code+'</span></div></div></td><td><input type="text" maxlength="40" value="'+esc(e.role)+'" data-chg="erole" data-id="'+e.id+'" aria-label="Role"></td><td><select data-chg="team" data-id="'+e.id+'" aria-label="Team for '+esc(e.name)+'">'+TEAMS.map(function(t){return '<option value="'+t.id+'"'+(e.team===t.id?' selected':'')+'>'+t.name+'</option>'}).join('')+'</select></td><td class="r"><input class="sm" type="number" min="0" step="5" value="'+e.rate+'" data-chg="rate" data-id="'+e.id+'" aria-label="Hourly rate for '+esc(e.name)+'"></td><td class="r">'+del+'</td></tr>';
  }).join('')||'<tr><td colspan="5" class="muted">No employee matches.</td></tr>';
  var table='<div class="card"><div class="head-row"><h3>Employees <span class="muted">('+act.length+')</span></h3></div><div class="scroll"><table><thead><tr><th>Employee</th><th>Role</th><th>Team</th><th class="r">Rate ₹/hour</th><th class="r">Actions</th></tr></thead><tbody>'+rows+'</tbody></table></div><p class="small muted" style="margin:12px 0 0">Removed employees cannot log in. Their past attendance and salary records are kept.</p></div>';
  var rem=gone.length?'<div class="card"><h3 style="margin-bottom:4px">Removed employees</h3>'+gone.map(function(e){return '<div class="logrow">'+avatar(e,null,34)+'<div class="grow"><b>'+esc(e.name)+'</b><br><span class="small muted">'+esc(e.role)+'</span></div><button class="btn sm" data-act="restore" data-id="'+e.id+'">'+ic('undo',13)+' Restore</button></div>'}).join('')+'</div>':'';
  return '<div class="stack">'+tools+add+table+rem+'</div>';
}
function adminTeams(){
  var list=A(),mgrs=list.filter(function(e){return e.mgr});
  var ceo='<div class="pp ceo">'+avatar(CEO,null,48)+'<div><b>'+CEO.name+'</b><small>Chief Executive Officer</small></div></div>';
  var mrow=mgrs.map(function(e){return '<div class="pp" style="--tc:'+tm(e.team).c+'">'+avatar(e,null,44,1)+'<div><b>'+esc(e.name)+'</b><small>'+esc(e.role)+'</small></div></div>'}).join('');
  var leadT=TEAMS.filter(function(t){var l=list.filter(function(e){return e.team===t.id&&e.lead})[0];return list.some(function(e){return e.team===t.id})&&!(l&&l.mgr)});
  var lrow=leadT.map(function(t){var l=list.filter(function(e){return e.team===t.id&&e.lead})[0];
    return l?'<div class="pp" style="--tc:'+t.c+'">'+avatar(l,null,44,1)+'<div><b>'+esc(l.name)+'</b><small>Team Leader · '+t.name+'</small></div></div>':'<div class="pp empty"><div><b>No leader yet</b><small>'+t.name+'</small></div></div>'}).join('');
  var org='<div class="card"><div class="org"><div class="tlabel">Leadership</div>'+ceo+'<div class="tlink"></div><div class="tlabel">Managers</div><div class="tier">'+mrow+'</div><div class="tlink"></div><div class="tlabel">Team leaders</div><div class="tier">'+lrow+'</div></div></div>';
  var cards=TEAMS.map(function(t){
    var m=list.filter(function(e){return e.team===t.id}).sort(function(a,b){return (b.lead?1:0)-(a.lead?1:0)||a.id-b.id});if(!m.length)return '';
    var ld=m.filter(function(e){return e.lead})[0],pr=m.filter(function(e){return !!todayRec(e.id)}).length;
    return '<div class="tcard" style="--tc:'+t.c+'"><div class="th"><div><h3>'+t.name+'</h3><span class="small muted">'+m.length+' member'+(m.length>1?'s':'')+' · Leader: '+(ld?esc(ld.name):'not assigned')+'</span></div>'+chip(pr+' in today','good')+'</div><div class="tb">'+m.map(function(e){
      var s=todayStatus(e);
      return '<div class="mrow">'+avatar(e,s.r,36,1)+'<div class="grow"><b>'+esc(e.name)+(e.lead?' <span class="lead">LEAD</span>':'')+'</b><small>'+esc(e.role)+'</small></div>'+(e.lead?'':'<button class="btn sm ghost" data-act="mkLead" data-id="'+e.id+'">Make leader</button>')+s.chip+'</div>';
    }).join('')+'</div></div>';
  }).join('');
  return '<div class="stack">'+org+'<div class="teams">'+cards+'</div></div>';
}
function adminDevices(){
  var pair=S.pairing?'<div style="margin-top:12px"><span class="code">'+S.pairing+'</span><p class="small muted" style="margin:8px 0 0">One-time code. Expires in 10 minutes. Enter it on the new company mobile to replace the current one.</p></div>':'';
  return '<div class="cols"><div class="stack"><div class="card"><div class="head-row"><h3>Authorized company mobile</h3>'+chip('Authorized','good')+'</div>'+
   '<div style="display:grid;gap:6px;font-size:.9rem"><div><span class="muted">Device ID</span> <b class="mono">AVYA-MOB-01</b></div><div><span class="muted">Model</span> Samsung Galaxy A15</div><div><span class="muted">Paired on</span> 12 Oct 2026</div><div><span class="muted">Last seen</span> Today</div></div>'+
   '<div style="margin-top:14px"><button class="btn sm" data-act="pair">Generate pairing code</button></div>'+pair+'</div>'+
   '<div class="card"><h3 style="margin-bottom:8px">How blocking works</h3><ul class="small muted" style="margin:0;padding-left:18px;display:grid;gap:6px"><li>Only one device is authorized at a time.</li><li>The server checks a signed device token on every check-in and check-out.</li><li>A punch from any other phone is rejected and logged here.</li><li>Replacing the phone needs a code created by the Main Admin.</li></ul></div></div>'+
   '<div class="card"><h3 style="margin-bottom:4px">Blocked attempts</h3>'+S.blocked.map(function(b){
    return '<div class="logrow"><div class="grow"><b>'+esc(b.who)+'</b><br><span class="small muted">'+b.dev+' · '+b.when+'</span></div>'+chip(b.why,'bad')+'</div>';
   }).join('')+'</div></div>';
}
function adminLeave(){
  var ps=S.leaves.filter(function(l){return l.status==='pending'}),ds=S.leaves.filter(function(l){return l.status!=='pending'});
  function row(l,act){
    var e=emp(l.emp),n=span(l.from,l.to);
    return '<div class="pend">'+avatar(e,null,40,1)+'<div class="grow"><b>'+esc(e.name)+'</b><br><span class="small muted">'+l.type+' · '+n+' day'+(n>1?'s':'')+' · '+fd(l.from)+(l.to!==l.from?' to '+fd(l.to):'')+'<br>'+esc(l.reason)+'</span></div>'+
     (act?'<button class="btn sm ok" data-act="leaveOk" data-id="'+l.id+'">Approve</button><button class="btn sm no" data-act="leaveNo" data-id="'+l.id+'">Reject</button>':chip(l.status==='approved'?'Approved':'Rejected',l.status==='approved'?'good':'bad'))+(act?'':'<button class="btn sm ghost no" data-act="leaveDel" data-id="'+l.id+'" aria-label="Delete request">'+ic('trash',13)+'</button>')+'</div>';
  }
  return '<div class="cols even"><div class="card"><h3 style="margin-bottom:4px">Pending requests</h3>'+(ps.length?ps.map(function(l){return row(l,1)}).join(''):'<p class="muted">No pending requests.</p>')+'</div><div class="card"><h3 style="margin-bottom:4px">Decided</h3>'+(ds.length?ds.map(function(l){return row(l,0)}).join(''):'<p class="muted">Nothing decided yet.</p>')+'</div></div>';
}
function repEmps(ym){return S.emps.filter(function(e){return e.active||S.records.some(function(r){return r.emp===e.id&&r.date.indexOf(ym)===0})})}
function adminSalary(){
  var rows=repEmps(S.month).map(function(e){var s=stats(e.id,S.month);return {e:e,s:s,pay:s.ap*e.rate}});
  var max=Math.max.apply(null,rows.map(function(r){return r.pay}).concat([1])),tp=0,ta=0,tpe=0,tu=0;
  var body=rows.map(function(r){tp+=r.pay;ta+=r.s.ap;tpe+=r.s.pe;tu+=r.s.units;
    return '<tr><td><div style="display:flex;gap:10px;align-items:center">'+avatar(r.e,null,34,1)+'<div><b>'+esc(r.e.name)+'</b><br><span class="small muted">'+esc(r.e.role)+(r.e.active?'':' · removed')+'</span></div></div></td><td class="r mono">'+num(r.s.units)+'</td><td class="r mono">'+r.s.half+'</td><td class="r mono">'+r.s.dbl+'</td><td class="r mono">'+r.s.ap.toFixed(2)+'</td><td class="r mono">'+(r.s.pe?'<span style="color:var(--warn)">'+r.s.pe.toFixed(2)+'</span>':'0.00')+'</td><td class="r mono">'+r.e.rate+'</td><td class="r" style="min-width:130px"><b class="mono">'+inr(r.pay)+'</b><div class="bar" style="width:'+Math.round(r.pay/max*100)+'%"></div></td></tr>';
  }).join('');
  return '<div class="card"><div class="head-row"><div><h3>Monthly salary report</h3><span class="small muted">Payable = approved hours × hourly rate</span></div>'+monthSwitch('month',S.month)+'</div><div class="scroll"><table><thead><tr><th>Employee</th><th class="r">Days</th><th class="r">Half</th><th class="r">Double</th><th class="r">Approved h</th><th class="r">Pending h</th><th class="r">Rate</th><th class="r">Payable</th></tr></thead><tbody>'+body+'</tbody><tfoot><tr><td>Total</td><td class="r mono">'+num(tu)+'</td><td></td><td></td><td class="r mono">'+ta.toFixed(2)+'</td><td class="r mono">'+tpe.toFixed(2)+'</td><td></td><td class="r mono">'+inr(tp)+'</td></tr></tfoot></table></div>'+
   '<p class="small muted" style="margin:12px 0 0">Days counts a full day as 1, a half day as 0.5 and a double shift as 2.'+(tpe>0?' '+tpe.toFixed(2)+' hours are still unapproved and not included in the payable amount.':'')+'</p></div>';
}
function adminReport(){
  var ym=S.month,y=+ym.slice(0,4),m=+ym.slice(5,7),dim=new Date(y,m,0).getDate(),t=todayStr(),d,WD=['S','M','T','W','T','F','S'];
  var th='<th>Employee</th>';
  for(d=1;d<=dim;d++){
    var ds=ym+'-'+pad(d),dow=new Date(y,m-1,d).getDay();
    if(dow===0)th+='<th class="sun">'+d+'<small>'+WD[dow]+'</small><button data-act="sunTog" data-d="'+ds+'" aria-label="Toggle Sunday off for '+ds+'">'+(sunOff(ds)?'OFF':'WORK')+'</button></th>';
    else th+='<th>'+d+'<small>'+WD[dow]+'</small></th>';
  }
  th+='<th>P</th><th>H</th><th>D</th><th>L</th><th>A</th><th>Days</th>';
  var rows=repEmps(ym).map(function(e){
    var p=0,h=0,dd=0,l=0,a=0,tds='<td>'+esc(e.name)+'</td>';
    for(d=1;d<=dim;d++){
      var ds2=ym+'-'+pad(d),rec=S.records.filter(function(r){return r.emp===e.id&&r.date===ds2&&r.outMin!=null})[0],c='',ch='';
      if(rec){var k=DT[rec.dt||'full'].k;c=ch=k;if(k==='P')p++;else if(k==='H')h++;else dd++}
      else if(onLeave(e.id,ds2)){c=ch='L';l++}
      else if(sunOff(ds2)){c=ch='S'}
      else if(ds2>=t){c='';ch=''}
      else{c=ch='A';a++}
      tds+='<td class="'+c+'">'+ch+'</td>';
    }
    return '<tr>'+tds+'<td class="tot">'+p+'</td><td class="tot">'+h+'</td><td class="tot">'+dd+'</td><td class="tot">'+l+'</td><td class="tot">'+a+'</td><td class="tot">'+num(p+h*.5+dd*2)+'</td></tr>';
  }).join('');
  var wk=[1,2,3,4,5].map(function(n){return '<button data-act="sunWk" data-v="'+n+'" class="'+(S.sunWeeks.indexOf(n)>=0?'on':'')+'">'+n+['st','nd','rd','th','th'][n-1]+'</button>'}).join('');
  var pol='<div class="head-row" style="margin-bottom:14px"><div><b>Sunday off policy</b><div class="small muted">Sundays marked off are not counted absent. Click a Sunday in the table to change a single date.</div></div><div class="seg" role="group" aria-label="Sundays off">'+wk+'</div></div>';
  return '<div class="card"><div class="head-row"><div><h3>Monthly attendance report</h3><span class="small muted">'+ml(ym)+' · Avya Woodcraft LLP</span></div>'+monthSwitch('month',ym)+'</div>'+pol+'<div class="scroll"><table class="mx"><thead><tr>'+th+'</tr></thead><tbody>'+rows+'</tbody></table></div>'+
   '<div class="legend"><span><b class="P">P</b>Full day</span><span><b class="H">H</b>Half day (0.5)</span><span><b class="D">D</b>Double shift (2)</span><span><b class="L">L</b>Approved leave</span><span><b class="A">A</b>Absent</span><span><b class="S">S</b>Sunday off</span></div></div>';
}
function workHrs(id,d){return S.work.filter(function(w){return w.emp===id&&w.date===d}).reduce(function(a,w){return a+w.hours},0)}
function adminWork(){
  var dates=S.work.map(function(w){return w.date}).concat([todayStr()]);
  dates=dates.filter(function(x,i){return dates.indexOf(x)===i}).sort().reverse();
  var d=S.wdate&&dates.indexOf(S.wdate)>=0?S.wdate:dates[0];
  var all=S.work.filter(function(w){return w.date===d}),tot=all.reduce(function(a,w){return a+w.hours},0),by={};
  all.forEach(function(w){by[w.task]=(by[w.task]||0)+w.hours});
  var keys=Object.keys(by).sort(function(a,b){return by[b]-by[a]}),mx=Math.max.apply(null,keys.map(function(k){return by[k]}).concat([1]));
  var logged=0,missing=0;
  A().forEach(function(e){var has=S.records.some(function(r){return r.emp===e.id&&r.date===d});if(workHrs(e.id,d)>0)logged++;else if(has)missing++});
  var filters='<div class="two" style="max-width:520px"><div class="field" style="margin:0"><span>Date</span><select id="wf-date" data-chg="wsel" data-k="wdate">'+dates.map(function(x){return '<option value="'+x+'"'+(x===d?' selected':'')+'>'+fd(x)+(x===todayStr()?' (today)':'')+'</option>'}).join('')+'</select></div>'+
   '<div class="field" style="margin:0"><span>Employee</span><select id="wf-emp" data-chg="wsel" data-k="wemp"><option value="all">All employees</option>'+A().map(function(e){return '<option value="'+e.id+'"'+(String(e.id)===String(S.wemp)?' selected':'')+'>'+esc(e.name)+'</option>'}).join('')+'</select></div></div>';
  var tiles='<div class="tiles">'+tile('clock','Hours logged',tot.toFixed(2),'var(--primary)')+tile('users','Employees logged',logged,'var(--good)')+tile('clip','Present, no log',missing,'var(--warn)')+'</div>';
  var cards=A().filter(function(e){return S.wemp==='all'||String(e.id)===String(S.wemp)}).map(function(e){
    var rec=S.records.filter(function(r){return r.emp===e.id&&r.date===d})[0],es=all.filter(function(w){return w.emp===e.id}),w=workHrs(e.id,d),c;
    if(!es.length&&!rec)return '';
    if(!es.length)c=chip('No work logged','warn');
    else if(rec&&rec.outMin!=null&&Math.abs(w-rec.hours)>1)c=chip('Logged '+H(w)+' of '+H(rec.hours),'warn');
    else c=chip(H(w)+' logged','good');
    return '<div class="card"><div class="logrow" style="padding-top:0">'+avatar(e,rec,40,1)+'<div class="grow"><b>'+esc(e.name)+'</b><br><span class="small muted">'+esc(e.role)+(rec?' · in '+t12(rec.inMin)+(rec.outMin!=null?', out '+t12(rec.outMin):''):'')+'</span></div>'+c+'</div>'+
     (es.length?es.map(function(x){return '<div class="logrow"><div class="grow"><b>'+x.task+'</b><br><span class="small muted">'+esc(x.item)+(x.note?' · '+esc(x.note):'')+'</span></div><input class="sm" type="number" min="0.25" max="12" step="0.25" value="'+x.hours+'" data-chg="wh" data-id="'+x.id+'" aria-label="Hours"><button class="btn sm ghost no" data-act="admDelWork" data-id="'+x.id+'" aria-label="Delete entry">'+ic('trash',13)+'</button></div>'}).join(''):'<p class="small muted" style="margin:8px 0 0">This employee was present but did not add any work.</p>')+'</div>';
  }).join('');
  var side='<div class="card"><h3 style="margin-bottom:12px">Hours by kind of work</h3>'+(keys.length?'<div style="display:grid;gap:12px">'+keys.map(function(k){return '<div><div class="head-row" style="margin:0"><span>'+k+'</span><span class="mono">'+by[k].toFixed(2)+'</span></div><div class="bar" style="width:'+Math.round(by[k]/mx*100)+'%"></div></div>'}).join('')+'</div>':'<p class="muted" style="margin:0">No work logged on this day.</p>')+'</div>';
  return '<div class="stack">'+filters+tiles+'<div class="cols"><div class="stack">'+(cards||'<div class="card"><p class="muted" style="margin:0">Nothing to show for this day.</p></div>')+'</div>'+side+'</div></div>';
}
var NAV=[['Workspace',[['overview','Overview','home'],['attendance','Approvals','check'],['work','Work log','clip']]],
 ['People',[['employees','Employees','users'],['teams','Teams','team'],['leave','Leave','sun']]],
 ['Business',[['costing','Costing','tag'],['petty','Petty cash','wallet'],['inventory','Inventory','box']]],
 ['Reports',[['salary','Salary','rupee'],['report','Monthly report','cal']]],
 ['Security',[['devices','Devices','shield']]]];
var TITLES={overview:['Overview','Live view of the workshop today'],attendance:['Approvals','Approve hours and set the day type'],work:['Daily work log','What every employee worked on'],employees:['Employees','Add, remove and manage staff, teams and rates'],teams:['Teams','Who works in which team and who leads it'],leave:['Leave','Review leave requests'],costing:['Product costing','Material, labour and other cost of each product'],petty:['Petty cash','Balance and daily spending'],inventory:['Inventory','Stock, requests and the order list'],salary:['Salary report','Approved hours × hourly rate'],report:['Monthly report','Attendance with half day, double shift and Sunday off'],devices:['Devices','Authorized company mobile and blocked phones']};
function adminView(){
  var cnt={attendance:pending().length,leave:S.leaves.filter(function(l){return l.status==='pending'}).length,inventory:reqPending()};
  var nav=NAV.map(function(g){return '<div class="sgroup">'+g[0]+'</div>'+g[1].map(function(n){return '<button class="nv'+(S.tab===n[0]?' on':'')+'" data-act="tab" data-v="'+n[0]+'">'+ic(n[2],18)+n[1]+(cnt[n[0]]?'<em>'+cnt[n[0]]+'</em>':'')+'</button>'}).join('')}).join('');
  var body={overview:adminOverview,attendance:adminAttendance,employees:adminEmployees,teams:adminTeams,leave:adminLeave,salary:adminSalary,report:adminReport,work:adminWork,costing:adminCosting,petty:adminPetty,inventory:adminInventory,devices:adminDevices,production:adminProduction,advances:adminAdvances,profile:adminProfile,data:adminData}[S.tab]();
  var T=TITLES[S.tab];
  return '<div class="shell"><aside class="side"><div class="sbrand">'+logo(38,'')+'<div><b>Avya Woodcraft LLP</b><small>Operations console</small></div></div><nav class="snav" aria-label="Admin sections">'+nav+'</nav><div class="suser">'+avatar(CEO,null,34)+'<div><b>Main Admin</b><small>admin@avyawoodcraft.in</small></div></div><button class="nv" data-act="logout" style="margin-top:8px">'+ic('out',18)+'Log out</button></aside>'+
   '<main class="main gut"><div class="top"><div class="tl"><div><h1>'+T[0]+'</h1><p class="muted small">'+T[1]+'</p></div></div><div class="tr"><div class="uchip">'+avatar(CEO,null,28)+'Main Admin</div><button class="btn sm" data-act="logout">'+ic('out',14)+' Log out</button></div></div>'+body+
   '<p class="note">Demo with sample data. In the full app, every punch, approval and leave decision is saved in the database and checked on the server.</p></main></div>';
}

/* ===== product costing, petty cash, inventory ===== */
var INV_CATS=['Wood','Polish & paint','Hardware','Fabric & foam','Consumables','Packing','Tools'];
var PC_CATS=['Tea & food','Transport','Fuel','Hardware & tools','Repair & maintenance','Stationery','Courier','Labour advance','Other'];
var UNITS=['pcs','cft','sheet','litre','kg','metre','box','roll','set'];

function seedBiz(){
  var T=todayStr();
  var raw=[['Teak wood planks','Wood','cft',180,100,4200],['Teak veneer sheet','Wood','sheet',24,10,1800],['PU polish (clear gloss)','Polish & paint','litre',8,15,640],['Melamine polish','Polish & paint','litre',22,10,520],['Wood stain (teak shade)','Polish & paint','litre',5,6,480],['Sandpaper 120 grit','Consumables','sheet',90,50,14],['Wood glue','Consumables','kg',12,8,210],['Screws 2 inch','Hardware','box',14,10,160],['Hinges','Hardware','pcs',60,40,35],['Chair cushion foam','Fabric & foam','pcs',6,12,380],['Upholstery fabric','Fabric & foam','metre',0,20,320],['Bubble wrap','Packing','roll',4,3,900]];
  S.inv=raw.map(function(r,i){return {id:i+1,name:r[0],cat:r[1],unit:r[2],qty:r[3],min:r[4],rate:r[5]}});
  S.nextInv=raw.length+1;
  S.reqs=[{id:1,emp:12,item:'PU polish (clear gloss)',qty:10,unit:'litre',urg:'Urgent',note:'Polish is almost finished. Need it before Thursday.',status:'pending',date:T},
    {id:2,emp:1,item:'Sandpaper 120 grit',qty:50,unit:'sheet',urg:'Normal',note:'',status:'approved',date:addDays(T,-1)},
    {id:3,emp:5,item:'Planer blade',qty:2,unit:'pcs',urg:'Urgent',note:'Machine blade is worn out.',status:'ordered',date:addDays(T,-2)}];
  S.nextReq=4;S.nextLine=1;S.nextProd=1;S.nextPc=1;
  function L(kind,name,qty,unit,rate){return {id:S.nextLine++,kind:kind,name:name,qty:qty,unit:unit,rate:rate}}
  function prod(name,price,lines){return {id:S.nextProd++,name:name,price:price,lines:lines}}
  S.products=[
   prod('Teak dining table, 6 seater',98000,[L('material','Teak wood planks',12,'cft',4200),L('material','Teak veneer sheet',1,'sheet',1800),L('material','Wood glue',1,'kg',210),L('material','Screws 2 inch',1,'box',160),L('material','PU polish (clear gloss)',2,'litre',640),L('material','Wood stain (teak shade)',0.5,'litre',480),L('material','Sandpaper 120 grit',10,'sheet',14),
     L('labour','Cutting and planing',6,'h',130),L('labour','Joinery',22,'h',120),L('labour','Carving',8,'h',120),L('labour','Sanding',10,'h',85),L('labour','Polishing',12,'h',110),L('labour','Assembly',6,'h',100),
     L('overhead','Packing',1,'lot',600),L('overhead','Transport and loading',1,'lot',800),L('overhead','Power and machine wear',1,'lot',1200),L('overhead','Workshop rent share',1,'lot',2000)]),
   prod('Teak dining chair',14500,[L('material','Teak wood planks',1.6,'cft',4200),L('material','Chair cushion foam',1,'pcs',380),L('material','Upholstery fabric',1.2,'metre',320),L('material','Wood glue',0.15,'kg',210),L('material','Screws 2 inch',0.1,'box',160),L('material','PU polish (clear gloss)',0.3,'litre',640),L('material','Sandpaper 120 grit',4,'sheet',14),
     L('labour','Cutting and planing',0.8,'h',130),L('labour','Joinery',3,'h',120),L('labour','Sanding',1.2,'h',85),L('labour','Polishing',1.5,'h',110),L('labour','Upholstery',1,'h',95),
     L('overhead','Packing',1,'lot',80),L('overhead','Transport and loading',1,'lot',100),L('overhead','Power and rent share',1,'lot',250)]),
   prod('Teak bed frame, queen',135000,[L('material','Teak wood planks',16,'cft',4200),L('material','Teak veneer sheet',2,'sheet',1800),L('material','Wood glue',1.5,'kg',210),L('material','Screws 2 inch',2,'box',160),L('material','PU polish (clear gloss)',3,'litre',640),L('material','Wood stain (teak shade)',1,'litre',480),L('material','Sandpaper 120 grit',15,'sheet',14),
     L('labour','Cutting and planing',8,'h',130),L('labour','Joinery',28,'h',120),L('labour','Carving',14,'h',120),L('labour','Sanding',12,'h',85),L('labour','Polishing',14,'h',110),L('labour','Assembly',8,'h',100),
     L('overhead','Packing',1,'lot',900),L('overhead','Transport and loading',1,'lot',1200),L('overhead','Power and machine wear',1,'lot',1500),L('overhead','Workshop rent share',1,'lot',2500)])
  ];
  S.pid=1;S.cqty=1;
  var e=function(d,type,cat,desc,amt,to){return {id:S.nextPc++,date:addDays(T,d),type:type,cat:cat,desc:desc,amt:amt,to:to||''}};
  S.petty={opening:25000,openDate:addDays(T,-3),low:10000,entries:[
    e(-3,'in','Cash added','Cash from owner',20000,'Owner'),e(-3,'out','Tea & food','Tea and snacks',180,'Canteen'),e(-3,'out','Fuel','Diesel for tempo',650,'Fuel pump'),
    e(-2,'out','Transport','Tempo hire for teak delivery',1200,'Ravi Transport'),e(-2,'out','Hardware & tools','Screws and hinges',940,'Sharma Hardware'),e(-2,'out','Tea & food','Tea and snacks',160,'Canteen'),
    e(-1,'out','Hardware & tools','Polish brush set',560,'Sharma Hardware'),e(-1,'out','Repair & maintenance','Planer blade sharpening',450,'Local mechanic'),e(-1,'out','Courier','Sample sent to client',220,'Courier'),e(-1,'out','Tea & food','Tea and snacks',150,'Canteen'),
    e(0,'out','Tea & food','Tea and snacks',170,'Canteen'),e(0,'out','Stationery','Register and pens',120,'Stationery shop'),e(0,'out','Labour advance','Advance to Mohan Lal',1000,'Mohan Lal')]};
  S.nextInvTab=0;
}
function prodTotals(p){var t={material:0,labour:0,overhead:0};p.lines.forEach(function(l){t[l.kind]+=l.qty*l.rate});t.total=t.material+t.labour+t.overhead;t.profit=p.price-t.total;t.margin=p.price?t.profit/p.price*100:0;return t}
function curProd(){var p=S.products.filter(function(x){return x.id===S.pid})[0]||S.products[0];S.pid=p.id;return p}
function marginChip(m){return chip(m.toFixed(0)+'% margin',m>=25?'good':m>=10?'warn':'bad')}

function adminCosting(){
  var p=curProd(),t=prodTotals(p),n=Math.max(1,S.cqty||1);
  var list=S.products.map(function(x){var tt=prodTotals(x);return '<button class="prodbtn'+(x.id===p.id?' on':'')+'" data-act="pp" data-id="'+x.id+'"><b>'+esc(x.name)+'</b><span class="small muted">Cost '+inr(tt.total)+' · Price '+inr(x.price)+'</span>'+marginChip(tt.margin)+'</button>'}).join('');
  var addProd='<div class="card"><h3 style="margin-bottom:10px">New product</h3><div class="field"><span>Product name</span><input id="np-name" type="text" maxlength="60" placeholder="Example: Teak study table"></div><button class="btn primary sm" data-act="addProd">Add product</button></div>';
  var pct=function(v){return t.total?Math.round(v/t.total*100):0};
  var tiles='<div class="tiles"><div class="tile"><span class="cap">Material</span><b class="num">'+inr(t.material)+'</b></div><div class="tile"><span class="cap">Labour</span><b class="num">'+inr(t.labour)+'</b></div><div class="tile"><span class="cap">Other costs</span><b class="num">'+inr(t.overhead)+'</b></div><div class="tile alert"><span class="cap">Cost of 1 unit</span><b class="num">'+inr(t.total)+'</b></div></div>';
  var split='<div class="card"><div class="split" role="img" aria-label="Cost split"><i class="c-mat" style="width:'+pct(t.material)+'%"></i><i class="c-lab" style="width:'+pct(t.labour)+'%"></i><i class="c-ovh" style="width:'+pct(t.overhead)+'%"></i></div><div class="legend"><span><i class="sw c-mat"></i>Material '+pct(t.material)+'%</span><span><i class="sw c-lab"></i>Labour '+pct(t.labour)+'%</span><span><i class="sw c-ovh"></i>Other '+pct(t.overhead)+'%</span></div></div>';
  var profit='<div class="card"><div class="two"><div class="field"><span>Selling price of 1 unit (₹)</span><input id="pr-price" type="number" min="0" step="100" value="'+p.price+'" data-chg="price"></div><div class="field"><span>Profit on 1 unit</span><b class="num '+(t.profit<0?'neg':'pos')+'" style="font-size:1.4rem">'+inr(t.profit)+'</b>'+marginChip(t.margin)+'</div></div>'+
    '<div class="field" style="max-width:220px"><span>If we make this many units</span><input id="pr-qty" type="number" min="1" step="1" value="'+n+'" data-chg="cqty"></div>'+
    '<div class="small muted">Total cost <b class="mono">'+inr(t.total*n)+'</b> · Sales <b class="mono">'+inr(p.price*n)+'</b> · Profit <b class="mono">'+inr(t.profit*n)+'</b></div></div>';
  var head={material:['Material','Qty','Rate'],labour:['Work','Hours','Rate per hour'],overhead:['Cost','Qty','Rate']};
  var title={material:'Material cost',labour:'Labour cost',overhead:'Other costs (packing, transport, power, rent)'};
  var groups=['material','labour','overhead'].map(function(k){
    var rows=p.lines.filter(function(l){return l.kind===k}).map(function(l){
      return '<tr><td>'+esc(l.name)+'</td><td class="r"><input class="sm" type="number" min="0" step="any" value="'+l.qty+'" data-chg="line" data-lid="'+l.id+'" data-k="qty" aria-label="Quantity"></td><td>'+esc(l.unit)+'</td><td class="r"><input class="sm" type="number" min="0" step="any" value="'+l.rate+'" data-chg="line" data-lid="'+l.id+'" data-k="rate" aria-label="Rate"></td><td class="r mono">'+inr(l.qty*l.rate)+'</td><td class="r"><button class="btn sm no" data-act="delLine" data-id="'+l.id+'" aria-label="Remove line">Remove</button></td></tr>';
    }).join('')||'<tr><td colspan="6" class="muted">Nothing added yet.</td></tr>';
    return '<div class="card"><div class="head-row"><h3>'+title[k]+'</h3><b class="num">'+inr(t[k])+'</b></div><div class="scroll"><table><thead><tr><th>'+head[k][0]+'</th><th class="r">'+head[k][1]+'</th><th>Unit</th><th class="r">'+head[k][2]+' ₹</th><th class="r">Amount</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
  }).join('');
  var addLine='<div class="card"><h3 style="margin-bottom:4px">Add a cost line</h3><p class="small muted" style="margin:0 0 12px">For material, pick an item from inventory and the rate is filled in for you.</p><div class="rowform"><div class="field"><span>Type</span><select id="nl-kind"><option value="material">Material</option><option value="labour">Labour</option><option value="overhead">Other cost</option></select></div><div class="field"><span>Name</span><input id="nl-name" type="text" list="nl-names" maxlength="60"><datalist id="nl-names">'+S.inv.map(function(i){return '<option value="'+esc(i.name)+'">'}).join('')+'</datalist></div><div class="field"><span>Qty or hours</span><input id="nl-qty" type="number" min="0" step="any"></div><div class="field"><span>Unit</span><input id="nl-unit" type="text" maxlength="12" placeholder="cft, h, lot"></div><div class="field"><span>Rate ₹</span><input id="nl-rate" type="number" min="0" step="any"></div><button class="btn primary" data-act="addLine">Add line</button></div></div>';
  return '<div class="cols" style="grid-template-columns:minmax(0,1fr)"><div class="stack"><div class="head-row" style="margin:0"><div><h2>'+esc(p.name)+'</h2><span class="small muted">Full cost of making 1 unit, from material to packing</span></div></div>'+'<div class="rowform" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));align-items:stretch">'+list+'</div>'+tiles+split+profit+groups+addLine+addProd+'</div></div>';
}

/* petty cash */
function pcBal(upTo){var b=S.petty.opening;S.petty.entries.forEach(function(e){if(!upTo||e.date<=upTo)b+=e.type==='in'?e.amt:-e.amt});return b}
function adminPetty(){
  var t=todayStr(),P=S.petty,bal=pcBal(),sToday=0,sMonth=0,cats={};
  P.entries.forEach(function(e){if(e.type!=='out')return;if(e.date===t)sToday+=e.amt;if(e.date.slice(0,7)===t.slice(0,7)){sMonth+=e.amt;cats[e.cat]=(cats[e.cat]||0)+e.amt}});
  var low=bal<P.low;
  var tiles='<div class="tiles"><div class="tile'+(low?' alert':'')+'"><span class="cap">Balance now</span><b class="num '+(bal<0?'neg':'')+'">'+inr(bal)+'</b></div><div class="tile"><span class="cap">Spent today</span><b class="num">'+inr(sToday)+'</b></div><div class="tile"><span class="cap">Spent this month</span><b class="num">'+inr(sMonth)+'</b></div><div class="tile"><span class="cap">Low balance alert</span><b class="num" style="font-size:1.2rem"><input id="pc-low" class="boxed" type="number" min="0" step="500" value="'+P.low+'" data-chg="pcLow" style="width:110px" aria-label="Low balance alert amount"></b></div></div>';
  var alertBox=low?'<div class="card" style="border-color:var(--warn)">'+chip('Low balance','warn')+' Petty cash is below '+inr(P.low)+'. Add cash soon.</div>':'';
  var form='<div class="card"><h3 style="margin-bottom:12px">Add today’s entry</h3><div class="rowform"><div class="field"><span>Type</span><select id="pc-type"><option value="out">Spent</option><option value="in">Cash added</option></select></div><div class="field"><span>Date</span><input id="pc-date" type="date" min="'+P.openDate+'" max="'+t+'" value="'+t+'"></div><div class="field"><span>Category</span><select id="pc-cat">'+opts(PC_CATS)+'</select></div><div class="field"><span>What for</span><input id="pc-desc" type="text" maxlength="80" placeholder="Example: Tea and snacks"></div><div class="field"><span>Amount ₹</span><input id="pc-amt" type="number" min="1" step="any"></div><div class="field"><span>Paid to</span><input id="pc-to" type="text" maxlength="50" placeholder="Optional"></div><button class="btn primary" data-act="pcAdd">Add entry</button></div></div>';
  var keys=Object.keys(cats).sort(function(a,b){return cats[b]-cats[a]}),mx=Math.max.apply(null,keys.map(function(k){return cats[k]}).concat([1]));
  var cat='<div class="card"><h3 style="margin-bottom:12px">Where the money went this month</h3>'+(keys.length?'<div style="display:grid;gap:12px">'+keys.map(function(k){return '<div><div class="head-row" style="margin:0"><span>'+esc(k)+'</span><span class="mono">'+inr(cats[k])+'</span></div><div class="bar" style="width:'+Math.round(cats[k]/mx*100)+'%"></div></div>'}).join('')+'</div>':'<p class="muted" style="margin:0">No spending yet.</p>')+'</div>';
  var dates=P.entries.map(function(e){return e.date}).filter(function(d,i,a){return a.indexOf(d)===i}).sort().reverse();
  var ledger='<div class="card"><h3 style="margin-bottom:8px">Daily ledger</h3>'+dates.map(function(d){
    var es=P.entries.filter(function(e){return e.date===d}).sort(function(a,b){return b.id-a.id}),sp=es.filter(function(e){return e.type==='out'}).reduce(function(a,e){return a+e.amt},0);
    return '<div class="day"><b>'+fd(d)+(d===t?' (today)':'')+'</b><span class="small muted">Spent <b class="mono">'+inr(sp)+'</b> · Closing balance <b class="mono">'+inr(pcBal(d))+'</b></span></div>'+es.map(function(e){
      return '<div class="logrow"><div class="grow"><b>'+esc(e.desc)+'</b><br><span class="small muted">'+esc(e.cat)+(e.to?' · '+esc(e.to):'')+'</span></div><b class="mono '+(e.type==='in'?'pos':'')+'">'+(e.type==='in'?'+':'−')+inr(e.amt)+'</b><button class="btn sm no" data-act="pcDel" data-id="'+e.id+'" aria-label="Delete entry">Delete</button></div>';
    }).join('');
  }).join('')+'</div>';
  return '<div class="stack">'+tiles+alertBox+'<div class="cols"><div class="stack">'+form+ledger+'</div>'+cat+'</div></div>';
}

/* inventory */
function invSt(i){return i.qty<=0?'out':i.qty<=i.min?'low':'ok'}
function invChip(i){var s=invSt(i);return chip(s==='out'?'Out of stock':s==='low'?'Low':'In stock',s==='out'?'bad':s==='low'?'warn':'good')}
function reqPending(){return S.reqs.filter(function(r){return r.status==='pending'}).length}
function orderList(){
  var rows=[];
  S.inv.forEach(function(i){if(invSt(i)!=='ok')rows.push({name:i.name,unit:i.unit,qty:Math.max(i.min*2-i.qty,i.min),why:'Stock '+num(i.qty)+', minimum '+num(i.min)})});
  S.reqs.filter(function(r){return r.status==='approved'}).forEach(function(r){rows.push({name:r.item,unit:r.unit,qty:r.qty,why:'Asked by '+emp(r.emp).name+(r.urg==='Urgent'?' (urgent)':'')})});
  return rows;
}
function reqChip(s){return chip({pending:'Waiting',approved:'Approved, to order',ordered:'Ordered',received:'Received',rejected:'Rejected'}[s],{pending:'warn',approved:'good',ordered:'',received:'good',rejected:'bad'}[s])}
function adminInventory(){
  var tab=S.invTab||'stock',pend=reqPending(),ol=orderList();
  var sub='<div class="seg" role="group" aria-label="Inventory view" style="margin-bottom:14px"><button data-act="invTab" data-v="stock" class="'+(tab==='stock'?'on':'')+'">Stock</button><button data-act="invTab" data-v="req" class="'+(tab==='req'?'on':'')+'">Requests'+(pend?' ('+pend+')':'')+'</button><button data-act="invTab" data-v="order" class="'+(tab==='order'?'on':'')+'">To order ('+ol.length+')</button></div>';
  var body='';
  if(tab==='stock'){
    var items=S.inv.filter(function(i){return S.invFilter!=='low'||invSt(i)!=='ok'}),val=S.inv.reduce(function(a,i){return a+i.qty*i.rate},0),lowN=S.inv.filter(function(i){return invSt(i)!=='ok'}).length;
    body='<div class="tiles" style="margin-bottom:14px"><div class="tile"><span class="cap">Items</span><b class="num">'+S.inv.length+'</b></div><div class="tile'+(lowN?' alert':'')+'"><span class="cap">Low or out</span><b class="num">'+lowN+'</b></div><div class="tile"><span class="cap">Stock value</span><b class="num">'+inr(val)+'</b></div></div>'+
     '<div class="card"><div class="head-row"><h3>Material in stock</h3><div class="seg" role="group" aria-label="Filter"><button data-act="invFilter" data-v="all" class="'+(S.invFilter!=='low'?'on':'')+'">All</button><button data-act="invFilter" data-v="low" class="'+(S.invFilter==='low'?'on':'')+'">Low or out</button></div></div><div class="scroll"><table><thead><tr><th>Item</th><th>Category</th><th class="r">In stock</th><th class="r">Minimum</th><th>Status</th><th class="r">Value</th><th class="r">Update stock</th></tr></thead><tbody>'+items.map(function(i){
      return '<tr><td><b>'+esc(i.name)+'</b></td><td class="muted">'+esc(i.cat)+'</td><td class="r mono">'+num(i.qty)+' '+esc(i.unit)+'</td><td class="r mono">'+num(i.min)+'</td><td>'+invChip(i)+'</td><td class="r mono">'+inr(i.qty*i.rate)+'</td><td><div class="inl"><input id="iq-'+i.id+'" type="number" min="0" step="any" placeholder="Qty" aria-label="Quantity for '+esc(i.name)+'"><button class="btn sm ok" data-act="invIn" data-id="'+i.id+'">Add</button><button class="btn sm" data-act="invOut" data-id="'+i.id+'">Used</button></div></td></tr>';
    }).join('')+'</tbody></table></div></div>'+
     '<div class="card" style="margin-top:14px"><h3 style="margin-bottom:12px">Add a new item</h3><div class="rowform"><div class="field"><span>Name</span><input id="ni-name" type="text" maxlength="60"></div><div class="field"><span>Category</span><select id="ni-cat">'+opts(INV_CATS)+'</select></div><div class="field"><span>Unit</span><select id="ni-unit">'+opts(UNITS)+'</select></div><div class="field"><span>In stock</span><input id="ni-qty" type="number" min="0" step="any" value="0"></div><div class="field"><span>Minimum to keep</span><input id="ni-min" type="number" min="0" step="any" value="0"></div><div class="field"><span>Rate ₹</span><input id="ni-rate" type="number" min="0" step="any" value="0"></div><button class="btn primary" data-act="invAdd">Add item</button></div></div>';
  }else if(tab==='req'){
    var rs=S.reqs.slice().sort(function(a,b){return (a.status==='pending'?0:1)-(b.status==='pending'?0:1)||b.id-a.id});
    body='<div class="card"><h3 style="margin-bottom:4px">Material requests from the workshop</h3>'+(rs.length?rs.map(function(r){
      var e=emp(r.emp),acts='';
      if(r.status==='pending')acts='<button class="btn sm ok" data-act="reqSet" data-id="'+r.id+'" data-v="approved">Approve</button><button class="btn sm no" data-act="reqSet" data-id="'+r.id+'" data-v="rejected">Reject</button>';
      else if(r.status==='approved')acts='<button class="btn sm" data-act="reqSet" data-id="'+r.id+'" data-v="ordered">Mark ordered</button>';
      else if(r.status==='ordered')acts='<button class="btn sm ok" data-act="reqSet" data-id="'+r.id+'" data-v="received">Mark received</button>';
      return '<div class="pend">'+avatar(e)+'<div class="grow"><b>'+esc(r.item)+'</b> · <span class="mono">'+num(r.qty)+' '+esc(r.unit)+'</span><br><span class="small muted">'+e.name+' ('+e.role+') · '+fd(r.date)+(r.note?'<br>'+esc(r.note):'')+'</span></div>'+(r.urg==='Urgent'?chip('Urgent','bad'):'')+reqChip(r.status)+acts+'</div>';
    }).join(''):'<p class="muted">No requests yet.</p>')+'</div>';
  }else{
    body='<div class="card"><div class="head-row"><div><h3>Material to order</h3><span class="small muted">Low or finished items, plus approved requests</span></div>'+(ol.length?'<button class="btn sm" data-act="copyOrder">Copy list</button>':'')+'</div>'+(ol.length?'<div class="scroll"><table><thead><tr><th>Item</th><th class="r">Order</th><th>Why</th></tr></thead><tbody>'+ol.map(function(r){return '<tr><td><b>'+esc(r.name)+'</b></td><td class="r mono">'+num(r.qty)+' '+esc(r.unit)+'</td><td class="muted">'+esc(r.why)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="muted" style="margin:0">Nothing to order right now.</p>')+'</div>';
  }
  return sub+body;
}
function bizCards(){
  var bal=pcBal(),ol=orderList().length,pend=reqPending();
  return '<div class="card"><span class="cap">Petty cash</span><div class="pay" style="margin-top:6px"><div class="big num '+(bal<S.petty.low?'neg':'')+'">'+inr(bal)+'</div><button class="btn sm" data-act="tab" data-v="petty">Open</button></div>'+(bal<S.petty.low?'<p class="small muted" style="margin:8px 0 0">Below the alert amount of '+inr(S.petty.low)+'.</p>':'')+'</div>'+
   '<div class="card"><span class="cap">Material to order</span><p style="margin:6px 0 10px"><b class="num">'+ol+'</b> items to order, <b class="num">'+pend+'</b> requests waiting.</p><button class="btn sm" data-act="tab" data-v="inventory">Open inventory</button></div>';
}
function empMaterial(){
  var mine=S.reqs.filter(function(r){return r.emp===S.uid}).sort(function(a,b){return b.id-a.id});
  var stock='<div class="card"><h3 style="margin-bottom:4px">Material available</h3><p class="small muted" style="margin:0 0 6px">Check here before you ask for something.</p>'+S.inv.map(function(i){return '<div class="logrow">'+thumb(i.name,42,i.img,'material')+'<div class="grow"><b>'+esc(i.name)+'</b></div><span class="mono">'+num(i.qty)+' '+esc(i.unit)+'</span>'+invChip(i)+'</div>'}).join('')+'</div>';
  var form='<div class="card"><h3 style="margin-bottom:4px">Need something?</h3><p class="small muted" style="margin:0 0 12px">Write what you need. The admin will see it and order it.</p><div class="field"><span>Material</span><input id="rq-item" type="text" list="rq-names" maxlength="80" placeholder="Example: PU polish or paint"><datalist id="rq-names">'+S.inv.map(function(i){return '<option value="'+esc(i.name)+'">'}).join('')+'</datalist></div><div class="two"><div class="field"><span>How much</span><input id="rq-qty" type="number" min="0.01" step="any" value="1"></div><div class="field"><span>How soon</span><select id="rq-urg"><option>Normal</option><option>Urgent</option></select></div></div><div class="field"><span>Note (optional)</span><input id="rq-note" type="text" maxlength="120" placeholder="Why you need it"></div><button class="btn primary" data-act="reqAdd">Send request</button></div>';
  var my='<div class="card"><h3 style="margin-bottom:4px">My requests</h3>'+(mine.length?mine.map(function(r){return '<div class="logrow"><div class="grow"><b>'+esc(r.item)+'</b> · <span class="mono">'+num(r.qty)+' '+esc(r.unit)+'</span><br><span class="small muted">'+fd(r.date)+(r.note?' · '+esc(r.note):'')+'</span></div>'+reqChip(r.status)+'</div>'}).join(''):'<p class="muted" style="margin:0">No requests yet.</p>')+'</div>';
  return '<div class="stack">'+form+my+stock+'</div>';
}
function curInv(n){var m=S.inv.filter(function(i){return i.name.toLowerCase()===String(n).trim().toLowerCase()});return m[0]||null}
function bizClick0(a,b){
  var id=+b.dataset.id,v=b.dataset.v,p,q,r;
  if(a==='pp'){S.pid=id;render();return true}
  if(a==='addProd'){var nm=$('#np-name').value.trim();if(!nm){toast('Enter the product name.',1);return true}p={id:S.nextProd++,name:nm,price:0,lines:[]};S.products.push(p);S.pid=p.id;toast('Product added. Now add its material and labour.');render();return true}
  if(a==='addLine'){
    p=curProd();var kind=$('#nl-kind').value,name=$('#nl-name').value.trim(),unit=$('#nl-unit').value.trim(),rate=parseFloat($('#nl-rate').value);q=parseFloat($('#nl-qty').value);
    var m=kind==='material'?curInv(name):null;if(m){if(isNaN(rate))rate=m.rate;if(!unit)unit=m.unit}
    if(!name){toast('Enter the item name.',1);return true}
    if(isNaN(q)||q<=0){toast('Enter a quantity above 0.',1);return true}
    if(isNaN(rate)||rate<0){toast('Enter the rate.',1);return true}
    p.lines.push({id:S.nextLine++,kind:kind,name:name,qty:q,unit:unit||(kind==='labour'?'h':'pcs'),rate:rate});toast('Cost line added.');render();return true}
  if(a==='delLine'){p=curProd();p.lines=p.lines.filter(function(l){return l.id!==id});toast('Line removed.');render();return true}
  if(a==='pcAdd'){
    var type=$('#pc-type').value,date=$('#pc-date').value,cat=$('#pc-cat').value,desc=$('#pc-desc').value.trim(),amt=parseFloat($('#pc-amt').value),to=$('#pc-to').value.trim();
    if(!date||date>todayStr()||date<S.petty.openDate){toast('Choose a date from '+fd(S.petty.openDate)+' up to today.',1);return true}
    if(!desc){toast('Write what the money was for.',1);return true}
    if(isNaN(amt)||amt<=0){toast('Enter an amount above 0.',1);return true}
    S.petty.entries.push({id:S.nextPc++,date:date,type:type,cat:type==='in'?'Cash added':cat,desc:desc,amt:amt,to:to});toast(type==='in'?'Cash added to petty cash.':'Expense saved.');render();return true}
  if(a==='pcDel'){S.petty.entries=S.petty.entries.filter(function(e){return e.id!==id});toast('Entry deleted.');render();return true}
  if(a==='invTab'){S.invTab=v;render();return true}
  if(a==='invFilter'){S.invFilter=v;render();return true}
  if(a==='invIn'||a==='invOut'){
    q=parseFloat($('#iq-'+id).value);if(isNaN(q)||q<=0){toast('Enter a quantity above 0.',1);return true}
    var it=S.inv.filter(function(i){return i.id===id})[0];
    if(a==='invOut'&&q>it.qty){toast('Only '+num(it.qty)+' '+it.unit+' in stock.',1);return true}
    it.qty=Math.round((it.qty+(a==='invIn'?q:-q))*100)/100;toast(a==='invIn'?'Stock added.':'Marked as used.');render();return true}
  if(a==='invAdd'){
    var n=$('#ni-name').value.trim(),qty=parseFloat($('#ni-qty').value),mn=parseFloat($('#ni-min').value),rt=parseFloat($('#ni-rate').value);
    if(!n){toast('Enter the item name.',1);return true}
    if(curInv(n)){toast('This item is already in the list.',1);return true}
    if([qty,mn,rt].some(function(x){return isNaN(x)||x<0})){toast('Quantity, minimum and rate must be 0 or more.',1);return true}
    S.inv.push({id:S.nextInv++,name:n,cat:$('#ni-cat').value,unit:$('#ni-unit').value,qty:qty,min:mn,rate:rt});toast('Item added.');render();return true}
  if(a==='reqSet'){
    r=S.reqs.filter(function(x){return x.id===id})[0];r.status=v;
    if(v==='received'){var m2=curInv(r.item);if(m2)m2.qty=Math.round((m2.qty+r.qty)*100)/100}
    toast(v==='received'?'Marked received. Stock updated.':'Request updated.');render();return true}
  if(a==='reqAdd'){
    var item=$('#rq-item').value.trim(),rq=parseFloat($('#rq-qty').value);
    if(!item){toast('Write what you need.',1);return true}
    if(isNaN(rq)||rq<=0){toast('Enter how much you need.',1);return true}
    var mi=curInv(item);
    S.reqs.push({id:S.nextReq++,emp:S.uid,item:mi?mi.name:item,qty:rq,unit:mi?mi.unit:'pcs',urg:$('#rq-urg').value,note:$('#rq-note').value.trim(),status:'pending',date:todayStr()});
    toast('Request sent to the admin.');render();return true}
  if(a==='copyOrder'){
    var txt='Avya Woodcraft LLP - material to order\n'+orderList().map(function(x){return '- '+x.name+': '+num(x.qty)+' '+x.unit}).join('\n');
    try{navigator.clipboard.writeText(txt).then(function(){toast('List copied.')},function(){toast('Could not copy. Select the table and copy it.',1)})}catch(e){toast('Could not copy. Select the table and copy it.',1)}
    return true}
  return false;
}
function bizChange0(el){
  var k=el.dataset.chg,val=parseFloat(el.value),p;
  if(k==='line'){p=curProd();var l=p.lines.filter(function(x){return x.id===+el.dataset.lid})[0];if(isNaN(val)||val<0){toast('Enter a number, 0 or more.',1)}else{l[el.dataset.k]=val;toast('Cost updated.')}render();return true}
  if(k==='price'){p=curProd();if(isNaN(val)||val<0){toast('Enter a price, 0 or more.',1)}else{p.price=val;toast('Selling price updated.')}render();return true}
  if(k==='cqty'){S.cqty=isNaN(val)||val<1?1:Math.floor(val);render();return true}
  if(k==='pcLow'){if(isNaN(val)||val<0){toast('Enter an amount, 0 or more.',1)}else{S.petty.low=val;toast('Alert amount saved.')}render();return true}
  return false;
}

/* ===== luxury layer: material images, BOQ costing, editable everything ===== */
var ART={
 wood:['#C68B4E','<g fill="#A8652C"><rect x="8" y="14" width="48" height="10" rx="1.5"/><rect x="8" y="27" width="48" height="10" rx="1.5" fill="#B9763A"/><rect x="8" y="40" width="48" height="10" rx="1.5"/></g><g stroke="#7E4A1E" stroke-width=".9" fill="none" opacity=".7"><path d="M10 19h44M14 17h30M10 32h44M20 30h28M10 45h44M16 43h34"/></g>'],
 veneer:['#EBCB94','<path d="M10 46L22 16h34L44 46z" fill="#D9A862"/><path d="M16 42l9-22M24 42l9-22M32 42l9-22M40 42l9-22" stroke="#B98443" stroke-width=".9"/>'],
 polish:['#2B3556','<rect x="18" y="20" width="28" height="32" rx="3" fill="#D8A93E"/><rect x="16" y="15" width="32" height="8" rx="2" fill="#B78922"/><rect x="22" y="30" width="20" height="13" rx="1.5" fill="#FFF3D1"/><path d="M25 37h14" stroke="#B78922" stroke-width="2"/>'],
 stain:['#D8C3A5','<rect x="25" y="9" width="14" height="9" rx="2" fill="#3b2a1a"/><rect x="20" y="18" width="24" height="38" rx="5" fill="#7A4A22"/><rect x="24" y="31" width="16" height="13" fill="#F3E2C2"/>'],
 paper:['#B9B4AA','<rect x="12" y="16" width="38" height="30" fill="#CDA774" transform="rotate(-7 31 31)"/><rect x="16" y="20" width="38" height="30" fill="#DDBB89"/><g fill="#9B7A4B" opacity=".6"><circle cx="24" cy="30" r="1"/><circle cx="34" cy="26" r="1"/><circle cx="42" cy="36" r="1"/><circle cx="28" cy="42" r="1"/><circle cx="46" cy="28" r="1"/></g>'],
 glue:['#E8E2D6','<path d="M24 12h16l3 10v30a4 4 0 01-4 4H25a4 4 0 01-4-4V22z" fill="#F4F0E8" stroke="#BFB7A5"/><rect x="24" y="32" width="16" height="14" fill="#E39A2B"/><rect x="27" y="7" width="10" height="6" fill="#E39A2B"/>'],
 screw:['#3C4250','<g fill="#C9CED8"><circle cx="18" cy="14" r="5"/><rect x="16.5" y="18" width="3" height="34"/><circle cx="32" cy="14" r="5"/><rect x="30.5" y="18" width="3" height="34"/><circle cx="46" cy="14" r="5"/><rect x="44.5" y="18" width="3" height="34"/></g><g stroke="#3C4250" stroke-width="1"><path d="M15 14h6M29 14h6M43 14h6M16 26h4M16 34h4M30 26h4M30 34h4M44 26h4M44 34h4"/></g>'],
 hinge:['#3A3F4B','<rect x="10" y="20" width="20" height="24" rx="2" fill="#C8A55A"/><rect x="34" y="20" width="20" height="24" rx="2" fill="#D6B96F"/><rect x="29" y="18" width="6" height="28" rx="3" fill="#8F7435"/><g fill="#6D5827"><circle cx="16" cy="27" r="1.6"/><circle cx="16" cy="37" r="1.6"/><circle cx="48" cy="27" r="1.6"/><circle cx="48" cy="37" r="1.6"/></g>'],
 foam:['#E8D9A8','<path d="M10 28l22-10 22 10v14L32 52 10 42z" fill="#F2D35C"/><path d="M10 28l22 10 22-10M32 38v14" stroke="#C9A92F" fill="none"/>'],
 fabric:['#7E2D3F','<rect x="10" y="16" width="44" height="32" rx="3" fill="#A33A4F"/><path d="M10 24h44M10 32h44M10 40h44M18 16v32M26 16v32M34 16v32M42 16v32M50 16v32" stroke="#C25A6F" stroke-width=".8" opacity=".6"/>'],
 wrap:['#CFE3EE','<rect x="12" y="22" width="40" height="22" rx="11" fill="#E8F4FA" stroke="#9CC3D6"/><g fill="none" stroke="#9CC3D6"><circle cx="22" cy="33" r="3"/><circle cx="32" cy="33" r="3"/><circle cx="42" cy="33" r="3"/></g>'],
 blade:['#4A505C','<path d="M8 40l48-12v8L8 48z" fill="#DADFE8"/><path d="M8 48l48-12" stroke="#8A93A3"/>'],
 table:['#E5D3B6','<rect x="8" y="22" width="48" height="6" rx="1.5" fill="#9A5E2A"/><rect x="12" y="28" width="4" height="22" fill="#7E4A1E"/><rect x="48" y="28" width="4" height="22" fill="#7E4A1E"/><rect x="14" y="34" width="36" height="2" fill="#A8652C"/>'],
 chair:['#E5D3B6','<rect x="18" y="10" width="4" height="42" fill="#7E4A1E"/><rect x="42" y="10" width="4" height="42" fill="#7E4A1E"/><rect x="18" y="13" width="28" height="4" fill="#9A5E2A"/><rect x="18" y="21" width="28" height="3" fill="#9A5E2A"/><rect x="16" y="34" width="32" height="6" rx="1.5" fill="#A8652C"/><rect x="17" y="40" width="3" height="14" fill="#7E4A1E"/><rect x="44" y="40" width="3" height="14" fill="#7E4A1E"/>'],
 bed:['#E5D3B6','<rect x="6" y="16" width="6" height="32" fill="#7E4A1E"/><rect x="52" y="26" width="6" height="22" fill="#7E4A1E"/><rect x="12" y="34" width="40" height="10" fill="#A8652C"/><rect x="14" y="27" width="16" height="8" rx="2" fill="#F4EAD8"/><rect x="12" y="44" width="40" height="3" fill="#7E4A1E"/>'],
 labour:['#3A3F4B','<rect x="30" y="20" width="5" height="32" rx="2" fill="#C99A5B" transform="rotate(25 32 36)"/><rect x="17" y="13" width="28" height="10" rx="2" fill="#C9CED8" transform="rotate(25 32 36)"/>'],
 pack:['#CDB690','<path d="M10 24l22-10 22 10v22L32 56 10 46z" fill="#C79A5C"/><path d="M10 24l22 10 22-10M32 34v22" stroke="#9B7338" fill="none"/>'],
 truck:['#DDE3EE','<rect x="6" y="22" width="30" height="22" fill="#3A4C7A"/><path d="M36 28h10l9 9v7H36z" fill="#5A6FA5"/><circle cx="18" cy="46" r="5" fill="#222"/><circle cx="46" cy="46" r="5" fill="#222"/>'],
 power:['#2C2A22','<path d="M36 8L18 36h12l-4 20 20-30H34z" fill="#F2C94C"/>'],
 rent:['#D8DCE6','<rect x="14" y="12" width="36" height="42" fill="#5A6785"/><g fill="#E9EEF8"><rect x="20" y="18" width="6" height="6"/><rect x="29" y="18" width="6" height="6"/><rect x="38" y="18" width="6" height="6"/><rect x="20" y="29" width="6" height="6"/><rect x="29" y="29" width="6" height="6"/><rect x="38" y="29" width="6" height="6"/></g><rect x="28" y="42" width="8" height="12" fill="#E9EEF8"/>']
};
var KEYS=[[/stain/,'stain'],[/glue/,'glue'],[/veneer/,'veneer'],[/polish|paint|melamine|lacquer/,'polish'],[/sandpaper|sand paper/,'paper'],[/screw|nail|bolt/,'screw'],[/hinge|handle|hardware/,'hinge'],[/foam|cushion/,'foam'],[/fabric|cloth/,'fabric'],[/bubble|wrap/,'wrap'],[/blade|cutter/,'blade'],[/plank|timber|plywood|\bwood\b/,'wood'],[/table/,'table'],[/chair/,'chair'],[/\bbed\b/,'bed'],[/pack/,'pack'],[/transport|loading|tempo|truck/,'truck'],[/power|machine|electric/,'power'],[/rent/,'rent']];
function artKey(n,kind){
  n=String(n).toLowerCase();
  if(kind==='labour')return 'labour';
  for(var i=0;i<KEYS.length;i++)if(KEYS[i][0].test(n))return KEYS[i][1];
  return kind==='material'?'wood':'pack';
}
function thumb(name,size,img,kind){
  var inv=!img&&S.inv.filter(function(i){return i.name.toLowerCase()===String(name).toLowerCase()})[0];
  var src=img||(inv&&inv.img),k=artKey(name,kind),a=ART[k]||ART.pack;
  return '<span class="thumb" style="width:'+size+'px;height:'+size+'px">'+(src?'<img src="'+src+'" alt="'+esc(name)+'">':'<svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid slice" role="img" aria-label="'+esc(name)+'"><rect width="64" height="64" fill="'+a[0]+'"/>'+a[1]+'</svg>')+'</span>';
}
function invCode(i){return 'MT-'+String(i.id).padStart(3,'0')}
function invByName(n){return S.inv.filter(function(i){return i.name.toLowerCase()===String(n).trim().toLowerCase()})[0]||null}

/* ---- costing as a bill of quantities ---- */
function adminCosting(){
  var p=curProd(),t=prodTotals(p),n=Math.max(1,S.cqty||1);
  var list=S.products.map(function(x){var tt=prodTotals(x);return '<button class="prodbtn'+(x.id===p.id?' on':'')+'" data-act="pp" data-id="'+x.id+'"><div style="display:flex;gap:10px;align-items:center">'+thumb(x.name,44,x.img,'product')+'<b>'+esc(x.name)+'</b></div><span class="small muted">Cost '+inr(tt.total)+' · Price '+inr(x.price)+'</span>'+marginChip(tt.margin)+'</button>'}).join('');
  var confirm=S.confirmProd===p.id?'<span class="inl"><span class="small">Delete this product?</span><button class="btn sm no" data-act="doProdDel" data-id="'+p.id+'">Yes, delete</button><button class="btn sm" data-act="cancelProdDel">Cancel</button></span>':'<button class="btn sm no" data-act="askProdDel" data-id="'+p.id+'">'+ic('trash',13)+' Delete product</button>';
  var head='<div class="card hero-card"><div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">'+thumb(p.name,96,p.img,'product')+'<div class="grow" style="min-width:220px"><span class="cap">Product being manufactured</span><div class="field" style="margin:6px 0 10px"><input id="pr-name" class="serif-in" type="text" maxlength="60" value="'+esc(p.name)+'" data-chg="pName" aria-label="Product name"></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="pickProd" data-id="'+p.id+'">'+ic('cam',13)+' Product photo</button>'+confirm+'</div></div></div></div>';
  var pct=function(v){return t.total?Math.round(v/t.total*100):0};
  var tiles='<div class="tiles">'+tile('box','Material',inr(t.material),'var(--accent)')+tile('users','Labour',inr(t.labour),'var(--primary)')+tile('rupee','Other costs',inr(t.overhead),'var(--muted)')+tile('tag','Cost of 1 unit',inr(t.total),'var(--good)')+'</div>';
  var split='<div class="card"><div class="split" role="img" aria-label="Cost split"><i class="c-mat" style="width:'+pct(t.material)+'%"></i><i class="c-lab" style="width:'+pct(t.labour)+'%"></i><i class="c-ovh" style="width:'+pct(t.overhead)+'%"></i></div><div class="legend"><span><i class="sw c-mat"></i>Material '+pct(t.material)+'%</span><span><i class="sw c-lab"></i>Labour '+pct(t.labour)+'%</span><span><i class="sw c-ovh"></i>Other '+pct(t.overhead)+'%</span></div></div>';
  var profit='<div class="card"><div class="two"><div class="field"><span>Selling price of 1 unit (₹)</span><input id="pr-price" type="number" min="0" step="100" value="'+p.price+'" data-chg="price"></div><div class="field"><span>Profit on 1 unit</span><b class="num '+(t.profit<0?'neg':'pos')+'" style="font-size:1.5rem">'+inr(t.profit)+'</b>'+marginChip(t.margin)+'</div></div>'+
    '<div class="field" style="max-width:220px"><span>If we make this many units</span><input id="pr-qty" type="number" min="1" step="1" value="'+n+'" data-chg="cqty"></div>'+
    '<div class="small muted">Total cost <b class="mono">'+inr(t.total*n)+'</b> · Sales <b class="mono">'+inr(p.price*n)+'</b> · Profit <b class="mono">'+inr(t.profit*n)+'</b></div></div>';
  var title={material:'Material',labour:'Labour',overhead:'Other costs'},sub={material:'Raw material, hardware and consumables',labour:'Work done on the product, in hours',overhead:'Packing, transport, power and rent share'};
  var groups=['material','labour','overhead'].map(function(k,gi){
    var idx=0,rows=p.lines.filter(function(l){return l.kind===k}).map(function(l){
      idx++;var m=k==='material'?invByName(l.name):null;
      return '<tr><td class="mono muted">'+pad(idx)+'</td><td>'+thumb(l.name,44,m&&m.img,k)+'</td><td><input class="nm" type="text" maxlength="60" value="'+esc(l.name)+'" data-chg="lineName" data-lid="'+l.id+'" aria-label="Item name"><div class="small muted">'+(m?'<span class="mono">'+invCode(m)+'</span> · '+esc(m.cat):(k==='material'?'Not in inventory':k==='labour'?'Labour':'Overhead'))+'</div></td><td class="r"><input class="sm" type="number" min="0" step="any" value="'+l.qty+'" data-chg="line" data-lid="'+l.id+'" data-k="qty" aria-label="Quantity"></td><td><input class="sm u" type="text" maxlength="12" value="'+esc(l.unit)+'" data-chg="lineUnit" data-lid="'+l.id+'" aria-label="Unit"></td><td class="r"><input class="sm" type="number" min="0" step="any" value="'+l.rate+'" data-chg="line" data-lid="'+l.id+'" data-k="rate" aria-label="Rate"></td><td class="r mono"><b>'+inr(l.qty*l.rate)+'</b></td><td class="r"><button class="btn sm ghost no" data-act="delLine" data-id="'+l.id+'" aria-label="Remove line">'+ic('trash',13)+'</button></td></tr>';
    }).join('')||'<tr><td colspan="8" class="muted">Nothing added yet.</td></tr>';
    return '<div class="card"><div class="head-row"><div><h3>'+title[k]+'</h3><span class="small muted">'+sub[k]+'</span></div><b class="num" style="font-size:1.2rem">'+inr(t[k])+'</b></div><div class="scroll"><table class="boq"><thead><tr><th>#</th><th>Image</th><th>Item</th><th class="r">'+(k==='labour'?'Hours':'Qty')+'</th><th>Unit</th><th class="r">Rate ₹</th><th class="r">Amount</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
  }).join('');
  var addLine='<div class="card"><h3 style="margin-bottom:4px">Add a line</h3><p class="small muted" style="margin:0 0 12px">For material, pick an item from inventory and the rate and unit are filled in for you.</p><div class="rowform"><div class="field"><span>Type</span><select id="nl-kind"><option value="material">Material</option><option value="labour">Labour</option><option value="overhead">Other cost</option></select></div><div class="field"><span>Name</span><input id="nl-name" type="text" list="nl-names" maxlength="60"><datalist id="nl-names">'+S.inv.map(function(i){return '<option value="'+esc(i.name)+'">'}).join('')+'</datalist></div><div class="field"><span>Qty or hours</span><input id="nl-qty" type="number" min="0" step="any"></div><div class="field"><span>Unit</span><input id="nl-unit" type="text" maxlength="12" placeholder="cft, h, lot"></div><div class="field"><span>Rate ₹</span><input id="nl-rate" type="number" min="0" step="any"></div><button class="btn primary" data-act="addLine">Add line</button></div></div>';
  var addProd='<div class="card"><h3 style="margin-bottom:10px">New product</h3><div class="field"><span>Product name</span><input id="np-name" type="text" maxlength="60" placeholder="Example: Teak study table"></div><button class="btn primary sm" data-act="addProd">Add product</button></div>';
  return '<div class="stack"><div class="rowform" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));align-items:stretch">'+list+'</div>'+head+tiles+split+profit+'<h2 class="sec">Bill of quantities</h2>'+groups+addLine+addProd+'</div>';
}

/* ---- inventory with photos and editing ---- */
function adminInventory(){
  var tab=S.invTab||'stock',pend=reqPending(),ol=orderList();
  var sub='<div class="seg" role="group" aria-label="Inventory view" style="margin-bottom:14px"><button data-act="invTab" data-v="stock" class="'+(tab==='stock'?'on':'')+'">Stock</button><button data-act="invTab" data-v="req" class="'+(tab==='req'?'on':'')+'">Requests'+(pend?' ('+pend+')':'')+'</button><button data-act="invTab" data-v="order" class="'+(tab==='order'?'on':'')+'">To order ('+ol.length+')</button></div>';
  var body='';
  if(tab==='stock'){
    var items=S.inv.filter(function(i){return S.invFilter!=='low'||invSt(i)!=='ok'}),val=S.inv.reduce(function(a,i){return a+i.qty*i.rate},0),lowN=S.inv.filter(function(i){return invSt(i)!=='ok'}).length;
    body='<div class="tiles" style="margin-bottom:14px">'+tile('box','Items',S.inv.length,'var(--primary)')+tile('clip','Low or out',lowN,'var(--warn)')+tile('rupee','Stock value',inr(val),'var(--good)')+'</div>'+
     '<div class="card"><div class="head-row"><h3>Material in stock</h3><div class="seg" role="group" aria-label="Filter"><button data-act="invFilter" data-v="all" class="'+(S.invFilter!=='low'?'on':'')+'">All</button><button data-act="invFilter" data-v="low" class="'+(S.invFilter==='low'?'on':'')+'">Low or out</button></div></div><div class="scroll"><table class="boq"><thead><tr><th>Image</th><th>Item</th><th class="r">In stock</th><th class="r">Minimum</th><th class="r">Rate ₹</th><th>Status</th><th class="r">Value</th><th class="r">Add / used</th><th class="r">Edit</th></tr></thead><tbody>'+items.map(function(i){
      var del=S.confirmInv===i.id?'<span class="inl"><button class="btn sm no" data-act="doInvDel" data-id="'+i.id+'">Delete</button><button class="btn sm" data-act="cancelInvDel">No</button></span>':'<div class="inl"><button class="btn sm" data-act="pickInv" data-id="'+i.id+'" aria-label="Change photo">'+ic('cam',13)+'</button><button class="btn sm ghost no" data-act="askInvDel" data-id="'+i.id+'" aria-label="Delete item">'+ic('trash',13)+'</button></div>';
      return '<tr><td>'+thumb(i.name,46,i.img,'material')+'</td><td><input class="nm" type="text" maxlength="60" value="'+esc(i.name)+'" data-chg="invf" data-k="name" data-id="'+i.id+'" aria-label="Item name"><div class="small muted"><span class="mono">'+invCode(i)+'</span> · '+esc(i.cat)+'</div></td><td class="r"><input class="sm" type="number" min="0" step="any" value="'+i.qty+'" data-chg="invf" data-k="qty" data-id="'+i.id+'" aria-label="In stock"> <span class="small muted">'+esc(i.unit)+'</span></td><td class="r"><input class="sm" type="number" min="0" step="any" value="'+i.min+'" data-chg="invf" data-k="min" data-id="'+i.id+'" aria-label="Minimum"></td><td class="r"><input class="sm" type="number" min="0" step="any" value="'+i.rate+'" data-chg="invf" data-k="rate" data-id="'+i.id+'" aria-label="Rate"></td><td>'+invChip(i)+'</td><td class="r mono">'+inr(i.qty*i.rate)+'</td><td><div class="inl"><input id="iq-'+i.id+'" type="number" min="0" step="any" placeholder="Qty" aria-label="Quantity for '+esc(i.name)+'"><button class="btn sm ok" data-act="invIn" data-id="'+i.id+'">Add</button><button class="btn sm" data-act="invOut" data-id="'+i.id+'">Used</button></div></td><td class="r">'+del+'</td></tr>';
    }).join('')+'</tbody></table></div></div>'+
     '<div class="card" style="margin-top:14px"><h3 style="margin-bottom:12px">Add a new item</h3><div class="rowform"><div class="field"><span>Name</span><input id="ni-name" type="text" maxlength="60"></div><div class="field"><span>Category</span><select id="ni-cat">'+opts(INV_CATS)+'</select></div><div class="field"><span>Unit</span><select id="ni-unit">'+opts(UNITS)+'</select></div><div class="field"><span>In stock</span><input id="ni-qty" type="number" min="0" step="any" value="0"></div><div class="field"><span>Minimum to keep</span><input id="ni-min" type="number" min="0" step="any" value="0"></div><div class="field"><span>Rate ₹</span><input id="ni-rate" type="number" min="0" step="any" value="0"></div><button class="btn primary" data-act="invAdd">Add item</button></div></div>';
  }else if(tab==='req'){
    var rs=S.reqs.slice().sort(function(a,b){return (a.status==='pending'?0:1)-(b.status==='pending'?0:1)||b.id-a.id});
    body='<div class="card"><h3 style="margin-bottom:4px">Material requests from the workshop</h3>'+(rs.length?rs.map(function(r){
      var e=emp(r.emp),acts='';
      if(r.status==='pending')acts='<button class="btn sm ok" data-act="reqSet" data-id="'+r.id+'" data-v="approved">Approve</button><button class="btn sm no" data-act="reqSet" data-id="'+r.id+'" data-v="rejected">Reject</button>';
      else if(r.status==='approved')acts='<button class="btn sm" data-act="reqSet" data-id="'+r.id+'" data-v="ordered">Mark ordered</button>';
      else if(r.status==='ordered')acts='<button class="btn sm ok" data-act="reqSet" data-id="'+r.id+'" data-v="received">Mark received</button>';
      return '<div class="pend">'+thumb(r.item,44,null,'material')+'<div class="grow"><b>'+esc(r.item)+'</b> · <span class="mono">'+num(r.qty)+' '+esc(r.unit)+'</span><br><span class="small muted">'+avatar(e,null,18)+' '+esc(e.name)+' ('+esc(e.role)+') · '+fd(r.date)+(r.note?'<br>'+esc(r.note):'')+'</span></div>'+(r.urg==='Urgent'?chip('Urgent','bad'):'')+reqChip(r.status)+acts+'<button class="btn sm ghost no" data-act="reqDel" data-id="'+r.id+'" aria-label="Delete request">'+ic('trash',13)+'</button></div>';
    }).join(''):'<p class="muted">No requests yet.</p>')+'</div>';
  }else{
    body='<div class="card"><div class="head-row"><div><h3>Material to order</h3><span class="small muted">Low or finished items, plus approved requests</span></div>'+(ol.length?'<button class="btn sm" data-act="copyOrder">Copy list</button>':'')+'</div>'+(ol.length?'<div class="scroll"><table class="boq"><thead><tr><th>Image</th><th>Item</th><th class="r">Order</th><th>Why</th></tr></thead><tbody>'+ol.map(function(r){return '<tr><td>'+thumb(r.name,44,null,'material')+'</td><td><b>'+esc(r.name)+'</b></td><td class="r mono">'+num(r.qty)+' '+esc(r.unit)+'</td><td class="muted">'+esc(r.why)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="muted" style="margin:0">Nothing to order right now.</p>')+'</div>';
  }
  return sub+body;
}

/* ---- petty cash with editable ledger ---- */
function adminPetty(){
  var t=todayStr(),P=S.petty,bal=pcBal(),sToday=0,sMonth=0,cats={};
  P.entries.forEach(function(e){if(e.type!=='out')return;if(e.date===t)sToday+=e.amt;if(e.date.slice(0,7)===t.slice(0,7)){sMonth+=e.amt;cats[e.cat]=(cats[e.cat]||0)+e.amt}});
  var low=bal<P.low;
  var tiles='<div class="tiles">'+tile('wallet','Balance now',inr(bal),low?'var(--warn)':'var(--good)','<button class="btn sm tedit" data-act="pcEditOpen">✎ Edit balance</button>')+tile('rupee','Spent today',inr(sToday),'var(--primary)')+tile('cal','Spent this month',inr(sMonth),'var(--accent)')+'<div class="tile" style="--tc:var(--muted)"><span class="ti">'+ic('clip',19)+'</span><span class="cap">Low balance alert</span><input id="pc-low" class="boxed" type="number" min="0" step="500" value="'+P.low+'" data-chg="pcLow" aria-label="Low balance alert amount"></div></div>';
  var alertBox=low?'<div class="card" style="border-color:var(--warn)">'+chip('Low balance','warn')+' Petty cash is below '+inr(P.low)+'. Add cash soon.</div>':'';
  var editBox=S.pcEdit?'<div class="cellpanel" style="margin:0"><div class="head-row" style="margin-bottom:6px"><h3>Edit petty cash balance</h3><button class="btn sm ghost" data-act="pcEditClose">Close</button></div>'+
   '<p class="small muted" style="margin:0 0 12px">Type the real cash you have in hand now. The difference is saved as a “Balance correction” line in today’s ledger, so every change stays on record.</p>'+
   '<div class="rowform"><div class="field"><span>Correct balance now ₹</span><input id="pc-bal" type="number" min="0" step="any" inputmode="decimal" value="'+bal+'"></div><div class="field"><span>Reason (optional)</span><input id="pc-why" type="text" maxlength="60" placeholder="Example: Cash counted in drawer"></div><button class="btn primary" data-act="pcSetBal">Save balance</button></div>'+
   '<div style="border-top:1px solid var(--line);margin:18px 0 12px"></div><p class="small muted" style="margin:0 0 10px"><b>Starting balance.</b> The cash you had before the first entry in the ledger. Change it if the first balance was wrong; every closing balance updates.</p>'+
   '<div class="rowform"><div class="field"><span>Starting balance ₹</span><input id="pc-open" type="number" min="0" step="any" inputmode="decimal" value="'+P.opening+'"></div><div class="field"><span>As on date</span><input id="pc-opend" type="date" max="'+t+'" value="'+P.openDate+'"></div><button class="btn" data-act="pcSetOpen">Save starting balance</button></div></div>':'';
  var PCX=PC_CATS.concat(['Cash added','Balance correction']);
  var form='<div class="card"><h3 style="margin-bottom:12px">Add today’s entry</h3><div class="rowform"><div class="field"><span>Type</span><select id="pc-type"><option value="out">Spent</option><option value="in">Cash added</option></select></div><div class="field"><span>Date</span><input id="pc-date" type="date" min="'+P.openDate+'" max="'+t+'" value="'+t+'"></div><div class="field"><span>Category</span><select id="pc-cat">'+opts(PC_CATS)+'</select></div><div class="field"><span>What for</span><input id="pc-desc" type="text" maxlength="80" placeholder="Example: Tea and snacks"></div><div class="field"><span>Amount ₹</span><input id="pc-amt" type="number" min="1" step="any"></div><div class="field"><span>Paid to</span><input id="pc-to" type="text" maxlength="50" placeholder="Optional"></div><button class="btn primary" data-act="pcAdd">Add entry</button></div></div>';
  var keys=Object.keys(cats).sort(function(a,b){return cats[b]-cats[a]}),mx=Math.max.apply(null,keys.map(function(k){return cats[k]}).concat([1]));
  var cat='<div class="card"><h3 style="margin-bottom:12px">Where the money went this month</h3>'+(keys.length?'<div style="display:grid;gap:12px">'+keys.map(function(k){return '<div><div class="head-row" style="margin:0"><span>'+esc(k)+'</span><span class="mono">'+inr(cats[k])+'</span></div><div class="bar" style="width:'+Math.round(cats[k]/mx*100)+'%"></div></div>'}).join('')+'</div>':'<p class="muted" style="margin:0">No spending yet.</p>')+'</div>';
  var dates=P.entries.map(function(e){return e.date}).filter(function(d,i,a){return a.indexOf(d)===i}).sort().reverse();
  var ledger='<div class="card"><h3 style="margin-bottom:8px">Daily ledger</h3><p class="small muted" style="margin:0 0 6px">Every field below can be changed: what for, type, amount, category, paid to and date. Balances update at once.</p>'+dates.map(function(d){
    var es=P.entries.filter(function(e){return e.date===d}).sort(function(a,b){return b.id-a.id}),sp=es.filter(function(e){return e.type==='out'}).reduce(function(a,e){return a+e.amt},0);
    return '<div class="day"><b>'+fd(d)+(d===t?' (today)':'')+'</b><span class="small muted">Spent <b class="mono">'+inr(sp)+'</b> · Closing balance <b class="mono">'+inr(pcBal(d))+'</b></span></div>'+es.map(function(e){
      var cl=PCX.indexOf(e.cat)<0?PCX.concat([e.cat]):PCX;
      return '<div class="pcrow"><div class="field pcw"><span>What for</span><input type="text" maxlength="80" value="'+esc(e.desc)+'" data-chg="pcDesc" data-id="'+e.id+'"></div>'+
       '<div class="field"><span>Type</span><select data-chg="pcTyp" data-id="'+e.id+'"><option value="out"'+(e.type==='out'?' selected':'')+'>Spent</option><option value="in"'+(e.type==='in'?' selected':'')+'>Cash added</option></select></div>'+
       '<div class="field"><span>Amount ₹</span><input type="number" min="1" step="any" value="'+e.amt+'" data-chg="pcAmt" data-id="'+e.id+'"></div>'+
       '<div class="field"><span>Category</span><select data-chg="pcCat" data-id="'+e.id+'">'+opts(cl,e.cat)+'</select></div>'+
       '<div class="field"><span>Paid to</span><input type="text" maxlength="50" value="'+esc(e.to||'')+'" data-chg="pcTo" data-id="'+e.id+'"></div>'+
       '<div class="field"><span>Date</span><input type="date" min="'+P.openDate+'" max="'+t+'" value="'+e.date+'" data-chg="pcDate" data-id="'+e.id+'"></div>'+
       '<div class="pcx">'+(S.confirmPc===e.id?'<span class="small">Delete?</span><button class="btn sm no" data-act="pcDel" data-id="'+e.id+'">Yes</button><button class="btn sm" data-act="pcDelNo">No</button>':'<button class="btn sm ghost no" data-act="pcAskDel" data-id="'+e.id+'" aria-label="Delete entry">'+ic('trash',13)+' Delete</button>')+'</div></div>';
    }).join('');
  }).join('')+'</div>';
  return '<div class="stack">'+tiles+editBox+alertBox+'<div class="cols"><div class="stack">'+form+ledger+'</div>'+cat+'</div></div>';
}

/* ---- monthly report: editable cells, 1.5 days etc ---- */
function adminReport(){
  var ym=S.month,y=+ym.slice(0,4),m=+ym.slice(5,7),dim=new Date(y,m,0).getDate(),t=todayStr(),d,WD=['S','M','T','W','T','F','S'];
  var th='<th>Employee</th>';
  for(d=1;d<=dim;d++){
    var ds=ym+'-'+pad(d),dow=new Date(y,m-1,d).getDay();
    if(dow===0)th+='<th class="sun">'+d+'<small>'+WD[dow]+'</small><button data-act="sunTog" data-d="'+ds+'" aria-label="Toggle Sunday off for '+ds+'">'+(sunOff(ds)?'OFF':'WORK')+'</button></th>';
    else th+='<th>'+d+'<small>'+WD[dow]+'</small></th>';
  }
  th+='<th>P</th><th>H</th><th>D</th><th>Other</th><th>L</th><th>A</th><th>Days</th>';
  var rows=repEmps(ym).map(function(e){
    var p=0,h=0,dd=0,o=0,l=0,a=0,u=0,tds='<td><button class="lnk" data-act="openEmp" data-id="'+e.id+'">'+avatar(e,null,28,1)+'<span>'+esc(e.name)+'</span></button></td>';
    for(d=1;d<=dim;d++){
      var ds2=ym+'-'+pad(d),rec=S.records.filter(function(r){return r.emp===e.id&&r.date===ds2&&r.outMin!=null})[0],c='',ch='';
      if(rec){var k=DT[rec.dt||'full'].k,un=unitsOf(rec);u+=un;c=k;ch=k==='C'?num(un):k;if(k==='P')p++;else if(k==='H')h++;else if(k==='D')dd++;else o++}
      else if(onLeave(e.id,ds2)){c=ch='L';l++}
      else if(sunOff(ds2)){c=ch='S'}
      else if(ds2>=t){c='';ch=''}
      else{c=ch='A';a++}
      tds+='<td class="'+c+(S.cell&&S.cell.e===e.id&&S.cell.d===ds2?' sel':'')+'" data-act="cell" data-e="'+e.id+'" data-d="'+ds2+'" title="Click to edit">'+ch+'</td>';
    }
    return '<tr>'+tds+'<td class="tot">'+p+'</td><td class="tot">'+h+'</td><td class="tot">'+dd+'</td><td class="tot">'+o+'</td><td class="tot">'+l+'</td><td class="tot">'+a+'</td><td class="tot">'+num(u)+'</td></tr>';
  }).join('');
  var wk=[1,2,3,4,5].map(function(n){return '<button data-act="sunWk" data-v="'+n+'" class="'+(S.sunWeeks.indexOf(n)>=0?'on':'')+'">'+n+['st','nd','rd','th','th'][n-1]+'</button>'}).join('');
  var pol='<div class="head-row" style="margin-bottom:14px"><div><b>Sunday off policy</b><div class="small muted">Sundays marked off are not counted absent. Click a Sunday header to change one date.</div></div><div class="seg" role="group" aria-label="Sundays off">'+wk+'</div></div>';
  var panel='';
  if(S.cell){
    var ce=emp(S.cell.e),cd=S.cell.d,rc=S.records.filter(function(r){return r.emp===ce.id&&r.date===cd})[0],cu=rc?unitsOf(rc):1;
    panel='<div class="cellpanel"><div class="head-row"><div><b>Edit attendance · '+esc(ce.name)+'</b><div class="small muted">'+fd(cd)+(rc?' · currently '+dayLabel(rc)+', '+H(rc.hours):' · no attendance recorded')+'</div></div><button class="btn sm ghost" data-act="cellCancel">Close</button></div>'+
      '<div class="rowform"><div class="field"><span>Days worked</span><input id="ce-days" type="number" min="0" max="3" step="0.25" value="'+cu+'"></div><div class="field"><span>Quick pick</span><div class="seg" role="group">'+[0.5,1,1.5,2,2.5].map(function(x){return '<button data-act="cePick" data-v="'+x+'">'+x+'</button>'}).join('')+'</div></div><div class="field"><span>Paid hours</span><input id="ce-hours" type="number" min="0" max="24" step="0.25" value="'+(rc?rc.hours:8)+'"></div></div>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn primary" data-act="cellSave">Save</button><button class="btn" data-act="cellAbsent">Mark absent</button><button class="btn" data-act="cellLeave">Mark leave</button></div><p class="small muted" style="margin:10px 0 0">Salary uses the paid hours × hourly rate. An edit by the admin is approved straight away.</p></div>';
  }
  return '<div class="card"><div class="head-row"><div><h3>Monthly attendance report</h3><span class="small muted">'+ml(ym)+' · Avya Woodcraft LLP · click any day to edit</span></div>'+monthSwitch('month',ym)+'</div>'+pol+panel+'<div class="scroll"><table class="mx"><thead><tr>'+th+'</tr></thead><tbody>'+rows+'</tbody></table></div>'+
   '<div class="legend"><span><b class="P">P</b>Full day</span><span><b class="H">H</b>Half day (0.5)</span><span><b class="D">D</b>Double shift (2)</span><span><b class="C">1.5</b>Any other count</span><span><b class="L">L</b>Leave</span><span><b class="A">A</b>Absent</span><span><b class="S">S</b>Sunday off</span></div></div>';
}
function unitsToDt(u){return u===1?'full':u===.5?'half':u===2?'double':'custom'}

/* ---- handlers ---- */
function bizClick(a,b){
  var id=+b.dataset.id,v=b.dataset.v,p;
  if(a==='pickProd'){S.photoTarget={k:'prod',id:id};$('#photoFile').click();return true}
  if(a==='pickInv'){S.photoTarget={k:'inv',id:id};$('#photoFile').click();return true}
  if(a==='askProdDel'){S.confirmProd=id;render();return true}
  if(a==='cancelProdDel'){S.confirmProd=null;render();return true}
  if(a==='doProdDel'){if(S.products.length<2){toast('Keep at least one product.',1);S.confirmProd=null;render();return true}S.products=S.products.filter(function(x){return x.id!==id});S.pid=S.products[0].id;S.confirmProd=null;toast('Product deleted.');render();return true}
  if(a==='askInvDel'){S.confirmInv=id;render();return true}
  if(a==='cancelInvDel'){S.confirmInv=null;render();return true}
  if(a==='doInvDel'){S.inv=S.inv.filter(function(x){return x.id!==id});S.confirmInv=null;toast('Item deleted.');render();return true}
  if(a==='reqDel'){S.reqs=S.reqs.filter(function(x){return x.id!==id});toast('Request deleted.');render();return true}
  if(a==='admDelWork'){S.work=S.work.filter(function(x){return x.id!==id});toast('Work entry deleted.');render();return true}
  if(a==='leaveDel'){S.leaves=S.leaves.filter(function(x){return x.id!==id});toast('Leave record deleted.');render();return true}
  if(a==='cell'){S.cell={e:+b.dataset.e,d:b.dataset.d};render();var pn=$('.cellpanel');if(pn&&pn.scrollIntoView)pn.scrollIntoView({block:'nearest'});return true}
  if(a==='cellCancel'){S.cell=null;render();return true}
  if(a==='cePick'){$('#ce-days').value=v;$('#ce-hours').value=Math.round(parseFloat(v)*8*4)/4;return true}
  if(a==='cellAbsent'||a==='cellLeave'){
    var c=S.cell;S.records=S.records.filter(function(r){return !(r.emp===c.e&&r.date===c.d)});
    if(a==='cellLeave')S.leaves.push({id:Date.now(),emp:c.e,type:'Casual',from:c.d,to:c.d,reason:'Set by admin',status:'approved'});
    else S.leaves=S.leaves.filter(function(l){return !(l.emp===c.e&&l.from===c.d&&l.to===c.d)});
    S.cell=null;toast(a==='cellLeave'?'Marked as leave.':'Marked absent.');render();return true}
  if(a==='cellSave'){
    var c2=S.cell,days=parseFloat($('#ce-days').value),hrs=parseFloat($('#ce-hours').value);
    if(isNaN(days)||days<0||days>3){toast('Days must be between 0 and 3.',1);return true}
    if(isNaN(hrs)||hrs<0||hrs>24){toast('Hours must be between 0 and 24.',1);return true}
    if(days===0){S.records=S.records.filter(function(r){return !(r.emp===c2.e&&r.date===c2.d)});S.cell=null;toast('Marked absent.');render();return true}
    S.leaves=S.leaves.filter(function(l){return !(l.emp===c2.e&&l.from===c2.d&&l.to===c2.d&&l.reason==='Set by admin')});
    var rc=S.records.filter(function(r){return r.emp===c2.e&&r.date===c2.d})[0],dt=unitsToDt(days);
    if(!rc){rc={id:S.nextId++,emp:c2.e,date:c2.d,inMin:540,outMin:540,hours:0,dt:'full',units:null,approved:true,dist:0,selfie:null};S.records.push(rc)}
    rc.hours=hrs;rc.dt=dt;rc.units=dt==='custom'?days:null;rc.approved=true;if(rc.outMin==null||rc.outMin<=rc.inMin)rc.outMin=rc.inMin+Math.round(hrs*60)+(hrs>5?60:0);
    S.cell=null;toast('Saved '+num(days)+' day'+(days===1?'':'s')+' · '+H(hrs)+'.');render();return true}
  if(a==='addProd'){var nm=$('#np-name').value.trim();if(!nm){toast('Enter the product name.',1);return true}p={id:S.nextProd++,name:nm,price:0,lines:[],img:null};S.products.push(p);S.pid=p.id;toast('Product added. Now add its material and labour.');render();return true}
  return bizClick0(a,b);
}
function bizChange(el){
  var k=el.dataset.chg,val=parseFloat(el.value),id=+el.dataset.id,txt=el.value.trim(),p,l;
  function ok(){toast('Saved.');render();return true}
  if(k==='pName'){if(!txt){toast('Name cannot be empty.',1);render();return true}curProd().name=txt;return ok()}
  if(k==='lineName'||k==='lineUnit'){p=curProd();l=p.lines.filter(function(x){return x.id===+el.dataset.lid})[0];if(!txt){toast('This cannot be empty.',1);render();return true}l[k==='lineName'?'name':'unit']=txt;
    if(k==='lineName'&&l.kind==='material'){var m=invByName(txt);if(m){l.rate=m.rate;l.unit=m.unit}}return ok()}
  if(k==='invf'){var it=S.inv.filter(function(x){return x.id===id})[0],f=el.dataset.k;
    if(f==='name'){if(!txt){toast('Name cannot be empty.',1);render();return true}it.name=txt}
    else{if(isNaN(val)||val<0){toast('Enter a number, 0 or more.',1);render();return true}it[f]=val}return ok()}
  if(k==='pcDesc'){var e1=S.petty.entries.filter(function(x){return x.id===id})[0];if(!txt){toast('Write what the money was for.',1);render();return true}e1.desc=txt;return ok()}
  if(k==='pcAmt'){var e2=S.petty.entries.filter(function(x){return x.id===id})[0];if(isNaN(val)||val<=0){toast('Enter an amount above 0.',1);render();return true}e2.amt=val;return ok()}
  if(k==='pcTyp'||k==='pcCat'||k==='pcTo'||k==='pcDate'){var e3=S.petty.entries.filter(function(x){return x.id===id})[0];if(!e3)return true;
    if(k==='pcTyp')e3.type=el.value==='in'?'in':'out';
    else if(k==='pcCat')e3.cat=el.value;
    else if(k==='pcTo')e3.to=txt;
    else{var dv=el.value;if(!dv||dv>todayStr()||dv<S.petty.openDate){toast('Choose a date from '+fd(S.petty.openDate)+' up to today.',1);render();return true}e3.date=dv}
    return ok()}
  if(k==='hrH'||k==='hrR'){var hp=curProd();hp.hrs=hp.hrs||{};var hk=el.dataset.e,ho=hp.hrs[hk]=(hp.hrs[hk]&&!hp.hrs[hk].x)?hp.hrs[hk]:{};
    if(el.value===''){delete ho[k==='hrH'?'h':'r']}
    else{if(isNaN(val)||val<0){toast('Enter a number, 0 or more.',1);render();return true}ho[k==='hrH'?'h':'r']=val}
    if(ho.h==null&&ho.r==null)delete hp.hrs[hk];return ok()}
  if(k==='hrAdd'){if(!el.value)return true;var hp2=curProd();hp2.hrs=hp2.hrs||{};hp2.hrs[el.value]={h:0};return ok()}
  if(k==='wh'){var w=S.work.filter(function(x){return x.id===id})[0];if(isNaN(val)||val<=0||val>12){toast('Hours must be between 0.25 and 12.',1);render();return true}w.hours=Math.round(val*4)/4;return ok()}
  if(k==='ename'||k==='erole'){var em=emp(id);if(!txt){toast('This cannot be empty.',1);render();return true}em[k==='ename'?'name':'role']=txt;if(k==='erole')em.mgr=/Manager/.test(txt);return ok()}
  return bizChange0(el);
}

/* ===== real-data layer: past months, advances, production tracking, backup ===== */
IC.gantt='<path d="M4 6h9M8 12h12M4 18h8"/>';
IC.db='<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>';
IC.adv='<path d="M12 3v18M17 7H9.5a2.5 2.5 0 000 5h5a2.5 2.5 0 010 5H7"/>';
NAV[0][1].splice(2,0,['production','Production','gantt']);
NAV[1][1].splice(2,0,['advances','Advances','adv']);
NAV.push(['Settings',[['data','Data & backup','db']]]);
TITLES.production=['Production tracking','Live status, people and timeline of every item being made'];
TITLES.advances=['Advances','Money given to employees and deducted from salary'];
TITLES.profile=['Employee file','Full record, edit any past month, advances and net pay'];
TITLES.data=['Data & backup','Enter real data, export a backup, start fresh'];
var MIN_MONTH='2025-01';
function curMonth(){return todayStr().slice(0,7)}
function dd(a,b){return Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/864e5)}
function sdate(s){return new Date(s+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
function dim(ym){return new Date(+ym.slice(0,4),+ym.slice(5,7),0).getDate()}

/* ---------- advances ---------- */
function advPaid(a){var t=0;for(var k in a.ded)t+=a.ded[k]||0;return t}
function advBal(a){return a.amt-advPaid(a)}
function outstanding(eid){return S.advances.filter(function(a){return a.emp===eid}).reduce(function(s,a){return s+advBal(a)},0)}
function dedFor(eid,ym){return S.advances.filter(function(a){return a.emp===eid}).reduce(function(s,a){return s+(a.ded[ym]||0)},0)}
function setDed(eid,ym,total){
  var list=S.advances.filter(function(a){return a.emp===eid}).sort(function(a,b){return a.date.localeCompare(b.date)||a.id-b.id});
  list.forEach(function(a){delete a.ded[ym]});
  var rem=total;
  list.forEach(function(a){var take=Math.min(advBal(a),rem);if(take>0){a.ded[ym]=take;rem-=take}});
  return total-rem;
}
function seedAdv(){
  var T=todayStr(),m=T.slice(0,7);
  S.advances=[{id:1,emp:5,date:addDays(T,-24),amt:5000,note:'Family medical need',ded:{'2026-10':2000}},
   {id:2,emp:7,date:addDays(T,-10),amt:3000,note:'Rent advance',ded:{}},
   {id:3,emp:14,date:addDays(T,-3),amt:2000,note:'Festival advance',ded:{}}];
  S.nextAdv=4;
}

/* ---------- salary and employee pay ---------- */
function adminSalary(){
  var ym=S.month,rows=repEmps(ym).map(function(e){var s=stats(e.id,ym),k=e.id+':'+ym,ov=(S.salGross||{})[k],g=ov==null?s.ap*e.rate:ov,d=dedFor(e.id,ym);return {e:e,s:s,g:g,d:d,net:g-d,ob:outstanding(e.id),fixed:ov!=null}});
  var tg=0,td=0,tn=0,ta=0,tpe=0,tu=0,to=0;
  var body=rows.map(function(r){tg+=r.g;td+=r.d;tn+=r.net;ta+=r.s.ap;tpe+=r.s.pe;tu+=r.s.units;to+=r.ob;
    return '<tr><td><button class="lnk" data-act="openEmp" data-id="'+r.e.id+'">'+avatar(r.e,null,34,1)+'<span><b>'+esc(r.e.name)+'</b><br><small class="muted">'+esc(r.e.role)+(r.e.active?'':' · removed')+'</small></span></button></td><td class="r mono">'+num(r.s.units)+'</td><td class="r mono">'+r.s.ap.toFixed(2)+(r.s.pe?'<br><small style="color:var(--warn)">+'+r.s.pe.toFixed(2)+' pending</small>':'')+'</td><td class="r"><input class="sm" type="number" min="0" step="5" value="'+r.e.rate+'" data-chg="rate" data-id="'+r.e.id+'" aria-label="Hourly rate for '+esc(r.e.name)+'"></td><td class="r"><input class="sm" type="number" min="0" step="100" value="'+r.g+'" data-chg="salGross" data-e="'+r.e.id+'" data-m="'+ym+'" aria-label="Gross pay for '+esc(r.e.name)+'" title="'+(r.fixed?'Typed by you. Press auto to go back to hours x rate.':'Hours x rate')+'">'+(r.fixed?'<button class="lnk" data-act="salAuto" data-e="'+r.e.id+'" data-m="'+ym+'" aria-label="Use hours x rate for '+esc(r.e.name)+'">auto</button>':'<small class="muted" style="display:block">auto</small>')+'</td><td class="r mono'+(r.ob>0?' neg':'')+'">'+inr(r.ob)+'</td><td class="r"><input class="sm" type="number" min="0" step="100" value="'+r.d+'" data-chg="salDed" data-e="'+r.e.id+'" aria-label="Advance to deduct from '+esc(r.e.name)+'"></td><td class="r"><b class="mono">'+inr(r.net)+'</b></td></tr>';
  }).join('');
  return '<div class="card"><div class="head-row"><div><h3>Monthly salary report</h3><span class="small muted">Net pay = approved hours × hourly rate − advance deducted</span></div>'+monthSwitch('month',ym)+'</div><div class="scroll"><table><thead><tr><th>Employee</th><th class="r">Days</th><th class="r">Approved h</th><th class="r">Rate</th><th class="r">Gross</th><th class="r">Advance balance</th><th class="r">Deduct this month ₹</th><th class="r">Net pay</th></tr></thead><tbody>'+body+'</tbody><tfoot><tr><td>Total</td><td class="r mono">'+num(tu)+'</td><td class="r mono">'+ta.toFixed(2)+'</td><td></td><td class="r mono">'+inr(tg)+'</td><td class="r mono">'+inr(to)+'</td><td class="r mono">'+inr(td)+'</td><td class="r mono">'+inr(tn)+'</td></tr></tfoot></table></div>'+
   '<p class="small muted" style="margin:12px 0 0">Click a name to open the full file. Days counts a full day as 1, half as 0.5, double shift as 2.'+(tpe>0?' '+tpe.toFixed(2)+' hours are still unapproved and are not in gross pay.':'')+'</p></div>';
}
function payCard(){
  var e=emp(S.uid),st=stats(S.uid,S.emonth),ov=(S.salGross||{})[S.uid+':'+S.emonth],g=ov==null?st.ap*e.rate:ov,d=dedFor(S.uid,S.emonth),ob=outstanding(S.uid);
  var adv=(ob>0||d>0)?'<div class="advbox"><div><span class="cap">Advance balance</span><b class="mono">'+inr(ob)+'</b></div><div><span class="cap">Deducted this month</span><b class="mono">'+inr(d)+'</b></div></div>':'';
  return '<div class="card"><div class="head-row"><h3>Pay estimate</h3>'+monthSwitch('emonth',S.emonth)+'</div><div class="pay"><div><span class="cap">Net payable for '+ml(S.emonth)+'</span><div class="big num">'+inr(g-d)+'</div></div><div class="formula">'+(ov==null?H(st.ap)+' approved × '+inr(e.rate):'Gross set by admin')+(d?' − '+inr(d)+' advance':'')+'</div></div>'+adv+
   '<p class="small muted" style="margin:10px 0 0">'+num(st.units)+' day'+(st.units===1?'':'s')+' counted ('+st.half+' half, '+st.dbl+' double shift). '+(st.pe>0?H(st.pe)+' still waiting for admin approval ('+inr(st.pe*e.rate)+').':'No hours waiting for approval.')+'</p></div>';
}
function adminAdvances(){
  var all=S.advances.slice().sort(function(a,b){return b.date.localeCompare(a.date)||b.id-a.id}),given=0,bal=0,who={};
  all.forEach(function(a){given+=a.amt;bal+=advBal(a);if(advBal(a)>0)who[a.emp]=1});
  var tiles='<div class="tiles">'+tile('adv','Total given',inr(given),'var(--primary)')+tile('wallet','Still to recover',inr(bal),'var(--warn)')+tile('users','Employees with balance',Object.keys(who).length,'var(--accent)')+'</div>';
  var form='<div class="card"><h3 style="margin-bottom:12px">Give an advance</h3><div class="rowform"><div class="field"><span>Employee</span><select id="ad-emp">'+A().map(function(e){return '<option value="'+e.id+'">'+esc(e.name)+'</option>'}).join('')+'</select></div><div class="field"><span>Date</span><input id="ad-date" type="date" value="'+todayStr()+'"></div><div class="field"><span>Amount ₹</span><input id="ad-amt" type="number" min="1" step="100"></div><div class="field"><span>Note</span><input id="ad-note" type="text" maxlength="80" placeholder="Optional"></div><label class="small" style="display:flex;gap:8px;align-items:center;padding-bottom:10px"><input type="checkbox" id="ad-petty" style="width:auto"> Also take from petty cash</label><button class="btn primary" data-act="advAdd">Save advance</button></div></div>';
  var rows=all.map(function(a){var e=emp(a.emp);
    return '<tr><td><button class="lnk" data-act="openEmp" data-id="'+e.id+'">'+avatar(e,null,32,1)+'<span>'+esc(e.name)+'</span></button></td><td>'+fd(a.date)+'</td><td class="r"><input class="sm" type="number" min="1" step="100" value="'+a.amt+'" data-chg="advAmt" data-id="'+a.id+'" aria-label="Amount"></td><td class="r mono">'+inr(advPaid(a))+'</td><td class="r mono '+(advBal(a)>0?'neg':'pos')+'">'+inr(advBal(a))+'</td><td><input class="nm" type="text" maxlength="80" value="'+esc(a.note)+'" data-chg="advNote" data-id="'+a.id+'" aria-label="Note"></td><td class="r"><button class="btn sm ghost no" data-act="advDel" data-id="'+a.id+'" aria-label="Delete advance">'+ic('trash',13)+'</button></td></tr>';
  }).join('')||'<tr><td colspan="7" class="muted">No advances yet.</td></tr>';
  return '<div class="stack">'+tiles+form+'<div class="card"><h3 style="margin-bottom:8px">All advances</h3><div class="scroll"><table><thead><tr><th>Employee</th><th>Date</th><th class="r">Amount ₹</th><th class="r">Deducted</th><th class="r">Balance</th><th>Note</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div><p class="small muted" style="margin:12px 0 0">Set how much to cut from a month in Salary, or in the employee file. Deductions are applied to the oldest advance first.</p></div></div>';
}

/* ---------- employee file ---------- */
function setDay(eid,ds,days,hours){
  var rc=S.records.filter(function(r){return r.emp===eid&&r.date===ds})[0];
  if(!(days>0)){S.records=S.records.filter(function(r){return r!==rc});return}
  var dt=unitsToDt(days);
  if(!rc){rc={id:S.nextId++,emp:eid,date:ds,inMin:540,outMin:540,hours:0,dt:'full',units:null,approved:true,dist:0,selfie:null};S.records.push(rc);if(hours==null)hours=Math.round(days*8*4)/4}
  else if(hours==null&&Math.abs(rc.hours-unitsOf(rc)*8)<.01)hours=Math.round(days*8*4)/4;
  if(hours!=null)rc.hours=hours;
  rc.dt=dt;rc.units=dt==='custom'?days:null;rc.approved=true;rc.outMin=rc.inMin+Math.round(rc.hours*60)+(rc.hours>5?60:0);
  S.leaves=S.leaves.filter(function(l){return !(l.emp===eid&&l.from===ds&&l.to===ds&&l.reason==='Set by admin')});
}
function adminProfile(){
  var e=emp(S.profEmp);if(!e){return '<div class="card"><p class="muted">Pick an employee from the Employees page.</p></div>'}
  var ym=S.pm=S.pm||curMonth(),st=stats(e.id,ym),g=st.ap*e.rate,d=dedFor(e.id,ym),ob=outstanding(e.id),n=dim(ym),t=todayStr(),WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var head='<div class="card hero-card"><div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">'+avatar(e,null,72,1)+'<div class="grow"><h2>'+esc(e.name)+'</h2><div class="muted">'+esc(e.role)+' · '+tm(e.team).name+' · <span class="mono">'+e.code+'</span></div><div style="margin-top:6px">'+tchip(e.team)+(e.lead?' <span class="lead">LEAD</span>':'')+(e.active?'':' '+chip('Removed','bad'))+'</div></div><div class="field" style="margin:0;width:140px"><span>Hourly rate ₹</span><input type="number" min="0" step="5" value="'+e.rate+'" data-chg="rate" data-id="'+e.id+'"></div><button class="btn" data-act="tab" data-v="employees">‹ All employees</button></div></div>';
  var tiles='<div class="tiles">'+tile('cal','Days counted',num(st.units),'var(--primary)')+tile('clock','Approved hours',st.ap.toFixed(2),'var(--accent)')+tile('rupee','Gross pay',inr(g),'var(--good)')+tile('adv','Advance deducted',inr(d),'var(--warn)')+tile('wallet','Net pay',inr(g-d),'var(--good)')+'</div>';
  var rows='';
  for(var i=1;i<=n;i++){
    var ds=ym+'-'+pad(i),rc=S.records.filter(function(r){return r.emp===e.id&&r.date===ds})[0],dow=new Date(ds+'T00:00:00').getDay(),stt;
    if(rc)stt=chip(dayLabel(rc),rc.dt==='full'?'good':'info')+(rc.approved?'':' '+chip('Pending','warn'));
    else if(onLeave(e.id,ds))stt=chip('Leave','warn');
    else if(sunOff(ds))stt=chip('Sunday off','');
    else stt=ds>t?'<span class="muted small">Upcoming</span>':chip('Absent','bad');
    rows+='<tr><td><b>'+pad(i)+'</b> <span class="muted small">'+WD[dow]+'</span></td><td>'+stt+'</td><td class="r"><input class="sm" type="number" min="0" max="3" step="0.25" value="'+(rc?unitsOf(rc):'')+'" placeholder="0" data-chg="pdDays" data-e="'+e.id+'" data-d="'+ds+'" aria-label="Days on '+ds+'"></td><td class="r"><input class="sm" type="number" min="0" max="24" step="0.25" value="'+(rc?rc.hours:'')+'" placeholder="0" data-chg="pdHours" data-e="'+e.id+'" data-d="'+ds+'" aria-label="Hours on '+ds+'"></td></tr>';
  }
  var days='<div class="card"><div class="head-row"><div><h3>Daily record</h3><span class="small muted">Type days worked (0.5, 1, 1.5, 2 …) and paid hours. Clear the days to mark absent.</span></div>'+monthSwitch('pm',ym)+'</div><div class="scroll"><table class="boq"><thead><tr><th>Date</th><th>Status</th><th class="r">Days</th><th class="r">Paid hours</th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
  var mine=S.advances.filter(function(a){return a.emp===e.id}).sort(function(a,b){return b.date.localeCompare(a.date)});
  var adv='<div class="card"><div class="head-row"><div><h3>Advances</h3><span class="small muted">Outstanding balance <b class="mono '+(ob>0?'neg':'')+'">'+inr(ob)+'</b></span></div></div>'+
    '<div class="rowform" style="margin-bottom:14px"><div class="field"><span>Deduct from '+ml(ym)+' salary ₹</span><input type="number" min="0" step="100" value="'+d+'" data-chg="profDed" data-e="'+e.id+'"></div><button class="btn" data-act="profDedAll" data-e="'+e.id+'">Deduct full balance</button></div>'+
    (mine.length?mine.map(function(a){return '<div class="logrow"><div class="grow"><b>'+inr(a.amt)+'</b> · '+fd(a.date)+'<br><span class="small muted">'+esc(a.note||'No note')+' · deducted '+inr(advPaid(a))+' · balance '+inr(advBal(a))+'</span></div><button class="btn sm ghost no" data-act="advDel" data-id="'+a.id+'" aria-label="Delete advance">'+ic('trash',13)+'</button></div>'}).join(''):'<p class="muted" style="margin:0 0 10px">No advances taken.</p>')+
    '<div class="rowform" style="margin-top:12px"><div class="field"><span>New advance ₹</span><input id="pa-amt" type="number" min="1" step="100"></div><div class="field"><span>Date</span><input id="pa-date" type="date" value="'+t+'"></div><div class="field"><span>Note</span><input id="pa-note" type="text" maxlength="80"></div><button class="btn primary" data-act="profAdv" data-e="'+e.id+'">Add advance</button></div></div>';
  return '<div class="stack">'+head+tiles+'<div class="cols"><div class="stack">'+days+'</div><div class="stack">'+adv+'</div></div></div>';
}

/* ---------- production tracking ---------- */
var STAGE_T=[['Cutting & planing',2],['Joinery',3],['Carving',2],['Sanding',2],['Polishing',3],['Assembly',1],['Packing',1]];
function orderLabels(){return S.orders?S.orders.filter(function(o){return ordInfo(o).st!=='done'&&ordInfo(o).st!=='late-done'}).map(function(o){return o.label}):ITEMS}
function ordInfo(o){
  var T=todayStr(),total=0,doneD=0,rem=0,all=o.stages.length>0,last=null;
  var first=true;
  o.stages.forEach(function(s){total+=s.days;if(s.done){doneD+=s.days;if(!last||s.done>last)last=s.done}else{var r=s.days;if(first&&s.start&&s.start<=T){r=Math.max(0,s.days-dd(s.start,T))}first=false;rem+=r;all=false}});
  var pe=addDays(o.start,Math.ceil(total)),started=o.start<=T||o.stages.some(function(s){return s.start||s.done}),base=T<o.start?o.start:T,fe=all?last:addDays(base,Math.ceil(rem)),delay=Math.max(0,dd(pe,fe));
  var st=all?(delay>0?'late-done':'done'):!started?'planned':delay>0?'delayed':'ontrack';
  return {total:total,pe:pe,fe:fe,delay:delay,st:st,pct:total?Math.round(doneD/total*100):0,started:started,all:all,doneAt:all?last:null,elapsed:started?dd(o.start,all?last:T)+(all?0:1):0};
}
function ordChip(i){return {ontrack:chip('On track','good'),delayed:chip('Delayed +'+i.delay+' day'+(i.delay>1?'s':''),'bad'),done:chip('Completed on time','good'),'late-done':chip('Completed '+i.delay+' day'+(i.delay>1?'s':'')+' late','warn'),planned:chip('Not started','')}[i.st]}
function ordWork(o){return S.work.filter(function(w){return w.item===o.label})}
function todayWorkers(o){var t=todayStr(),m={};ordWork(o).forEach(function(w){if(w.date===t){m[w.emp]=(m[w.emp]||0)+w.hours}});return m}
function seedOrders(){
  var T=todayStr(),id=1;
  function mk(label,cust,qty,off,days,doneN,slipAt,slip){
    var o={id:id++,label:label,customer:cust,qty:qty,start:addDays(T,off),stages:[]},cum=0;
    days.forEach(function(d,i){var dur=d+(i===slipAt?slip:0),s={id:i+1,name:STAGE_T[i][0],days:d,start:null,done:null,assigned:[]},sd=addDays(o.start,cum);
      if(i<doneN){s.start=sd;s.done=addDays(o.start,cum+dur)}else if(i===doneN&&sd<=T&&doneN>0)s.start=sd;
      cum+=dur;o.stages.push(s)});
    return o;
  }
  S.orders=[mk(ITEMS[0],'Mr. Reddy',1,-12,[2,3,2,2,3,1,1],4,-1,0),mk(ITEMS[1],'Sunrise Interiors',6,-9,[1,2,1,1,2,1,1],5,1,1),mk(ITEMS[2],'Mr. Khan',1,-20,[2,4,3,3,3,2,1],7,2,1),mk(ITEMS[3],'Mrs. Iyer',2,-3,[2,3,3,2,2,1,1],1,-1,0),mk(ITEMS[4],'Gupta Home',1,2,[2,3,2,2,2,1,1],0,-1,0)];
  S.orders[0].stages[4].assigned=[12,13];S.orders[1].stages[5].assigned=[5,6];S.orders[3].stages[1].assigned=[1,7];
  S.nextOrd=id;
}
function gantt(rows,lo,hi){
  var N=Math.max(1,dd(lo,hi)),T=todayStr(),pc=function(d){return Math.max(0,Math.min(100,dd(lo,d)/N*100))},step=Math.max(1,Math.ceil(N/8)),ax='',i;
  for(i=0;i<=N;i+=step)ax+='<span style="left:'+(i/N*100)+'%">'+sdate(addDays(lo,i))+'</span>';
  var tl=(T>=lo&&T<=hi)?'<i class="gtoday" style="left:'+pc(T)+'%"></i>':'';
  var bar=function(cls,a,b){return a&&b?'<i class="'+cls+'" style="left:'+pc(a)+'%;width:'+Math.max(.8,pc(b)-pc(a))+'%"></i>':''};
  return '<div class="scroll"><div class="gantt"><div class="gax">'+ax+'</div>'+rows.map(function(r){
    return '<div class="gr"><div class="gl">'+r.label+'</div><div class="gt">'+bar('gp',r.pS,r.pE)+bar('ga '+(r.state||''),r.aS,r.aE)+bar('gf',r.fS,r.fE)+tl+'</div></div>';
  }).join('')+'</div></div><div class="legend"><span><i class="sw" style="background:color-mix(in srgb,var(--accent) 35%,transparent)"></i>Planned</span><span><i class="sw" style="background:var(--accent)"></i>Actual so far</span><span><i class="sw" style="background:var(--good)"></i>Done on time</span><span><i class="sw" style="background:var(--bad)"></i>Late</span><span><i class="sw" style="background:repeating-linear-gradient(45deg,var(--bad) 0 3px,transparent 3px 6px)"></i>Expected extra time</span><span><i class="sw" style="background:var(--bad);width:3px"></i>Today</span></div>';
}
function orderRow(o){
  var i=ordInfo(o),T=todayStr(),aE=i.all?i.doneAt:(i.started?T:null);
  return {label:'<b>'+esc(o.label)+'</b>',pS:o.start,pE:i.pe,aS:i.started?o.start:null,aE:aE,state:i.st==='done'?'done':i.delay>0?'late':'',fS:(!i.all&&i.delay>0)?i.pe:null,fE:(!i.all&&i.delay>0)?i.fe:null};
}
function adminProduction(){
  var T=todayStr(),act=S.orders.filter(function(o){var s=ordInfo(o).st;return s==='ontrack'||s==='delayed'||s==='planned'}),del=act.filter(function(o){return ordInfo(o).st==='delayed'}).length;
  var hereN=A().filter(function(e){return !!todayRec(e.id)}).length,workers={};
  S.orders.forEach(function(o){var w=todayWorkers(o);for(var k in w)workers[k]=1});
  var tiles='<div class="tiles">'+tile('tag','Active items',act.length,'var(--primary)')+tile('check','On track',act.length-del-act.filter(function(o){return ordInfo(o).st==='planned'}).length,'var(--good)')+tile('clock','Delayed',del,'var(--bad)')+tile('users','Working on items today',Object.keys(workers).length+'<small> / '+hereN+' present</small>','var(--accent)')+'</div>';
  var lo=T,hi=T;S.orders.forEach(function(o){var i=ordInfo(o);if(o.start<lo)lo=o.start;[i.pe,i.fe].forEach(function(d){if(d>hi)hi=d})});hi=addDays(hi,2);lo=addDays(lo,-1);
  var tl='<div class="card"><div class="head-row"><div><h3>Timeline of all items</h3><span class="small muted">Planned days against actual progress. Red means the item is taking longer than planned.</span></div></div>'+gantt(S.orders.map(orderRow),lo,hi)+'</div>';
  var live='<div class="card"><h3 style="margin-bottom:4px">Live: who is working on what</h3><span class="small muted">From attendance and the work each person logs today</span>'+A().filter(function(e){return !!todayRec(e.id)}).map(function(e){
    var ws=S.work.filter(function(w){return w.emp===e.id&&w.date===T}),last=ws[ws.length-1],r=todayRec(e.id);
    return '<div class="logrow">'+avatar(e,null,38,1)+'<div class="grow"><b>'+esc(e.name)+'</b><br><span class="small muted">'+(last?esc(last.task)+' · '+esc(last.item):'Present, no task logged yet')+'</span></div>'+(r.outMin==null?chip('Working','good'):chip('Done',''))+'</div>';
  }).join('')+(hereN?'':'<p class="muted" style="margin:10px 0 0">Nobody has checked in yet.</p>')+'</div>';
  var cards=S.orders.slice().sort(function(a,b){var o={delayed:0,ontrack:1,planned:2,'late-done':3,done:4};return o[ordInfo(a).st]-o[ordInfo(b).st]}).map(orderCard).join('');
  var form='<div class="card"><h3 style="margin-bottom:12px">Add an item to make</h3><div class="rowform"><div class="field"><span>Item and order number</span><input id="on-label" type="text" maxlength="80" placeholder="Example: Teak study table (Order #220)"></div><div class="field"><span>Customer</span><input id="on-cust" type="text" maxlength="60"></div><div class="field"><span>Quantity</span><input id="on-qty" type="number" min="1" value="1"></div><div class="field"><span>Start date</span><input id="on-start" type="date" value="'+T+'"></div><button class="btn primary" data-act="ordAdd">Add item</button></div><p class="small muted" style="margin:10px 0 0">It starts with 7 standard stages (14 days). Change the stages and days after adding.</p></div>';
  return '<div class="stack">'+tiles+tl+'<div class="cols even"><div class="stack">'+cards+'</div><div class="stack">'+live+form+'</div></div></div>';
}
function orderCard(o){
  var i=ordInfo(o),T=todayStr(),open=S.orderOpen===o.id,tw=todayWorkers(o),w=ordWork(o),mh=w.reduce(function(a,x){return a+x.hours},0),ppl={};w.forEach(function(x){ppl[x.emp]=(ppl[x.emp]||0)+x.hours});
  var cur=o.stages.filter(function(s){return !s.done})[0],ids=Object.keys(tw);
  var dayline=i.started?'Day <b class="mono">'+Math.min(i.elapsed,999)+'</b> of <b class="mono">'+num(i.total)+'</b> planned'+(i.delay>0?' · <span class="neg"><b>+'+i.delay+'</b> day'+(i.delay>1?'s':'')+' extra</span>':''):'Starts '+fd(o.start);
  var live=ids.length?'<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:10px"><span class="cap">Working today</span>'+ids.map(function(k){var e=emp(+k);return '<span class="who">'+avatar(e,null,26,1)+esc(e.name)+' <span class="mono small muted">'+H(tw[k])+'</span></span>'}).join('')+'</div>':'<div class="small muted" style="margin-top:10px">Nobody logged work on this item today.</div>';
  var head='<div class="head-row" style="margin-bottom:6px"><div style="display:flex;gap:12px;align-items:center">'+thumb(o.label,48,null,'product')+'<div><b style="font-size:1.02rem">'+esc(o.label)+'</b><div class="small muted">'+esc(o.customer||'No customer')+' · Qty '+o.qty+' · '+sdate(o.start)+' → '+sdate(i.pe)+' planned</div></div></div>'+ordChip(i)+'</div>';
  var prog='<div class="track" style="margin:8px 0 6px;height:9px"><div class="bar" style="width:'+i.pct+'%;height:9px;background:'+(i.delay>0?'var(--bad)':'var(--good)')+'"></div></div><div class="head-row" style="margin:0"><span class="small">'+dayline+'</span><span class="mono small">'+i.pct+'% done'+(cur&&i.started?' · now: '+esc(cur.name):'')+'</span></div>';
  var stats='<div class="small muted" style="margin-top:6px">Man-hours so far <b class="mono">'+num(mh)+' h</b> (≈ '+num(Math.round(mh/8*10)/10)+' man-days) · '+Object.keys(ppl).length+(Object.keys(ppl).length===1?' person has':' people have')+' worked on it'+(!i.all?' · expected finish <b>'+sdate(i.fe)+'</b>':'')+'</div>';
  var btn='<div style="margin-top:12px"><button class="btn sm" data-act="ordOpen" data-id="'+o.id+'">'+(open?'Hide details':'Timeline, stages and edit')+'</button></div>';
  return '<div class="card">'+head+prog+live+stats+btn+(open?orderDetail(o,i,ppl):'')+'</div>';
}
function orderDetail(o,i,ppl){
  var T=todayStr(),lo=o.start,hi=addDays(i.fe>i.pe?i.fe:i.pe,2),cum=0,rows=o.stages.map(function(s){
    var pS=addDays(o.start,cum);cum+=s.days;var pE=addDays(o.start,Math.ceil(cum)),aE=s.done||(s.start?T:null),late=s.done?s.done>pE:(s.start&&T>pE);
    if(s.start&&s.start<lo)lo=s.start;
    return {label:esc(s.name),pS:pS,pE:pE,aS:s.start,aE:aE,state:s.done?(late?'late':'done'):(late?'late':'')};
  });
  var chart=gantt(rows,addDays(lo,0),hi);
  var emps='<option value="">Add person…</option>'+A().map(function(e){return '<option value="'+e.id+'">'+esc(e.name)+'</option>'}).join('');
  var srows=o.stages.map(function(s){
    var as=s.assigned.map(function(id){var e=emp(id);return e?'<span class="who">'+esc(e.name)+' <button class="x" data-act="stUnassign" data-o="'+o.id+'" data-s="'+s.id+'" data-id="'+id+'" aria-label="Remove '+esc(e.name)+'">×</button></span>':''}).join('');
    return '<tr><td><input class="nm" type="text" maxlength="40" value="'+esc(s.name)+'" data-chg="stF" data-k="name" data-o="'+o.id+'" data-s="'+s.id+'" aria-label="Stage name"></td><td class="r"><input class="sm" type="number" min="0.5" step="0.5" value="'+s.days+'" data-chg="stF" data-k="days" data-o="'+o.id+'" data-s="'+s.id+'" aria-label="Planned days"></td><td><input type="date" value="'+(s.start||'')+'" data-chg="stF" data-k="start" data-o="'+o.id+'" data-s="'+s.id+'" aria-label="Actual start"></td><td><input type="date" value="'+(s.done||'')+'" data-chg="stF" data-k="done" data-o="'+o.id+'" data-s="'+s.id+'" aria-label="Done on"></td><td><div class="inl" style="justify-content:flex-start;flex-wrap:wrap">'+as+'<select data-chg="stAssign" data-o="'+o.id+'" data-s="'+s.id+'" aria-label="Assign person">'+emps+'</select></div></td><td class="r"><div class="inl">'+(s.done?'<button class="btn sm" data-act="stClear" data-o="'+o.id+'" data-s="'+s.id+'">Reopen</button>':'<button class="btn sm ok" data-act="stDone" data-o="'+o.id+'" data-s="'+s.id+'">Done today</button>')+'<button class="btn sm ghost no" data-act="stDel" data-o="'+o.id+'" data-s="'+s.id+'" aria-label="Delete stage">'+ic('trash',13)+'</button></div></td></tr>';
  }).join('');
  var edit='<div class="rowform" style="margin:14px 0"><div class="field"><span>Item and order number</span><input type="text" maxlength="80" value="'+esc(o.label)+'" data-chg="ordF" data-k="label" data-o="'+o.id+'"></div><div class="field"><span>Customer</span><input type="text" maxlength="60" value="'+esc(o.customer||'')+'" data-chg="ordF" data-k="customer" data-o="'+o.id+'"></div><div class="field"><span>Quantity</span><input type="number" min="1" value="'+o.qty+'" data-chg="ordF" data-k="qty" data-o="'+o.id+'"></div><div class="field"><span>Start date</span><input type="date" value="'+o.start+'" data-chg="ordF" data-k="start" data-o="'+o.id+'"></div></div>';
  var who=Object.keys(ppl).length?'<div class="small muted" style="margin-top:12px">Hours by person: '+Object.keys(ppl).map(function(k){return esc(emp(+k).name)+' <b class="mono">'+num(ppl[k])+' h</b>'}).join(' · ')+'</div>':'';
  var conf=S.confirmOrder===o.id?'<span class="inl"><span class="small">Delete this item?</span><button class="btn sm no" data-act="ordDelYes" data-id="'+o.id+'">Yes, delete</button><button class="btn sm" data-act="ordDelNo">Cancel</button></span>':'<button class="btn sm no" data-act="ordDel" data-id="'+o.id+'">'+ic('trash',13)+' Delete item</button>';
  return '<div style="border-top:1px solid var(--line);margin-top:14px;padding-top:14px"><h3 style="margin-bottom:10px">Timeline</h3>'+chart+edit+'<h3 style="margin:6px 0 8px">Stages</h3><div class="scroll"><table class="boq"><thead><tr><th>Stage</th><th class="r">Planned days</th><th>Started</th><th>Done</th><th>People</th><th></th></tr></thead><tbody>'+srows+'</tbody></table></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn sm" data-act="stAdd" data-o="'+o.id+'">'+ic('plus',13)+' Add stage</button>'+conf+'</div>'+who+'<p class="small muted" style="margin:10px 0 0">If a stage is not finished by its planned date, the expected finish moves out and the item shows as delayed.</p></div>';
}

/* ===== employee hours in costing + live tracking (admin edits anyone, employee updates own) ===== */
function LVM(){if(!S.live)S.live={};return S.live}
function nowT(){return nowD().getTime()}
function tmS(ts){return new Date(ts).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'})}
function runFor(ts){var m=Math.max(0,Math.round((nowT()-ts)/60000));return Math.floor(m/60)+'h '+('0'+m%60).slice(-2)+'m'}
var LVS={working:['Working','good'],break:['On break','warn'],idle:['Not working','']};
function itemSel(sel){return '<option value="">Select item…</option>'+opts(orderLabels().concat(sel&&orderLabels().indexOf(sel)<0?[sel]:[]),sel)}
function liveSet(id,st,task,item,by){var m=LVM(),o=m[id],same=o&&o.st===st&&o.task===task&&o.item===item;m[id]={st:st,task:task||'',item:item||'',since:same?o.since:nowT(),by:by}}
function liveRow(e){
  var T=todayStr(),r=todayRec(e.id),lv=LVM()[e.id],on=lv&&lv.st!=='idle',h=workHrs(e.id,T),ws=S.work.filter(function(w){return w.emp===e.id&&w.date===T}),last=ws[ws.length-1],c,sub;
  if(on){c=chip(LVS[lv.st][0],LVS[lv.st][1]);sub=esc(lv.task)+' · '+esc(lv.item)+' · since '+tmS(lv.since)+' ('+runFor(lv.since)+') · '+(lv.by==='self'?'updated by employee':'set by admin')}
  else if(onLeave(e.id)){c=chip('On leave','warn');sub='On approved leave'}
  else if(r&&r.outMin==null){c=chip('Present','info');sub=last?'Last logged: '+esc(last.task)+' · '+esc(last.item):'Present, no task set yet'}
  else if(r){c=chip('Done','');sub='Checked out'}
  else{c=chip('Not in','');sub='Not checked in today'}
  var ed='';
  if(S.liveEdit===e.id){ed='<div class="rowform" style="margin:6px 0 14px"><div class="field"><span>Status</span><select id="lv-st">'+['working','break','idle'].map(function(k){return '<option value="'+k+'"'+((on?lv.st:'idle')===k?' selected':'')+'>'+LVS[k][0]+'</option>'}).join('')+'</select></div><div class="field"><span>Kind of work</span><select id="lv-task">'+opts(TASKS,lv&&lv.task)+'</select></div><div class="field"><span>Item or order</span><select id="lv-item">'+itemSel(lv&&lv.item)+'</select></div><button class="btn primary sm" data-act="lvSave" data-id="'+e.id+'">Save</button><button class="btn sm" data-act="lvCancel">Cancel</button></div>'}
  return '<div class="logrow">'+avatar(e,null,38,1)+'<div class="grow"><b>'+esc(e.name)+'</b> <span class="small muted">'+esc(e.role)+'</span><br><span class="small muted">'+sub+'</span></div>'+(h>0?'<span class="mono small">'+H(h)+'</span>':'')+c+'<button class="btn sm" data-act="lvEdit" data-id="'+e.id+'">'+(S.liveEdit===e.id?'Close':'Edit')+'</button></div>'+ed;
}
function liveCard(){
  var m=LVM(),rk=function(e){var l=m[e.id];return l&&l.st==='working'?0:l&&l.st==='break'?1:todayRec(e.id)?2:3},L=A().slice().sort(function(a,b){return rk(a)-rk(b)}),w=L.filter(function(e){return rk(e)===0}).length,b=L.filter(function(e){return rk(e)===1}).length;
  return '<div class="card"><div class="head-row"><div><h3>Live: who is working on what</h3><span class="small muted">Admin can edit anyone. Each employee updates their own status from the Today tab.</span></div><div style="display:flex;gap:6px">'+chip(w+' working','good')+chip(b+' on break','warn')+'</div></div>'+L.map(liveRow).join('')+'</div>';
}
function liveSelf(){
  var lv=LVM()[S.uid],on=lv&&lv.st!=='idle',open=!!openRec(S.uid);
  return '<div class="card"><div class="head-row"><h3>What are you doing now?</h3>'+chip(on?LVS[lv.st][0]:'Not working',on?LVS[lv.st][1]:'')+'</div>'+(on?'<p class="small muted" style="margin:0 0 10px">'+esc(lv.task)+' · '+esc(lv.item)+' · since '+tmS(lv.since)+' ('+runFor(lv.since)+')</p>':'')+
   '<div class="two"><div class="field"><span>Kind of work</span><select id="ls-task">'+opts(TASKS,lv&&lv.task)+'</select></div><div class="field"><span>Item or order</span><select id="ls-item">'+itemSel(lv&&lv.item)+'</select></div></div>'+
   '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-act="lvSelf" data-v="working"'+(open?'':' disabled')+'>Start work</button><button class="btn" data-act="lvSelf" data-v="break"'+(on?'':' disabled')+'>Take a break</button><button class="btn" data-act="lvSelf" data-v="idle"'+(on?'':' disabled')+'>Stop</button></div>'+(open?'':'<p class="small muted" style="margin:10px 0 0">Check in first to start work.</p>')+'</div>';
}
function hrData(p){
  var od=S.orders||[],ords=(p.ords||[]).map(function(id){return od.filter(function(o){return o.id===id})[0]}).filter(Boolean),lab=ords.map(function(o){return o.label}),by={},ov=p.hrs||{};
  S.work.forEach(function(w){if(lab.indexOf(w.item)>=0)by[w.emp]=(by[w.emp]||0)+w.hours});
  var ids=Object.keys(by).concat(Object.keys(ov).filter(function(k){return !(k in by)})),rows=[],tot=0,amt=0;
  ids.forEach(function(k){var o=ov[k]||{};if(o.x)return;var e=emp(+k);if(!e)return;var lg=Math.round((by[k]||0)*100)/100,h=o.h!=null?o.h:lg,r=o.r!=null?o.r:e.rate;
    rows.push({e:e,id:k,lg:lg,h:h,r:r,ed:o.h!=null||o.r!=null,man:!(k in by)});tot+=h;amt+=h*r});
  rows.sort(function(a,b){return b.h-a.h});
  return {ords:ords,rows:rows,tot:tot,amt:amt};
}
function hoursCard(){
  var p=curProd(),od=S.orders||[],D=hrData(p),ords=D.ords,rows=D.rows,tot=D.tot,amt=D.amt;
  var plan=p.lines.filter(function(l){return l.kind==='labour'&&!l.auto}).reduce(function(a,l){return a+l.qty},0),mx=Math.max.apply(null,rows.map(function(r){return r.h}).concat([1]));
  var shown=rows.map(function(r){return r.id});
  var body=rows.map(function(r,i){var e=r.e;
    return '<tr><td class="mono muted">'+pad(i+1)+'</td><td><div style="display:flex;gap:10px;align-items:center">'+avatar(e,null,34,1)+'<div><b>'+esc(e.name)+'</b><div class="small muted">'+esc(e.role)+(e.active?'':' · removed')+(r.man?' · added by hand':'')+'</div></div></div></td>'+
     '<td class="r"><input class="sm" type="number" min="0" step="0.25" value="'+r.h+'" data-chg="hrH" data-e="'+r.id+'" aria-label="Hours for '+esc(e.name)+'">'+(r.ed&&r.h!==r.lg?'<div class="small muted mono">logged '+num(r.lg)+' h</div>':'')+'<div class="mb"><i style="width:'+Math.round(r.h/mx*100)+'%"></i></div></td>'+
     '<td class="r"><input class="sm" type="number" min="0" step="any" value="'+r.r+'" data-chg="hrR" data-e="'+r.id+'" aria-label="Rate for '+esc(e.name)+'">'+(r.r!==e.rate?'<div class="small muted mono">own rate '+inr(e.rate)+'</div>':'')+'</td>'+
     '<td class="r mono"><b>'+inr(r.h*r.r)+'</b></td>'+
     '<td class="r"><div class="inl">'+(r.ed?'<button class="btn sm ghost" data-act="hrReset" data-e="'+r.id+'" title="Back to logged hours and own rate" aria-label="Reset row">↺</button>':'')+'<button class="btn sm ghost no" data-act="hrDel" data-e="'+r.id+'" aria-label="Remove row">'+ic('trash',13)+'</button></div></td></tr>';
  }).join('')||'<tr><td colspan="6" class="muted">'+(ords.length?'Nobody has logged work on these orders yet. Add an employee below.':'No order linked yet. Link an order to count logged hours, or add employees below by hand.')+'</td></tr>';
  var chips=ords.map(function(o){return '<span class="who">'+esc(o.label)+' <button class="x" data-act="pOrdDel" data-o="'+o.id+'" aria-label="Unlink order">×</button></span>'}).join(' ');
  var free=od.filter(function(o){return (p.ords||[]).indexOf(o.id)<0}).map(function(o){return '<option value="'+o.id+'">'+esc(o.label)+'</option>'}).join('');
  var avail=S.emps.filter(function(e){return e.active&&shown.indexOf(String(e.id))<0}).map(function(e){return '<option value="'+e.id+'">'+esc(e.name)+' · '+inr(e.rate)+'/h</option>'}).join('');
  var line=p.lines.filter(function(l){return l.auto==='hrs'})[0];
  var tiles='<div class="tiles" style="margin-bottom:14px"><div class="tile" style="--tc:var(--primary)"><span class="cap">People</span><b class="num">'+rows.length+'</b></div><div class="tile" style="--tc:var(--accent)"><span class="cap">Total hours</span><b class="num">'+num(tot)+'<small> h</small></b></div><div class="tile" style="--tc:var(--good)"><span class="cap">Total labour amount</span><b class="num">'+inr(amt)+'</b></div></div>';
  return '<div class="card"><div class="head-row"><div><h3>Employee hours on this product</h3><span class="small muted">Hours come from each person’s work log. Change any hours or rate here to match your costing. Edited values show a ↺ to go back.</span></div></div>'+tiles+
   '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:10px">'+chips+'<select data-chg="pOrdAdd" aria-label="Link an order"><option value="">Link an order…</option>'+free+'</select></div>'+
   '<div class="scroll"><table class="boq"><thead><tr><th>#</th><th>Employee</th><th class="r">Hours</th><th class="r">Rate ₹/h</th><th class="r">Amount</th><th></th></tr></thead><tbody>'+body+'</tbody>'+
   '<tfoot><tr><td></td><td><b>Total</b></td><td class="r mono"><b>'+num(tot)+' h</b></td><td></td><td class="r mono"><b style="font-size:1.1rem">'+inr(amt)+'</b></td><td></td></tr></tfoot></table></div>'+
   '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px"><select data-chg="hrAdd" aria-label="Add an employee"><option value="">+ Add an employee…</option>'+avail+'</select><span class="grow"></span><button class="btn gold" data-act="hrToLine">'+(line?'Update labour line in costing':'Add this total to costing as a labour line')+'</button></div>'+
   '<p class="small muted" style="margin:10px 0 0">Labour planned in the BOQ for 1 unit <b class="mono">'+num(plan)+' h</b>'+(line?' · Costing line currently <b class="mono">'+inr(line.qty*line.rate)+'</b>':'')+'</p></div>';
}
function liveClick(a,b){
  var id=+b.dataset.id;
  if(a==='lvEdit'){S.liveEdit=S.liveEdit===id?null:id;render();return true}
  if(a==='lvCancel'){S.liveEdit=null;render();return true}
  if(a==='lvSave'){var st=$('#lv-st').value,t=$('#lv-task').value,it=$('#lv-item').value;if(st!=='idle'&&!it){toast('Pick the item or order.',1);return true}liveSet(id,st,t,it,'admin');S.liveEdit=null;toast('Live status updated.');render();return true}
  if(a==='lvSelf'){var v=b.dataset.v,o=LVM()[S.uid],t2,i2;
    if(v==='working'){if(!openRec(S.uid)){toast('Check in first.',1);return true}t2=$('#ls-task').value;i2=$('#ls-item').value;if(!i2){toast('Pick the item or order.',1);return true}}
    else{t2=o&&o.task;i2=o&&o.item}
    liveSet(S.uid,v,t2,i2,'self');toast(v==='working'?'Started. The admin can see this live.':v==='break'?'Break noted.':'Stopped.');render();return true}
  if(a==='pOrdDel'){var p=curProd();p.ords=(p.ords||[]).filter(function(x){return x!==+b.dataset.o});toast('Order unlinked.');render();return true}
  return false;
}
function liveChange(el){
  if(el.dataset.chg==='pOrdAdd'){var v=+el.value,p=curProd();if(v){p.ords=p.ords||[];if(p.ords.indexOf(v)<0)p.ords.push(v);toast('Order linked. Hours are now counted.')}render();return true}
  return false;
}
var _ac=adminCosting;adminCosting=function(){var h=_ac(),m='<div class="card"><h3 style="margin-bottom:4px">Add a line</h3>',i=h.indexOf(m);return i>-1?h.slice(0,i)+hoursCard()+h.slice(i):h+hoursCard()};
var _ap=adminProduction;adminProduction=function(){var h=_ap(),a=h.indexOf('<div class="card"><h3 style="margin-bottom:4px">Live: who is working on what</h3>'),b=h.indexOf('<div class="card"><h3 style="margin-bottom:12px">Add an item to make</h3>');return(a>-1&&b>a)?h.slice(0,a)+liveCard()+h.slice(b):h};
var _et=empToday;empToday=function(){var h=_et();return h.slice(0,-6)+liveSelf()+'</div>'};

/* ===== production videos (stored in this browser's IndexedDB) + motion ===== */
var MAXV=300*1024*1024,VDB=null,VURL={};
function vdb(){return VDB||(VDB=new Promise(function(res,rej){var q=indexedDB.open('avya-videos',1);q.onupgradeneeded=function(){q.result.createObjectStore('v')};q.onsuccess=function(){res(q.result)};q.onerror=function(){rej(q.error)}}))}
function vtx(mode,fn){return vdb().then(function(d){return new Promise(function(res,rej){var t=d.transaction('v',mode),r=fn(t.objectStore('v'));t.oncomplete=function(){res(r&&r.result)};t.onerror=function(){rej(t.error)}})})}
function vput(k,b){return vtx('readwrite',function(s){return s.put(b,k)})}
function vget(k){return vtx('readonly',function(s){return s.get(k)})}
function vrm(k){if(VURL[k]){URL.revokeObjectURL(VURL[k]);delete VURL[k]}return vtx('readwrite',function(s){return s.delete(k)})}
function vurl(k){if(VURL[k])return Promise.resolve(VURL[k]);return vget(k).then(function(b){return b?(VURL[k]=URL.createObjectURL(b)):null})}
function VM(){if(!S.videos)S.videos=[];return S.videos}
function hydrate(){document.querySelectorAll('video[data-vid]').forEach(function(v){if(v.dataset.ok)return;v.dataset.ok=1;vurl(v.dataset.vid).then(function(u){if(u)v.src=u+'#t=0.6';else v.closest('.vtile').classList.add('gone')}).catch(function(){v.closest('.vtile').classList.add('gone')})})}
function vwho(v){var e=v.emp?emp(v.emp):null;return e?e.name:'Admin'}
function vtile(v,mini){
  var own=S.role==='admin'||(S.role==='employee'&&v.emp===S.uid);
  return '<div class="vtile" data-act="vPlay" data-k="'+v.id+'"><div class="vth"><video muted playsinline preload="metadata" data-vid="'+v.id+'"></video><i class="vp"></i><div class="vbadge">'+(v.kind==='full'?'<span class="chip">Full production</span>':'')+(v.pct!=null?'<span class="chip">'+v.pct+'% made</span>':'')+'</div></div>'+
   (mini?'':'<div class="vcap"><b>'+esc(v.item)+'</b><span class="small muted">'+esc(vwho(v))+' · '+fd(v.date)+' · '+(v.size/1048576).toFixed(1)+' MB</span>'+(v.note?'<span class="small">'+esc(v.note)+'</span>':'')+(own?'<span><button class="btn sm ghost no" data-act="vDel" data-k="'+v.id+'" aria-label="Delete video">'+ic('trash',13)+' Delete</button></span>':'')+'</div>')+'</div>';
}
function vform(admin){
  return '<div class="rowform" style="margin-top:12px"><div class="field"><span>Item</span><select id="vu-item"><option value="">Select item…</option>'+opts(orderLabels())+'</select></div>'+
   (admin?'<div class="field"><span>Type</span><select id="vu-kind"><option value="full">Full production video</option><option value="progress">Progress update</option></select></div>':'')+
   '<div class="field"><span>How much is made (%)</span><input id="vu-pct" type="number" min="0" max="100" step="5" placeholder="Example: 60"></div><div class="field"><span>Note</span><input id="vu-note" type="text" maxlength="120" placeholder="Example: Joinery done, polishing next"></div><div class="field"><span>Video file</span><input id="vu-file" type="file" accept="video/*"></div><button class="btn primary" data-act="vUp">Upload video</button></div><p class="small muted" style="margin:8px 0 0">Videos are kept in this browser on this device (up to 300 MB each).</p>';
}
function vidCard(){
  var f=S.vfilter||'all',all=VM().slice().sort(function(a,b){return b.t-a.t}),vs=all.filter(function(v){return f==='all'||v.item===f});
  return '<div class="card"><div class="head-row"><div><h3>Production videos</h3><span class="small muted">Full production videos and progress clips of every item, from the admin and the team.</span></div><select data-chg="vFilter" aria-label="Filter by item"><option value="all">All items ('+all.length+')</option>'+orderLabels().map(function(x){return '<option value="'+esc(x)+'"'+(x===f?' selected':'')+'>'+esc(x)+'</option>'}).join('')+'</select></div>'+vform(true)+
   (vs.length?'<div class="vgrid">'+vs.map(function(v){return vtile(v)}).join('')+'</div>':'<p class="muted" style="margin:14px 0 0">No videos yet. Upload the first one above.</p>')+'</div>';
}
function vidStrip(o){
  var vs=VM().filter(function(v){return v.item===o.label}).sort(function(a,b){return b.t-a.t}),rp=vs.filter(function(v){return v.pct!=null})[0];
  if(!vs.length)return '<div class="small muted" style="margin-top:10px">No videos for this item yet.</div>';
  return '<div class="vstrip">'+vs.slice(0,3).map(function(v){return vtile(v,1)}).join('')+'<div class="small"><b>'+vs.length+'</b> video'+(vs.length>1?'s':'')+(rp?'<br>Latest report: <b>'+rp.pct+'% made</b> · '+esc(vwho(rp))+', '+fd(rp.date):'')+'</div></div>';
}
function closeV(){var m=document.querySelector('.vmodal');if(m)m.remove()}
function playV(k){var v=VM().filter(function(x){return x.id===k})[0];if(!v)return;closeV();var m=document.createElement('div');m.className='vmodal';
  m.innerHTML='<div class="vbox"><video controls autoplay playsinline></video><div class="vinfo"><div><b>'+esc(v.item)+'</b><br><span class="small" style="opacity:.8">'+esc(vwho(v))+' · '+fd(v.date)+(v.pct!=null?' · '+v.pct+'% made':'')+(v.note?' · '+esc(v.note):'')+'</span></div><button class="btn sm" data-vclose="1">Close ✕</button></div></div>';
  m.onclick=function(e){if(e.target===m||e.target.dataset.vclose)closeV()};document.body.appendChild(m);
  vurl(k).then(function(u){if(u)m.querySelector('video').src=u;else{toast('Video not found on this device.',1);closeV()}})}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeV()});
function vidClick(a,b){
  if(a==='vPlay'){if(!ev0(b))return true;playV(b.dataset.k);return true}
  if(a==='vDel'){if(!confirm('Delete this video?'))return true;var k=b.dataset.k;S.videos=VM().filter(function(x){return x.id!==k});vrm(k).catch(function(){});toast('Video deleted.');render();return true}
  if(a==='vUp'){var fl=$('#vu-file').files[0],it=$('#vu-item').value,kd=$('#vu-kind');
    if(!it){toast('Pick the item.',1);return true}if(!fl){toast('Choose a video file first.',1);return true}
    if(!/^video\//.test(fl.type)){toast('That file is not a video.',1);return true}if(fl.size>MAXV){toast('Video is too large. Keep it under 300 MB.',1);return true}
    var p=parseFloat($('#vu-pct').value),k2='v'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);b.disabled=true;toast('Saving video…');
    vput(k2,fl).then(function(){VM().push({id:k2,item:it,kind:kd?kd.value:'progress',pct:isNaN(p)?null:Math.max(0,Math.min(100,p)),note:$('#vu-note').value.trim(),emp:S.role==='admin'?0:S.uid,date:todayStr(),t:nowT(),size:fl.size,type:fl.type});toast('Video added.');render()}).catch(function(){b.disabled=false;toast('This browser could not store the video.',1)});return true}
  return false;
}
function ev0(b){return !b.closest('[data-act=vDel]')||b.dataset.act==='vDel'}
function vidChange(el){if(el.dataset.chg==='vFilter'){S.vfilter=el.value;render();return true}return false}
var _ap2=adminProduction;adminProduction=function(){var h=_ap2(),i=h.indexOf('<div class="cols even">');return i>-1?h.slice(0,i)+vidCard()+h.slice(i):h};
var _oc=orderCard;orderCard=function(o){var h=_oc(o),m='<div style="margin-top:12px"><button class="btn sm" data-act="ordOpen"',i=h.indexOf(m);return i>-1?h.slice(0,i)+vidStrip(o)+h.slice(i):h};
var _ew=empWork;empWork=function(){var h=_ew(),mine=VM().filter(function(v){return v.emp===S.uid}).sort(function(a,b){return b.t-a.t});
  return h.slice(0,-6)+'<div class="card"><h3 style="margin-bottom:2px">Upload an item video</h3><p class="small muted" style="margin:0">Show how much is made so far. The admin sees it in Production.</p>'+vform(false)+(mine.length?'<div class="vgrid">'+mine.map(function(v){return vtile(v)}).join('')+'</div>':'')+'</div></div>'};
var _rd=render,LK='',EN=0;render=function(){_rd();var k=S.screen+S.role+S.tab+S.etab,a=$('#app');
  if(k!==LK){LK=k;a.classList.remove('enter');void a.offsetWidth;a.classList.add('enter');clearTimeout(EN);EN=setTimeout(function(){a.classList.remove('enter')},2800);
    a.querySelectorAll('.tile b').forEach(function(el){var n=el.firstChild&&el.firstChild.nodeType===3?el.firstChild:null;if(!n||!/^\d{1,4}$/.test(n.nodeValue))return;var to=+n.nodeValue,t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/900);n.nodeValue=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)})}
  hydrate()};

/* ===== charts (inline SVG, no libraries) ===== */
var CID=0;
function lastDays(n){var a=[],t=todayStr(),i;for(i=n-1;i>=0;i--)a.push(addDays(t,-i));return a}
function dlab(d){return new Date(d+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short'}).slice(0,3)}
function cScale(vals){var mx=Math.max.apply(null,vals.concat([1])),st=mx<=4?1:mx<=10?2:mx<=40?10:mx<=100?20:Math.pow(10,Math.floor(Math.log10(mx)));return Math.ceil(mx/st)*st}
function cGrid(W,H,pl,pr,pt,pb,top){var o='',i;for(i=0;i<=4;i++){var y=pt+(H-pt-pb)*i/4;o+='<line class="cgr" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y+'" y2="'+y+'"/><text class="ctx" x="'+(pl-6)+'" y="'+(y+3)+'" text-anchor="end">'+num(top*(1-i/4))+'</text>'}return o}
function cArea(vals,labs,unit){
  var W=520,H=190,pl=34,pr=12,pt=14,pb=26,n=vals.length,top=cScale(vals),g='g'+(++CID),i;
  var X=function(i){return pl+(n>1?i*(W-pl-pr)/(n-1):0)},Y=function(v){return pt+(H-pt-pb)*(1-v/top)};
  var d='M'+X(0)+','+Y(vals[0]);for(i=1;i<n;i++){var cx=(X(i-1)+X(i))/2;d+=' C'+cx+','+Y(vals[i-1])+' '+cx+','+Y(vals[i])+' '+X(i)+','+Y(vals[i])}
  var ar=d+' L'+X(n-1)+','+(H-pb)+' L'+X(0)+','+(H-pb)+' Z';
  return '<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img"><defs><linearGradient id="'+g+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8802F" stop-opacity=".38"/><stop offset="1" stop-color="#A8802F" stop-opacity="0"/></linearGradient></defs>'+cGrid(W,H,pl,pr,pt,pb,top)+'<path class="carea" d="'+ar+'" fill="url(#'+g+')"/><path class="cline" pathLength="1" d="'+d+'"/>'+
   vals.map(function(v,i){return '<circle class="cdot" style="--d:'+(1+i*.12)+'s" cx="'+X(i)+'" cy="'+Y(v)+'" r="4"><title>'+labs[i]+': '+num(v)+(unit||'')+'</title></circle><text class="ctx" x="'+X(i)+'" y="'+(H-8)+'" text-anchor="middle">'+labs[i]+'</text>'}).join('')+'</svg>';
}
function cCols(vals,labs,unit){
  var W=520,H=190,pl=34,pr=8,pt=14,pb=26,n=vals.length,top=cScale(vals),bw=(W-pl-pr)/n,i,o='';
  for(i=0;i<n;i++){var h=(H-pt-pb)*vals[i]/top,x=pl+i*bw+bw*.18;o+='<rect class="ccol'+(i===n-1?' today':'')+'" style="--d:'+(i*.08)+'s" x="'+x+'" y="'+(H-pb-h)+'" width="'+bw*.64+'" height="'+Math.max(h,0)+'" rx="5"><title>'+labs[i]+': '+num(vals[i])+(unit||'')+'</title></rect><text class="ctx" x="'+(pl+i*bw+bw/2)+'" y="'+(H-8)+'" text-anchor="middle">'+labs[i]+'</text>'}
  return '<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img">'+cGrid(W,H,pl,pr,pt,pb,top)+o+'</svg>';
}
function cDonut(parts,top,sub){
  var tot=parts.reduce(function(a,p){return a+p.v},0),off=0;
  var segs=tot?parts.map(function(p,i){var len=p.v/tot*100,vis=Math.max(0,len-(parts.length>1?.8:0));var s='<circle class="cseg" style="--d:'+i*.2+'s" cx="21" cy="21" r="15.9155" fill="none" stroke="'+p.c+'" stroke-width="5" pathLength="100" stroke-dasharray="'+vis+' '+(100-vis)+'" stroke-dashoffset="'+(-off)+'"><title>'+esc(p.l)+': '+esc(p.t)+'</title></circle>';off+=len;return s}).join(''):'';
  return '<div class="dwrap"><div class="donut"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--line)" stroke-width="5"/>'+segs+'</svg><div class="mid"><b>'+top+'</b><span>'+sub+'</span></div></div><div class="dleg">'+parts.map(function(p){return '<div><i style="background:'+p.c+'"></i>'+esc(p.l)+'<span>'+(tot?Math.round(p.v/tot*100):0)+'% · '+esc(p.t)+'</span></div>'}).join('')+'</div></div>';
}
function cRing(pct,color,label,sub){
  var v=Math.max(0,Math.min(100,pct));
  return '<div class="ring"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--line)" stroke-width="4.4"/><circle class="cseg" cx="21" cy="21" r="15.9155" fill="none" stroke="'+color+'" stroke-width="4.4" stroke-linecap="round" pathLength="100" stroke-dasharray="'+v+' '+(100-v)+'"/></svg><b class="mono" style="display:block;margin-top:-58px;height:58px;line-height:58px;font-size:1rem">'+v+'%</b><small><b>'+esc(label)+'</b><br><span class="muted">'+esc(sub)+'</span></small></div>';
}
function hbars(rows){var mx=Math.max.apply(null,rows.map(function(r){return r.v}).concat([1]));return rows.map(function(r,i){return '<div class="hb"><span title="'+esc(r.l)+'" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r.l)+'</span><div class="ht"><i style="width:'+Math.max(3,r.v/mx*100)+'%;--d:'+i*.1+'s'+(r.c?';--c:'+r.c:'')+'"></i></div><b class="mono small">'+r.t+'</b></div>'}).join('')||'<p class="muted" style="margin:10px 0 0">Nothing to chart yet.</p>'}
function ccard(title,sub,body,cls){return '<div class="card '+(cls||'')+'"><h3>'+title+'</h3><span class="small muted">'+sub+'</span>'+body+'</div>'}
function prodCharts(){
  var D=lastDays(7),L=D.map(dlab),ws=S.work.filter(function(w){return w.date>=D[0]}),hv=D.map(function(d){return Math.round(workHrs0(d)*100)/100});
  var byT={},byE={};ws.forEach(function(w){byT[w.task]=(byT[w.task]||0)+w.hours;byE[w.emp]=(byE[w.emp]||0)+w.hours});
  var PAL=['#A8802F','#0E8A84','#5B52C9','#B4476B','#2E7D55','#B07A1B','#6F675B'],tk=Object.keys(byT).sort(function(a,b){return byT[b]-byT[a]}),parts=tk.slice(0,6).map(function(k,i){return {v:byT[k],c:PAL[i],l:k,t:num(byT[k])+' h'}}),rest=tk.slice(6).reduce(function(a,k){return a+byT[k]},0);
  if(rest)parts.push({v:rest,c:PAL[6],l:'Others',t:num(rest)+' h'});
  var tot=ws.reduce(function(a,w){return a+w.hours},0),top=Object.keys(byE).sort(function(a,b){return byE[b]-byE[a]}).slice(0,6).map(function(k){var e=emp(+k);return {l:e?e.name:'—',v:byE[k],t:num(byE[k])+' h'}});
  var rings=(S.orders||[]).map(function(o){var i=ordInfo(o),c=i.st==='delayed'?'#B53A30':i.all?'#2E7D55':'#A8802F';return cRing(i.pct,c,o.label.split(' (')[0],i.st==='delayed'?'Delayed +'+i.delay+'d':i.all?'Completed':i.started?'On track':'Not started')}).join('');
  return '<div class="cgrid">'+ccard('Hours logged · last 7 days','Total work hours entered by the team each day',cArea(hv,L,' h'),'c2')+ccard('Hours by kind of work','Last 7 days',cDonut(parts,num(tot),'hours'))+
   ccard('Top contributors','Most hours logged · last 7 days',hbars(top))+ccard('Item progress','How much of each item is complete','<div class="rings">'+rings+'</div>','c2')+'</div>';
}
function workHrs0(d){return S.work.filter(function(w){return w.date===d}).reduce(function(a,w){return a+w.hours},0)}
function costCharts(){
  var p=curProd(),t=prodTotals(p),ls=p.lines.map(function(l){return {l:l.name,v:l.qty*l.rate,t:inr(l.qty*l.rate),c:l.kind==='material'?'#A8802F':l.kind==='labour'?'#0E8A84':'#6F675B'}}).sort(function(a,b){return b.v-a.v}).slice(0,7);
  return '<div class="cgrid">'+ccard('Where the cost goes','Cost of 1 unit by type',cDonut([{v:t.material,c:'#A8802F',l:'Material',t:inr(t.material)},{v:t.labour,c:'#0E8A84',l:'Labour',t:inr(t.labour)},{v:t.overhead,c:'#6F675B',l:'Other costs',t:inr(t.overhead)}],inr(t.total),'per unit'))+ccard('Biggest cost lines','Top lines, colour shows the type',hbars(ls),'c2')+'</div>';
}
function ovCharts(){
  var D=lastDays(7),L=D.map(dlab),hv=D.map(function(d){return Math.round(S.records.filter(function(r){return r.date===d}).reduce(function(a,r){return a+(r.hours||0)},0))}),pr=0,lv=0,ni=0;
  A().forEach(function(e){var s=todayStatus(e);if(s.k==='leave')lv++;else if(s.r)pr++;else ni++});
  return '<div class="cgrid">'+ccard('Attendance hours · last 7 days','Total hours punched by the whole team',cCols(hv,L,' h'),'c2')+ccard('Today’s presence','Who is in the workshop',cDonut([{v:pr,c:'#2E7D55',l:'Present',t:pr+''},{v:lv,c:'#B07A1B',l:'On leave',t:lv+''},{v:ni,c:'#6F675B',l:'Not in yet',t:ni+''}],pr+' / '+(pr+lv+ni),'present'))+'</div>';
}
function insBefore(h,m,x){var i=h.indexOf(m);return i>-1?h.slice(0,i)+x+h.slice(i):h}
var _ap3=adminProduction;adminProduction=function(){return insBefore(_ap3(),'<div class="card"><div class="head-row"><div><h3>Timeline of all items</h3>',prodCharts())};
var _ac2=adminCosting;adminCosting=function(){return insBefore(_ac2(),'<h2 class="sec">Bill of quantities</h2>',costCharts())};
var _ao=adminOverview;adminOverview=function(){return insBefore(_ao(),'<div class="cols">',ovCharts())};

/* ===== employee: full personal record + petty cash balance edit ===== */
function myMonthDays(ym){var n=ym===todayStr().slice(0,7)?+todayStr().slice(8):dim(ym),a=[],i;for(i=1;i<=n;i++)a.push(ym+'-'+pad(i));return a}
function myStart(){var m='';S.records.forEach(function(r){if(r.emp===S.uid&&(!m||r.date<m))m=r.date});return m}
function dayKind(d,start){
  if(S.records.some(function(r){return r.emp===S.uid&&r.date===d}))return 'P';
  if(!start||d<start)return 'N';
  if(onLeave(S.uid,d))return 'L';
  if(sunOff(d))return 'S';
  if(d===todayStr())return 'T';
  return 'A';
}
function myDay(d){
  var e=emp(S.uid),start=myStart(),kind=dayKind(d,start);
  var r=S.records.filter(function(x){return x.emp===S.uid&&x.date===d})[0],es=S.work.filter(function(w){return w.emp===S.uid&&w.date===d});
  var c=r?(r.approved?chip('Approved','good'):chip(r.outMin==null?'Open':'Pending','warn')):kind==='L'?chip('On leave','warn'):kind==='S'?chip('Sunday off',''):kind==='T'?chip('Not in yet',''):chip('Absent','bad');
  var sub=r?t12(r.inMin)+' → '+(r.outMin!=null?t12(r.outMin):'working'):kind==='L'?'Approved leave':kind==='S'?'Sunday off':kind==='T'?'Not checked in yet':'Did not come';
  var earn=r&&r.approved&&r.outMin!=null?'<span class="small muted mono">'+inr(r.hours*e.rate)+'</span><br>':'';
  return '<div class="logrow" style="align-items:flex-start"><div class="grow"><b>'+fd(d)+'</b> '+(r&&r.dt!=='full'&&r.outMin!=null?chip(dayLabel(r),'info'):'')+'<br><span class="small muted mono">'+sub+'</span>'+
   (es.length?'<div style="margin-top:8px;display:grid;gap:4px">'+es.map(function(w){return '<div class="small">• <b>'+esc(w.task)+'</b> · '+esc(w.item)+' · <span class="mono">'+H(w.hours)+'</span>'+(w.note?' · '+esc(w.note):'')+'</div>'}).join('')+'</div>':(r?'<div class="small muted" style="margin-top:6px">No work was written for this day.</div>':''))+'</div><div style="text-align:right"><span class="mono">'+(r&&r.outMin!=null?H(r.hours):'–')+'</span><br>'+earn+c+'</div></div>';
}
function myRecord(){
  var ym=S.emonth,D=myMonthDays(ym),start=myStart(),flt=S.efilter||'all';
  var recs=S.records.filter(function(r){return r.emp===S.uid&&r.date.indexOf(ym)===0}),ws=S.work.filter(function(w){return w.emp===S.uid&&w.date.indexOf(ym)===0});
  var hv=D.map(function(d){return Math.round(recs.filter(function(r){return r.date===d}).reduce(function(a,r){return a+(r.hours||0)},0)*100)/100}),lb=D.map(function(d,i){return D.length>16&&i%2?'':String(i+1)});
  var th=hv.reduce(function(a,b){return a+b},0),lh=ws.reduce(function(a,w){return a+w.hours},0),pd=recs.length,ab=0,lv=0;
  D.forEach(function(d){var k=dayKind(d,start);if(k==='A')ab++;else if(k==='L')lv++});
  var tiles='<div class="tiles">'+tile('check','Days present',pd,'var(--good)')+tile('clock','Days absent',ab,'var(--bad)')+tile('sun','Leave days',lv,'var(--warn)')+tile('clock','Hours worked',Math.round(th*10)/10,'var(--primary)')+tile('clip','Work written',Math.round(lh*10)/10+'<small> h</small>','var(--accent)')+tile('cal','Average a day',pd?(th/pd).toFixed(1)+'<small> h</small>':'0','var(--muted)')+'</div>';
  var bt={},bi={},PAL=['#A8802F','#0E8A84','#5B52C9','#B4476B','#2E7D55','#B07A1B','#6F675B'];ws.forEach(function(w){bt[w.task]=(bt[w.task]||0)+w.hours;bi[w.item]=(bi[w.item]||0)+w.hours});
  var tk=Object.keys(bt).sort(function(a,b){return bt[b]-bt[a]}),parts=tk.slice(0,6).map(function(k,i){return {v:bt[k],c:PAL[i],l:k,t:num(bt[k])+' h'}}),rest=tk.slice(6).reduce(function(a,k){return a+bt[k]},0);if(rest)parts.push({v:rest,c:PAL[6],l:'Others',t:num(rest)+' h'});
  var items=Object.keys(bi).sort(function(a,b){return bi[b]-bi[a]}).slice(0,5).map(function(k){return {l:k.split(' (')[0],v:bi[k],t:num(bi[k])+' h'}});
  var days=D.slice().reverse().filter(function(d){var k=dayKind(d,start);if(k==='N')return false;return flt==='all'||(flt==='present'&&k==='P')||(flt==='absent'&&k==='A')});
  var seg='<div class="seg" role="group" aria-label="Show days" style="margin:12px 0 2px">'+[['all','All days'],['present','Came'],['absent','Absent']].map(function(x){return '<button data-act="efilter" data-v="'+x[0]+'" class="'+(flt===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div>';
  return tiles+ccard('My hours, day by day',ml(ym)+' · hours punched each day',cCols(hv,lb,' h'))+
   ccard('What I worked on','Hours by kind of work, '+ml(ym),tk.length?cDonut(parts,num(lh),'hours'):'<p class="muted" style="margin:10px 0 0">No work written in this month.</p>')+
   (items.length?ccard('Items I worked on','Hours by item',hbars(items)):'')+
   '<div class="card"><h3 style="margin-bottom:4px">Every day in '+ml(ym)+'</h3><span class="small muted">The day I came, how long I worked, and what I did. Use the arrows at the top to see other months.</span>'+seg+(days.length?days.map(myDay).join(''):'<p class="muted" style="margin:12px 0 0">No days to show here.</p>')+'</div>';
}
function pcClick(a,b){
  var id=+b.dataset.id;
  if(a==='efilter'){S.efilter=b.dataset.v;render();return true}
  if(a==='hrDel'||a==='hrReset'||a==='hrToLine'){
    var hp=curProd();hp.hrs=hp.hrs||{};var hk=b.dataset.e;
    if(a==='hrDel'){hp.hrs[hk]={x:true};toast('Row removed from this product.')}
    else if(a==='hrReset'){delete hp.hrs[hk];toast('Back to logged hours and own rate.')}
    else{var hd=hrData(hp),ln=hp.lines.filter(function(l){return l.auto==='hrs'})[0],amt=Math.round(hd.amt);
      if(ln){ln.qty=1;ln.rate=amt;toast('Labour line updated to '+inr(amt)+'.')}
      else{hp.lines.push({id:S.nextLine++,kind:'labour',name:'Employee labour (from hours table)',qty:1,unit:'job',rate:amt,auto:'hrs'});toast('Labour line of '+inr(amt)+' added to costing.')}}
    render();return true}
  if(a==='pcEditOpen'){S.pcEdit=true;render();setTimeout(function(){var i=$('#pc-bal');if(i){try{i.scrollIntoView({block:'center'})}catch(e){}i.focus();i.select()}},40);return true}
  if(a==='pcEditClose'){S.pcEdit=false;render();return true}
  if(a==='pcSetBal'){
    var v=parseFloat($('#pc-bal').value),old=pcBal(),why=($('#pc-why').value||'').trim();
    if(isNaN(v)||v<0){toast('Enter the cash balance, 0 or more.',1);return true}
    var d=Math.round((v-old)*100)/100;
    if(!d){toast('Balance is already '+inr(old)+'.',1);return true}
    S.petty.entries.push({id:S.nextPc++,date:todayStr(),type:d>0?'in':'out',cat:'Balance correction',desc:'Balance corrected from '+inr(old)+' to '+inr(v)+(why?' · '+why:''),amt:Math.abs(d),to:'Admin'});
    S.pcEdit=false;toast('Balance set to '+inr(v)+'. A correction line is added in today’s ledger.');render();return true}
  if(a==='pcSetOpen'){
    var ov=parseFloat($('#pc-open').value),od=$('#pc-opend').value;
    if(isNaN(ov)||ov<0){toast('Enter the starting balance, 0 or more.',1);return true}
    if(!od||od>todayStr()){toast('Choose a start date up to today.',1);return true}
    var first=S.petty.entries.reduce(function(m,e){return !m||e.date<m?e.date:m},'');
    if(first&&od>first){toast('Start date cannot be after the first entry ('+fd(first)+').',1);return true}
    S.petty.opening=ov;S.petty.openDate=od;S.pcEdit=false;toast('Starting balance saved. Balance now is '+inr(pcBal())+'.');render();return true}
  if(a==='pcAskDel'){S.confirmPc=id;render();return true}
  if(a==='pcDelNo'){S.confirmPc=null;render();return true}
  if(a==='pcDel'){S.petty.entries=S.petty.entries.filter(function(e){return e.id!==id});S.confirmPc=null;toast('Entry deleted. Balance updated.');render();return true}
  return false;
}

/* ---------- data & backup ---------- */
function adminData(){
  function bt(k,label,cls){return S.confirmData===k?'<button class="btn '+(cls||'no')+'" data-act="dataDo" data-v="'+k+'">Click again to confirm</button>':'<button class="btn" data-act="dataAsk" data-v="'+k+'">'+label+'</button>'}
  return '<div class="stack"><div class="card"><h3 style="margin-bottom:6px">How this demo stores data</h3><p style="margin:0">Everything you type is saved automatically in <b>this browser on this device</b>. It stays after you close the page, but other phones and computers will not see it, and clearing the browser data removes it. Export a backup regularly.</p><p class="small muted" style="margin:10px 0 0">The shared company mobile, the admin phone and the manager all seeing the same live data needs the database version of the app (Supabase). This demo shows the screens and the logic.</p></div>'+
   '<div class="card"><h3 style="margin-bottom:10px">Backup</h3><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-act="dataExport">'+ic('file',15)+' Export backup (.json)</button><button class="btn" data-act="dataImport">Import backup</button></div><p class="small muted" style="margin:10px 0 0">Import replaces everything currently in this browser.</p></div>'+
   '<div class="card"><h3 style="margin-bottom:4px">Start with your real data</h3><p class="small muted" style="margin:0 0 12px">Remove the sample data, then fill in the real records. Your employee list, teams and rates are kept.</p><div style="display:flex;gap:8px;flex-wrap:wrap">'+bt('records','Clear attendance, work log, leave and advances')+bt('orders','Clear production items')+bt('petty','Clear petty cash')+bt('biz','Clear products and inventory')+'</div><p class="small muted" style="margin:12px 0 0">After clearing attendance, open <b>Employees → File</b> or the <b>Monthly report</b> and fill past months day by day. Use the month arrows to go back.</p></div>'+
   '<div class="card"><h3 style="margin-bottom:10px">Reset</h3>'+bt('reset','Reset everything to the sample data')+'</div></div>';
}
var TRANSIENT=['screen','role','selfie','cell','confirmDel','confirmProd','confirmInv','confirmOrder','confirmData','pairing','addOpen','photoTarget','orderOpen','q','tf','liveEdit','vfilter','pcEdit','confirmPc'];
var SKEY='avya_demo_v3',saveT=null;
function persist(){if(window.AvyaApi)AvyaApi.persist(S,TRANSIENT)}
function loadSaved(){return false}
function wipe(key){
  if(key==='records'){S.records=[];S.work=[];S.leaves=[];S.advances=[];S.blocked=[]}
  if(key==='orders'){S.orders=[]}
  if(key==='petty'){S.petty.entries=[];S.petty.opening=0;S.petty.openDate=addDays(todayStr(),-60)}
  if(key==='biz'){S.products=[{id:S.nextProd++,name:'New product',price:0,lines:[],img:null}];S.pid=S.products[0].id;S.inv=[];S.reqs=[]}
}

/* ---------- handlers ---------- */
var _bc=bizClick,_bch=bizChange;
bizClick=function(a,b){
  var id=+b.dataset.id,v=b.dataset.v,o,s,p;
  function ord(){return S.orders.filter(function(x){return x.id===+b.dataset.o})[0]}
  function stg(od){return od.stages.filter(function(x){return x.id===+b.dataset.s})[0]}
  if(a==='mshift'){var key=b.dataset.key,cur=S[key]||curMonth(),y=+cur.slice(0,4),m=+cur.slice(5,7)+(+b.dataset.d);if(m<1){m=12;y--}if(m>12){m=1;y++}var nm=y+'-'+pad(m);if(nm<MIN_MONTH||nm>curMonth()){toast(nm>curMonth()?'That month has not started yet.':'Records start from '+ml(MIN_MONTH)+'.',1);return true}S[key]=nm;S.cell=null;render();return true}
  if(a==='openEmp'){S.profEmp=id;S.pm=S.pm||curMonth();S.tab='profile';render();window.scrollTo(0,0);return true}
  if(a==='advAdd'||a==='profAdv'){
    var eid=a==='advAdd'?+$('#ad-emp').value:+b.dataset.e,amt=parseFloat($(a==='advAdd'?'#ad-amt':'#pa-amt').value),date=$(a==='advAdd'?'#ad-date':'#pa-date').value,note=$(a==='advAdd'?'#ad-note':'#pa-note').value.trim();
    if(isNaN(amt)||amt<=0){toast('Enter an amount above 0.',1);return true}
    if(!date||date>todayStr()){toast('Choose a date up to today.',1);return true}
    S.advances.push({id:S.nextAdv++,emp:eid,date:date,amt:amt,note:note,ded:{}});
    if(a==='advAdd'&&$('#ad-petty').checked)S.petty.entries.push({id:S.nextPc++,date:date<S.petty.openDate?S.petty.openDate:date,type:'out',cat:'Labour advance',desc:'Advance to '+emp(eid).name,amt:amt,to:emp(eid).name});
    toast('Advance of '+inr(amt)+' saved.');render();return true}
  if(a==='advDel'){S.advances=S.advances.filter(function(x){return x.id!==id});toast('Advance deleted.');render();return true}
  if(a==='salAuto'){var sgk=(+b.dataset.e)+':'+b.dataset.m;if(S.salGross)delete S.salGross[sgk];toast('Using approved hours × rate again.');render();return true}
  if(a==='profDedAll'){var e0=+b.dataset.e,ym=S.pm,total=outstanding(e0)+dedFor(e0,ym);setDed(e0,ym,total);toast('Full balance set to deduct in '+ml(ym)+'.');render();return true}
  if(a==='ordOpen'){S.orderOpen=S.orderOpen===id?null:id;render();return true}
  if(a==='ordAdd'){
    var lb=$('#on-label').value.trim(),qt=parseInt($('#on-qty').value,10),st=$('#on-start').value;
    if(!lb){toast('Write the item name.',1);return true}
    if(S.orders.some(function(x){return x.label.toLowerCase()===lb.toLowerCase()})){toast('An item with this name already exists.',1);return true}
    if(!(qt>0)){toast('Quantity must be 1 or more.',1);return true}
    if(!st){toast('Choose a start date.',1);return true}
    o={id:S.nextOrd++,label:lb,customer:$('#on-cust').value.trim(),qty:qt,start:st,stages:STAGE_T.map(function(x,i){return {id:i+1,name:x[0],days:x[1],start:null,done:null,assigned:[]}})};
    S.orders.push(o);S.orderOpen=o.id;toast('Item added. Adjust its stages and days.');render();return true}
  if(a==='ordDel'){S.confirmOrder=id;render();return true}
  if(a==='ordDelNo'){S.confirmOrder=null;render();return true}
  if(a==='ordDelYes'){S.orders=S.orders.filter(function(x){return x.id!==id});S.confirmOrder=null;S.orderOpen=null;toast('Item deleted.');render();return true}
  if(a==='stAdd'){o=ord();o.stages.push({id:o.stages.reduce(function(m,x){return Math.max(m,x.id)},0)+1,name:'New stage',days:1,start:null,done:null,assigned:[]});render();return true}
  if(a==='stDel'){o=ord();o.stages=o.stages.filter(function(x){return x.id!==+b.dataset.s});toast('Stage deleted.');render();return true}
  if(a==='stDone'){o=ord();s=stg(o);if(!s.start)s.start=todayStr()<o.start?o.start:todayStr();s.done=todayStr()<s.start?s.start:todayStr();toast(s.name+' marked done.');render();return true}
  if(a==='stClear'){o=ord();s=stg(o);s.done=null;toast('Stage reopened.');render();return true}
  if(a==='stUnassign'){o=ord();s=stg(o);s.assigned=s.assigned.filter(function(x){return x!==id});render();return true}
  if(a==='dataExport'){
    try{var oo={};for(var k in S){if(TRANSIENT.indexOf(k)<0)oo[k]=S[k]}var bl=new Blob([JSON.stringify(oo)],{type:'application/json'}),u=URL.createObjectURL(bl),l=document.createElement('a');l.href=u;l.download='avya-backup-'+todayStr()+'.json';document.body.appendChild(l);l.click();l.remove();setTimeout(function(){URL.revokeObjectURL(u)},2000);toast('Backup file created.')}catch(e){toast('Could not create the file here. Open the standalone file to export.',1)}
    return true}
  if(a==='dataImport'){$('#importFile').click();return true}
  if(a==='dataAsk'){S.confirmData=v;render();return true}
  if(a==='dataDo'){
    S.confirmData=null;
    if(v==='reset'){if(!window.AvyaApi){toast('The server is not reachable.',1);return true}AvyaApi.reset().then(function(){location.reload()}).catch(function(e){toast(e&&e.message?e.message:'Could not reset the data.',1)});return true}
    wipe(v);toast('Cleared.');render();return true}
  return _bc(a,b);
};
bizChange=function(el){
  var k=el.dataset.chg,val=parseFloat(el.value),txt=el.value.trim(),o,s;
  function ord(){return S.orders.filter(function(x){return x.id===+el.dataset.o})[0]}
  function ok(m){toast(m||'Saved.');render();return true}
  if(k==='salDed'||k==='profDed'){var eid=+el.dataset.e,ym=k==='salDed'?S.month:S.pm;if(isNaN(val)||val<0){toast('Enter an amount, 0 or more.',1);render();return true}
    var max=outstanding(eid)+dedFor(eid,ym),got=setDed(eid,ym,val);return ok(got<val?'Only '+inr(max)+' is outstanding. Deducted '+inr(got)+'.':'Deduction saved.')}
  if(k==='advAmt'){var a=S.advances.filter(function(x){return x.id===+el.dataset.id})[0];if(isNaN(val)||val<=0){toast('Enter an amount above 0.',1);render();return true}if(val<advPaid(a)){toast('Amount cannot be less than already deducted ('+inr(advPaid(a))+').',1);render();return true}a.amt=val;return ok()}
  if(k==='advNote'){S.advances.filter(function(x){return x.id===+el.dataset.id})[0].note=txt;return ok()}
  if(k==='salGross'){var ge=+el.dataset.e,gk=ge+':'+el.dataset.m;
    if(txt===''){if(S.salGross)delete S.salGross[gk];return ok('Gross reset to approved hours × rate.')}
    if(isNaN(val)||val<0){toast('Enter an amount, 0 or more.',1);render();return true}
    S.salGross=S.salGross||{};S.salGross[gk]=val;return ok('Gross pay saved.')}
  if(k==='pdDays'||k==='pdHours'){var e=+el.dataset.e,ds=el.dataset.d;
    if(k==='pdDays'){if(el.value===''||val===0){setDay(e,ds,0);return ok('Marked absent.')}if(isNaN(val)||val<0||val>3){toast('Days must be between 0 and 3.',1);render();return true}setDay(e,ds,val,null);return ok()}
    var rc=S.records.filter(function(r){return r.emp===e&&r.date===ds})[0];if(!rc){toast('Enter the days worked first.',1);render();return true}
    if(isNaN(val)||val<0||val>24){toast('Hours must be between 0 and 24.',1);render();return true}setDay(e,ds,unitsOf(rc),val);return ok()}
  if(k==='ordF'){o=ord();var f=el.dataset.k;
    if(f==='label'){if(!txt){toast('Name cannot be empty.',1);render();return true}if(S.orders.some(function(x){return x!==o&&x.label.toLowerCase()===txt.toLowerCase()})){toast('Another item has this name.',1);render();return true}S.work.forEach(function(w){if(w.item===o.label)w.item=txt});o.label=txt}
    else if(f==='customer')o.customer=txt;
    else if(f==='qty'){if(!(val>0)){toast('Quantity must be 1 or more.',1);render();return true}o.qty=Math.floor(val)}
    else if(f==='start'){if(!el.value){render();return true}o.start=el.value}
    return ok()}
  if(k==='stF'){o=ord();s=o.stages.filter(function(x){return x.id===+el.dataset.s})[0];var f2=el.dataset.k;
    if(f2==='name'){if(!txt){toast('Name cannot be empty.',1);render();return true}s.name=txt}
    else if(f2==='days'){if(isNaN(val)||val<0.5||val>60){toast('Planned days must be 0.5 to 60.',1);render();return true}s.days=val}
    else{var dv=el.value||null;if(f2==='done'&&dv){if(!s.start)s.start=dv;if(dv<s.start){toast('Done date cannot be before the start date.',1);render();return true}}if(f2==='start'&&dv&&s.done&&s.done<dv){toast('Start date cannot be after the done date.',1);render();return true}s[f2]=dv}
    return ok()}
  if(k==='stAssign'){if(!el.value){return true}o=ord();s=o.stages.filter(function(x){return x.id===+el.dataset.s})[0];var pid=+el.value;if(s.assigned.indexOf(pid)<0)s.assigned.push(pid);return ok('Person added to the stage.')}
  return _bch(el);
};
$('#importFile').addEventListener('change',function(ev){
  var f=ev.target.files&&ev.target.files[0];if(!f)return;
  var fr=new FileReader();  fr.onload=function(){try{var o=JSON.parse(fr.result);if(!o||!Array.isArray(o.emps)||!Array.isArray(o.records))throw 0;for(var k in o)S[k]=o[k];if(window.AvyaApi)AvyaApi.invalidate();toast('Backup imported.');render()}catch(e){toast('That file is not a valid Avya backup.',1)}};
  fr.readAsText(f);ev.target.value='';
});

/* ---------- render, selfie, punches ---------- */
function render(){
  var v=S.screen==='login'?loginView():S.role==='admin'?adminView():employeeView();
  $('#app').innerHTML=demoBar()+v;persist();
}
function setSelfie(url){S.selfie=url;render()}
function sampleSelfie(){
  var c=document.createElement('canvas');c.width=c.height=160;var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,160,160);g.addColorStop(0,'#6b84b8');g.addColorStop(1,'#1b2b52');x.fillStyle=g;x.fillRect(0,0,160,160);
  x.fillStyle='#d9b48a';x.beginPath();x.arc(80,66,30,0,7);x.fill();
  x.fillStyle='#2f4a5c';x.beginPath();x.ellipse(80,160,56,52,0,Math.PI,0);x.fill();
  x.fillStyle='rgba(255,255,255,.85)';x.font='600 11px sans-serif';x.fillText('SAMPLE',6,152);
  setSelfie(c.toDataURL('image/jpeg',.8));
}
function readImg(file,size,square,cb){
  if(!/^image\//.test(file.type)){toast('Please choose a photo.',1);return}
  var fr=new FileReader();
  fr.onload=function(){var im=new Image();im.onload=function(){
    var c=document.createElement('canvas'),x=c.getContext('2d');
    if(square){c.width=c.height=size;var m=Math.min(im.width,im.height);x.drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,size,size)}
    else{var s=Math.min(1,size/Math.max(im.width,im.height));c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);x.drawImage(im,0,0,c.width,c.height)}
    cb(c.toDataURL('image/jpeg',.82));
  };im.onerror=function(){toast('Could not read that photo.',1)};im.src=fr.result};
  fr.readAsDataURL(file);
}
$('#selfieFile').addEventListener('change',function(ev){var f=ev.target.files&&ev.target.files[0];if(!f)return;readImg(f,200,false,function(u){setSelfie(u)});ev.target.value=''});
$('#photoFile').addEventListener('change',function(ev){
  var f=ev.target.files&&ev.target.files[0],T=S.photoTarget;if(!f||!T)return;
  readImg(f,T.k==='emp'?160:240,true,function(u){
    var o=T.k==='emp'?emp(T.id):T.k==='prod'?S.products.filter(function(x){return x.id===T.id})[0]:S.inv.filter(function(x){return x.id===T.id})[0];
    if(!o)return;if(T.k==='emp')o.photo=u;else o.img=u;toast('Photo updated.');render()});ev.target.value='';
});
function gateCheck(){
  var e=emp(S.uid);
  if(S.device!=='company'){
    S.blocked.unshift({who:e.name,dev:'Redmi Note 12 (personal)',when:'Just now',why:'Device not registered'});
    toast('Blocked: this phone is not the authorized company mobile.',1);render();return false;
  }
  if(S.loc==='out'){toast('You are 380 m from the workshop. Move within 150 m.',1);return false}
  if(!S.selfie){toast('Take a selfie first.',1);return false}
  return true;
}
function checkin(){
  if(!gateCheck())return;
  if(openRec(S.uid)||todayRec(S.uid)){toast('Already checked in today.',1);return}
  var d=nowD();
  S.records.push({id:S.nextId++,emp:S.uid,date:ymd(d),inMin:d.getHours()*60+d.getMinutes(),inTs:d.getTime(),outMin:null,hours:0,dt:'full',approved:false,dist:42,selfie:S.selfie});
  S.selfie=null;toast('Checked in. Have a good shift.');render();
}
function checkout(){
  if(!gateCheck())return;
  var r=openRec(S.uid);if(!r)return;
  var d=nowD(),el=r.inTs?Math.round((d.getTime()-r.inTs)/60000):Math.max(0,d.getHours()*60+d.getMinutes()-r.inMin);
  r.outMin=r.inMin+el;
  r.hours=Math.max(0,Math.round((el-(el>300?60:0))/60*4)/4);
  r.dt=dtFor(r.hours);r.approved=false;S.selfie=null;
  toast('Checked out. '+H(r.hours)+' sent for approval.');render();
}

/* ---------- events ---------- */
document.addEventListener('click',function(ev){
  var b=ev.target.closest('[data-act]');if(!b)return;
  var a=b.dataset.act,v=b.dataset.v,id=+b.dataset.id;
  if(pcClick(a,b)||liveClick(a,b)||vidClick(a,b)||bizClick(a,b))return;
  if(a==='lrole'){S.loginRole=v;render()}
  else if(a==='login'){
    var adminLogin=S.loginRole==='admin',payload;
    if(adminLogin){
      if(!$('#lg-email').value.trim()||!$('#lg-pass').value){toast('Enter email and password.',1);return}
      payload={role:'admin',email:$('#lg-email').value.trim(),password:$('#lg-pass').value};
    }else{
      S.uid=+$('#lg-emp').value;
      if($('#lg-pin').value!=='1234'){toast('Wrong PIN. Demo PIN is 1234.',1);return}
      payload={role:'employee',employeeId:S.uid,pin:$('#lg-pin').value};
    }
    signIn(payload,adminLogin);
  }
  else if(a==='logout'){if(window.AvyaApi)AvyaApi.logout();S.screen='login';S.role=null;S.selfie=null;render()}
  else if(a==='dev'){S.device=v;render()}
  else if(a==='loc'){S.loc=v;render()}
  else if(a==='ff'){S.off+=480;toast('Demo clock moved forward 8 hours.');render()}
  else if(a==='tab'){S.tab=v;render();window.scrollTo(0,0)}
  else if(a==='etab'){S.etab=v;render();window.scrollTo(0,0)}
  else if(a==='month'){S.month=v;render()}
  else if(a==='emonth'){S.emonth=v;render()}
  else if(a==='pickSelfie'){$('#selfieFile').click()}
  else if(a==='sampleSelfie'){sampleSelfie()}
  else if(a==='checkin'){checkin()}
  else if(a==='checkout'){checkout()}
  else if(a==='approve'){S.records.forEach(function(r){if(r.id===id)r.approved=true});toast('Hours approved.');render()}
  else if(a==='approveAll'){var n=0;S.records.forEach(function(r){if(r.outMin!=null&&!r.approved){r.approved=true;n++}});toast(n+' records approved.');render()}
  else if(a==='leaveOk'||a==='leaveNo'){S.leaves.forEach(function(l){if(l.id===id)l.status=a==='leaveOk'?'approved':'rejected'});toast(a==='leaveOk'?'Leave approved.':'Leave rejected.');render()}
  else if(a==='addWork'){
    if(!todayRec(S.uid)){toast('Check in first, then add your work.',1);return}
    var wt=$('#wl-task').value,wi=$('#wl-item').value.trim(),wh=parseFloat($('#wl-hours').value),wn=$('#wl-note').value.trim();
    if(!wi){toast('Add the item or order you worked on.',1);return}
    if(isNaN(wh)||wh<=0||wh>12){toast('Hours must be between 0.25 and 12.',1);return}
    S.work.push({id:S.wid++,emp:S.uid,date:todayStr(),task:wt,item:wi,hours:Math.round(wh*4)/4,note:wn});
    toast('Work added to today’s log.');render();
  }
  else if(a==='delWork'){S.work=S.work.filter(function(w){return !(w.id===id&&w.emp===S.uid&&w.date===todayStr())});toast('Entry removed.');render()}
  else if(a==='toggleAdd'){S.addOpen=!S.addOpen;render()}
  else if(a==='addEmp'){
    var nm=$('#ne-name').value.trim(),rl=$('#ne-role').value.trim(),rt=parseFloat($('#ne-rate').value);
    if(!nm||!rl){toast('Enter name and role.',1);return}
    if(isNaN(rt)||rt<=0){toast('Enter an hourly rate above 0.',1);return}
    var nid=S.emps.reduce(function(x,e){return Math.max(x,e.id)},0)+1;
    S.emps.push({id:nid,name:nm,role:rl,team:$('#ne-team').value,lead:false,rate:rt,code:'AW-'+(100+nid),active:true,photo:null,mgr:/Manager/.test(rl)});
    S.addOpen=false;toast(nm+' added. You can add a photo now.');render();
  }
  else if(a==='askDel'){S.confirmDel=id;render()}
  else if(a==='cancelDel'){S.confirmDel=null;render()}
  else if(a==='doDel'){var e1=emp(id);e1.active=false;e1.lead=false;S.confirmDel=null;toast(e1.name+' removed. Past records are kept.');render()}
  else if(a==='restore'){var e2=emp(id);e2.active=true;toast(e2.name+' restored.');render()}
  else if(a==='pickPhoto'){S.photoTarget={k:'emp',id:id};$('#photoFile').click()}
  else if(a==='mkLead'){var e3=emp(id);S.emps.forEach(function(x){if(x.team===e3.team)x.lead=false});e3.lead=true;toast(e3.name+' is now team leader of '+tm(e3.team).name+'.');render()}
  else if(a==='sunWk'){var w=+v,i=S.sunWeeks.indexOf(w);if(i>=0)S.sunWeeks.splice(i,1);else S.sunWeeks.push(w);S.sun={};render()}
  else if(a==='sunTog'){var ds=b.dataset.d;S.sun[ds]=!sunOff(ds);render()}
  else if(a==='pair'){S.pairing=(1000+Math.floor(Math.random()*9000))+'-'+(1000+Math.floor(Math.random()*9000));render()}
  else if(a==='submitLeave'){
    var f=S.form;
    if(!f.from||!f.to){toast('Choose both dates.',1);return}
    if(f.to<f.from){toast('End date cannot be before the start date.',1);return}
    if(f.from<todayStr()){toast('Leave cannot start in the past.',1);return}
    if(!f.reason.trim()){toast('Add a short reason.',1);return}
    S.leaves.push({id:Date.now(),emp:S.uid,type:f.type,from:f.from,to:f.to,reason:f.reason.trim(),status:'pending'});
    S.form={type:'Casual',from:'',to:'',reason:''};toast('Leave request sent.');render();
  }
});
document.addEventListener('input',function(ev){
  var el=ev.target.closest('[data-inp]');if(!el)return;
  S.q=el.value;var p=el.selectionStart;render();var n=$('#emp-q');if(n){n.focus();try{n.setSelectionRange(p,p)}catch(e){}}
});
document.addEventListener('change',function(ev){
  var el=ev.target.closest('[data-chg]');if(!el)return;
  if(liveChange(el)||vidChange(el)||bizChange(el))return;
  var k=el.dataset.chg,id=+el.dataset.id;
  if(k==='wsel'){S[el.dataset.k]=el.value;render();return}
  if(k==='lvf'){S.form[el.dataset.k]=el.value;return}
  if(k==='tf'){S.tf=el.value;render();return}
  if(k==='team'){var e=emp(id);e.team=el.value;e.lead=false;toast(e.name+' moved to '+tm(e.team).name+'.');render();return}
  if(k==='dt'){S.records.forEach(function(r){if(r.id===id){r.dt=el.value;if(el.value==='half')r.hours=Math.min(r.hours,4);if(el.value!=='custom')r.units=null;else if(!r.units)r.units=1.5;}});toast('Day type set to '+DT[el.value].l+'.');render();return}
  var val=parseFloat(el.value);
  if(isNaN(val)||val<0){toast('Enter a valid number.',1);render();return}
  if(k==='hrs'){S.records.forEach(function(r){if(r.id===id)r.hours=Math.min(16,val)});toast('Hours updated.')}
  if(k==='rate'){emp(id).rate=val;toast('Rate updated.')}
  render();
});
setInterval(function(){var c=$('#clock');if(c)c.textContent=nowD().toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit',second:'2-digit'})},1000);
CEO.photo=portrait(11);

/* ---------- three-tier boot: browser <-> REST API <-> SQLite ---------- */
function applyState(st){
  if(!st||typeof st!=='object')return;
  Object.keys(st).forEach(function(k){if(TRANSIENT.indexOf(k)<0)S[k]=st[k]});
  if(Array.isArray(S.emps))S.emps.forEach(function(e){if(!e.photo)e.photo=portrait(e.id)});
}
function withInvCodes(){if(Array.isArray(S.inv))S.inv.forEach(function(i){i.code=invCode(i)})}
function signIn(payload,adminLogin){
  toast('Signing in…');
  AvyaApi.login(payload).then(function(){return AvyaApi.load()}).then(function(st){
    applyState(st);
    AvyaApi.markSynced(S,TRANSIENT);
    if(adminLogin){S.role='admin';S.tab='overview';S.screen='app'}
    else{S.uid=payload.employeeId;S.role='employee';S.etab='today';S.screen='app';S.emonth=todayStr().slice(0,7);S.efilter='all'}
    render();window.scrollTo(0,0);
  }).catch(function(e){toast(e&&e.message?e.message:'Could not sign in.',1)});
}
function bootFromApi(){
  AvyaApi.publicEmployees().then(function(people){
    if(people&&people.length){
      S.emps=people.map(function(p){return {id:p.id,name:p.name,role:p.role,team:p.team,lead:false,rate:0,code:p.code,active:p.isActive!==false,photo:null,mgr:/Manager/.test(p.role||'')}});
      if(!S.emps.some(function(e){return e.id===S.uid}))S.uid=S.emps[0].id;
    }
    withInvCodes();render();
  }).catch(function(){withInvCodes();render();toast('Could not reach the server. Start the backend and reload.',1)});
}
bootFromApi();

})();
