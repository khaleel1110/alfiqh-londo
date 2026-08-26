import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface IslamicDay {
  hijriDay: number;
  hijriMonth: string;
  hijriMonthNumber: number;
  hijriYear: number;
  gregorianDate: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
}

interface IslamicEvent {
  title: string;
  description: string;
  hijriDate: string;
  icon: string;
}

@Component({
  selector: 'app-islamic-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './islamic-calendar.component.html',
  styleUrl: './islamic-calendar.component.scss',
})
export class IslamicCalendarComponent {

  today = new Date();

  currentGregorianMonth = signal(
    new Date(this.today.getFullYear(), this.today.getMonth(), 1)
  );

  /**
   * Islamic month names
   */
  hijriMonths = [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    'Sha’ban',
    'Ramadan',
    'Shawwal',
    'Dhul-Qi’dah',
    'Dhul-Hijjah',
  ];

  /**
   * Convert Gregorian date to Hijri using Intl.
   *
   * This uses the browser's Islamic calendar implementation.
   */
  getHijri(date: Date) {
    const formatter = new Intl.DateTimeFormat(
      'en-TN-u-ca-islamic',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    );

    return formatter.formatToParts(date);
  }

  getHijriDate(date: Date): string {
    const parts = this.getHijri(date);

    const day = parts.find(p => p.type === 'day')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const year = parts.find(p => p.type === 'year')?.value;

    return `${day} ${month} ${year} AH`;
  }

  getHijriParts(date: Date) {
    const parts = this.getHijri(date);

    return {
      day: Number(parts.find(p => p.type === 'day')?.value),
      month: parts.find(p => p.type === 'month')?.value ?? '',
      year: Number(parts.find(p => p.type === 'year')?.value),
    };
  }

  currentHijri = computed(() => {
    return this.getHijriParts(this.today);
  });

  currentMonthLabel = computed(() => {
    return this.currentGregorianMonth().toLocaleDateString(
      'en-GB',
      {
        month: 'long',
        year: 'numeric',
      }
    );
  });

  /**
   * Generate calendar days.
   */
  calendarDays = computed(() => {

    const current = this.currentGregorianMonth();

    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: IslamicDay[] = [];

    // Sunday = 0
    const startingDay = firstDay.getDay();

    // Previous month placeholders
    for (let i = 0; i < startingDay; i++) {
      const date = new Date(
        year,
        month,
        i - startingDay + 1
      );

      days.push(this.createDay(date, false));
    }

    // Current month
    for (let day = 1; day <= lastDay.getDate(); day++) {

      const date = new Date(year, month, day);

      days.push(this.createDay(date, true));
    }

    // Complete final week
    while (days.length % 7 !== 0) {

      const date = new Date(
        year,
        month,
        lastDay.getDate() + (days.length - startingDay + 1)
      );

      days.push(this.createDay(date, false));
    }

    return days;
  });

  private createDay(
    date: Date,
    isCurrentMonth: boolean
  ): IslamicDay {

    const hijri = this.getHijriParts(date);

    return {
      hijriDay: hijri.day,
      hijriMonth: hijri.month,
      hijriMonthNumber: 0,
      hijriYear: hijri.year,
      gregorianDate: date,
      isToday: this.isSameDay(date, this.today),
      isCurrentMonth,
    };
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  previousMonth(): void {
    const current = this.currentGregorianMonth();

    this.currentGregorianMonth.set(
      new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1
      )
    );
  }

  nextMonth(): void {
    const current = this.currentGregorianMonth();

    this.currentGregorianMonth.set(
      new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        1
      )
    );
  }

  goToToday(): void {
    this.currentGregorianMonth.set(
      new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        1
      )
    );
  }

  /**
   * Important Islamic dates.
   *
   * These are displayed as learning/reference dates.
   * Actual dates can vary depending on moon sighting.
   */
  islamicEvents: IslamicEvent[] = [
    {
      title: 'Ramadan',
      description:
        'The blessed month of fasting, Qur’an recitation, charity and increased worship.',
      hijriDate: '9th month',
      icon: 'bi bi-moon-stars',
    },
    {
      title: 'Laylat al-Qadr',
      description:
        'The Night of Decree, sought during the final ten nights of Ramadan.',
      hijriDate: 'Last 10 nights of Ramadan',
      icon: 'bi bi-stars',
    },
    {
      title: 'Eid al-Fitr',
      description:
        'The celebration marking the completion of Ramadan.',
      hijriDate: '1 Shawwal',
      icon: 'bi bi-sun',
    },
    {
      title: 'Day of Arafah',
      description:
        'A significant day during Dhul-Hijjah and the Hajj pilgrimage.',
      hijriDate: '9 Dhul-Hijjah',
      icon: 'bi bi-kaaba',
    },
    {
      title: 'Eid al-Adha',
      description:
        'The festival of sacrifice celebrated during the days of Hajj.',
      hijriDate: '10 Dhul-Hijjah',
      icon: 'bi bi-heart',
    },
    {
      title: 'Ashura',
      description:
        'The 10th day of Muharram, a significant day in the Islamic calendar.',
      hijriDate: '10 Muharram',
      icon: 'bi bi-calendar-heart',
    },
  ];

  /**
   * Islamic learning cards.
   */
  learningTopics = [
    {
      title: 'The Five Pillars of Islam',
      description:
        'Learn about Shahadah, Salah, Zakat, Sawm and Hajj.',
      icon: 'bi bi-moon-stars',
    },
    {
      title: 'Understanding Salah',
      description:
        'Learn the importance of prayer and how it connects a believer with Allah.',
      icon: 'bi bi-person-check',
    },
    {
      title: 'What is Zakat?',
      description:
        'Understand the purpose and importance of obligatory charity.',
      icon: 'bi bi-hand-heart',
    },
    {
      title: 'The Qur’an',
      description:
        'Discover the importance of the Qur’an as guidance for Muslims.',
      icon: 'bi bi-book',
    },
    {
      title: 'Good Character',
      description:
        'Explore Islamic teachings about kindness, honesty, patience and mercy.',
      icon: 'bi bi-heart',
    },
    {
      title: 'Making Dua',
      description:
        'Learn about supplication and maintaining a strong connection with Allah.',
      icon: 'bi bi-stars',
    },
  ];
}
