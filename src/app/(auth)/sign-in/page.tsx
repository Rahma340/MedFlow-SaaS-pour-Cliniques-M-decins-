"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "@/component/auth/AuthLayout";
import { Brand } from "@/component/auth/Brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type FormData = z.infer<typeof Schema>;

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  const next = search.get("next") ?? "/dashboard";

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(Schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: next,
      redirect: true,
    });
    setLoading(false);
  };

  return (
    <AuthLayout>
      
      <div className="absolute left-6 top-6">
        <Brand />
      </div>

      <Card className="w-[360px] border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <CardContent className="p-6">
        
          <h1 className="mb-6 text-center text-lg font-semibold text-slate-800">
            Welcome back
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-sky-600">Email</Label>
              <Input
                type="email"
                placeholder="enter your email"
                className="h-9"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-sky-600">Password</Label>
              <Input
                type="password"
                placeholder="enter your password"
                className="h-9"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "signing in…" : "sign in"}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-slate-500">
            <span>create account?</span>
            <a
              href="/sign-up"
              className="font-semibold text-sky-700 hover:underline"
            >
              sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}