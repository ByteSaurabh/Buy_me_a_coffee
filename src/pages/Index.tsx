import { Coffee, Heart, Github, Linkedin, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoffeeTier } from "@/components/CoffeeTier";
import { Supporter } from "@/components/Supporter";
import { FloatingCoffeeBean } from "@/components/FloatingCoffeeBean";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import heroCoffee from "@/assets/hero-coffee.jpg";

const Index = () => {
  const [customAmount, setCustomAmount] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(false);

  // Formspree endpoint - set VITE_FORMSPREE_ENDPOINT in your .env (e.g. https://formspree.io/f/xxxxxx)
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT ?? "https://formspree.io/f/xgvnqwvl";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: senderName, message: senderMessage }),
      });

      if (res.ok) {
        setSuccess(true);
        setSenderName("");
        setSenderMessage("");
      } else {
        // try to extract message from response
        let msg = "Submission failed.";
        try {
          const json = await res.json();
          if (json && json.error) msg = json.error;
        } catch {
          // ignore
        }
        setError(msg);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
      // auto-dismiss success after a short time
      if (success) setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingCoffeeBean delay={0} size={60} left="5%" top="10%" />
      <FloatingCoffeeBean delay={1} size={40} left="85%" top="15%" />
      <FloatingCoffeeBean delay={2} size={80} left="10%" top="60%" />
      <FloatingCoffeeBean delay={1.5} size={50} left="90%" top="70%" />
      <FloatingCoffeeBean delay={0.5} size={45} left="50%" top="80%" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Hero Background Image with Overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroCoffee})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-scale-in">
          {/* Animated Coffee Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Coffee className="w-24 h-24 text-accent animate-float drop-shadow-[0_0_30px_rgba(255,215,0,0.6)]" />
              <div className="absolute inset-0 animate-glow">
                <Coffee className="w-24 h-24 text-accent" />
              </div>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold mb-6 text-gradient glow-text">
            Buy Me a Coffee
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary mb-4">
            Hey there! I'm a <span className="text-accent font-semibold">creator</span>, <span className="text-accent font-semibold">developer</span>, and <span className="text-accent font-semibold">coffee enthusiast</span>.
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your support keeps me caffeinated and creating amazing content. Every coffee helps fuel late-night coding sessions and creative breakthroughs! ☕✨
          </p>

          {/* Social Links */}
          <div className="flex gap-4 justify-center mb-12">
            <a
              href="https://github.com/ByteSaurabh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="glass" size="icon" className="rounded-full w-14 h-14 hover:scale-110 transition-transform">
                <Github className="w-6 h-6" />
              </Button>
            </a>

            <a
              href="https://www.linkedin.com/in/saurabh-sharma-25b96a218/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="glass" size="icon" className="rounded-full w-14 h-14 hover:scale-110 transition-transform">
                <Linkedin className="w-6 h-6" />
              </Button>
            </a>

            <a
              href="https://besaurabh-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="glass" size="icon" className="rounded-full w-14 h-14 hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </Button>
            </a>
          </div>

          <Button
            variant="hero"
            size="xl"
            className="animate-pulse"
            onClick={() => {
              const el = document.getElementById("support-section");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <Heart className="w-6 h-6 fill-current" />
            Support My Work
          </Button>
        </div>
      </section>

      {/* Coffee Tiers Section */}
      <section id="support-section" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-5xl font-bold mb-4 text-gradient">Choose Your Support</h2>
            <p className="text-xl text-muted-foreground">Every coffee makes a difference! ☕</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <CoffeeTier amount={3} cups={1} />
            <CoffeeTier amount={5} cups={2} isPopular />
            <CoffeeTier amount={10} cups={3} />
          </div>

          {/* Custom Amount */}
          <div className="max-w-md mx-auto glass rounded-3xl p-8 animate-slide-up">
            <h3 className="text-2xl font-bold mb-4 text-center text-gradient">Or Choose Your Own Amount</h3>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="glass border-accent/30 text-lg h-14"
              />
              <Button variant="hero" size="lg" className="px-8">
                <Coffee className="w-5 h-5" />
                Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Supporters Section */}
      <section className="relative py-24 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-gradient">Recent Supporters</h2>
            <p className="text-xl text-muted-foreground">Amazing people who fueled my creativity! 🙏</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Supporter
              name="Sarah Chen"
              amount={5}
              message="Love your content! Keep it up! 🚀"
              avatar="SC"
              timeAgo="2 hours ago"
            />
            <Supporter
              name="Alex Johnson"
              amount={10}
              message="This project helped me so much. Thank you!"
              avatar="AJ"
              timeAgo="5 hours ago"
            />
            <Supporter
              name="Maria Garcia"
              amount={3}
              message="Small token of appreciation for your hard work!"
              avatar="MG"
              timeAgo="1 day ago"
            />
            <Supporter
              name="David Kim"
              amount={5}
              message="Coffee for the best developer! ☕"
              avatar="DK"
              timeAgo="2 days ago"
            />
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-2xl mx-auto glass rounded-3xl p-12 animate-slide-up">
          <div className="text-center mb-8">
            <MessageCircle className="w-16 h-16 text-accent mx-auto mb-4 animate-float" />
            <h2 className="text-4xl font-bold mb-4 text-gradient">Leave a Message</h2>
            <p className="text-muted-foreground">Share your thoughts or just say hi! 👋</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
            <Input
              placeholder="Your name"
              className="glass border-accent/30 h-12"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              required
            />
            <Textarea
              placeholder="Your message (optional)"
              className="glass border-accent/30 min-h-32 resize-none"
              value={senderMessage}
              onChange={(e) => setSenderMessage(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={sending}>
                {sending ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Heart className="w-5 h-5 fill-current" />
                    Send Support with Love
                  </>
                )}
              </Button>

              {success && (
                <p className="text-sm text-green-400">Message sent — thanks for reaching out!</p>
              )}

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-border/50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-6">
            <Button variant="ghost" size="sm">Terms</Button>
            <Button variant="ghost" size="sm">Privacy</Button>
            <Button variant="ghost" size="sm">Contact</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Made with <Heart className="inline w-4 h-4 text-accent fill-accent animate-pulse" /> and lots of ☕
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} Saurabh Sharma. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;