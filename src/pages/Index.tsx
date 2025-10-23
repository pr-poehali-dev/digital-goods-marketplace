import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const categories = [
  { name: 'Игры', icon: 'Gamepad2', count: 1250 },
  { name: 'Ключи', icon: 'Key', count: 890 },
  { name: 'Аккаунты', icon: 'UserCircle', count: 640 },
  { name: 'ПО', icon: 'Box', count: 420 },
  { name: 'Гифты', icon: 'Gift', count: 780 }
];

const products = [
  { id: 1, name: 'Grand Theft Auto V', category: 'Игры', price: 899, badge: 'ХИТ', discount: 20 },
  { id: 2, name: 'Windows 11 Pro', category: 'ПО', price: 1299, badge: 'НОВИНКА' },
  { id: 3, name: 'Steam Gift Card 1000₽', category: 'Гифты', price: 950, badge: 'ВЫГОДНО', discount: 5 },
  { id: 4, name: 'Spotify Premium (12 мес)', category: 'Аккаунты', price: 599 },
  { id: 5, name: 'Cyberpunk 2077', category: 'Игры', price: 1599, badge: 'ХИТ' },
  { id: 6, name: 'Adobe Creative Cloud', category: 'ПО', price: 2499 }
];

const faqs = [
  { q: 'Как быстро я получу товар?', a: 'Цифровые товары доставляются мгновенно после оплаты на вашу электронную почту.' },
  { q: 'Безопасны ли покупки?', a: 'Все платежи защищены SSL-шифрованием. Мы работаем только с проверенными поставщиками.' },
  { q: 'Что делать, если ключ не активировался?', a: 'Свяжитесь с нашей поддержкой в течение 24 часов, и мы заменим товар или вернём деньги.' },
  { q: 'Есть ли гарантия на товары?', a: 'Да, на все товары действует гарантия от 30 дней до 1 года в зависимости от категории.' }
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow">
              <Icon name="Zap" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold glow-text">STEELTRADE</h1>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <a href="#catalog" className="hover:text-primary transition-colors">Каталог</a>
            <a href="#guarantees" className="hover:text-primary transition-colors">Гарантии</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="ShoppingCart" size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full text-xs flex items-center justify-center">3</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="User" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
              Тысячи цифровых товаров
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Игры, ключи, гифты и ПО по низким ценам с быстрой доставкой и безопасными сделками
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="glow text-lg px-8">
                <Icon name="Search" className="mr-2" size={20} />
                Начать покупки
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Как купить?
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">Категории товаров</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {categories.map((cat, i) => (
              <Card 
                key={cat.name}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:glow animate-slide-up ${selectedCategory === cat.name ? 'ring-2 ring-primary glow' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <Icon name={cat.icon as any} size={32} className="text-white" />
                  </div>
                  <h4 className="font-semibold mb-1">{cat.name}</h4>
                  <p className="text-sm text-muted-foreground">{cat.count} товаров</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-8 flex justify-between items-center">
            <h3 className="text-2xl font-bold">
              {selectedCategory ? `${selectedCategory}` : 'Популярные товары'}
            </h3>
            {selectedCategory && (
              <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
                <Icon name="X" className="mr-2" size={16} />
                Сбросить фильтр
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => (
              <Card key={product.id} className="group hover:glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.badge && (
                        <Badge className="bg-secondary">{product.badge}</Badge>
                      )}
                      {product.discount && (
                        <Badge variant="destructive">-{product.discount}%</Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon name="Package" size={64} className="text-primary/30" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <Badge variant="outline" className="mb-2">{product.category}</Badge>
                  <h4 className="font-semibold mb-2 text-lg">{product.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{product.price}₽</span>
                    {product.discount && (
                      <span className="text-sm line-through text-muted-foreground">
                        {Math.round(product.price / (1 - product.discount / 100))}₽
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full glow-pulse">
                    <Icon name="ShoppingCart" className="mr-2" size={16} />
                    Купить
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="guarantees" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center">Наши гарантии</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:glow transition-all">
              <CardContent className="pt-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={40} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Безопасность</h4>
                <p className="text-muted-foreground">Все платежи защищены SSL-шифрованием. Ваши данные в безопасности.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:glow transition-all">
              <CardContent className="pt-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Icon name="Zap" size={40} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Мгновенная доставка</h4>
                <p className="text-muted-foreground">Получите товар на почту сразу после оплаты. Никаких ожиданий.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:glow transition-all">
              <CardContent className="pt-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Icon name="HeadphonesIcon" size={40} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Поддержка 24/7</h4>
                <p className="text-muted-foreground">Наша команда всегда готова помочь решить любой вопрос.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">Часто задаваемые вопросы</h3>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:text-primary">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Остались вопросы?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами любым удобным способом, и мы ответим в течение 5 минут
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="glow">
              <Icon name="MessageCircle" className="mr-2" size={20} />
              Telegram
            </Button>
            <Button size="lg" variant="outline">
              <Icon name="Mail" className="mr-2" size={20} />
              Email
            </Button>
            <Button size="lg" variant="outline">
              <Icon name="Phone" className="mr-2" size={20} />
              Телефон
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="Zap" className="text-white" size={24} />
                </div>
                <h4 className="text-xl font-bold">STEELTRADE</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Ваш надёжный маркетплейс цифровых товаров
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Каталог</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Игры</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Ключи</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Аккаунты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">ПО</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Информация</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Как купить</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Гарантии</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Поддержка</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  support@steeltrade.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={16} />
                  @steeltrade_support
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 STEELTRADE. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
