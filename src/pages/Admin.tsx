import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, Product } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Игры',
    description: '',
    price: '',
    discount: '',
    badge: '',
    stock: '',
    product_key: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      navigate('/');
      return;
    }
    loadProducts();
  }, [user, isAuthenticated, navigate]);

  const loadProducts = async () => {
    const data = await api.getProducts();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProduct({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseInt(formData.discount) : 0,
        badge: formData.badge || undefined,
        stock: parseInt(formData.stock),
        image_url: undefined,
        product_key: formData.product_key,
        is_active: true
      });
      
      toast({
        title: 'Товар добавлен',
        description: 'Товар успешно добавлен в каталог'
      });
      
      setFormData({
        name: '',
        category: 'Игры',
        description: '',
        price: '',
        discount: '',
        badge: '',
        stock: '',
        product_key: ''
      });
      
      loadProducts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive'
      });
    }
  };

  if (!user?.is_admin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow">
              <Icon name="Zap" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold glow-text">STEELTRADE - Админ</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="Home" className="mr-2" size={16} />
              Главная
            </Button>
            <Button variant="ghost" onClick={() => navigate('/profile')}>
              <Icon name="User" className="mr-2" size={16} />
              Профиль
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Plus" size={24} />
                Добавить товар
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Игры">Игры</SelectItem>
                      <SelectItem value="Ключи">Ключи</SelectItem>
                      <SelectItem value="Аккаунты">Аккаунты</SelectItem>
                      <SelectItem value="ПО">ПО</SelectItem>
                      <SelectItem value="Гифты">Гифты</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Цена (₽)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Скидка (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={formData.discount}
                      onChange={e => setFormData({...formData, discount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="badge">Бейдж</Label>
                    <Input
                      id="badge"
                      value={formData.badge}
                      onChange={e => setFormData({...formData, badge: e.target.value})}
                      placeholder="ХИТ, НОВИНКА"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Количество</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="product_key">Ключ/Логин</Label>
                  <Input
                    id="product_key"
                    value={formData.product_key}
                    onChange={e => setFormData({...formData, product_key: e.target.value})}
                    placeholder="XXXXX-XXXXX или login:pass"
                    required
                  />
                </div>

                <Button type="submit" className="w-full glow">
                  <Icon name="Plus" className="mr-2" size={16} />
                  Добавить товар
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Package" size={24} />
                Товары в каталоге ({products.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              <div className="space-y-3">
                {products.map(product => (
                  <div key={product.id} className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{product.price}₽</p>
                        <p className="text-sm text-muted-foreground">Осталось: {product.stock}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
