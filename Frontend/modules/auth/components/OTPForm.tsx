// modules/auth/components/OTPForm.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

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

import { authService } from "../services/authService";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";
import { ROLE, type Role } from "@/lib/constants/statuses";
import type { VerifyOtpPayload } from "../types";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

export function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);

  const email = searchParams.get("email") || "";
  const role = (searchParams.get("role") as Role) || ROLE.AGENT;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please log in again.");
      router.replace("/login");
      return;
    }
    inputRef.current?.focus();
  }, [email, router]);

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: VerifyOtpPayload) => authService.verifyOtp(values),
    onSuccess: (data) => {
      setSession({
        token: data.access_token,
        user: data.user,
      });
      toast.success(`Welcome back, ${data.user.fullName}!`);
      router.replace("/dashboard");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
      form.setValue("otp", "");
      inputRef.current?.focus();
    },
  });

  const onSubmit = form.handleSubmit((values) =>
    mutation.mutate({ email, otp: values.otp, role }),
  );

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-2xl">Verify your identity</CardTitle>
          <CardDescription>
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="text-center text-2xl tracking-[0.5em] font-mono"
              autoComplete="one-time-code"
              {...form.register("otp")}
              ref={(el: any) => {
                form.register("otp").ref(el);
                inputRef.current = el;
              }}
            />
            {form.formState.errors.otp && (
              <p className="text-center text-xs text-destructive">
                {form.formState.errors.otp.message}
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
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/login"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
