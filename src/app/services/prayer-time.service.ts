import { Injectable } from '@angular/core';
import { CalculationMethod, Coordinates, Prayer, PrayerTimes } from 'adhan';

export interface PrayerTimeItem {
  name: string;
  prayer: any;
  time: Date;
  formattedTime: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class PrayerTimeService {
  /**
   * Calculate prayer times for a specific location.
   */
  calculatePrayerTimes(
    latitude: number,
    longitude: number,
    date: Date = new Date(),
  ): PrayerTimeItem[] {
    const coordinates = new Coordinates(latitude, longitude);

    const params = CalculationMethod.MuslimWorldLeague();

    params.adjustments = {
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    };

    const prayerTimes = new PrayerTimes(coordinates, date, params);

    return [
      {
        name: 'Fajr',
        prayer: Prayer.Fajr,
        time: prayerTimes.fajr,
        formattedTime: this.formatTime(prayerTimes.fajr),
        icon: 'bi bi-moon-stars',
      },
      {
        name: 'Sunrise',
        prayer: Prayer.Sunrise,
        time: prayerTimes.sunrise,
        formattedTime: this.formatTime(prayerTimes.sunrise),
        icon: 'bi bi-sunrise',
      },
      {
        name: 'Dhuhr',
        prayer: Prayer.Dhuhr,
        time: prayerTimes.dhuhr,
        formattedTime: this.formatTime(prayerTimes.dhuhr),
        icon: 'bi bi-sun',
      },
      {
        name: 'Asr',
        prayer: Prayer.Asr,
        time: prayerTimes.asr,
        formattedTime: this.formatTime(prayerTimes.asr),
        icon: 'bi bi-brightness-high',
      },
      {
        name: 'Maghrib',
        prayer: Prayer.Maghrib,
        time: prayerTimes.maghrib,
        formattedTime: this.formatTime(prayerTimes.maghrib),
        icon: 'bi bi-sunset',
      },
      {
        name: 'Isha',
        prayer: Prayer.Isha,
        time: prayerTimes.isha,
        formattedTime: this.formatTime(prayerTimes.isha),
        icon: 'bi bi-moon',
      },
    ];
  }

  getNextPrayer(prayers: PrayerTimeItem[], now: Date = new Date()): PrayerTimeItem | null {
    return prayers.find((prayer) => prayer.time.getTime() > now.getTime()) ?? null;
  }

  private formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-NG', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }
}
