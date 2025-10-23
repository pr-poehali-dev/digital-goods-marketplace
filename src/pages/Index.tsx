import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api, Product } from '@/lib/api';
import { AuthDialog } from '@/components/AuthDialog';
import { CartSheet } from '@/components/CartSheet';

const categories = [
  { name: 'Игры', icon: 'Gamepad2' },
  { name: 'Ключи', icon: 'Key' },
  { name: 'Аккаунты', icon: 'UserCircle' },
  { name: 'ПО', icon: 'Box' },
  { name: 'Гифты', icon: 'Gift' }
];

const faqs = [
  { q: 'Как быстро я получу товар?', a: 'Цифровые товары доставляются мгновенно после оплаты на вашу электронную почту.' },
  { q: 'Безопасны ли покупки?', a: 'Все платежи защищены SSL-шифрованием. Мы работаем только с проверенными поставщиками.' },
  { q: 'Что делать, если ключ не активировался?', a: 'Свяжитесь с нашей поддержкой в течение 24 часов, и мы заменим товар или вернём деньги.' },
  { q: 'Есть ли гарантия на товары?', a: 'Да, на все товары действует гарантия от 30 дней до 1 года в зависимости от категории.' }
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { addToCart, itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    const data = await api.getProducts(selectedCategory || undefined);
    setProducts(data);
  };

  const filteredProducts = products.slice(0, 12);

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
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
              <Icon name="ShoppingCart" size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                  <Icon name="User" size={20} />
                </Button>
                {user?.is_admin && (
                  <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
                    <Icon name="Settings" size={20} />
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  <Icon name="LogOut" className="mr-2" size={16} />
                  Выйти
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => setAuthOpen(true)}>
                <Icon name="LogIn" className="mr-2" size={16} />
                Войти
              </Button>
            )}
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
              <Button size="lg" className="glow text-lg px-8" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
                <Icon name="Search" className="mr-2" size={20} />
                Начать покупки
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
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-8 flex justify-between items-center">
            <h3 className="text-2xl font-bold">
              {selectedCategory || 'Все товары'}
            </h3>
            {selectedCategory && (
              <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
                <Icon name="X" className="mr-2" size={16} />
                Сбросить
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => (
              <Card key={product.id} className="group hover:glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.badge && (
                        <Badge className="bg-secondary">{product.badge}</Badge>
                      )}
                      {product.discount && product.discount > 0 && (
                        <Badge variant="destructive">-{product.discount}%</Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon name="Package" size={64} className="text-primary/30" />
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <Badge variant="outline" className="mb-2">{product.category}</Badge>
                  <h4 className="font-semibold mb-2 text-lg">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {product.discount 
                        ? (product.price * (1 - product.discount / 100)).toFixed(0)
                        : product.price}₽
                    </span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-sm line-through text-muted-foreground">
                        {product.price}₽
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">В наличии: {product.stock}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full glow-pulse" 
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <Icon name="ShoppingCart" className="mr-2" size={16} />
                    {product.stock > 0 ? 'В корзину' : 'Нет в наличии'}
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
                <p className="text-muted-foreground">Все платежи защищены. Ваши данные в безопасности.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:glow transition-all">
              <CardContent className="pt-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Icon name="Zap" size={40} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Мгновенная доставка</h4>
                <p className="text-muted-foreground">Получите товар сразу после оплаты.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:glow transition-all">
              <CardContent className="pt-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Icon name="HeadphonesIcon" size={40} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Поддержка 24/7</h4>
                <p className="text-muted-foreground">Всегда готовы помочь решить любой вопрос.</p>
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

      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 STEELTRADE. Все права защищены.</p>
        </div>
      </footer>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
