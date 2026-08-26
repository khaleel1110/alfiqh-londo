import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SupportOption {
  title: string;
  description: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-support-us',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './support-us.component.html',
  styleUrl: './support-us.component.scss',
})
export class SupportUsComponent {
  copied = false;

  supportOptions: SupportOption[] = [
    {
      title: 'Zakat',
      description:
        'Fulfil your Zakat and help provide meaningful support to those who are eligible.',
      icon: 'bi bi-moon-stars',
      path: '/zakat',
    },
    {
      title: 'Sadaqah',
      description:
        'Give voluntary charity and contribute to projects that benefit people and communities.',
      icon: 'bi bi-heart',
      path: '/donate',
    },
    {
      title: 'Support a Project',
      description: 'Choose an active Islamic project and directly support its goals and impact.',
      icon: 'bi bi-bullseye',
      path: '/projects',
    },
    {
      title: 'Volunteer',
      description:
        'Your time, skills and experience can help us deliver meaningful community projects.',
      icon: 'bi bi-people',
      path: '/contact-us',
    },
  ];

  accountNumber = '0000000000';

  copyAccountNumber(): void {
    navigator.clipboard.writeText(this.accountNumber);

    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 2500);
  }
}
