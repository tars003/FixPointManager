import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface LogoProps {
  variant?: "icon" | "full" | "text" | "gradient" | "icon-shadow" | "full-new";
  size?: "sm" | "md" | "lg";
  className?: string;
  withLink?: boolean;
}

export function Logo({
  variant = "full",
  size = "md",
  className,
  withLink = true
}: LogoProps) {
  const sizeClasses = {
    sm: variant.includes("icon") ? "h-8 w-8" : "h-8",
    md: variant.includes("icon") ? "h-10 w-10" : "h-10",
    lg: variant.includes("icon") ? "h-12 w-12" : "h-14"
  };

  // Choose the correct logo source based on variant
  let logoSrc = "/logo-full-new.png"; // Default to the new full logo
  
  if (variant === "icon") {
    logoSrc = "/logo-icon-new.png";
  } else if (variant === "icon-shadow") {
    logoSrc = "/logo-icon-shadow.png";
  } else if (variant === "full") {
    logoSrc = "/logo-full-new.png";
  } else if (variant === "full-new") {
    logoSrc = "/logo-full-new.png";
  }
  
  const alt = variant === "icon" ? "FixPoint Icon" : "FixPoint Logo";
  
  const logoElement = (
    <img 
      src={logoSrc} 
      alt={alt} 
      className={cn(
        sizeClasses[size],
        "object-contain",
        className
      )} 
    />
  );

  if (withLink) {
    return (
      <Link href="/" className="flex items-center">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}