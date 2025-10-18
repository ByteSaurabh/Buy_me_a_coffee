import { Heart } from "lucide-react";

interface SupporterProps {
  name: string;
  amount: number;
  message?: string;
  avatar: string;
  timeAgo: string;
}

export const Supporter = ({ name, amount, message, avatar, timeAgo }: SupporterProps) => {
  return (
    <div className="glass rounded-2xl p-6 hover-lift animate-slide-up">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-primary-foreground">
            {avatar}
          </div>
          <Heart className="absolute -bottom-1 -right-1 w-5 h-5 text-accent fill-accent animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-foreground">{name}</h4>
            <div className="text-accent font-bold">${amount}</div>
          </div>
          
          {message && (
            <p className="text-sm text-muted-foreground mb-2">"{message}"</p>
          )}
          
          <div className="text-xs text-muted-foreground">{timeAgo}</div>
        </div>
      </div>
    </div>
  );
};