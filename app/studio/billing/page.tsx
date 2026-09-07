"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Coins,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CreditCard,
  Crown,
  Calendar,
  RefreshCw,
  X,
  ArrowRight,
  ArrowDownLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// Extend Window to include Razorpay
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface SubscriptionPlan {
  id: "free" | "basic" | "pro";
  name: string;
  priceINR: number;
  priceLabel: string;
  period: string;
  credits: number;
  creditLabel: string;
  badge?: string;
  popular?: boolean;
  color: string;
  ringColor: string;
  features: string[];
}

const PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Plan",
    priceINR: 0,
    priceLabel: "₹0",
    period: "/ month",
    credits: 25,
    creditLabel: "25 Free Credits / mo",
    color: "from-slate-700 to-slate-900",
    ringColor: "ring-slate-200",
    features: [
      "25 AI Photo Generations per month",
      "Standard Resolution Exports",
      "Standard AI Queue Processing",
      "Basic Makeup & Virtual Try-On",
      "Community Forum Support",
    ],
  },
  {
    id: "basic",
    name: "Basic Plan",
    priceINR: 999,
    priceLabel: "₹999",
    period: "/ month",
    credits: 350,
    creditLabel: "350 Credits / mo",
    badge: "Popular Value",
    color: "from-blue-600 via-indigo-600 to-purple-600",
    ringColor: "ring-blue-400/40",
    features: [
      "350 AI Photo Generations per month",
      "Ultra-HD Quality Photo Exports",
      "Fast-Track Priority Queue",
      "Full Beauty Studio & Makeup Transfer",
      "AI Eye Color & Hair Styling Try-On",
      "Standard Email Support (within 24h)",
    ],
  },
  {
    id: "pro",
    name: "Pro Plan",
    priceINR: 2799,
    priceLabel: "₹2,799",
    period: "/ month",
    credits: 1000,
    creditLabel: "1,000 Credits / mo",
    badge: "Best for Creators",
    popular: true,
    color: "from-purple-600 via-pink-600 to-indigo-600",
    ringColor: "ring-purple-500",
    features: [
      "1,000 AI Photo Generations per month",
      "Maximum 4K Resolution AI Exports",
      "Instant Turbo Processing Engine",
      "Full Suite: Beauty, Fashion & Hair",
      "Commercial License for All Assets",
      "24/7 Dedicated VIP Priority Support",
    ],
  },
];

interface HistoryItem {
  id: string;
  plan: string;
  amount_paise: number;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  status: "pending" | "paid" | "failed";
  created_at: string;
  paid_at?: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    msg: string;
  } | null>(null);

  // Modals state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const currentPlanId = (user?.plan || "free").toLowerCase() as "free" | "basic" | "pro";
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) || PLANS[0];

  const showToast = (type: "success" | "error" | "info", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  // Fetch Payment History
  const fetchHistory = useCallback(async () => {
    if (!user?.id) return;
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/payments/subscription-history?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("Failed to load subscription history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Handle Plan Upgrade / Checkout
  const handleSubscribe = useCallback(
    async (plan: SubscriptionPlan) => {
      if (!user) {
        showToast("error", "Please sign in to upgrade your subscription.");
        return;
      }

      if (plan.id === "free") {
        setShowDowngradeModal(true);
        return;
      }

      setProcessingPlan(plan.id);

      try {
        // 1. Load Razorpay script
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          showToast(
            "error",
            "Failed to load payment gateway. Check your internet connection."
          );
          setProcessingPlan(null);
          return;
        }

        // 2. Create subscription order on server
        const orderRes = await fetch("/api/payments/create-subscription-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planName: plan.id,
            userId: user.id,
            userName: user.name || user.email?.split("@")[0] || "",
            userEmail: user.email || "",
          }),
        });

        if (!orderRes.ok) {
          const errData = await orderRes.json();
          throw new Error(errData.error || "Could not create payment order.");
        }

        const { checkoutOptions } = await orderRes.json();

        // 3. Open Razorpay Checkout Modal
        const options = {
          ...checkoutOptions,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            // 4. Verify signature & fulfill subscription in DB
            try {
              const verifyRes = await fetch("/api/payments/verify-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  userId: user.id,
                  planName: plan.id,
                }),
              });

              const verifyData = await verifyRes.json();

              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(
                  verifyData.error || "Payment verification failed."
                );
              }

              showToast(
                "success",
                `🎉 Upgraded to ${plan.name}! ${plan.credits} credits added to your account.`
              );
              await refreshUser();
              fetchHistory();
            } catch (err: any) {
              showToast(
                "error",
                err instanceof Error ? err.message : "Verification failed."
              );
            } finally {
              setProcessingPlan(null);
            }
          },
          modal: {
            ondismiss: () => {
              showToast("info", "Subscription checkout cancelled.");
              setProcessingPlan(null);
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on(
          "payment.failed",
          (response: { error: { description: string } }) => {
            showToast(
              "error",
              response.error?.description || "Payment failed. Please try again."
            );
            setProcessingPlan(null);
          }
        );

        rzp.open();
      } catch (err: any) {
        showToast(
          "error",
          err instanceof Error ? err.message : "Subscription checkout error."
        );
        setProcessingPlan(null);
      }
    },
    [user, refreshUser, fetchHistory]
  );

  // Handle Downgrade to Free
  const confirmDowngrade = async () => {
    if (!user) return;
    setModalLoading(true);
    try {
      const res = await fetch("/api/payments/manage-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          action: "downgrade-free",
        }),
      });

      if (!res.ok) throw new Error("Failed to downgrade plan.");
      showToast("info", "Switched to Free Plan. 25 monthly credits active.");
      setShowDowngradeModal(false);
      await refreshUser();
    } catch (err: any) {
      showToast("error", err.message || "Failed to downgrade.");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Cancel Subscription
  const confirmCancel = async () => {
    if (!user) return;
    setModalLoading(true);
    try {
      const res = await fetch("/api/payments/manage-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          action: "cancel",
        }),
      });

      if (!res.ok) throw new Error("Failed to cancel subscription.");
      showToast(
        "info",
        "Subscription auto-renewal cancelled. You will retain credits until your cycle ends."
      );
      setShowCancelModal(false);
      await refreshUser();
    } catch (err: any) {
      showToast("error", err.message || "Failed to cancel.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[9999] flex items-start gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium transition-all animate-in slide-in-from-top-2 duration-300 max-w-sm ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : toast.type === "info"
              ? "bg-indigo-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4 mt-0.5 shrink-0" />
          ) : toast.type === "info" ? (
            <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Subscription &amp; Credits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose the right monthly plan for your creative workflow or top up credits instantly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPaymentMethodsModal(true)}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <CreditCard className="w-3.5 h-3.5 text-purple-600" />
            <span>Manage Payment Methods</span>
          </button>
        </div>
      </div>

      {/* Account Overview Cards (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Remaining Credits */}
        <div className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Available Credits
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {user?.credits ?? 25}{" "}
                <span className="text-sm font-semibold text-slate-400">
                  credits
                </span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Coins className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Plan allowance:</span>
            <span className="font-semibold text-slate-800">
              {currentPlan.credits} credits / month
            </span>
          </div>
        </div>

        {/* Card 2: Current Subscription Plan */}
        <div className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Current Subscription
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-extrabold text-slate-900">
                  {currentPlan.name}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    currentPlan.id === "pro"
                      ? "bg-purple-100 text-purple-700"
                      : currentPlan.id === "basic"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Active
                </span>
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${currentPlan.color}`}
            >
              {currentPlan.id === "pro" ? (
                <Crown className="w-6 h-6" />
              ) : currentPlan.id === "basic" ? (
                <Zap className="w-6 h-6" />
              ) : (
                <Sparkles className="w-6 h-6" />
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Monthly Price:</span>
            <span className="font-bold text-slate-900 text-sm">
              {currentPlan.priceLabel}{" "}
              <span className="font-normal text-xs text-slate-400">
                {currentPlan.period}
              </span>
            </span>
          </div>
        </div>

        {/* Card 3: Renewal / Management */}
        <div className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Billing Period &amp; Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-800">
                  {user?.plan_expires_at
                    ? `Renews on ${new Date(
                        user.plan_expires_at
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : currentPlan.id === "free"
                    ? "Free Forever (No expiry)"
                    : "Monthly auto-renewal"}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentPlan.id !== "free" ? (
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
              >
                Cancel Subscription
              </button>
            ) : (
              <span className="text-xs text-slate-400">Upgrade anytime</span>
            )}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("plans-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
            >
              <span>Change Plan</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Available Subscription Plans */}
      <div id="plans-section" className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Monthly Subscription Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Upgrade to unlock unlimited high-res exports and priority GPU queue.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure via Razorpay</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = currentPlanId === plan.id;
            const isProcessing = processingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 bg-white border flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? "border-purple-400 shadow-2xl shadow-purple-500/10 ring-2 ring-purple-400/30"
                    : isCurrent
                    ? "border-indigo-300 shadow-md ring-2 ring-indigo-200"
                    : "border-slate-100 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Popular or Current Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-6">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${
                        plan.popular
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{plan.badge}</span>
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Current Plan
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Icon */}
                  <div className="flex items-center gap-3 mb-2 mt-1">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-md`}
                    >
                      {plan.id === "pro" ? (
                        <Crown className="w-5 h-5" />
                      ) : plan.id === "basic" ? (
                        <Zap className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {plan.name}
                      </h3>
                      <p className="text-xs font-semibold text-purple-600">
                        {plan.creditLabel}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="my-5 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">
                      {plan.priceLabel}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {plan.period}
                    </span>
                  </div>

                  {/* Points / Features */}
                  <div className="space-y-3 mb-7">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Included with this plan:
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div>
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!!processingPlan}
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        plan.popular
                          ? "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-purple-500/25"
                          : plan.id === "free"
                          ? "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
                          : "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Initiating Checkout…</span>
                        </>
                      ) : (
                        <>
                          {plan.id === "free" ? (
                            <span>Downgrade to Free</span>
                          ) : (
                            <>
                              <span>Upgrade to {plan.name}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Management Card */}
      <div className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Manage Subscription &amp; Payment Methods
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Securely powered by Razorpay. Update details, view invoices, or change plan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPaymentMethodsModal(true)}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-purple-600" />
              <span>Payment Details</span>
            </button>
            {currentPlan.id !== "free" && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
              >
                Cancel Renewal
              </button>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Payment History &amp; Invoices
            </h4>
            <button
              onClick={fetchHistory}
              disabled={loadingHistory}
              className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loadingHistory ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-8 flex items-center justify-center text-xs text-slate-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span>Loading payment history…</span>
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-2xl p-6 bg-slate-50 border border-slate-100 text-center">
              <p className="text-xs text-slate-500 font-medium">
                No past transactions recorded yet.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Your future subscription payments and credit top-ups will be listed here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Plan / Package</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 capitalize">
                        {item.plan} Plan
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{(item.amount_paise / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {item.razorpay_order_id || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : item.status === "pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {item.status === "paid" && <Check className="w-2.5 h-2.5" />}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-3 p-5 rounded-3xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-700">Bank-Grade 256-Bit SSL Encrypted</p>
          <p className="mt-0.5">
            Subscriptions and credit orders are verified directly through Razorpay. You can
            upgrade, downgrade, or cancel anytime without cancellation fees. Credits renew automatically every 30 days.
          </p>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Cancel Auto-Renewal?
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel your active <strong>{currentPlan.name}</strong>?
              Your remaining credits will remain accessible, and your benefits will continue until{" "}
              {user?.plan_expires_at
                ? new Date(user.plan_expires_at).toLocaleDateString()
                : "the end of your monthly period"}
              . After that, your account will switch to the Free Plan (25 credits/mo).
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Keep My Plan
              </button>
              <button
                type="button"
                disabled={modalLoading}
                onClick={confirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5"
              >
                {modalLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>Confirm Cancellation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Downgrade to Free Modal */}
      {showDowngradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Switch to Free Plan
              </h3>
              <button
                onClick={() => setShowDowngradeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Switching to the Free Plan will set your monthly allowance to 25 credits. Any existing balance you have already purchased will remain in your account.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDowngradeModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={modalLoading}
                onClick={confirmDowngrade}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5"
              >
                {modalLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>Confirm Switch to Free</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPaymentMethodsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Payment Methods &amp; Gateway
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentMethodsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                    UPI
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Instant UPI Checkout</p>
                    <p className="text-[11px] text-slate-400">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Active
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    CARD
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Credit / Debit Cards</p>
                    <p className="text-[11px] text-slate-400">Visa, Mastercard, RuPay, Amex</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Active
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    NET
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">NetBanking &amp; Wallets</p>
                    <p className="text-[11px] text-slate-400">50+ Indian banks &amp; top wallets</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Active
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Payment details are entered securely during the Razorpay Standard Checkout modal. Your card details are never stored on Pixora servers.
            </p>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowPaymentMethodsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
