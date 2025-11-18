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
  firstName: z.string().min(2, "Prénom trop court"),
  lastName: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Min 6 caractères"),
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

    await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    router.push("/onboarding");
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
              <Label className="text-xs text-slate-600">First Name</Label>
              <Input className="h-9" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-xs text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Last Name</Label>
              <Input className="h-9" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-xs text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Email</Label>
              <Input type="email" className="h-9" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Password</Label>
              <Input type="password" className="h-9" {...register("password")} />
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
            <a href="/sign-in" className="font-semibold text-sky-700 hover:underline">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
