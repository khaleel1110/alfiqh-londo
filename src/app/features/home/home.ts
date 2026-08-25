import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swiper from 'swiper';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Subscription, interval } from 'rxjs';
import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Prayer,
} from 'adhan';

// ---- Swiper styles must be imported once for the slider to render/animate.
// This was the reason the previous slider "didn't work": the JS was wired up
// correctly, but without these the slides have no transition/position CSS
// and just stack on top of each other.
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface Slide {
  title: string;
  subtitle: string;
  image: string;
}

interface PrayerRow {
  key: string;
  label: string;
  arabic: string;
  time: Date;
}

interface EventItem {
  title: string;
  category: 'Jumu\'ah' | 'Lecture' | 'Quran Class' | 'Ramadan' | 'Seminar' | 'Community';
  date: Date;
  time: string;
  location: string;
}

interface Announcement {
  title: string;
  message: string;
  date: Date;
  priority: 'normal' | 'high';
}

interface GalleryImage {
  url: string;
  caption: string;
  category: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  constructor(private sanitizer: DomSanitizer) {}

  // ---------- Hero / slider ----------
  mosqueName = 'Al-Fiqh Nigerian Islamic Trust';
  mosqueLocation = 'London, United Kingdom';

  @ViewChild('heroSwiper') swiperRef!: ElementRef<HTMLElement>;
  private swiper?: Swiper;
  currentSlide = 0;

  slides: Slide[] = [
    {
      title: 'Al-Fiqh Nigerian Islamic Trust',
      subtitle: 'A home for worship, learning and community in London',
      image: '/assets/hero/mosque-hero-1.jpg',
    },
    {
      title: 'Five Daily Prayers, One Community',
      subtitle: 'Join us for congregational Salah every day of the week',
      image: '/assets/hero/mosque-hero-2.jpg',
    },
    {
      title: 'Jumu\'ah & Islamic Learning',
      subtitle: 'Khutbah, Qur\'an classes and seminars for all ages',
      image: '/assets/hero/mosque-hero-3.jpg',
    },
  ];

  // ---------- Dates ----------
  gregorianDate = '';
  hijriDate = '';

  // ---------- Prayer times ----------
  // TODO: move to a shared PrayerTimesService once the dedicated
  // "Prayer Times" page is built, so location + calculation method
  // can be configured from one place.
  private londonCoordinates = new Coordinates(51.5074, -0.1278);
  private calculationParams = CalculationMethod.MuslimWorldLeague();
  private prayerTimes!: PrayerTimes;

  todayPrayers: PrayerRow[] = [];
  currentPrayerKey = '';
  nextPrayerKey = '';
  nextPrayerTime: Date | null = null;
  countdown = '00:00:00';

  private countdownSub?: Subscription;

  // ---------- Static/mock content (to be wired to Firebase later) ----------
  jumuah = {
    khutbahTime: '13:15',
    jamaahTime: '13:30',
    note: 'Two khutbahs are delivered in English and Yoruba/Hausa on rotation. Please arrive 15 minutes early as space is limited.',
  };

  upcomingEvents: EventItem[] = [
    {
      title: 'Jumu\'ah Khutbah',
      category: "Jumu'ah",
      date: this.nextFriday(),
      time: '1:15 PM',
      location: 'Main Prayer Hall',
    },
    {
      title: 'Weekly Tafsir Circle',
      category: 'Lecture',
      date: this.daysFromNow(3),
      time: '7:00 PM',
      location: 'Community Hall',
    },
    {
      title: 'Qur\'an Memorisation Class (Children)',
      category: 'Quran Class',
      date: this.daysFromNow(5),
      time: '4:30 PM',
      location: 'Madrasah Room 1',
    },
  ];

  announcements: Announcement[] = [
    {
      title: 'Ramadan 1447 Planning Meeting',
      message: 'All volunteers are invited to the Ramadan preparation meeting after Isha this Saturday.',
      date: new Date(),
      priority: 'high',
    },
    {
      title: 'Car Park Resurfacing Notice',
      message: 'The rear car park will be closed for resurfacing next week. Please use street parking.',
      date: this.daysFromNow(-2),
      priority: 'normal',
    },
  ];

  galleryImages: GalleryImage[] = [
    { url: '/assets/gallery/prayer-hall.jpg', caption: 'Main Prayer Hall', category: 'Mosque' },
    { url: '/assets/gallery/jumuah.jpg', caption: 'Jumu\'ah Congregation', category: 'Community' },
    { url: '/assets/gallery/madrasah.jpg', caption: 'Madrasah Class', category: 'Education' },
    { url: '/assets/gallery/ramadan.jpg', caption: 'Ramadan Iftar', category: 'Ramadan' },
  ];

  quickLinks = [
    { label: 'Prayer Times', path: '/prayer-times' },
    { label: 'Donate', path: '/donate' },
    { label: 'Events', path: '/events' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  contact = {
    address: '123 Example Road, London, E1 6AN',
    phone: '+44 20 0000 0000',
    email: 'info@alfiqhtrust.org.uk',
    mapsEmbedUrl: '' as string | SafeResourceUrl,
    social: [
      { label: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
      { label: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
      { label: 'WhatsApp', url: 'https://wa.me/', icon: 'whatsapp' },
    ],
  };

  ngOnInit(): void {
    this.updateDates();
    this.calculatePrayerTimes();
    this.startCountdown();

    // Google Maps iframe URLs must be explicitly trusted, otherwise
    // Angular's sanitizer strips the src and the map renders blank.
    this.contact.mapsEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps?q=London&output=embed',
    );
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  ngOnDestroy(): void {
    this.swiper?.destroy(true, true);
    this.countdownSub?.unsubscribe();
  }

  // ---------- Swiper ----------
  private initializeSwiper(): void {
    if (!this.swiperRef?.nativeElement) return;

    this.swiper = new Swiper(this.swiperRef.nativeElement, {
      modules: [EffectFade, Autoplay, Pagination],
      effect: 'fade',
      fadeEffect: { crossFade: true },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      speed: 1200,
      on: {
        init: (swiper) => (this.currentSlide = swiper.realIndex),
        slideChange: (swiper) => (this.currentSlide = swiper.realIndex),
      },
    });
  }

  // ---------- Dates ----------
  private updateDates(): void {
    const now = new Date();
    this.gregorianDate = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);

    // Umm al-Qura based Hijri date. This is an approximation supplied by the
    // browser's Intl implementation - good enough for display purposes.
    // A moon-sighting-adjusted date can be layered on later if needed.
    this.hijriDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);
  }

  // ---------- Prayer times ----------
  private calculatePrayerTimes(): void {
    const date = new Date();
    this.prayerTimes = new PrayerTimes(
      this.londonCoordinates,
      date,
      this.calculationParams,
    );

    this.todayPrayers = [
      { key: 'fajr', label: 'Fajr', arabic: 'الفجر', time: this.prayerTimes.fajr },
      { key: 'sunrise', label: 'Sunrise', arabic: 'الشروق', time: this.prayerTimes.sunrise },
      { key: 'dhuhr', label: 'Dhuhr', arabic: 'الظهر', time: this.prayerTimes.dhuhr },
      { key: 'asr', label: 'Asr', arabic: 'العصر', time: this.prayerTimes.asr },
      { key: 'maghrib', label: 'Maghrib', arabic: 'المغرب', time: this.prayerTimes.maghrib },
      { key: 'isha', label: 'Isha', arabic: 'العشاء', time: this.prayerTimes.isha },
    ];

    const current = this.prayerTimes.currentPrayer();
    const next = this.prayerTimes.nextPrayer();
    this.currentPrayerKey = this.prayerEnumToKey(current);
    this.nextPrayerKey = this.prayerEnumToKey(next);
    this.nextPrayerTime =
      next === Prayer.None ? null : this.prayerTimes.timeForPrayer(next);
  }

  private prayerEnumToKey(prayer: Prayer): string {
    switch (prayer) {
      case Prayer.Fajr:
        return 'fajr';
      case Prayer.Sunrise:
        return 'sunrise';
      case Prayer.Dhuhr:
        return 'dhuhr';
      case Prayer.Asr:
        return 'asr';
      case Prayer.Maghrib:
        return 'maghrib';
      case Prayer.Isha:
        return 'isha';
      default:
        return '';
    }
  }

  private startCountdown(): void {
    this.countdownSub = interval(1000).subscribe(() => {
      if (!this.nextPrayerTime) {
        // Past Isha - next prayer is tomorrow's Fajr.
        this.calculatePrayerTimes();
        return;
      }

      const diffMs = this.nextPrayerTime.getTime() - Date.now();
      if (diffMs <= 0) {
        this.calculatePrayerTimes();
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      this.countdown = [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
    });
  }

  // ---------- Helpers ----------
  private daysFromNow(days: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  private nextFriday(): Date {
    const d = new Date();
    const dayDiff = (5 - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + dayDiff);
    return d;
  }
}
