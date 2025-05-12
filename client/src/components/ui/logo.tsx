import { cn } from "@/lib/utils";
import { Link } from "wouter";
import logoIconNew from "@assets/logo-icon-new.png";
import logoIconShadow from "@assets/logo-icon-shadow.png";
import logoFullNew from "@assets/logo-full-new.png";

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
  let logoSrc = logoFullNew; // Default to the new full logo
  
  if (variant === "icon") {
    logoSrc = logoIconNew;
  } else if (variant === "icon-shadow") {
    logoSrc = logoIconShadow;
  } else if (variant === "full") {
    logoSrc = logoFullNew;
  } else if (variant === "full-new") {
    logoSrc = logoFullNew;
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