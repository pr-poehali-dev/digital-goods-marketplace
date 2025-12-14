import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Токен подтверждения не найден');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `https://functions.poehali.dev/984f1f7f-8a0a-47b4-9ced-eff8492aff62?token=${token}`
        );
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email успешно подтверждён!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Ошибка подтверждения');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Не удалось подтвердить email');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-12 pb-8">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
                  <Icon name="Mail" className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Проверяем email...</h2>
                <p className="text-muted-foreground">Пожалуйста, подождите</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow">
                  <Icon name="CheckCircle" className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-primary">Готово!</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Button onClick={() => navigate('/')} className="glow">
                  <Icon name="Home" className="mr-2" size={16} />
                  На главную
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  <Icon name="XCircle" className="text-destructive" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-destructive">Ошибка</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Button onClick={() => navigate('/')} variant="outline">
                  <Icon name="Home" className="mr-2" size={16} />
                  Вернуться на главную
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
