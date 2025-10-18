import { Coffee } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

// When running locally, set VITE_API_BASE_URL (e.g. http://localhost:4242)
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4242";
// Optional direct Razorpay payment link (preferred for quick setup). You provided: https://rzp.io/rzp/mdBSaBWS
const RAZORPAY_LINK = import.meta.env.VITE_RAZORPAY_LINK ?? "https://rzp.io/rzp/mdBSaBWS";

interface CoffeeTierProps {
  amount: number;
  cups: number;
  isPopular?: boolean;
}

export const CoffeeTier = ({ amount, cups, isPopular = false }: CoffeeTierProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative group hover-lift ${
        isPopular ? "scale-110 z-10 mt-8" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent to-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold animate-pulse shadow-lg border-2 border-primary-foreground/20 whitespace-nowrap">
          ⭐ MOST POPULAR ⭐
        </div>
      )}
      
      <div
        className={`glass rounded-3xl p-8 transition-all duration-500 ${
          isHovered ? "border-accent/50" : ""
        }`}
        style={{
          boxShadow: isHovered ? "0 0 40px rgba(255, 215, 0, 0.3)" : "",
        }}
      >
        <div className="flex flex-col items-center gap-6">
          {/* Animated Coffee Cups */}
          <div className="relative h-20 w-20">
            {[...Array(cups)].map((_, i) => (
              <Coffee
                key={i}
                className={`absolute text-primary transition-all duration-500 ${
                  isHovered ? "animate-float" : ""
                }`}
                style={{
                  left: `${i * 15}px`,
                  top: `${i * 5}px`,
                  transform: isHovered ? `scale(${1 + i * 0.1}) rotate(${i * 5}deg)` : "",
                  animationDelay: `${i * 0.1}s`,
                  fontSize: "2rem",
                }}
              />
            ))}
          </div>

          {/* Amount */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gradient glow-text">${amount}</div>
            <div className="text-sm text-muted-foreground mt-2">
              {cups} {cups === 1 ? "Coffee" : "Coffees"}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            variant={isPopular ? "hero" : "coffee"}
            size="lg"
            className="w-full"
            onClick={async () => {
              try {
                // 1) Quick path: if a direct Razorpay link is configured, open it in a new tab
                if (RAZORPAY_LINK) {
                  window.open(RAZORPAY_LINK, "_blank");
                  return;
                }

                // 2) Try creating a Razorpay order via the server and open Razorpay Checkout
                try {
                  const rRes = await fetch(`${API_BASE}/create-razorpay-order`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount }),
                  });

                  if (rRes.ok) {
                    const { orderId, key } = await rRes.json();

                    // Load Razorpay checkout script
                    await new Promise((resolve, reject) => {
                      if ((window as any).Razorpay) return resolve(true);
                      const s = document.createElement("script");
                      s.src = "https://checkout.razorpay.com/v1/checkout.js";
                      s.onload = () => resolve(true);
                      s.onerror = reject;
                      document.body.appendChild(s);
                    });

                    const options = {
                      key,
                      amount: Math.round(amount * 100),
                      currency: "INR",
                      name: "Support",
                      description: `Support - ₹${amount}`,
                      order_id: orderId,
                      handler: function (response: any) {
                        // verify on server
                        fetch(`${API_BASE}/verify-razorpay`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(response),
                        })
                          .then((r) => r.json())
                          .then((json) => {
                            if (json.ok) alert("Payment successful — thank you!");
                            else alert("Payment verification failed on server.");
                          })
                          .catch((e) => {
                            console.error(e);
                            alert("Payment completed but verification failed.");
                          });
                      },
                      theme: { color: "#F59E0B" },
                    };

                    const rzp = new (window as any).Razorpay(options);
                    rzp.open();
                    return;
                  }
                } catch (razErr) {
                  console.warn("Razorpay server flow failed, will try Stripe fallback", razErr);
                }

                // 3) Fallback: create Stripe Checkout session and redirect
                const sRes = await fetch(`${API_BASE}/create-checkout-session`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ amount }),
                });

                if (!sRes.ok) {
                  const text = await sRes.text();
                  throw new Error(text || "Failed to create checkout session");
                }

                const sJson = await sRes.json();
                if (sJson?.url) window.location.href = sJson.url;
                else throw new Error("No checkout URL returned from server");
              } catch (err: any) {
                alert(err?.message ?? "Payment failed to start. See console for details.");
                console.error(err);
              }
            }}
          >
            Support ${amount}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Help fuel my creativity with {cups === 1 ? "a" : cups} delicious {cups === 1 ? "coffee" : "coffees"}!
          </p>
        </div>
      </div>
    </div>
  );
};