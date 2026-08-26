import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Subscription, interval } from 'rxjs';
import { PrayerTimeItem, PrayerTimeService } from '../../services/prayer-time.service';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prayer-times.component.html',
  styleUrl: './prayer-times.component.scss',
})
export class PrayerTimesComponent implements OnInit, OnDestroy {
  prayers = signal<PrayerTimeItem[]>([]);

  currentTime = signal(new Date());

  nextPrayer = signal<PrayerTimeItem | null>(null);

  countdown = signal('');

  city = signal('Abuja');

  country = signal('Nigeria');

  latitude = 9.0765;

  longitude = 7.3986;

  private timerSubscription?: Subscription;

  constructor(private prayerTimeService: PrayerTimeService) {}

  ngOnInit(): void {
    this.calculatePrayerTimes();

    this.timerSubscription = interval(1000).subscribe(() => {
      const now = new Date();

      this.currentTime.set(now);

      this.updateNextPrayer();
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  calculatePrayerTimes(): void {
    const result = this.prayerTimeService.calculatePrayerTimes(this.latitude, this.longitude);

    this.prayers.set(result);

    this.updateNextPrayer();
  }

  updateNextPrayer(): void {
    const next = this.prayerTimeService.getNextPrayer(this.prayers(), this.currentTime());

    this.nextPrayer.set(next);

    if (next) {
      this.countdown.set(this.getCountdown(next.time, this.currentTime()));
    } else {
      this.countdown.set('Tomorrow');
    }
  }

  private getCountdown(target: Date, now: Date): string {
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      return '00:00:00';
    }

    const totalSeconds = Math.floor(difference / 1000);

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
  }

  isNextPrayer(prayer: PrayerTimeItem): boolean {
    return this.nextPrayer()?.prayer === prayer.prayer;
  }
}
