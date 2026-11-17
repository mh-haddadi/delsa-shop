const norm = s => String(s).replace(/ي/g,'ی').replace(/ك/g,'ک').trim();
const S = { q:'', cat:new URLSearchParams(location.search).get('cat') || 'all', sort:'sales' };
let all = [];
const $ = id => document.getElementById(id);
const SORTS = { sales:(a,b)=>b.sales-a.sales, cheap:(a,b)=>a.price-b.price, pricey:(a,b)=>b.price-a.price };

function render(){
  const l = all.filter(p => (S.cat === 'all' || p.category === S.cat) && norm(p.name).includes(norm(S.q))).sort(SORTS[S.sort]);
  $('grid').innerHTML = l.map(card).join('');
  $('empty').hidden = !!l.length;
  $('total').textContent = fa(l.length) + ' محصول';
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.cat === S.cat));
}

$('chips').innerHTML = CATS.map(([k,t]) => `<button class="chip" data-cat="${k}">${t}</button>`).join('');
$('chips').onclick = e => { const c = e.target.closest('.chip'); if (!c) return; S.cat = c.dataset.cat; history.replaceState(null,'', S.cat === 'all' ? '/shop.html' : '?cat=' + S.cat); render(); };
$('q').oninput = e => { S.q = e.target.value; render(); };
$('sort').onchange = e => { S.sort = e.target.value; render(); };
$('reset').onclick = () => { S.q = ''; S.cat = 'all'; $('q').value = ''; render(); };

fetch(API).then(r => r.json()).then(d => { all = d; render(); })
  .catch(() => { $('grid').innerHTML = '<p class="col-span-full py-10 text-center text-[var(--muted)]">محصولات بارگذاری نشد. صفحه را دوباره باز کن.</p>'; });
