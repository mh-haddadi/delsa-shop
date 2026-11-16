/* ===== ۱) منوی موبایل (کشویی) ===== */
const drawer = document.getElementById('drawer');   // خود منو
const overlay = document.getElementById('ov');      // پس‌زمینه تیره
const menuBtn = document.getElementById('menuBtn'); // دکمه همبرگری

// منو را باز (true) یا بسته (false) می‌کند
function setMenu(open) {
  drawer.classList.toggle('open', open);  // کلاس open منو را به داخل صفحه می‌آورد
  overlay.classList.toggle('show', open); // پس‌زمینه تیره را نشان می‌دهد
  if (open) drawer.removeAttribute('inert'); else drawer.setAttribute('inert', ''); // وقتی بسته است قابل فوکوس نباشد
  menuBtn.setAttribute('aria-expanded', open);       // برای صفحه‌خوان‌ها
  document.body.style.overflow = open ? 'hidden' : ''; // وقتی منو بازه صفحه اسکرول نشود
}
menuBtn.onclick = () => setMenu(true);   // کلیک روی همبرگر: باز شود
overlay.onclick = () => setMenu(false);  // کلیک روی پس‌زمینه: بسته شود
drawer.querySelectorAll('a,.close').forEach(el => el.onclick = () => setMenu(false)); // کلیک روی لینک یا ✕: بسته شود
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });        // کلید Esc: بسته شود

/* ===== ۲) جستجو ===== */
const searchBtn = document.getElementById('sBtn');
const searchForm = document.getElementById('sForm');
const searchInput = document.getElementById('sInput');
let scrolled = false; // برای اینکه فقط یک بار به بخش محصولات اسکرول کنیم

// با دکمه جستجو، فرم نمایش داده یا مخفی می‌شود
searchBtn.onclick = () => {
  const willShow = searchForm.hidden;
  searchForm.hidden = !willShow;
  searchBtn.setAttribute('aria-expanded', willShow);
  if (willShow) searchInput.focus(); // مکان‌نما بره داخل کادر
};
searchForm.onsubmit = e => e.preventDefault(); // جلوگیری از رفرش شدن صفحه با Enter

// هر بار که کاربر تایپ می‌کند، کارت‌هایی که نامشان شامل متن نیست مخفی می‌شوند
searchInput.oninput = () => {
  const q = searchInput.value.trim();
  document.querySelectorAll('#best article').forEach(card => {
    card.hidden = !!q && !card.querySelector('h3').textContent.includes(q);
  });
  if (q && !scrolled) { scrolled = true; document.getElementById('best').scrollIntoView({ behavior: 'smooth' }); }
  if (!q) scrolled = false;
};

/* ===== ۳) تغییر تم تیره/روشن ===== */
const themeBtn = document.getElementById('tBtn');
const root = document.documentElement; // همان تگ html
// متن توضیح دکمه را متناسب با تم فعلی تنظیم می‌کند
const updateThemeLabel = () => themeBtn.setAttribute('aria-label', root.dataset.theme === 'light' ? 'تغییر به حالت تیره' : 'تغییر به حالت روشن');
updateThemeLabel();
themeBtn.onclick = () => {
  const t = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = t;  // CSS بر اساس data-theme رنگ‌ها را عوض می‌کند
  updateThemeLabel();
  try { localStorage.setItem('theme', t); } catch (e) {} // انتخاب کاربر را در مرورگر ذخیره می‌کند
};

/* ===== ۴) شمارنده سبد خرید (فعلاً فقط نمایشی؛ بعداً به بک‌اند وصل می‌شود) ===== */
let cartCount = 0;
const countBadge = document.getElementById('count');
document.querySelectorAll('[data-add]').forEach(btn => btn.onclick = () => {
  cartCount++;
  countBadge.textContent = cartCount.toLocaleString('fa-IR'); // عدد فارسی
  countBadge.hidden = false;
});

/* ===== ۵) ظرف‌های یکبارمصرف در حال سقوط در بخش بالای صفحه ===== */
const rain = document.querySelector('.rain');
const kinds = ['cup', 'plate', 'fork', 'spoon'];                       // نوع شکل‌ها (همان آیکون‌های بالای فایل)
const viewBoxes = { cup: '0 0 60 80', plate: '0 0 100 100', fork: '0 0 30 100', spoon: '0 0 30 100' };
const colors = ['#FFC83D', '#FF5C8A', '#2BB3A6', '#FFFFFF', '#FF8A5C']; // رنگ‌ها
for (let i = 0; i < 20; i++) {          // ۲۰ تا شکل می‌سازد
  const kind = kinds[i % 4];
  const size = 28 + Math.random() * 52;   // اندازه تصادفی
  const isNear = size > 56;               // بزرگ‌ترها «نزدیک‌تر» هستند: تارتر و کندتر
  const color = colors[i % 5];
  const h = kind === 'plate' ? size : size * 1.3;
  const w = kind === 'plate' ? size : h * (kind === 'cup' ? .75 : .3);
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('viewBox', viewBoxes[kind]);
  el.setAttribute('class', 'fx');         // کلاس fx در CSS انیمیشن سقوط دارد
  el.innerHTML = `<use href="#${kind}"/>`;
  // موقعیت، رنگ، شفافیت، تاری و سرعت تصادفی
  el.style.cssText = `left:${Math.random() * 96}%;width:${w}px;height:${h}px;color:${color};opacity:${color === '#FFFFFF' ? .22 : isNear ? .3 : .55};filter:blur(${isNear ? 2.5 : 0}px);--r:${Math.random() * 360}deg;--sw:${(Math.random() * 2 - 1) * 60}px;--t:${Math.random() * 85}%;animation-duration:${isNear ? 22 + Math.random() * 8 : 11 + Math.random() * 7}s;animation-delay:-${Math.random() * 20}s`;
  rain.appendChild(el);
}