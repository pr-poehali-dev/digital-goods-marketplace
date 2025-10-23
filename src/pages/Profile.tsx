import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api, Order } from '@/lib/api';
import Icon from '@/components/ui/icon';

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (user) {
      api.getUserOrders(user.id).then(setOrders);
    }
  }, [user, isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow">
              <Icon name="Zap" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold glow-text">STEELTRADE</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="Home" className="mr-2" size={16} />
              Главная
            </Button>
            {user.is_admin && (
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                <Icon name="Settings" className="mr-2" size={16} />
                Админ
              </Button>
            )}
            <Button variant="outline" onClick={logout}>
              <Icon name="LogOut" className="mr-2" size={16} />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="User" size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.full_name || 'Пользователь'}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.is_admin && (
                    <Badge className="mt-1 bg-secondary">Администратор</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Icon name="ShoppingBag" size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{orders.length}</h3>
                  <p className="text-sm text-muted-foreground">Всего покупок</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                  <Icon name="Wallet" size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{user.balance.toFixed(2)}₽</h3>
                  <p className="text-sm text-muted-foreground">Баланс</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="History" size={24} />
              История покупок
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 opacity-30" />
                <p>У вас пока нет покупок</p>
                <Button className="mt-4" onClick={() => navigate('/')}>
                  Перейти в каталог
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold">Заказ #{order.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{order.total_amount}₽</p>
                          <Badge>{order.status === 'completed' ? 'Выполнен' : 'В обработке'}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-primary font-semibold">{item.price}₽</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <Icon name="Key" size={16} className="text-muted-foreground" />
                              <code className="text-sm bg-background px-2 py-1 rounded">{item.key}</code>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
