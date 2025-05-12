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
  // Enhanced size classes for better proportions
  const sizeClasses = {
    sm: variant.includes("icon") ? "h-8 w-8" : variant === "full-new" ? "h-7" : "h-8",
    md: variant.includes("icon") ? "h-10 w-10" : variant === "full-new" ? "h-9" : "h-10",
    lg: variant.includes("icon") ? "h-12 w-12" : variant === "full-new" ? "h-11" : "h-14"
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
  
  // Add specific styling based on variant
  const getLogoClasses = () => {
    let baseClasses = "object-contain transition-all duration-200";
    
    if (variant === "icon-shadow") {
      return cn(sizeClasses[size], baseClasses, "drop-shadow-lg", className);
    } else if (variant === "full-new") {
      return cn(sizeClasses[size], baseClasses, "drop-shadow", className);
    } else {
      return cn(sizeClasses[size], baseClasses, className);
    }
  };

  const logoElement = (
    <img 
      src={logoSrc} 
      alt={alt} 
      className={getLogoClasses()} 
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