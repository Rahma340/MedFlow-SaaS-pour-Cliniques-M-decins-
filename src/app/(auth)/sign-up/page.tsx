"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import AuthLayout from "@/component/auth/AuthLayout";
import { Brand } from "@/component/auth/Brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});
type FormData = z.infer<typeof Schema>;

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(Schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(json.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    // Connexion automatique après création du compte
    const signInRes = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (!signInRes?.error) {
      // edirection vers onboarding directement
      router.push("/onboarding");
    } else {
      // fallback si signIn échoue
      router.push("/sign-in");
    }

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
            Create account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Name</Label>
              <Input placeholder="your name" className="h-9" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Email</Label>
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
              <Label className="text-xs text-slate-600">Password</Label>
              <Input
                type="password"
                placeholder="choose a password"
                className="h-9"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Creating…" : "Sign up"}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-slate-500">
            <span>Already have an account?</span>
            <a
              href="/sign-in"
              className="font-semibold text-sky-700 hover:underline"
            >
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
