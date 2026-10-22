"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import toast from "react-hot-toast";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { extractApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Schema de validação do login (zod v4 — espelha LoginDto do backend)
const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginForm) {
    try {
      await login(values);
      toast.success("Sessão iniciada com sucesso");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <Camera className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold">Entrar no Fotografo</h1>
            <p className="text-sm text-zinc-500">
              Plataforma premium para fotógrafos de eventos
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="voce@exemplo.pt"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Palavra-passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A entrar…
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Ainda não tem conta?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            Criar conta
          </Link>
        </p>

        <div className="mt-6 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-500 dark:bg-zinc-800/50">
          Contas demo (seed): admin@fotografo.com · fotografo@fotografo.com ·
          cliente1@fotografo.com — password: <b>password123</b>
        </div>
      </div>
    </main>
  );
}
