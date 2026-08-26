import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface IslamicResource {
  title: string;
  description: string;
  category: string;
  icon: string;
  path?: string;
  externalUrl?: string;
}

@Component({
  selector: 'app-islamic-resources',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './islamic-resources.component.html',
  styleUrl: './islamic-resources.component.scss',
})
export class IslamicResourcesComponent {
  selectedCategory = signal('All');

  categories = ['All', 'Qur’an', 'Hadith', 'Duas', 'Prayer', 'Learning'];

  resources: IslamicResource[] = [
    {
      title: 'The Holy Qur’an',
      description: 'Read, reflect and explore the words of the Qur’an.',
      category: 'Qur’an',
      icon: 'bi bi-book',
      externalUrl: 'https://quran.com',
    },

    {
      title: 'Hadith',
      description: 'Explore authentic narrations and teachings of the Prophet ﷺ.',
      category: 'Hadith',
      icon: 'bi bi-journal-text',
      externalUrl: 'https://sunnah.com',
    },

    {
      title: 'Daily Duas',
      description: 'Useful supplications for everyday life and worship.',
      category: 'Duas',
      icon: 'bi bi-stars',
    },

    {
      title: 'Prayer Times',
      description: "Find today's prayer times and stay connected to your salah.",
      category: 'Prayer',
      icon: 'bi bi-moon-stars',
      path: '/prayer-times',
    },

    {
      title: 'Islamic Learning',
      description: 'Articles and educational resources for learning about Islam.',
      category: 'Learning',
      icon: 'bi bi-lightbulb',
      path: '/islamic-calendar',
    },

    {
      title: 'Islamic Calendar',
      description: 'Keep track of important Islamic dates and occasions.',
      category: 'Learning',
      icon: 'bi bi-calendar3',
      path: '/islamic-calendar',
    },
  ];

  filteredResources() {
    const category = this.selectedCategory();

    if (category === 'All') {
      return this.resources;
    }

    return this.resources.filter((resource) => resource.category === category);
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
