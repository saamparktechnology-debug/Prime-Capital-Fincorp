// modules/auth/OTPPage.tsx
import { Suspense } from "react";
import { OTPForm } from "./components/OTPForm";

export default function OTPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <OTPForm />
    </Suspense>
  );
}
