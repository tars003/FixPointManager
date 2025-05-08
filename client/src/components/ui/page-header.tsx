import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

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
    <div className={cn('flex flex-col space-y-2 md:space-y-1', className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg bg-muted',
            iconClassName ? iconClassName : 'text-primary'
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className={cn(
            "text-2xl font-semibold tracking-tight md:text-3xl",
            Icon ? '' : 'mb-1'
          )}>
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default PageHeader;