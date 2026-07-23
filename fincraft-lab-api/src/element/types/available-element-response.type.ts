import { ElementType } from '../../database/generated/prisma/client';

export interface AvailableElementCategoryResponse {
  id: string;
  name: string;
  sortOrder: number;
}

export interface AvailableElementResponse {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  iconUrl: string | null;
  elementType: ElementType;
  isStarter: boolean;
  category: AvailableElementCategoryResponse;
}
