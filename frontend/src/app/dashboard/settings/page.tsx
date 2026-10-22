"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

const profileSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

// Definições: perfil do utilizador autenticado
export default function SettingsPage() {
  const { user } = useAuth();
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", phone: "" },
  });

  function onSubmit(values: ProfileForm) {
    toast.success(`Perfil atualizado: ${values.name}`);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold">Definições</h2>
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Nome</Label>
              <Input id="settings-name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-phone">Telemóvel</Label>
              <Input id="settings-phone" {...form.register("phone")} placeholder="+351 900 000 000" />
            </div>
            <Button type="submit">Guardar alterações</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
