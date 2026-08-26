import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';
interface FooterLink {
  label: string;
  path: string;
}
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  // Newsletter state
  currentYear = new Date().getFullYear();

  exploreLinks: FooterLink[] = [
    {
      label: 'Home',
      path: '/home',
    },
    {
      label: 'About Us',
      path: '/about',
    },
    {
      label: 'Projects',
      path: '/projects',
    },
    {
      label: 'News & Activities',
      path: '/news-and-activities',
    },
    {
      label: 'Gallery',
      path: '/gallery',
    },
  ];

  resourceLinks: FooterLink[] = [
    {
      label: 'Islamic Resources',
      path: '/islamic-resources',
    },
    {
      label: 'Prayer Times',
      path: '/prayer-times',
    },
    {
      label: 'Qur’an',
      path: '/islamic-resources',
    },
    {
      label: 'Hadith',
      path: '/islamic-resources',
    },
    {
      label: 'Daily Duas',
      path: '/islamic-resources',
    },
  ];

  socialLinks = [
    {
      label: 'Facebook',
      icon: 'bi bi-facebook',
      url: '#',
    },
    {
      label: 'Instagram',
      icon: 'bi bi-instagram',
      url: '#',
    },
    {
      label: 'X',
      icon: 'bi bi-twitter-x',
      url: '#',
    },
    {
      label: 'YouTube',
      icon: 'bi bi-youtube',
      url: '#',
    },
  ];
}
