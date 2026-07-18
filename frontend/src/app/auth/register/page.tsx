'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Mail, Lock, User, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', confirmPassword: '', name: '' },
  });

  const password = watch('password');

  const onSubmit = async (data: { email: string; password: string; confirmPassword: string; name: string }) => {
    if (data.password !== data.confirmPassword) {
      toast.error('As passwords não coincidem');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(data.email, data.password, data.name);
      toast.success('Conta criada com sucesso!');
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
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
          <CardTitle className="text-center">Criar conta</CardTitle>
          <CardDescription className="text-center">
            Junte-se à plataforma premium para fotógrafos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="O seu nome"
                  className="pl-10"
                  {...register('name')}
                  disabled={isLoading}
                />
              </div>
            </div>
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
                  placeholder="Mínimo 6 caracteres"
                  className="pl-10 pr-10"
                  {...register('password', {
                    required: 'Password é obrigatória',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                  })}
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
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirme a password"
                  className="pl-10"
                  {...register('confirmPassword', { required: 'Confirme a password' })}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  A criar conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Entrar
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