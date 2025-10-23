CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount INTEGER DEFAULT 0,
    badge VARCHAR(50),
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    product_key TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    product_key TEXT
);

INSERT INTO products (name, category, description, price, discount, badge, stock, product_key) VALUES
('Grand Theft Auto V', 'Игры', 'Легендарная игра с открытым миром. Ключ активации для Steam.', 899, 20, 'ХИТ', 50, 'XXXXX-XXXXX-XXXXX'),
('Windows 11 Pro', 'ПО', 'Лицензионный ключ активации Windows 11 Professional. Бессрочная лицензия.', 1299, 0, 'НОВИНКА', 100, 'XXXXX-XXXXX-XXXXX'),
('Steam Gift Card 1000₽', 'Гифты', 'Пополнение кошелька Steam на 1000 рублей. Моментальная доставка кода.', 950, 5, 'ВЫГОДНО', 200, 'XXXXX-XXXXX-XXXXX'),
('Spotify Premium (12 мес)', 'Аккаунты', 'Готовый аккаунт Spotify Premium на 12 месяцев. Полный доступ.', 599, 0, NULL, 30, 'login:pass'),
('Cyberpunk 2077', 'Игры', 'Футуристическая RPG в Night City. Ключ для GOG платформы.', 1599, 0, 'ХИТ', 40, 'XXXXX-XXXXX-XXXXX'),
('Adobe Creative Cloud', 'ПО', 'Подписка на все приложения Adobe на 1 год. Photoshop, Illustrator и др.', 2499, 0, NULL, 20, 'account@email.com:pass'),
('FIFA 24', 'Игры', 'Последняя версия футбольного симулятора. Origin ключ.', 2999, 15, 'НОВИНКА', 60, 'XXXXX-XXXXX-XXXXX'),
('Microsoft Office 2024', 'ПО', 'Полный пакет Office: Word, Excel, PowerPoint. Лицензия навсегда.', 1899, 10, NULL, 80, 'XXXXX-XXXXX-XXXXX'),
('Netflix Premium (6 мес)', 'Аккаунты', 'Премиум аккаунт Netflix на 6 месяцев. 4K качество, 4 экрана.', 1299, 0, 'ВЫГОДНО', 25, 'login:pass'),
('Elden Ring', 'Игры', 'Эпическая souls-like RPG от FromSoftware. Steam ключ.', 1999, 25, 'ХИТ', 45, 'XXXXX-XXXXX-XXXXX'),
('Apple Music (12 мес)', 'Аккаунты', 'Годовая подписка Apple Music. Доступ ко всей библиотеке.', 799, 0, NULL, 35, 'account@icloud.com:pass'),
('PlayStation Plus (12 мес)', 'Гифты', 'Годовая подписка PS Plus. Бесплатные игры каждый месяц.', 3499, 0, 'ВЫГОДНО', 50, 'code-XXXXX-XXXXX');

INSERT INTO users (email, password_hash, full_name, is_admin) VALUES
('admin@steeltrade.ru', '$2b$10$admin_hash_placeholder', 'Администратор', TRUE);