// ---- Shared by every page: data source, cart, header, footer, theme ----
const API = 'data/products.json'; // later: '/api/products' (nothing else changes)
const CATS = [['all','همه'],['disposable','یکبارمصرف'],['birthday','تم تولد'],['kitchen','آشپزخانه'],['hygiene','لوازم بهداشتی']];
const fa = n => Number(n).toLocaleString('fa-IR');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const Cart = {
  // دریافت سبد خرید از localStorage
  get() {
    try {
      return JSON.parse(localStorage.getItem('cart')) || {};
    } catch (error) {
      return {};
    }
  },

  // ذخیره سبد خرید
  save(cart) {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('خطا در ذخیره سبد خرید:', error);
    }

    this.badge();
  },

  // افزودن محصول
  add(id, q = 1) {
    const cart = this.get();
    const productId = Number(id);
    const quantity = Number(q);

    if (!Number.isInteger(productId) || productId <= 0 ||
        !Number.isInteger(quantity) || quantity <= 0) {
      return;
    }

    cart[productId] = (Number(cart[productId]) || 0) + quantity;

    this.save(cart);
  },

  // تغییر تعداد محصول
  update(id, quantity) {
    const cart = this.get();
    const productId = Number(id);
    const q = Number(quantity);

    if (!Number.isInteger(productId) || productId <= 0 ||
        !Number.isInteger(q)) {
      return;
    }

    if (q <= 0) {
      delete cart[productId];
    } else {
      cart[productId] = q;
    }

    this.save(cart);
  },

  // حذف یک محصول
  remove(id) {
    const cart = this.get();
    delete cart[id];
    this.save(cart);
  },

  // خالی کردن سبد
  clear() {
    this.save({});
  },

  // به‌روزرسانی تعداد کنار آیکون سبد
  badge() {
    const cart = this.get();

    const count = Object.values(cart).reduce(
      (total, quantity) => total + (Number(quantity) || 0),
      0
    );

    const element = document.getElementById('count');

    if (element) {
      element.textContent = fa(count);
      element.hidden = count === 0;
    }
  }
};

const card = p => `<article class="card overflow-hidden rounded-[1.5rem] ${p.stock ? '' : 'opacity-70'}">
<a href="product.html?id=${p.id}" class="block">
  <div class="grid h-36 place-items-center overflow-hidden text-6xl md:h-44 md:text-7xl"
       style="background:${p.bg || '#FFF1C9'}" aria-hidden="true">
    ${p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" class="h-full w-full object-contain p-3">`
      : (p.emoji || '🛍️')}
  </div>
</a>
<div class="flex items-end justify-between gap-2 p-4">
  <a href="product.html?id=${p.id}" class="min-w-0">
    <h3 class="font-bold">${esc(p.name)}</h3>
    <p class="mt-1 text-sm text-[var(--muted)]">
      <b class="text-base text-[var(--ink)]">${fa(p.price)}</b> تومان
    </p>
  </a>
  ${p.stock
    ? `<button data-add="${p.id}" class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FFC83D] text-2xl font-bold text-[#2B0A10]" aria-label="افزودن ${esc(p.name)} به سبد">+</button>`
    : `<span class="text-xs font-bold text-[var(--muted)]">ناموجود</span>`}
</div>
</article>`;

const ico = d => `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${d}</svg>`;
const NAV = [['landing.html','خانه'],['shop.html','فروشگاه'],['landing.html#faq','سوالات متداول'],['#foot','تماس با ما']];
const links = cls => NAV.map(([h,t]) => `<a href="${h}" class="${cls}">${t}</a>`).join('');
const brand = s => `<a href="landing.html" class="flex items-center gap-2"><svg class="${s}"><use href="#logo"/></svg><span class="d text-xl md:text-2xl">دلسا شاپ</span></a>`;

function mountShell(){
  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" class="absolute" aria-hidden="true"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#7D1420"/><stop offset="1" stop-color="#FF2A33"/></linearGradient></defs><symbol id="logo" viewBox="0 0 48 48"><path d="M24 3c11 0 21 7 21 20s-9 22-21 22S3 36 3 24 13 3 24 3z" fill="url(#g)"/><ellipse cx="24" cy="18" rx="6" ry="7.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M24 25.5V32" stroke="#fff" stroke-width="2"/><rect x="19" y="32" width="10" height="8" rx="1" fill="none" stroke="#fff" stroke-width="2"/></symbol></svg>`);
  document.getElementById('top').innerHTML = `<header class="relative z-20 mx-3 mt-3 flex max-w-5xl items-center justify-between gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur md:mx-auto md:mt-5 md:px-5">
<div class="flex items-center gap-2"><button id="menuBtn" class="grid h-10 w-10 place-items-center rounded-full bg-white/15 md:hidden" aria-label="باز کردن منو" aria-expanded="false">${ico('<path d="M4 7h16M4 12h16M4 17h16"/>')}</button>${brand('h-9 w-9')}</div>
<nav class="hidden gap-6 text-sm text-white/90 md:flex">${links('')}</nav>
<div class="flex items-center gap-1.5"><a href="cart.html"
   class="relative grid h-10 w-10 place-items-center rounded-full bg-white/15"
   aria-label="سبد خرید">

  ${ico('<path d="M3 4h2l2.4 11h10.2L20 8H6.5"/><circle cx="9" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/>')}

  <span id="count" hidden
        class="absolute -top-1 -left-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#FFC83D] px-1 text-xs font-bold text-[#2B0A10]">
    0
  </span>
</a>
<button id="tBtn" class="grid h-10 w-10 place-items-center rounded-full bg-white/15" aria-label="تغییر حالت روشن و تیره"><span class="ic-sun">${ico('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>')}</span><span class="ic-moon">${ico('<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>')}</span></button></div></header>`;
  document.getElementById('foot-slot').innerHTML = `<footer id="foot" class="mt-16 bg-[#2A0A10] px-5 py-12 text-white"><div class="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between"><div>${brand('h-12 w-12')}<p class="mt-3 text-sm text-white/70">مهرشهر، کرج. یکبارمصرف و تم تولد.</p></div><nav class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">${links('')}</nav></div></footer>
<div id="ov" class="ov fixed inset-0 z-40 bg-black/55"></div>
<aside id="drawer" class="drawer fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85%] flex-col bg-[#2A0A10] p-6 text-white" inert aria-label="منو"><div class="mb-8 flex items-center justify-between">${brand('h-12 w-12')}<button class="close grid h-10 w-10 place-items-center rounded-full bg-white/10" aria-label="بستن منو">✕</button></div><nav class="flex flex-col gap-1 text-lg">${links('rounded-xl px-3 py-3 hover:bg-white/10')}</nav></aside>`;

  // mobile drawer
  const d = document.getElementById('drawer'), o = document.getElementById('ov'), b = document.getElementById('menuBtn');
  const setMenu = v => { d.classList.toggle('open', v); o.classList.toggle('show', v); v ? d.removeAttribute('inert') : d.setAttribute('inert',''); b.setAttribute('aria-expanded', v); document.body.style.overflow = v ? 'hidden' : ''; };
  b.onclick = () => setMenu(true); o.onclick = () => setMenu(false);
  d.querySelectorAll('a,.close').forEach(e => e.onclick = () => setMenu(false));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  // theme
  const R = document.documentElement;
  document.getElementById('tBtn').onclick = () => { const t = R.dataset.theme === 'light' ? 'dark' : 'light'; R.dataset.theme = t; try { localStorage.setItem('theme', t); } catch(e){} };
  Cart.badge();
}

// one listener for every "+" button on any page
document.addEventListener('click', e => {
  const b = e.target.closest('[data-add]'); if (!b) return;
  Cart.add(+b.dataset.add); const t = b.textContent; b.textContent = '✓'; setTimeout(() => b.textContent = t, 900);
});
document.addEventListener('DOMContentLoaded', mountShell);
