import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

interface LanguageSwitcherProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  position?: "bottom" | "top" | "left" | "right";
  showText?: boolean;
  className?: string;
}

// Available languages
const languages: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    flag: "🇬🇧",
    nativeName: "English"
  },
  {
    code: "hi",
    name: "Hindi",
    flag: "🇮🇳",
    nativeName: "हिन्दी"
  }
];

export function LanguageSwitcher({
  variant = "outline",
  size = "default",
  position = "bottom",
  showText = true,
  className
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setOpen(false);
  };
  
  const sizeClasses = {
    sm: "h-8 text-xs",
    default: "h-10 text-sm",
    lg: "h-12 text-base"
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size === "lg" ? "lg" : size === "sm" ? "sm" : "default"}
          className={cn("gap-2", className)}
        >
          <Globe className={cn(
            size === "sm" ? "h-3.5 w-3.5" : 
            size === "lg" ? "h-5 w-5" : 
            "h-4 w-4"
          )} />
          {showText && (
            <span className="hidden sm:inline-block">
              {currentLanguage.flag} {currentLanguage.nativeName}
            </span>
          )}
          {!showText && (
            <span className="sm:inline-block">
              {currentLanguage.flag}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side={position} className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 cursor-pointer",
              language.code === i18n.language && "bg-muted"
            )}
          >
            <span className="text-base">{language.flag}</span>
            <span className="flex-1">{language.nativeName}</span>
            {language.code === i18n.language && (
              <CheckCircle2 className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}