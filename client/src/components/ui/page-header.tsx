import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  Icon?: LucideIcon;
  iconClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  Icon,
  iconClassName,
  className,
  children
}) => {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center">
        {Icon && (
          <div className={cn("p-2 rounded-md mr-3", iconClassName ? undefined : "bg-primary/10")}>
            <Icon className={cn("h-5 w-5", iconClassName ? iconClassName : "text-primary")} />
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      
      {description && (
        <p className="text-muted-foreground text-sm md:text-base">{description}</p>
      )}
      
      {children}
    </div>
  );
};

export default PageHeader;