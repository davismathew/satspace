import { useState } from "react";
import { Send, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Welcome aboard! 🚀",
      description: "You've successfully subscribed to our newsletter.",
    });

    setEmail("");
    setIsLoading(false);
  };

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient stars-pattern opacity-50" />

      <div className="container relative mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Rocket className="h-8 w-8 text-primary animate-float" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Stay Connected
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Get the latest satellite industry news delivered to your inbox. Weekly updates on satellite launches, space infrastructure, and emerging technologies.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-card border-border"
              required
            />
            <Button type="submit" variant="hero" size="lg" disabled={isLoading}>
              {isLoading ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe
                  <Send className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;