import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface VehicleLoadingAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent";
  showText?: boolean;
  customText?: string;
}

export function VehicleLoadingAnimation({
  className,
  size = "md",
  color = "primary",
  showText = true,
  customText
}: VehicleLoadingAnimationProps) {
  const { t } = useTranslation(["common"]);
  
  // Size classes
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };
  
  // Color classes
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-orange-500"
  };
  
  // Animation settings
  const wheelVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  
  const carVariants = {
    animate: {
      x: [0, 5, 0, -5, 0],
      y: [0, -2, 0, -2, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  const loadingText = customText || t("common:loading");

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        className={cn("relative", sizeClasses[size])}
        variants={carVariants}
        animate="animate"
      >
        {/* Car Body */}
        <motion.svg
          viewBox="0 0 100 60"
          className={cn("w-full h-full", colorClasses[color])}
        >
          {/* Car Base and Body */}
          <motion.path
            d="M15,40 L15,45 C15,48 18,50 20,50 L80,50 C82,50 85,48 85,45 L85,40 L15,40 Z"
            fill="currentColor"
          />
          <motion.path
            d="M20,20 L30,10 L70,10 L80,20 L85,30 C85,35 85,40 85,40 L15,40 C15,40 15,35 15,30 L20,20 Z"
            fill="currentColor"
          />
          
          {/* Windows */}
          <motion.path
            d="M30,20 L35,15 L65,15 L70,20 L30,20 Z"
            fill="#FFFFFF"
            opacity="0.7"
          />
          
          {/* Lights */}
          <motion.circle
            cx="20"
            cy="35"
            r="3"
            fill="#FFCC00"
          />
          <motion.circle
            cx="80"
            cy="35"
            r="3"
            fill="#FF3300"
          />
          
          {/* Wheels Animation */}
          <motion.g
            variants={wheelVariants}
            animate="animate"
            style={{ originX: "25%", originY: "83%" }}
          >
            <circle
              cx="25"
              cy="50"
              r="8"
              fill="#333333"
            />
            <circle
              cx="25"
              cy="50"
              r="4"
              fill="#666666"
            />
            <path
              d="M25,46 L25,54 M21,50 L29,50"
              stroke="#999999"
              strokeWidth="2"
            />
          </motion.g>
          
          <motion.g
            variants={wheelVariants}
            animate="animate"
            style={{ originX: "75%", originY: "83%" }}
          >
            <circle
              cx="75"
              cy="50"
              r="8"
              fill="#333333"
            />
            <circle
              cx="75"
              cy="50"
              r="4"
              fill="#666666"
            />
            <path
              d="M75,46 L75,54 M71,50 L79,50"
              stroke="#999999"
              strokeWidth="2"
            />
          </motion.g>
        </motion.svg>
      </motion.div>
      
      {showText && (
        <div className="mt-4 flex items-center">
          <p className={cn("text-lg font-medium", colorClasses[color])}>
            {loadingText}
          </p>
          <motion.div
            className="ml-2 flex space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className={cn("h-1.5 w-1.5 rounded-full", colorClasses[color])}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  y: [0, -3, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: dot * 0.3
                }}
              />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}