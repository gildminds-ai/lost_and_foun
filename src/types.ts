export type ItemStatus = 'lost' | 'found';

export const CATEGORIES = [
  'Electronics',
  'Accessories',
  'Clothing',
  'Keys',
  'IDs & Cards',
  'Books',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Item {
  id: string;
  name: string;
  status: ItemStatus;
  category: Category;
  imageUrl: string;
  description: string;
  location: string;
  date: string;
  contactName: string;
  contactEmail: string;
}
