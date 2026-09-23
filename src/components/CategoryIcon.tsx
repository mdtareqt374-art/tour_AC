import React from 'react';
import {
  Bus,
  Hotel,
  Utensils,
  Ticket,
  ShoppingBag,
  HeartPulse,
  Compass,
  MoreHorizontal,
  Briefcase,
  Building2,
  Package,
  FileText,
  Wrench,
  Megaphone,
  Coffee,
  LucideProps
} from 'lucide-react';
import { ExpenseCategory } from '../types';

interface CategoryIconProps extends LucideProps {
  category: ExpenseCategory;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, ...props }) => {
  switch (category) {
    case 'salary':
      return <Briefcase {...props} />;
    case 'rent_utility':
      return <Building2 {...props} />;
    case 'inventory':
      return <Package {...props} />;
    case 'office_supplies':
      return <FileText {...props} />;
    case 'maintenance':
      return <Wrench {...props} />;
    case 'marketing':
      return <Megaphone {...props} />;
    case 'entertainment':
      return <Coffee {...props} />;
    case 'transport':
      return <Bus {...props} />;
    case 'accommodation':
      return <Hotel {...props} />;
    case 'food':
      return <Utensils {...props} />;
    case 'sightseeing':
      return <Ticket {...props} />;
    case 'activities':
      return <Compass {...props} />;
    case 'shopping':
      return <ShoppingBag {...props} />;
    case 'medical':
      return <HeartPulse {...props} />;
    case 'other':
    default:
      return <MoreHorizontal {...props} />;
  }
};
