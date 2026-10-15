const $=s=>document.querySelector(s);
const on=(s,e,f)=>{const x=$(s);if(x)x['on'+e]=f};
const store={get(k){try{return new Set(JSON.parse(localStorage.getItem(k)||'[]'))}catch(e){return new Set()}},
 set(k,v){try{localStorage.setItem(k,JSON.stringify([...v]))}catch(e){}}};
const JOBS=[
 {id:1,t:'Стажёр-frontend разработчик',c:'Яндекс',d:'IT',city:'Москва',f:'Гибрид',pay:60},
 {id:2,t:'Стажёр по маркетингу',c:'Сбер',d:'Маркетинг',city:'Москва',f:'Офис',pay:45},
 {id:3,t:'Junior UX/UI дизайнер',c:'Тинькофф',d:'Дизайн',city:'Удалённо',f:'Удалённо',pay:50},
 {id:4,t:'Стажёр-аналитик данных',c:'VK',d:'IT',city:'Санкт-Петербург',f:'Гибрид',pay:55},
 {id:5,t:'Помощник юриста',c:'Газпром нефть',d:'Право',city:'Санкт-Петербург',f:'Офис',pay:35},
 {id:6,t:'Стажёр-инженер',c:'Росатом',d:'Инженерия',city:'Москва',f:'Офис',pay:40}];
let dir='Все',fav=store.get('fav'),applied=store.get('applied'),cur=null,mode='';
const emailOk=v=>/^\S+@\S+\.\S+$/.test(v);

function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.id);toast.id=setTimeout(()=>t.style.display='none',2500)}

/* каталог (только на странице jobs.html) */
function render(){
 const q=$('#q').value.trim().toLowerCase(),city=$('#city').value;
 const a=JOBS.filter(j=>(dir==='Все'||j.d===dir)&&(!city||j.city===city)&&(!q||(j.t+j.c).toLowerCase().includes(q)));
 $('#list').innerHTML=a.length?a.map(j=>`<div class="card">
  <div class="co">${j.c}</div><h3>${j.t}</h3><div class="pay">от ${j.pay} 000 ₽</div>
  <div class="tags"><span>${j.d}</span><span>${j.city}</span><span>${j.f}</span></div>
  <div class="foot"><button class="btn small" data-apply="${j.id}">${applied.has(j.id)?'Вы откликнулись ✓':'Откликнуться'}</button>
  <button class="fav${fav.has(j.id)?' on':''}" data-fav="${j.id}">♥</button></div></div>`).join(''):'<div class="empty">Ничего не найдено</div>';
}
if($('#list')){
 const dirs=['Все',...new Set(JOBS.map(j=>j.d))];
 $('#chips').innerHTML=dirs.map(d=>`<button class="chip${d==='Все'?' on':''}" data-d="${d}">${d}</button>`).join('');
 $('#chips').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;dir=b.dataset.d;
  document.querySelectorAll('#chips .chip').forEach(c=>c.classList.toggle('on',c===b));render()};
 $('#q').oninput=render;$('#city').onchange=render;
 $('#list').onclick=e=>{
  const f=e.target.closest('[data-fav]'),a=e.target.closest('[data-apply]');
  if(f){const id=+f.dataset.fav;fav.has(id)?fav.delete(id):fav.add(id);store.set('fav',fav);render()}
  if(a){const j=JOBS.find(x=>x.id==a.dataset.apply);if(applied.has(j.id))return toast('Вы уже откликнулись');openModal('apply',j)}};
 render();
}

/* модальное окно (на всех страницах) */
function openModal(m,j){mode=m;cur=j;
 $('#mt').textContent=m==='apply'?'Отклик':m==='login'?'Вход':'Создать профиль';
 $('#md').textContent=j?`${j.t} — ${j.c}`:'Введите имя и email';
 $('#err').textContent='';$('#ov').classList.add('on')}
const closeModal=()=>$('#ov').classList.remove('on');
on('#loginBtn','click',()=>openModal('login'));
on('#profileBtn','click',()=>openModal('profile'));
on('#cancel','click',closeModal);
on('#ov','click',e=>{if(e.target.id==='ov')closeModal()});
on('#send','click',()=>{
 const n=$('#f1').value.trim(),m=$('#f2').value.trim();
 if(n.length<2)return $('#err').textContent='Введите имя';
 if(!emailOk(m))return $('#err').textContent='Введите корректный email';
 if(mode==='apply'){applied.add(cur.id);store.set('applied',applied);render();toast('Отклик отправлен: '+cur.c)}else toast('Добро пожаловать, '+n+'!');
 $('#f1').value=$('#f2').value='';closeModal()});

/* формы (подписка, заявка, сообщение) */
document.querySelectorAll('form[data-ok]').forEach(f=>f.onsubmit=e=>{e.preventDefault();
 const m=f.querySelector('input[type=email]');
 if(!emailOk(m.value.trim()))return toast('Введите корректный email');
 f.reset();toast(f.dataset.ok)});
