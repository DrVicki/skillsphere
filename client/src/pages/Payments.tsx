import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Payments() {
  const { isAuthenticated, loading } = useAuth();
  const { data: payments, isLoading } = trpc.payments.myHistory.useQuery(undefined, { enabled: isAuthenticated });

  const statusIcon = (status: string | null) => {
    if (status === "completed") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "pending") return <Clock className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const statusBadge = (status: string | null) => {
    if (status === "completed") return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
    if (status === "pending") return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
    return <Badge className="bg-red-100 text-red-700 border-red-200">Failed</Badge>;
  };

  if (loading || isLoading) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-4 p-8 text-center">
        <CreditCard className="h-14 w-14 text-muted-foreground/30" />
        <h2 className="text-2xl font-bold">Sign in to view payment history</h2>
        <Button asChild><a href={getLoginUrl("/payments")}>Sign In</a></Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="brand-gradient text-white py-10">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Payment History</h1>
          <p className="text-white/70">Your course purchases and transactions</p>
        </div>
      </section>

      <section className="flex-1 bg-gray-50 py-8">
        <div className="container max-w-3xl">
          {payments && payments.length > 0 ? (
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="font-semibold text-foreground">{payments.length} Transaction{payments.length !== 1 ? "s" : ""}</h2>
              </div>
              <div className="divide-y divide-border">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {statusIcon(payment.status ?? "unknown")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{payment.courseTitle ?? "Course Purchase"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                      {payment.couponCode && <p className="text-xs text-green-600 mt-0.5">Coupon: {payment.couponCode}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">${parseFloat(payment.amount ?? "0").toFixed(2)}</p>
                      <div className="mt-1">{statusBadge(payment.status ?? "unknown")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-border">
              <CreditCard className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-6">Browse our courses and start learning today.</p>
              <Button asChild><Link href="/courses">Browse Courses <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700">
              <strong>Test payments:</strong> Use card number <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code> with any future expiry and CVC for testing.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
