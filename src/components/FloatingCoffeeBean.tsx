interface FloatingCoffeeBeanProps {
  delay?: number;
  size?: number;
  left?: string;
  top?: string;
}

export const FloatingCoffeeBean = ({ 
  delay = 0, 
  size = 20, 
  left = "10%", 
  top = "20%" 
}: FloatingCoffeeBeanProps) => {
  return (
    <div
      className="absolute rounded-full bg-gradient-to-br from-primary to-accent opacity-20 blur-sm animate-float-slow"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left,
        top,
        animationDelay: `${delay}s`,
      }}
    />
  );
};