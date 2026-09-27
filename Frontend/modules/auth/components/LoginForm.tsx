// modules/auth/components/LoginForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Landmark, Lock, Mail, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { authService } from "../services/authService";
import { getErrorMessage } from "@/lib/api/client";
import { ROLE } from "@/lib/constants/statuses";
import { type SelectOption, optionTag } from "@/lib/format";
import type { LoginPayload } from "../types";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  role: z.enum([ROLE.ADMIN, ROLE.AGENT]),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Static role options
const ROLE_OPTIONS: SelectOption[] = [
  { value: ROLE.AGENT, tag: "Agent" },
  { value: ROLE.ADMIN, tag: "Admin" },
];

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: { email: "", password: "", role: ROLE.AGENT },
  });

  const mutation = useMutation({
    mutationFn: (values: LoginPayload) => authService.initiateLogin(values),
    onSuccess: (_data, variables) => {
      toast.success("OTP sent to your email/SMS.");
      const params = new URLSearchParams({
        email: variables.email,
        role: variables.role,
      });
      router.push(`/verify-otp?${params.toString()}`);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Landmark className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to BSA Microfinance Management System
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={form.watch("role")}
              onValueChange={(v) =>
                form.setValue(
                  "role",
                  (v ?? ROLE.AGENT) as LoginFormValues["role"],
                )
              }
            >
              <SelectTrigger id="role">
                <UserCog className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {optionTag(ROLE_OPTIONS, form.watch("role")) ?? "Select role"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-xs text-destructive">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="pl-9"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-9"
                {...form.register("password")}
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          A verification code will be sent to your registered email and phone.
        </p>
      </CardContent>
    </Card>
  );
}
