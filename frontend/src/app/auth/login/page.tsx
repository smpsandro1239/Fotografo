'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { Camera, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Bem-vindo de volta!');
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao entrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Camera className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-center">Entrar na conta</CardTitle>
          <CardDescription className="text-center">
            Aceda ao seu painel de fotógrafo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="A sua password"
                  className="pl-10 pr-10"
                  {...register('password', { required: 'Password é obrigatória' })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'A entrar...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Esqueceu a password?{' '}
            <Link href="/auth/forgot-password" className="text-primary hover:underline font-medium">
              Recuperar
            </Link>
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Não tem conta?{' '}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              Criar conta
            </Link>
          </p>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground text-center">
            ← Voltar ao site
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}