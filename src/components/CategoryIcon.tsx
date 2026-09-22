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
  LucideProps
} from 'lucide-react';
import { ExpenseCategory } from '../types';

interface CategoryIconProps extends LucideProps {
  category: ExpenseCategory;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, ...props }) => {
  switch (category) {
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
