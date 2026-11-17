const id = +new URLSearchParams(location.search).get('id'), box = document.getElementById('box');
const notFound = () => { box.innerHTML = '<div class="py-20 text-center"><p class="d text-3xl">این محصول پیدا نشد</p><a href="/shop.html" class="btn sun mt-6">برگشت به فروشگاه</a></div>'; };

function show(p, all){
  document.title = p.name + ' | دلسا شاپ';
  const cat = (CATS.find(c => c[0] === p.category) || [])[1] || '';
  const stock = !p.stock ? 'ناموجود' : p.stock <= 10 ? `فقط ${fa(p.stock)} عدد مانده` : 'موجود در انبار';
  box.innerHTML = `<nav class="mb-6 text-sm text-[var(--muted)]"><a href="/shop.html" class="underline underline-offset-4">فروشگاه</a> / <a href="/shop.html?cat=${p.category}" class="underline underline-offset-4">${cat}</a></nav>
<div class="grid gap-8 md:grid-cols-2 md:gap-12">
<div class="grid h-72 place-items-center rounded-[2rem] text-[8rem] md:h-[28rem] md:text-[12rem]" style="background:${p.bg}" aria-hidden="true">${p.emoji}</div>
<div class="flex flex-col"><h1 class="d text-4xl md:text-5xl">${esc(p.name)}</h1>
<p class="mt-4 text-3xl font-bold">${fa(p.price)} <span class="text-base font-medium text-[var(--muted)]">تومان</span></p>
<p class="mt-2 text-sm font-bold ${p.stock ? 'text-[#2BB3A6]' : 'text-[var(--red)]'}">${stock}</p>
<p class="mt-5 max-w-md leading-8 text-[var(--muted)]">${esc(p.desc)}</p>
${p.stock ? `<div class="mt-8 flex flex-wrap items-center gap-3"><div class="step" role="group" aria-label="تعداد"><button id="plus" aria-label="افزایش">+</button><output id="qty" aria-live="polite">${fa(1)}</output><button id="minus" aria-label="کاهش">−</button></div><button id="add" class="btn sun flex-1 md:flex-none">افزودن به سبد</button></div>` : ''}
</div></div>
<section class="mt-16"><h2 class="d mb-6 text-2xl md:text-3xl">محصولات مشابه</h2><div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">${all.filter(x => x.category === p.category && x.id !== p.id).slice(0,4).map(card).join('')}</div></section>`;

  if (!p.stock) return;
  let q = 1; const out = document.getElementById('qty');
  const set = n => { q = Math.min(p.stock, Math.max(1, n)); out.textContent = fa(q); };
  document.getElementById('plus').onclick = () => set(q + 1);
  document.getElementById('minus').onclick = () => set(q - 1);
  document.getElementById('add').onclick = e => { Cart.add(p.id, q); e.target.textContent = 'به سبد اضافه شد'; setTimeout(() => e.target.textContent = 'افزودن به سبد', 1200); };
}

fetch(API).then(r => r.json()).then(d => { const p = d.find(x => x.id === id); p ? show(p, d) : notFound(); }).catch(notFound);
