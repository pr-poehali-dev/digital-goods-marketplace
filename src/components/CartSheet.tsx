import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: 'Войдите в систему', description: 'Для покупки необходимо войти', variant: 'destructive' });
      return;
    }

    try {
      const orderItems = items.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
        quantity: item.quantity
      }));

      const result = await api.createOrder(user.id, orderItems);
      
      clearCart();
      onOpenChange(false);
      
      toast({
        title: 'Оплата успешна!',
        description: `Заказ #${result.order_id} оформлен. Ключи отправлены вам!`
      });
      
      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Ошибка оплаты',
        description: 'Попробуйте позже',
        variant: 'destructive'
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon name="ShoppingCart" />
            Корзина ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 opacity-30" />
              <p>Корзина пуста</p>
            </div>
          ) : (
            items.map(item => {
              const itemPrice = item.discount 
                ? item.price * (1 - item.discount / 100)
                : item.price;
              
              return (
                <div key={item.id} className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">x{item.quantity}</span>
                    <span className="text-lg font-bold text-primary">{itemPrice.toFixed(0)}₽</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="mt-6 flex-col gap-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Итого:</span>
              <span className="text-primary">{total.toFixed(0)}₽</span>
            </div>
            <Button 
              className="w-full glow" 
              size="lg"
              onClick={handleCheckout}
              disabled={!isAuthenticated}
            >
              <Icon name="CreditCard" className="mr-2" />
              {isAuthenticated ? 'Оплатить' : 'Войдите для оплаты'}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
