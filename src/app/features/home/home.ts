import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swiper from 'swiper';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Subscription, interval } from 'rxjs';
import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';
import { OurImpactComponent } from '../our-impact.component/our-impact.component';
import { DonateModalComponent } from '../donate-modal.component/donate-modal.component';
import { DonationModalService } from '../../services/donation-modal.service';

// Slider mechanics unchanged from the previous fix (see prior notes):
// no EffectFade module, crossfade driven by our own CSS reading
// .swiper-slide-active, so it can't be broken by the duplicate
// swiper-bundle.min.css load in angular.json.

interface Slide {
  tag: string;
  image: string;
}

interface ImpactStat {
  title: string;
  target: number;
  suffix: string;
  icon: string;
}

interface Project {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  image: string;
  status: 'Active' | 'Upcoming' | 'Completed' | 'Ongoing';
  fundraisingEnabled: boolean;
  target?: number;
  raised?: number;
  supporters?: number;
  impactLabel?: string; // used instead of a progress bar when fundraisingEnabled is false
}

interface WorkArea {
  title: string;
  slug: string;
  description: string;
  icon: string;
}

interface EventItem {
  title: string;
  category: string;
  date: Date;
  time: string;
  location: string;
}

interface ResourceItem {
  title: string;
  description: string;
  category: string;
  icon: string;
  path?: string;
  externalUrl?: string;
}

interface GalleryImage {
  url: string;
  caption: string;
  category: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, OurImpactComponent, RouterLinkActive],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private sanitizer: DomSanitizer,
    private donationModal: DonationModalService,
  ) {}

  openDonate(): void {
    this.donationModal.open();
  }

  // ---------- Org identity ----------
  // Registered charity name per the Constitution and Trust Deed.
  orgName = 'Al-Fiqh Nigerian Islamic Trust';
  orgTagline =
    'Advancing Islamic knowledge and turning charity into lasting change across the UK and Nigeria';

  @ViewChild('campaignSwiper')
  campaignSwiper!: ElementRef<HTMLElement>;
  @ViewChild('heroSwiper')
  heroSwiper!: ElementRef<HTMLElement>;

  private swiper!: Swiper;
  private campaignSwiperInstance!: Swiper;

  campaignSlideIndex = signal(0);
  currentSlide = signal(0);

  ngAfterViewInit(): void {
    // ==============================
    // HERO SLIDER
    // ==============================

    this.swiper = new Swiper(this.heroSwiper.nativeElement, {
      modules: [Autoplay, Pagination, EffectFade],

      effect: 'fade',

      fadeEffect: {
        crossFade: true,
      },

      loop: true,

      speed: 500,

      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },

      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      on: {
        init: (swiper) => {
          this.currentSlide.set(swiper.realIndex);
        },

        slideChange: (swiper) => {
          this.currentSlide.set(swiper.realIndex);
        },
      },
    });

    // ==============================
    // CAMPAIGN SLIDER
    // ==============================

    this.campaignSwiperInstance = new Swiper(this.campaignSwiper.nativeElement, {
      modules: [Autoplay, Pagination],

      slidesPerView: 1,

      spaceBetween: 0,

      loop: true,

      speed: 700,

      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      pagination: {
        el: '.campaign-pagination',
        clickable: true,
      },

      observer: true,
      observeParents: true,
    });

    // ==============================
    // STATS OBSERVER
    // ==============================

    if (!this.statsSectionRef?.nativeElement) {
      return;
    }

    this.statsObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !this.countersAnimated) {
          this.countersAnimated = true;

          this.animateCounters();

          this.statsObserver?.unobserve(this.statsSectionRef.nativeElement);
        }
      },
      {
        threshold: 0.25,
      },
    );

    this.statsObserver.observe(this.statsSectionRef.nativeElement);

    this.observeStatsSection();
  }

  private animateCounters(): void {
    const duration = 4000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const values = this.impactStats.map((stat) => Math.floor(stat.target * easedProgress));

      this.counterValues.set(values);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Guarantee exact final values
        this.counterValues.set(this.impactStats.map((stat) => stat.target));
      }
    };

    requestAnimationFrame(animate);
  }

  // ---------- Prayer times — small widget only, per the brief ----------
  // TODO: swap for the shared PrayerTimesService once the dedicated
  // /prayer-times page exists, so location + method stay in sync.
  private londonCoordinates = new Coordinates(51.5074, -0.1278);
  private calculationParams = CalculationMethod.MuslimWorldLeague();
  private prayerTimes!: PrayerTimes;
  nextPrayerKey = signal('');
  nextPrayerTimeLabel = signal('');
  countdown = signal('00:00:00');
  private nextPrayerTime: Date | null = null;
  private countdownSub?: Subscription;

  // ---------- Newsletter ----------
  newsletterEmail = signal('');
  newsletterSubmitted = signal(false);

  ngOnInit(): void {
    this.calculatePrayerTimes();
    this.startCountdown();

    this.contact.mapsEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps?q=97+Roycraft+Avenue+Barking+London+IG11+0NS&output=embed',
    );
  }

  ngOnDestroy(): void {
    this.swiper?.destroy(true, true);

    this.campaignSwiperInstance?.destroy(true, true);

    this.countdownSub?.unsubscribe();

    this.statsObserver?.disconnect();
  }

  // ---------- Impact counters ----------
  private observeStatsSection(): void {
    if (!this.statsSectionRef?.nativeElement || typeof IntersectionObserver === 'undefined') {
      this.animateCounters();
      return;
    }

    this.statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !this.countersAnimated) {
          this.animateCounters();
        }
      },
      { threshold: 0.35 },
    );
    this.statsObserver.observe(this.statsSectionRef.nativeElement);
  }

  progressPercent(project: Project): number {
    if (!project.target || !project.raised) return 0;
    return Math.min(100, Math.round((project.raised / project.target) * 100));
  }

  // ---------- Prayer widget ----------
  private calculatePrayerTimes(): void {
    const date = new Date();
    this.prayerTimes = new PrayerTimes(this.londonCoordinates, date, this.calculationParams);

    const next = this.prayerTimes.nextPrayer();
    this.nextPrayerKey.set(this.prayerEnumToKey(next));
    this.nextPrayerTime = next === Prayer.None ? null : this.prayerTimes.timeForPrayer(next);
    this.nextPrayerTimeLabel.set(
      this.nextPrayerTime
        ? new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit' }).format(
            this.nextPrayerTime,
          )
        : '',
    );
  }

  private prayerEnumToKey(prayer: any): string {
    switch (prayer) {
      case Prayer.Fajr:
        return 'Fajr';
      case Prayer.Sunrise:
        return 'Sunrise';
      case Prayer.Dhuhr:
        return 'Dhuhr';
      case Prayer.Asr:
        return 'Asr';
      case Prayer.Maghrib:
        return 'Maghrib';
      case Prayer.Isha:
        return 'Isha';
      default:
        return '';
    }
  }

  private startCountdown(): void {
    this.countdownSub = interval(1000).subscribe(() => {
      if (!this.nextPrayerTime) {
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
      this.countdown.set([h, m, s].map((n) => String(n).padStart(2, '0')).join(':'));
    });
  }

  // ---------- Newsletter ----------
  submitNewsletter(): void {
    if (!this.newsletterEmail().trim()) return;
    // TODO: wire to an email service (Mailchimp/Firestore `subscribers`)
    // once one is chosen. No backend call yet — this is a placeholder.
    this.newsletterSubmitted.set(true);
  }

  // ---------- Helpers ----------
  private daysFromNow(days: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  // ---------- Impact statistics (animated counters) ----------
  // TODO: replace with ImpactStatsService reading Firestore `impactStats`
  // (ordered, active-only) once Firebase is wired up.
  // Figures reflect the Trust's charitable objects under Clause 3 of the
  // Constitution and Trust Deed (education/madrasa, poverty relief,
  // orphan welfare, scholarships, community projects).
  impactStats: ImpactStat[] = [
    { title: 'Families Supported', target: 1250, suffix: '+', icon: 'ai-users' },
    { title: 'Food Parcels Distributed', target: 5000, suffix: '+', icon: 'ai-bowl' },
    { title: 'Orphans Supported', target: 320, suffix: '+', icon: 'ai-heart' },
    { title: "Madrasa & Qur'an Students", target: 450, suffix: '+', icon: 'ai-book' },
    { title: 'Scholarships & Bursaries Awarded', target: 85, suffix: '+', icon: 'ai-briefcase' },
    { title: 'Community Projects', target: 25, suffix: '+', icon: 'ai-globe' },
  ];

  counterValues = signal<number[]>(this.impactStats.map(() => 0));
  private countersAnimated = false;
  private statsObserver?: IntersectionObserver;
  @ViewChild('statsSection') statsSectionRef!: ElementRef<HTMLElement>;

  // ---------- Featured projects ----------
  // TODO: ProjectService.getFeaturedProjects() once Firestore `projects`
  // collection is live.

  slides: Slide[] = [
    {
      tag: "Da'wah & Community",
      image:
        'https://firebasestorage.googleapis.com/v0/b/gomart-apps.appspot.com/o/alfiqh-london%2Fz4.jpg?alt=media&token=2c46f4e8-4e38-4479-90f0-3417e706d002',
    },
    {
      tag: 'Madrasa & Islamic Education',
      image:
        'https://firebasestorage.googleapis.com/v0/b/gomart-apps.appspot.com/o/alfiqh-london%2Fqr6.jpg?alt=media&token=cbf13eb4-b172-4c0b-8d74-cb59ce89846b',
    },
    /*    {
      tag: "Qur'an & Tajweed",
      image: '/q3.webp',
    },*/
    {
      tag: 'Zakāt & Sadaqah',
      image:
        'https://firebasestorage.googleapis.com/v0/b/gomart-apps.appspot.com/o/alfiqh-london%2Fh2.webp?alt=media&token=97b964e8-8590-48fa-8c82-119026fbce48',
    },
    {
      tag: 'Orphan Welfare',
      image:
        'https://firebasestorage.googleapis.com/v0/b/gomart-apps.appspot.com/o/alfiqh-london%2Fh4.webp?alt=media&token=d9b6ab78-b1b1-4c60-b563-b98e85e9bfde',
    },
    /*    {
      tag: 'Relief in Nigeria & the UK',
      image: '/h3.webp',
    },*/
  ];
  featuredProjects: Project[] = [
    {
      title: 'Poverty Relief & Food Distribution',
      slug: 'poverty-relief-food-distribution',
      category: 'Charity',
      shortDescription:
        'Food parcels and essential household items for families facing hardship in the UK and Nigeria.',
      image:
        'https://firebasestorage.googleapis.com/v0/b/gomart-apps.appspot.com/o/alfiqh-london%2Fh3.webp?alt=media&token=01f896e0-1e85-4286-b068-2a16cdbccd15',
      status: 'Active',
      fundraisingEnabled: true,
      target: 10000,
      raised: 7450,
      supporters: 214,
    },

    {
      title: 'Orphan Sponsorship — Nigeria & UK',
      slug: 'orphan-sponsorship',
      category: 'Orphans',
      shortDescription:
        'Monthly subsistence, school fees and educational materials for sponsored orphans.',
      image:
        'https://firebasestorage.googleapis.com/v0/b/gomart-apps.appspot.com/o/alfiqh-london%2Fz10.jpg?alt=media&token=fe13fd23-dafa-4d6f-90c0-cdd084dfeaa0',
      status: 'Ongoing',
      fundraisingEnabled: true,
      target: 15000,
      raised: 9200,
      supporters: 168,
    },

    {
      title: 'Alfiqh Madrasa & Islamiyyah',
      slug: 'weekend-madrasa',
      category: 'Education',
      shortDescription:
        "Qur'an memorisation, Tajweed, Arabic and Islamic studies for children and adults.",
      image:
        'https://firebasestorage.googleapis.com/v0/b/gomart-apps.appspot.com/o/alfiqh-london%2Fy5.jpg?alt=media&token=315edab8-c314-4ba7-b8b5-0f69fccb2341',
      status: 'Active',
      fundraisingEnabled: false,
      impactLabel: '180+  Students Enrolled',
    },
  ];

  // ---------- What We Do ----------
  // Aligned with the Trust's Objects (Clause 3) and Powers (Clause 5) of
  // the Constitution and Trust Deed.
  workAreas: WorkArea[] = [
    {
      title: "Da'wah",
      slug: 'dawah',
      description: "Advancing the Islamic religion through da'wah, lectures and study circles.",
      icon: 'ai-mic',
    },
    {
      title: 'Madrasa & Education',
      slug: 'education',
      description:
        "Qur'an, Tajweed, Arabic and Islamic studies for children, young people and adults.",
      icon: 'ai-book',
    },
    {
      title: 'Zakāt & Sadaqah',
      slug: 'zakat',
      description:
        'Collecting and distributing Zakāt, Sadaqah and Waqf with transparency and accountability.',
      icon: 'ai-percent',
    },
    {
      title: 'Charity & Poverty Relief',
      slug: 'charity',
      description: 'Food, clothing and emergency financial assistance for families in hardship.',
      icon: 'ai-hand-heart',
    },
    {
      title: 'Orphans & Welfare',
      slug: 'orphans',
      description:
        'Sponsorship, education and welfare support for orphans and vulnerable children.',
      icon: 'ai-users',
    },
    {
      title: 'Humanitarian Relief',
      slug: 'relief',
      description:
        'Disaster relief, refugee support and emergency assistance in the UK, Nigeria and beyond.',
      icon: 'ai-globe',
    },
  ];

  campaigns: Project[] = [
    {
      title: 'Poverty Relief & Food Distribution',
      slug: 'poverty-relief-food-distribution',
      category: 'Charity',
      shortDescription:
        'Providing food parcels and essential household items to families facing hardship in the UK and Nigeria, so no family goes without.',
      image: '/is2.jpg',
      status: 'Active',
      fundraisingEnabled: true,
      target: 10000,
      raised: 7450,
      supporters: 214,
    },

    {
      title: 'Orphan Sponsorship — Nigeria & UK',
      slug: 'orphan-sponsorship',
      category: 'Orphans',
      shortDescription:
        'Monthly subsistence, school fees and educational materials for orphans and vulnerable children, with long-term care and support.',
      image: '/y2.jpg',
      status: 'Ongoing',
      fundraisingEnabled: true,
      target: 15000,
      raised: 9200,
      supporters: 168,
    },

    {
      title: "Qur'an Memorisation Programme",
      slug: 'quran-memorisation-programme',
      category: 'Madrasa',
      shortDescription:
        "Weekend and evening classes in Qur'an memorisation, Tajweed and Arabic for children and adults across London.",
      image: '/qr6.jpg',
      status: 'Active',
      fundraisingEnabled: false,
      impactLabel: '180 / 250 Students Enrolled',
    },

    {
      title: "Da'wah & Islamic Outreach",
      slug: 'dawah-islamic-outreach',
      category: "Da'wah",
      shortDescription:
        'Lectures, study circles and outreach that share authentic Islamic knowledge and promote community cohesion.',
      image: '/z4.jpg',
      status: 'Active',
      fundraisingEnabled: false,
      impactLabel: '850+ People Reached',
    },

    {
      title: 'Zakāt & Sadaqah Distribution',
      slug: 'zakat-sadaqah-distribution',
      category: 'Zakāt',
      shortDescription:
        'Helping eligible families and individuals receive Zakāt and Sadaqah support with dignity, transparency and accountability to donors.',
      image: '/z6.webp',
      status: 'Ongoing',
      fundraisingEnabled: true,
      target: 20000,
      raised: 13750,
      supporters: 302,
    },

    {
      title: 'Refugee & Disaster Relief',
      slug: 'refugee-disaster-relief',
      category: 'Humanitarian',
      shortDescription:
        'Emergency humanitarian assistance, refugee and asylum-seeker support, and disaster relief in the UK, Nigeria and elsewhere.',
      image: '/is.jpg',
      status: 'Active',
      fundraisingEnabled: true,
      target: 12000,
      raised: 8400,
      supporters: 189,
    },
  ];

  // ---------- Upcoming events ----------
  upcomingEvents: EventItem[] = [
    {
      title: 'Community Iftar Night',
      category: 'Ramadan',
      date: this.daysFromNow(2),
      time: '6:30 PM',
      location: 'Community Hall, Barking',
    },
    {
      title: 'Weekly Tafsir Circle',
      category: 'Education',
      date: this.daysFromNow(3),
      time: '7:00 PM',
      location: 'Madrasa Learning Centre, Barking',
    },
    {
      title: 'Orphan Sponsorship Info Session',
      category: 'Orphans',
      date: this.daysFromNow(6),
      time: '4:00 PM',
      location: 'Trust Office, 97 Roycraft Avenue',
    },
  ];

  // ---------- Islamic resources teaser ----------

  resources: ResourceItem[] = [
    {
      title: 'The Holy Qur’an',
      description: 'Read, reflect and explore the words of the Qur’an.',
      category: 'Qur’an',
      icon: 'bi bi-book',
      externalUrl: '/islamic-resources',
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

  galleryImages: GalleryImage[] = [
    { url: '/z2.jpg', caption: "Da'wah Outreach", category: "Da'wah" },
    { url: '/images/gallery/img3.jpg', caption: "Da'wah London", category: "Da'wah" },
    { url: '/images/gallery/img4.png', caption: "Da'wah", category: 'Charity' },
    { url: '/y7.jpg', caption: 'Orphan Sponsorship Visit, Nigeria', category: 'Orphans' },
  ];

  quickLinks = [
    { label: 'Our Projects', path: '/projects' },
    { label: 'Madrasa', path: '/madarasa' },
    { label: 'Donate', path: '/donate' },
    { label: 'Zakat', path: '/zakat' },
    { label: 'Events', path: '/events' },
    { label: 'Resources', path: '/resources' },
    { label: 'About Us', path: '/about' },
  ];

  // Registered office per the Constitution and Trust Deed.
  contact = {
    address: '97 Roycraft Avenue, Barking, London, IG11 0NS, England',
    phone: '+44 20 0000 0000',
    email: 'info@alfiqhtrust.org.uk',
    mapsEmbedUrl: '' as string | SafeResourceUrl,
    social: [
      { label: 'Facebook', url: 'https://facebook.com' },
      { label: 'Instagram', url: 'https://instagram.com' },
      { label: 'WhatsApp', url: 'https://wa.me/' },
    ],
  };

  previousCampaign(): void {
    this.campaignSwiperInstance?.slidePrev();
  }

  nextCampaign(): void {
    this.campaignSwiperInstance?.slideNext();
  }
}
