
const cartContent = document.getElementById('cartContent');

// محصولات دریافت‌شده از سرور
let currentProducts = [];

// نمایش سبد خرید خالی
function showEmptyCart() {
  cartContent.innerHTML = `
    <div class="card rounded-3xl p-10 text-center">
      <div class="text-6xl">🛒</div>

      <h2 class="d mt-5 text-3xl">
        سبد خریدت خالیه!
      </h2>

      <p class="mt-3 text-[var(--muted)]">
        هنوز محصولی به سبد خرید اضافه نکردی.
      </p>

      <a href="shop.html" class="btn sun mt-6">
        رفتن به فروشگاه
      </a>
    </div>
  `;
}

// نمایش محصولات
function renderCart(products, cart) {

  const items = products.filter(product =>
    cart[product.id] && Number(cart[product.id]) > 0
  );

  if (items.length === 0) {
    showEmptyCart();
    return;
  }

  let total = 0;

  const html = items.map(product => {

    const quantity = Number(cart[product.id]);
    const subtotal = product.price * quantity;

    total += subtotal;

    return `
      <article class="card flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center">

        <div class="grid h-24 w-full shrink-0 place-items-center rounded-2xl bg-[#FFF1C9] text-4xl sm:w-24">
          ${
            product.image
              ? `<img src="${esc(product.image)}" alt="${esc(product.name)}" class="h-full w-full object-contain p-2">`
              : '🛍️'
          }
        </div>

        <div class="flex-1">
          <h3 class="font-bold text-lg">
            ${esc(product.name)}
          </h3>

          <p class="mt-2 text-sm text-[var(--muted)]">
            قیمت واحد: ${fa(product.price)} تومان
          </p>

          <div class="step mt-3" role="group" aria-label="تغییر تعداد">

            <button
              data-action="increase"
              data-id="${product.id}"
              aria-label="افزایش تعداد"
              ${quantity >= product.stock ? 'disabled' : ''}
            >+</button>

            <output>${fa(quantity)}</output>

            <button
              data-action="decrease"
              data-id="${product.id}"
              aria-label="کاهش تعداد"
            >−</button>

          </div>

          ${
            quantity > product.stock
              ? `<p class="mt-2 text-sm text-[var(--red)]">موجودی کافی نیست؛ موجودی فعلی: ${fa(product.stock)}</p>`
              : ''
          }

        </div>

        <div class="flex items-center justify-between gap-3 sm:flex-col sm:items-end">

          <strong class="text-lg">
            ${fa(subtotal)} تومان
          </strong>

          <button
            data-action="remove"
            data-id="${product.id}"
            class="text-sm font-bold text-[var(--red)]"
          >
            حذف محصول
          </button>

        </div>

      </article>
    `;
  }).join('');

  cartContent.innerHTML = `
    <div class="grid gap-6 lg:grid-cols-3">

      <section class="space-y-4 lg:col-span-2">
        ${html}
      </section>

      <aside class="card h-fit rounded-3xl p-6">
        <h2 class="d text-2xl">خلاصه سفارش</h2>

        <div class="mt-6 flex justify-between gap-3">
          <span class="text-[var(--muted)]">مجموع خرید</span>
          <span class="font-bold">${fa(total)} تومان</span>
        </div>

        <div class="my-5 border-t border-[var(--line)]"></div>

        <div class="flex justify-between gap-3">
          <span class="font-bold">مبلغ نهایی</span>
          <span class="font-bold text-lg">${fa(total)} تومان</span>
        </div>

        <button class="btn sun mt-6 w-full" disabled>
          ادامه فرایند خرید (به‌زودی)
        </button>

        <a href="shop.html" class="mt-4 block text-center text-sm text-[var(--muted)] underline">
          بازگشت به فروشگاه
        </a>
      </aside>

    </div>
  `;
}

// مدیریت کلیک روی دکمه‌ها
cartContent.addEventListener('click', event => {

  const button = event.target.closest('[data-action]');

  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  const cart = Cart.get();
  const quantity = Number(cart[id]) || 0;

  const product = currentProducts.find(p => p.id === id);

  if (!product) return;

  if (action === 'increase') {

    if (quantity < product.stock) {
      Cart.update(id, quantity + 1);
    }

  } else if (action === 'decrease') {

    Cart.update(id, quantity - 1);

  } else if (action === 'remove') {

    Cart.remove(id);

  }

  // به‌روزرسانی صفحه بعد از تغییر سبد
  renderCart(currentProducts, Cart.get());
});

// دریافت اطلاعات از API
async function loadCart() {

  const cart = Cart.get();

  if (Object.keys(cart).length === 0) {
    showEmptyCart();
    return;
  }

  try {

    const response = await fetch('/api/products');

    if (!response.ok) {
      throw new Error('خطا در دریافت محصولات');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error('دریافت اطلاعات ناموفق بود');
    }

    currentProducts = result.data;

    renderCart(currentProducts, cart);

  } catch (error) {

    console.error(error);

    cartContent.innerHTML = `
      <div class="card rounded-3xl p-8 text-center">
        <p class="font-bold text-[var(--red)]">
          دریافت اطلاعات سبد خرید ناموفق بود.
        </p>

        <button onclick="loadCart()" class="btn sun mt-5">
          تلاش مجدد
        </button>
      </div>
    `;
  }
}

loadCart();
