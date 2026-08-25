import { Injectable } from '@angular/core';
import { Project, ProjectCategory, ProjectStatus } from './project.model';

export interface ProjectStats {
  total: number;
  active: number;
  upcoming: number;
  completed: number;
  ongoing: number;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  // TODO: replace this mock array with Firestore reads from the
  // `projects` collection (brief section 30) once Firebase is wired up.
  // Keep the method signatures below unchanged — components only call
  // through this service, never Firestore directly (brief section 31).
  private projects: Project[] = [
    {
      id: 'p1',
      title: 'Ramadan Food Distribution',
      slug: 'ramadan-food-distribution',
      description:
        'Our flagship Ramadan campaign delivers food packages to families across London facing hardship. Each parcel is put together by volunteers and covers a family\'s essentials for a full week during the month of fasting.',
      shortDescription: 'Providing essential food packages to families during Ramadan.',
      category: 'ramadan',
      status: 'Active',
      imageUrl: '/h3.webp',
      location: 'East London',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-03-30'),
      targetAmount: 10000,
      raisedAmount: 7450,
      supporters: 214,
      beneficiaries: '450 families',
      objectives: [
        'Pack and deliver 450 food parcels before Ramadan begins',
        'Prioritise families referred by local welfare partners',
        'Run weekly distribution points across three boroughs',
      ],
      impact: 'Fed over 1,800 people across 450 households last Ramadan.',
      featured: true,
      fundraisingEnabled: true,
    },
    {
      id: 'p2',
      title: 'Orphan Education Sponsorship',
      slug: 'orphan-education-sponsorship',
      description:
        'Long-term sponsorship covering school fees, books, uniforms and stationery for orphaned children, both locally and through partner organisations abroad.',
      shortDescription: 'Funding school fees, books and uniforms for sponsored orphans.',
      category: 'orphans',
      status: 'Ongoing',
      imageUrl: '/h4.webp',
      location: 'London & Overseas',
      startDate: new Date('2025-09-01'),
      targetAmount: 15000,
      raisedAmount: 9200,
      supporters: 168,
      beneficiaries: '90 children',
      objectives: [
        'Cover full-year school costs for 90 sponsored children',
        'Provide termly progress updates to sponsors',
      ],
      impact: '90 children currently sponsored through full academic years.',
      featured: true,
      fundraisingEnabled: true,
    },
    {
      id: 'p3',
      title: "Qur'an Memorisation Programme",
      slug: 'quran-memorisation-programme',
      description:
        'Weekly Qur\'an classes for children and adults, taught by qualified teachers, with a structured memorisation and tajweed curriculum.',
      shortDescription: 'Weekly Qur\'an classes for children and adults across London.',
      category: 'quran',
      status: 'Active',
      imageUrl: '/h1.webp',
      location: 'North London',
      startDate: new Date('2025-01-10'),
      beneficiaries: '250 students',
      objectives: ['Enrol 250 students across 3 age groups', 'Complete Qur\'an memorisation cohorts twice yearly'],
      impact: '180 students currently enrolled across weekday and weekend classes.',
      featured: true,
      fundraisingEnabled: false,
    },
    {
      id: 'p4',
      title: 'New Muslim Support Circle',
      slug: 'new-muslim-support-circle',
      description:
        'A dedicated support programme for new Muslims, offering foundational classes, mentorship and a welcoming community space.',
      shortDescription: 'Mentorship and foundational classes for new Muslims.',
      category: 'dawah',
      status: 'Active',
      imageUrl: '/h5.webp',
      location: 'Central London',
      startDate: new Date('2025-06-01'),
      targetAmount: 4000,
      raisedAmount: 2100,
      supporters: 64,
      beneficiaries: '40+ new Muslims',
      featured: false,
      fundraisingEnabled: true,
    },
    {
      id: 'p5',
      title: 'Winter Emergency Support',
      slug: 'winter-emergency-support',
      description:
        'Emergency winter relief for vulnerable families — heating support, warm clothing and essential supplies during the coldest months.',
      shortDescription: 'Heating support and warm clothing for vulnerable families.',
      category: 'charity',
      status: 'Upcoming',
      imageUrl: '/h2.webp',
      location: 'Greater London',
      startDate: new Date('2026-11-15'),
      endDate: new Date('2027-01-31'),
      targetAmount: 8000,
      raisedAmount: 0,
      supporters: 0,
      featured: false,
      fundraisingEnabled: true,
    },
    {
      id: 'p6',
      title: 'Zakat Distribution Programme',
      slug: 'zakat-distribution-programme',
      description:
        'Structured, responsible Zakat collection and distribution to eligible beneficiaries, verified through local welfare partners.',
      shortDescription: 'Responsible Zakat collection and distribution to eligible beneficiaries.',
      category: 'zakat',
      status: 'Ongoing',
      imageUrl: '/h2.webp',
      location: 'London',
      startDate: new Date('2025-01-01'),
      targetAmount: 30000,
      raisedAmount: 21500,
      supporters: 340,
      beneficiaries: '210 households',
      featured: false,
      fundraisingEnabled: true,
    },
    {
      id: 'p7',
      title: 'Youth Leadership Weekend',
      slug: 'youth-leadership-weekend',
      description:
        'A residential weekend programme building confidence, Islamic identity and leadership skills in Muslim youth aged 13–18.',
      shortDescription: 'A residential weekend building confidence and Islamic identity in Muslim youth.',
      category: 'youth',
      status: 'Upcoming',
      imageUrl: '/h1.webp',
      location: 'Surrey (residential)',
      startDate: new Date('2026-05-22'),
      targetAmount: 6000,
      raisedAmount: 1800,
      supporters: 37,
      featured: false,
      fundraisingEnabled: true,
    },
    {
      id: 'p8',
      title: 'Community Iftar Nights',
      slug: 'community-iftar-nights',
      description:
        'Open community iftars held every weekend of Ramadan, welcoming anyone — new Muslims, students, neighbours — to break their fast together.',
      shortDescription: 'Open community iftars held every weekend during Ramadan.',
      category: 'community',
      status: 'Active',
      imageUrl: '/h3.webp',
      location: 'East London',
      startDate: new Date('2026-02-15'),
      endDate: new Date('2026-03-30'),
      beneficiaries: '600+ attendees per Ramadan',
      featured: false,
      fundraisingEnabled: false,
    },
    {
      id: 'p9',
      title: 'Public Da\'wah Stall Series',
      slug: 'public-dawah-stall-series',
      description:
        'Regular Da\'wah stalls in high-footfall areas across London, offering literature, conversation and a friendly introduction to Islam.',
      shortDescription: 'Regular street Da\'wah stalls introducing Islam to the public.',
      category: 'dawah',
      status: 'Completed',
      imageUrl: '/h5.webp',
      location: 'Central London',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-08-31'),
      beneficiaries: '850+ people reached',
      impact: 'Reached over 850 people in direct conversation across 20 sessions.',
      featured: false,
      fundraisingEnabled: false,
    },
  ];

  getProjects(): Project[] {
    return this.projects;
  }

  getFeaturedProjects(): Project[] {
    return this.projects.filter((p) => p.featured);
  }

  getActiveProjects(): Project[] {
    return this.projects.filter((p) => p.status === 'Active');
  }

  getCompletedProjects(): Project[] {
    return this.projects.filter((p) => p.status === 'Completed');
  }

  getProjectsByCategory(category: ProjectCategory): Project[] {
    return this.projects.filter((p) => p.category === category);
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  getProjectBySlug(slug: string): Project | undefined {
    return this.projects.find((p) => p.slug === slug);
  }

  getProjectStats(): ProjectStats {
    return {
      total: this.projects.length,
      active: this.projects.filter((p) => p.status === 'Active').length,
      upcoming: this.projects.filter((p) => p.status === 'Upcoming').length,
      completed: this.projects.filter((p) => p.status === 'Completed').length,
      ongoing: this.projects.filter((p) => p.status === 'Ongoing').length,
    };
  }

  getLocations(): string[] {
    return Array.from(new Set(this.projects.map((p) => p.location))).sort();
  }
}
