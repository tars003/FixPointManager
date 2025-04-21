import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  CheckCircle, 
  Calendar, 
  Download, 
  ArrowLeftFromLine
} from 'lucide-react';

interface AlertItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  theme: 'light' | 'dark';
  actionText?: string;
}

export const AlertItem = ({
  icon,
  title,
  description,
  type,
  theme,
  actionText = 'Take action'
}: AlertItemProps) => {

  // Get background and text colors based on alert type
  const getAlertStyles = () => {
    switch(type) {
      case 'danger':
        return {
          bg: theme === 'light' ? 'bg-red-50' : 'bg-red-900/20',
          iconBg: theme === 'light' ? 'bg-red-100' : 'bg-red-900/30',
          textColor: theme === 'light' ? 'text-red-700' : 'text-red-400',
        };
      case 'warning':
        return {
          bg: theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900/20',
          iconBg: theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900/30',
          textColor: theme === 'light' ? 'text-yellow-700' : 'text-yellow-400',
        };
      case 'info':
        return {
          bg: theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20',
          iconBg: theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30',
          textColor: theme === 'light' ? 'text-blue-700' : 'text-blue-400',
        };
      case 'success':
        return {
          bg: theme === 'light' ? 'bg-green-50' : 'bg-green-900/20',
          iconBg: theme === 'light' ? 'bg-green-100' : 'bg-green-900/30',
          textColor: theme === 'light' ? 'text-green-700' : 'text-green-400',
        };
      default:
        return {
          bg: theme === 'light' ? 'bg-gray-50' : 'bg-gray-900/20',
          iconBg: theme === 'light' ? 'bg-gray-100' : 'bg-gray-900/30',
          textColor: theme === 'light' ? 'text-gray-700' : 'text-gray-400',
        };
    }
  };

  const { bg, iconBg, textColor } = getAlertStyles();

  return (
    <div className={`p-3 rounded-lg flex items-start gap-3 ${bg}`}>
      <div className={`p-2 rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={`font-medium ${textColor}`}>{title}</p>
        <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          {description}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={theme === 'light' ? '' : 'bg-gray-800 border-gray-700'}>
          <DropdownMenuItem>
            <CheckCircle className="mr-2 h-4 w-4" /> Mark as read
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" /> Snooze
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-primary">
            <ArrowLeftFromLine className="mr-2 h-4 w-4" /> {actionText}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};