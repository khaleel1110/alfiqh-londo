export type ProjectCategory =
  | 'dawah'
  | 'zakat'
  | 'sadaqah'
  | 'charity'
  | 'orphans'
  | 'education'
  | 'quran'
  | 'ramadan'
  | 'youth'
  | 'community'
  | 'humanitarian'
  | 'islamic-events';

export type ProjectStatus = 'Upcoming' | 'Active' | 'Completed' | 'Ongoing';

export interface CategoryOption {
  key: ProjectCategory;
  label: string;
}

// Mirrors the `projects` Firestore collection in the brief (section 30),
// with `id`/`Date` added for local mock use. When Firestore is wired up,
// map documents onto this shape rather than changing it, so nothing
// downstream (components, templates) needs to change.
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  imageUrl: string;
  gallery?: string[];
  location: string;
  startDate: Date;
  endDate?: Date;
  targetAmount?: number;
  raisedAmount?: number;
  supporters?: number;
  beneficiaries?: string;
  objectives?: string[];
  impact?: string;
  featured: boolean;
  fundraisingEnabled: boolean;
}

export const PROJECT_CATEGORIES: CategoryOption[] = [
  { key: 'dawah', label: "Da'wah" },
  { key: 'zakat', label: 'Zakat' },
  { key: 'sadaqah', label: 'Sadaqah' },
  { key: 'charity', label: 'Charity' },
  { key: 'orphans', label: 'Orphans' },
  { key: 'education', label: 'Education' },
  { key: 'quran', label: "Qur'an" },
  { key: 'ramadan', label: 'Ramadan' },
  { key: 'youth', label: 'Youth' },
  { key: 'community', label: 'Community' },
  { key: 'humanitarian', label: 'Humanitarian' },
  { key: 'islamic-events', label: 'Islamic Events' },
];
