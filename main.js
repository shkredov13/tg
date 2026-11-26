// ============================================
// БАЗА ДАННЫХ (localStorage)
// ============================================
const DB = {
    KEYS: {
        CART: 'mile_cart',
        ORDERS: 'mile_orders',
        SUBMISSIONS: 'mile_submissions',
        VISITS: 'mile_visits'
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('DB read error:', e);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            this.updateCounter();
            return true;
        } catch (e) {
            console.error('DB write error:', e);
            return false;
        }
    },

    push(key, item) {
        const arr = this.get(key) || [];
        arr.push(item);
        return this.set(key, arr);
    },

    clear(key) {
        localStorage.removeItem(key);
        this.updateCounter();
    },

    updateCounter() {
        const orders = this.get(this.KEYS.ORDERS) || [];
        const submissions = this.get(this.KEYS.SUBMISSIONS) || [];
        const total = orders.length + submissions.length;
        const el = document.getElementById('dbCount');
        if (el) el.textContent = total;
    },

    initVisits() {
        let visits = this.get(this.KEYS.VISITS) || 0;
        visits++;
        this.set(this.KEYS.VISITS, visits);
    }
};

// ============================================
// Product data
// ============================================
const products = [
    { id: 1, name: 'Сыворотка с витамином C', category: 'skincare', categoryName: 'Уход за лицом', price: 3500, oldPrice: 4200, badge: 'sale', badgeText: 'Скидка', description: 'Концентрированная сыворотка с 15% витамином C для сияния и выравнивания тона кожи.', fullDescription: 'Профессиональная сыворотка с высокой концентрацией витамина C (15%) и гиалуроновой кислотой. Осветляет пигментацию, стимулирует выработку коллагена, придаёт коже сияние. Подходит для всех типов кожи.', features: ['Объём: 30 мл', 'Концентрация витамина C: 15%', 'Срок годности: 12 месяцев', 'Производство: Франция'], icon: 'serum' },
    { id: 2, name: 'Увлажняющий крем премиум', category: 'skincare', categoryName: 'Уход за лицом', price: 4800, badge: 'new', badgeText: 'Новинка', description: 'Интенсивно увлажняющий крем с пептидами и маслом жожоба для зрелой кожи.', fullDescription: 'Роскошный увлажняющий крем с комплексом пептидов и натуральным маслом жожоба. Глубоко питает, разглаживает морщины, восстанавливает защитный барьер кожи. Идеален для зрелой и сухой кожи.', features: ['Объём: 50 мл', 'Содержит пептиды', 'Натуральный состав', 'Гипоаллергенный'], icon: 'cream' },
    { id: 3, name: 'Тканевая маска с золотом', category: 'skincare', categoryName: 'Уход за лицом', price: 890, description: 'Омолаживающая тканевая маска с частицами 24-каратного золота.', fullDescription: 'Премиальная тканевая маска с экстрактом золота 24 карата. Мгновенно освежает, подтягивает и придаёт коже роскошное сияние. Идеальна перед важным событием.', features: ['1 маска в упаковке', 'Содержит золото 24К', 'Время применения: 20 мин', 'Эффект лифтинга'], icon: 'mask' },
    { id: 4, name: 'Тоник с гиалуроновой кислотой', category: 'skincare', categoryName: 'Уход за лицом', price: 2400, description: 'Увлажняющий тоник для ежедневного ухода с низкомолекулярной гиалуроновой кислотой.', fullDescription: 'Лёгкий увлажняющий тоник с низкомолекулярной гиалуроновой кислотой и экстрактом зелёного чая. Подготовка кожи к нанесению сыворотки и крема, мгновенное увлажнение.', features: ['Объём: 200 мл', 'pH-баланс', 'Без спирта', 'Для всех типов кожи'], icon: 'toner' },
    { id: 5, name: 'Подарочный сертификат 5000₽', category: 'certificates', categoryName: 'Сертификаты', price: 5000, badge: 'popular', badgeText: 'Популярно', description: 'Подарочный сертификат на любую услугу центра МИЛЕ номиналом 5000 рублей.', fullDescription: 'Идеальный подарок для близкого человека. Сертификат действителен 12 месяцев, может быть использован на любую услугу центра лазерной косметологии МИЛЕ. Оформлен в премиальной упаковке.', features: ['Номинал: 5000 ₽', 'Срок действия: 12 мес', 'Премиальная упаковка', 'Персональное поздравление'], icon: 'certificate' },
    { id: 6, name: 'Подарочный сертификат 10000₽', category: 'certificates', categoryName: 'Сертификаты', price: 10000, description: 'Подарочный сертификат на любую услугу центра МИЛЕ номиналом 10000 рублей.', fullDescription: 'Премиальный подарочный сертификат для особого случая. Действителен на все услуги центра, включая инъекционную и аппаратную косметологию. Роскошная подарочная упаковка.', features: ['Номинал: 10000 ₽', 'Срок действия: 12 мес', 'Люксовая упаковка', 'Доставка курьером'], icon: 'certificate' },
    { id: 7, name: 'Набор "Сияние кожи"', category: 'sets', categoryName: 'Наборы', price: 8900, oldPrice: 11200, badge: 'sale', badgeText: 'Выгодно', description: 'Комплексный набор для домашнего ухода: сыворотка, крем, тоник и маска.', fullDescription: 'Полный набор для профессионального домашнего ухода за лицом. Включает сыворотку с витамином C, увлажняющий крем, тоник с гиалуроновой кислотой и 5 тканевых масок. Экономия 2300₽.', features: ['4 продукта в наборе', 'Экономия 2300 ₽', 'Премиальная коробка', 'Инструкция по применению'], icon: 'set' },
    { id: 8, name: 'Масло для тела с золотом', category: 'body', categoryName: 'Уход за телом', price: 3200, badge: 'new', badgeText: 'Новинка', description: 'Питательное масло для тела с экстрактом золота и маслом арганы.', fullDescription: 'Роскошное масло для тела с частицами золота и маслом арганы. Глубоко питает, делает кожу шелковистой, придаёт лёгкое сияние. Идеально после душа или для массажа.', features: ['Объём: 150 мл', 'Масло арганы', 'Частицы золота', 'Быстро впитывается'], icon: 'oil' },
    { id: 9, name: 'Пилинг-скатка для лица', category: 'skincare', categoryName: 'Уход за лицом', price: 2100, description: 'Мягкий энзимный пилинг-скатка для деликатного отшелушивания кожи.', fullDescription: 'Инновационный пилинг-скатка с фруктовыми энзимами. Мягко отшелушивает ороговевшие клетки, не травмируя кожу. Подходит для чувствительной кожи, можно использовать 1-2 раза в неделю.', features: ['Объём: 100 мл', 'Фруктовые энзимы', 'Для чувствительной кожи', 'Без агрессивных кислот'], icon: 'peeling' },
    { id: 10, name: 'Набор "Анти-эйдж"', category: 'sets', categoryName: 'Наборы', price: 12500, oldPrice: 15800, badge: 'sale', badgeText: 'Хит', description: 'Премиальный антивозрастной набор: сыворотка, крем, масло и 10 масок.', fullDescription: 'Максимальный антивозрастной уход в одном наборе. Включает сыворотку с ретинолом, антивозрастной крем с пептидами, масло для контура глаз и 10 золотых масок. Видимый результат через 2 недели.', features: ['4 продукта + 10 масок', 'Экономия 3300 ₽', 'Ретинол и пептиды', 'Видимый результат'], icon: 'set' },
    { id: 11, name: 'Скраб для тела с кофе', category: 'body', categoryName: 'Уход за телом', price: 1800, description: 'Натуральный кофейный скраб для тела с антицеллюлитным эффектом.', fullDescription: 'Натуральный скраб для тела на основе молотого кофе и кокосового масла. Отшелушивает, стимулирует кровообращение, борется с целлюлитом. Приятный кофейный аромат.', features: ['Объём: 250 г', '100% натуральный', 'Антицеллюлитный', 'Кокосовое масло'], icon: 'scrub' },
    { id: 12, name: 'Подарочный сертификат 3000₽', category: 'certificates', categoryName: 'Сертификаты', price: 3000, description: 'Подарочный сертификат на любую услугу центра МИЛЕ номиналом 3000 рублей.', fullDescription: 'Универсальный подарочный сертификат для знакомства с центром МИЛЕ. Действителен на все базовые услуги: уход за лицом, лазерная эпиляция, массаж. Красивая подарочная упаковка.', features: ['Номинал: 3000 ₽', 'Срок действия: 12 мес', 'Подарочная упаковка', 'Открытка в подарок'], icon: 'certificate' }
];

// SVG Icons for products
const productIcons = {
    serum: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="serumGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0ebe3;stop-opacity:1" /><stop offset="100%" style="stop-color:#d4c9b5;stop-opacity:1" /></linearGradient><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e8d5a3;stop-opacity:1" /><stop offset="100%" style="stop-color:#c9a961;stop-opacity:1" /></linearGradient></defs><rect x="35" y="10" width="30" height="15" rx="3" fill="url(#goldGrad)"/><rect x="40" y="25" width="20" height="10" fill="#5a5a5a"/><path d="M 30 35 L 70 35 L 75 120 Q 75 130 65 130 L 35 130 Q 25 130 25 120 Z" fill="url(#serumGrad)" stroke="#c9a961" stroke-width="1"/><rect x="35" y="50" width="30" height="40" rx="2" fill="white" opacity="0.6"/><text x="50" y="75" text-anchor="middle" font-size="8" fill="#3d3d3d" font-weight="bold">MILE</text></svg>`,
    cream: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="creamGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" /><stop offset="100%" style="stop-color:#f0ebe3;stop-opacity:1" /></linearGradient><linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e8d5a3;stop-opacity:1" /><stop offset="100%" style="stop-color:#c9a961;stop-opacity:1" /></linearGradient></defs><ellipse cx="50" cy="85" rx="35" ry="8" fill="#d4c9b5" opacity="0.3"/><path d="M 20 40 L 20 80 Q 20 90 30 90 L 70 90 Q 80 90 80 80 L 80 40 Z" fill="url(#creamGrad)" stroke="#c9a961" stroke-width="1"/><ellipse cx="50" cy="40" rx="30" ry="8" fill="url(#goldGrad2)"/><rect x="25" y="55" width="50" height="20" rx="2" fill="white" opacity="0.6"/><text x="50" y="70" text-anchor="middle" font-size="8" fill="#3d3d3d" font-weight="bold">MILE</text></svg>`,
    mask: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="maskGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#faf8f5;stop-opacity:1" /><stop offset="100%" style="stop-color:#e8d5a3;stop-opacity:1" /></linearGradient></defs><rect x="20" y="20" width="60" height="100" rx="5" fill="url(#maskGrad)" stroke="#c9a961" stroke-width="1"/><rect x="25" y="25" width="50" height="90" rx="3" fill="none" stroke="#c9a961" stroke-width="0.5"/><text x="50" y="65" text-anchor="middle" font-size="10" fill="#3d3d3d" font-weight="bold">MILE</text><text x="50" y="80" text-anchor="middle" font-size="6" fill="#7a7a7a">GOLD MASK</text><circle cx="50" cy="95" r="8" fill="#c9a961" opacity="0.3"/></svg>`,
    toner: `<svg viewBox="0 0 100 160" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="tonerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" /><stop offset="100%" style="stop-color:#f0ebe3;stop-opacity:1" /></linearGradient><linearGradient id="goldGrad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e8d5a3;stop-opacity:1" /><stop offset="100%" style="stop-color:#c9a961;stop-opacity:1" /></linearGradient></defs><rect x="40" y="10" width="20" height="20" rx="2" fill="url(#goldGrad3)"/><rect x="35" y="30" width="30" height="10" fill="#5a5a5a"/><rect x="30" y="40" width="40" height="110" rx="3" fill="url(#tonerGrad)" stroke="#c9a961" stroke-width="1"/><rect x="35" y="60" width="30" height="50" rx="2" fill="white" opacity="0.6"/><text x="50" y="85" text-anchor="middle" font-size="7" fill="#3d3d3d" font-weight="bold">MILE</text><text x="50" y="98" text-anchor="middle" font-size="5" fill="#7a7a7a">TONER</text></svg>`,
    certificate: `<svg viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="certGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#faf8f5;stop-opacity:1" /><stop offset="100%" style="stop-color:#e8d5a3;stop-opacity:1" /></linearGradient></defs><rect x="10" y="10" width="120" height="70" rx="3" fill="url(#certGrad)" stroke="#c9a961" stroke-width="2"/><rect x="15" y="15" width="110" height="60" rx="2" fill="none" stroke="#c9a961" stroke-width="0.5"/><text x="70" y="35" text-anchor="middle" font-size="12" fill="#3d3d3d" font-weight="bold" letter-spacing="2">MILE</text><text x="70" y="50" text-anchor="middle" font-size="7" fill="#7a7a7a">GIFT CERTIFICATE</text><text x="70" y="65" text-anchor="middle" font-size="10" fill="#c9a961" font-weight="bold">★ ★ ★</text></svg>`,
    set: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="setGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#faf8f5;stop-opacity:1" /><stop offset="100%" style="stop-color:#d4c9b5;stop-opacity:1" /></linearGradient><linearGradient id="goldGrad4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e8d5a3;stop-opacity:1" /><stop offset="100%" style="stop-color:#c9a961;stop-opacity:1" /></linearGradient></defs><rect x="10" y="30" width="100" height="60" rx="5" fill="url(#setGrad)" stroke="#c9a961" stroke-width="1"/><rect x="15" y="35" width="90" height="50" rx="3" fill="none" stroke="#c9a961" stroke-width="0.5"/><path d="M 60 30 L 70 20 L 80 30 L 70 40 Z" fill="url(#goldGrad4)"/><path d="M 60 30 L 50 20 L 40 30 L 50 40 Z" fill="url(#goldGrad4)"/><text x="60" y="65" text-anchor="middle" font-size="10" fill="#3d3d3d" font-weight="bold">MILE</text><text x="60" y="78" text-anchor="middle" font-size="6" fill="#7a7a7a">GIFT SET</text></svg>`,
    oil: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="oilGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0ebe3;stop-opacity:1" /><stop offset="100%" style="stop-color:#c9a961;stop-opacity:1" /></linearGradient><linearGradient id="goldGrad5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e8d5a3;stop-opacity:1" /><stop offset="100%" style="stop-color:#a88a4a;stop-opacity:1" /></linearGradient></defs><rect x="35" y="10" width="30" height="15" rx="3" fill="url(#goldGrad5)"/><rect x="42" y="25" width="16" height="10" fill="#5a5a5a"/><path d="M 32 35 L 68 35 L 72 115 Q 72 128 58 128 L 42 128 Q 28 128 28 115 Z" fill="url(#oilGrad)" stroke="#a88a4a" stroke-width="1"/><rect x="36" y="55" width="28" height="40" rx="2" fill="white" opacity="0.7"/><text x="50" y="75" text-anchor="middle" font-size="7" fill="#3d3d3d" font-weight="bold">MILE</text><text x="50" y="87" text-anchor="middle" font-size="5" fill="#7a7a7a">BODY OIL</text></svg>`,
    peeling: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="peelGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" /><stop offset="100%" style="stop-color:#f0ebe3;stop-opacity:1" /></linearGradient><linearGradient id="goldGrad6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e8d5a3;stop-opacity:1" /><stop offset="100%" style="stop-color:#c9a961;stop-opacity:1" /></linearGradient></defs><ellipse cx="50" cy="85" rx="32" ry="7" fill="#d4c9b5" opacity="0.3"/><path d="M 22 42 L 22 78 Q 22 88 32 88 L 68 88 Q 78 88 78 78 L 78 42 Z" fill="url(#peelGrad)" stroke="#c9a961" stroke-width="1"/><ellipse cx="50" cy="42" rx="28" ry="7" fill="url(#goldGrad6)"/><rect x="28" y="55" width="44" height="20" rx="2" fill="white" opacity="0.6"/><text x="50" y="70" text-anchor="middle" font-size="7" fill="#3d3d3d" font-weight="bold">MILE</text></svg>`,
    scrub: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="scrubGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8b6f47;stop-opacity:1" /><stop offset="100%" style="stop-color:#5a4530;stop-opacity:1" /></linearGradient><linearGradient id="goldGrad7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e8d5a3;stop-opacity:1" /><stop offset="100%" style="stop-color:#c9a961;stop-opacity:1" /></linearGradient></defs><ellipse cx="50" cy="95" rx="32" ry="7" fill="#d4c9b5" opacity="0.3"/><path d="M 22 35 L 22 88 Q 22 95 30 95 L 70 95 Q 78 95 78 88 L 78 35 Z" fill="url(#scrubGrad)" stroke="#c9a961" stroke-width="1"/><ellipse cx="50" cy="35" rx="28" ry="7" fill="url(#goldGrad7)"/><rect x="28" y="50" width="44" height="25" rx="2" fill="white" opacity="0.3"/><text x="50" y="68" text-anchor="middle" font-size="7" fill="white" font-weight="bold">MILE</text><circle cx="35" cy="75" r="2" fill="#c9a961"/><circle cx="50" cy="80" r="2" fill="#c9a961"/><circle cx="65" cy="75" r="2" fill="#c9a961"/></svg>`
};

// ============================================
// Cart state
// ============================================
let cart = DB.get(DB.KEYS.CART) || [];

// Render products
function renderProducts(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    grid.innerHTML = filtered.map(product => `
        <div class="product-card fade-in" data-id="${product.id}" onclick="openModal(${product.id})">
            ${product.badge ? `<div class="product-badge ${product.badge}">${product.badgeText}</div>` : ''}
            <div class="product-image">
                ${productIcons[product.icon]}
                <div class="quick-view">Быстрый просмотр</div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.categoryName}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">
                        ${product.price.toLocaleString()} ₽
                        ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
                    </div>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">+</button>
                </div>
            </div>
        </div>
    `).join('');

    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 50);
        });
    }, 100);
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// Modal functions
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalImage').innerHTML = productIcons[product.icon];
    document.getElementById('modalCategory').textContent = product.categoryName;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').innerHTML = `
        ${product.price.toLocaleString()} ₽
        ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
    `;
    document.getElementById('modalDescription').textContent = product.fullDescription;
    document.getElementById('modalFeatures').innerHTML = product.features.map(f => `<li>${f}</li>`).join('');
    document.getElementById('modalAddToCart').onclick = () => {
        addToCart(productId);
        closeModal();
    };

    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target.id === 'productModal') closeModal();
});

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    DB.set(DB.KEYS.CART, cart);
    showNotification(`${product.name} добавлен в корзину`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    DB.set(DB.KEYS.CART, cart);
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            DB.set(DB.KEYS.CART, cart);
        }
    }
}

function updateCart() {
    const badge = document.getElementById('cartBadge');
    const items = document.getElementById('cartItems');
    const total = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    badge.textContent = totalItems;
    total.textContent = totalPrice.toLocaleString() + ' ₽';
    
    if (cart.length === 0) {
        items.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Ваша корзина пуста</p></div>`;
    } else {
        items.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${productIcons[item.icon]}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} ₽</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        `).join('');
    }
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total: total
    };
    DB.push(DB.KEYS.ORDERS, order);
    
    alert(`Заказ оформлен!\nНомер: ${order.id}\nСумма: ${total.toLocaleString()} ₽\n\nМы свяжемся с вами для подтверждения.`);
    cart = [];
    DB.set(DB.KEYS.CART, cart);
    updateCart();
    toggleCart();
}

// Notification
function showNotification(text) {
    const notif = document.getElementById('notification');
    document.getElementById('notificationText').textContent = text;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

// Form submission
function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {
        id: 'SUB-' + Date.now(),
        date: new Date().toISOString(),
        name: formData.get('name'),
        phone: formData.get('phone'),
        branch: formData.get('branch'),
        service: formData.get('service'),
        comment: formData.get('comment') || ''
    };
    
    DB.push(DB.KEYS.SUBMISSIONS, data);
    
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '✓ Заявка сохранена!';
    btn.style.background = 'var(--gold)';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        form.reset();
        alert(`Спасибо, ${data.name}!\n\nВаша заявка №${data.id} принята.\nФилиал: ${data.branch}\nУслуга: ${data.service}\n\nМы перезвоним вам в течение 15 минут.`);
    }, 1500);
}

// Navbar scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Scroll animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -80px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ============================================
// Инициализация
// ============================================
DB.initVisits();
DB.updateCounter();
renderProducts();
updateCart();

console.log('%c МИЛЕ · База данных ', 'background: #c9a961; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
console.log('Таблицы:');
console.log('  • mile_cart — корзина');
console.log('  • mile_orders — заказы');
console.log('  • mile_submissions — заявки');
console.log('  • mile_visits — посещения');