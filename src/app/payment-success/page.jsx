import { Suspense } from "react";
import PaymentSuccess from "@/views/PaymentSuccess";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
