import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Announcement {
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  featured?: boolean;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.scss',
})
export class AnnouncementsComponent {
  selectedCategory = signal('All');

  categories = ['All', 'Projects', 'Da’wah', 'Charity', 'Zakat', 'Education', 'Events'];

  announcements: Announcement[] = [
    {
      title: 'Ramadan Food Distribution Campaign',
      description:
        'We are preparing to support families in need through our upcoming Ramadan food distribution project.',
      date: '25 Aug 2026',
      category: 'Charity',
      image: '/h3.webp',
      featured: true,
    },
    {
      title: 'New Qur’an Learning Programme',
      description:
        'A new learning initiative designed to make Qur’anic education more accessible to the community.',
      date: '20 Aug 2026',
      category: 'Education',
      image: '/h1.webp',
    },
    {
      title: 'Supporting Orphans',
      description:
        'Our orphan support programme continues to provide educational and essential support to vulnerable children.',
      date: '15 Aug 2026',
      category: 'Projects',
      image: '/h4.webp',
    },
    {
      title: 'Zakat Campaign',
      description:
        'Support our Zakat initiatives and help ensure assistance reaches those who are eligible.',
      date: '10 Aug 2026',
      category: 'Zakat',
      image: '/h2.webp',
    },
  ];

  filteredAnnouncements(): Announcement[] {
    const category = this.selectedCategory();

    if (category === 'All') {
      return this.announcements;
    }

    return this.announcements.filter((item) => item.category === category);
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
