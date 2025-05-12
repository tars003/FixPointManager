import { cn } from "@/lib/utils";

interface IndianAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  alt?: string;
}

export function IndianAvatar({ 
  size = "md", 
  className,
  alt = "User profile"
}: IndianAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  return (
    <div className={cn(
      "rounded-full overflow-hidden bg-blue-100 border border-blue-200 flex-shrink-0",
      sizeClasses[size],
      className
    )}>
      <img
        src="/images/indian-user.png"
        alt={alt}
        className="h-full w-full object-cover"
        style={{ objectPosition: "center" }}
        onError={(e) => {
          console.error('Failed to load avatar image');
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}