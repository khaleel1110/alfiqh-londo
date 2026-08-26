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
  category: string;
  excerpt: string;
  image: string;
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

  orgName = 'Al-Fiqh London';
  orgTagline = 'Turning Islamic values into meaningful action';

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

  /*
  @ViewChild('heroSwiper') swiperRef!: ElementRef<HTMLElement>;
  private swiper?: Swiper;
  currentSlide = signal(0);

  slides: Slide[] = [
    { tag: 'Da\'wah & Community', image: '/h5.webp' },
    { tag: 'Islamic Education', image: '/hero1.webp' },
    { tag: 'Qur\'an Programmes', image: '/h1.webp' },
    { tag: 'Zakat', image: '/h2.webp' },
    { tag: 'Supporting Orphans', image: '/h4.webp' },
    { tag: 'Charity & Food Distribution', image: '/h3.webp' },
  ];
*/

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
      'https://www.google.com/maps?q=London&output=embed',
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

  /*  private animateCounters(): void {
    this.countersAnimated = true;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out so the count settles rather than stopping abruptly.
      const eased = 1 - Math.pow(1 - progress, 3);

      this.counterValues.set(this.impactStats.map((stat) => Math.round(stat.target * eased)));

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }*/

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
  impactStats: ImpactStat[] = [
    { title: 'Families Supported', target: 1250, suffix: '+', icon: 'ai-users' },
    { title: 'Meals Distributed', target: 5000, suffix: '+', icon: 'ai-bowl' },
    { title: 'Orphans Supported', target: 320, suffix: '+', icon: 'ai-heart' },
    { title: "Reached Through Da'wah", target: 850, suffix: '+', icon: 'ai-mic' },
    { title: 'Community Projects', target: 25, suffix: '+', icon: 'ai-briefcase' },
    { title: 'Active Programmes', target: 12, suffix: '', icon: 'ai-activity' },
  ];

  counterValues = signal<number[]>(this.impactStats.map(() => 0));
  private countersAnimated = false;
  private statsObserver?: IntersectionObserver;
  @ViewChild('statsSection') statsSectionRef!: ElementRef<HTMLElement>;

  // ---------- Featured projects ----------
  // TODO: ProjectService.getFeaturedProjects() once Firestore `projects`

  slides: Slide[] = [
    {
      tag: "Da'wah & Community",
      image: '/h5.webp',
    },
    {
      tag: 'Islamic Education',
      image: '/hero1.webp',
    },
    {
      tag: "Qur'an Programmes",
      image: '/q3.webp',
    },
    {
      tag: 'Zakat',
      image: '/h2.webp',
    },
    {
      tag: 'Supporting Orphans',
      image: '/h4.webp',
    },
    {
      tag: 'Charity & Food Distribution',
      image: '/h3.webp',
    },
  ];
  // collection is live.
  featuredProjects: Project[] = [
    {
      title: 'Ramadan Food Distribution',
      slug: 'ramadan-food-distribution',
      category: 'Charity',
      shortDescription: 'Providing essential food packages to families during Ramadan.',
      image: '/h3.webp',
      status: 'Active',
      fundraisingEnabled: true,
      target: 10000,
      raised: 7450,
      supporters: 214,
    },
    {
      title: 'Orphan Education Sponsorship',
      slug: 'orphan-education-sponsorship',
      category: 'Orphans',
      shortDescription: 'Funding school fees, books and uniforms for sponsored orphans.',
      image: '/z10.jpg',
      status: 'Ongoing',
      fundraisingEnabled: true,
      target: 15000,
      raised: 9200,
      supporters: 168,
    },
    {
      title: "Qur'an Memorisation Programme",
      slug: 'quran-memorisation-programme',
      category: 'Education',
      shortDescription: "Weekly Qur'an classes for children and adults across London.",
      image: '/y5.jpg',
      status: 'Active',
      fundraisingEnabled: false,
      impactLabel: '180 / 250 Students Enrolled',
    },
  ];

  // ---------- What We Do ----------
  workAreas: WorkArea[] = [
    {
      title: "Da'wah",
      slug: 'dawah',
      description: 'Sharing Islamic knowledge and encouraging positive engagement.',
      icon: 'ai-mic',
    },
    {
      title: 'Zakat',
      slug: 'zakat',
      description: 'Facilitating responsible, transparent Zakat distribution.',
      icon: 'ai-percent',
    },
    {
      title: 'Charity',
      slug: 'charity',
      description: 'Supporting people facing hardship with food and emergency aid.',
      icon: 'ai-hand-heart',
    },
    {
      title: 'Education',
      slug: 'education',
      description: "Qur'an classes, Islamic studies and youth programmes.",
      icon: 'ai-book',
    },
    {
      title: 'Orphans',
      slug: 'orphans',
      description: 'Sponsorship, education and welfare for vulnerable children.',
      icon: 'ai-users',
    },
    {
      title: 'Community',
      slug: 'community',
      description: 'Building a stronger, more connected Muslim community.',
      icon: 'ai-globe',
    },
  ];

  campaigns: Project[] = [
    {
      title: 'Ramadan Food Distribution',
      slug: 'ramadan-food-distribution',
      category: 'Charity',
      shortDescription:
        'Providing essential food packages to families facing hardship and ensuring that no family is left without food during Ramadan.',
      image: '/is2.jpg',
      status: 'Active',
      fundraisingEnabled: true,
      target: 10000,
      raised: 7450,
      supporters: 214,
    },

    {
      title: 'Orphan Education Sponsorship',
      slug: 'orphan-education-sponsorship',
      category: 'Orphans',
      shortDescription:
        'Supporting vulnerable children with education, school materials and long-term care so they can build a brighter future.',
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
      category: 'Islamic Education',
      shortDescription:
        "Creating opportunities for children and adults to memorise the Qur'an while developing a deeper connection with Islamic knowledge.",
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
        'Supporting programmes that share authentic Islamic knowledge, engage communities and promote understanding of Islam.',
      image: '/z4.jpg',
      status: 'Active',
      fundraisingEnabled: false,
      impactLabel: '850+ People Reached',
    },

    {
      title: 'Zakat Distribution',
      slug: 'zakat-distribution',
      category: 'Zakat',
      shortDescription:
        'Helping eligible families and individuals receive Zakat support with dignity, transparency and responsibility.',
      image: '/z6.webp',
      status: 'Ongoing',
      fundraisingEnabled: true,
      target: 20000,
      raised: 13750,
      supporters: 302,
    },

    {
      title: 'Community Food Support',
      slug: 'community-food-support',
      category: 'Community',
      shortDescription:
        'Providing food and essential support to families, individuals and communities experiencing financial hardship.',
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
      location: 'Community Hall',
    },
    {
      title: 'Weekly Tafsir Circle',
      category: 'Education',
      date: this.daysFromNow(3),
      time: '7:00 PM',
      location: 'Learning Centre',
    },
    {
      title: 'New Muslim Support Session',
      category: "Da'wah",
      date: this.daysFromNow(6),
      time: '4:00 PM',
      location: 'Outreach Office',
    },
  ];

  // ---------- Islamic resources teaser ----------
  resources: ResourceItem[] = [
    {
      title: 'The Etiquette of Giving Sadaqah',
      category: 'Fiqh',
      excerpt: 'A short guide on the manners and intentions behind voluntary charity.',
      image: '/h2.webp',
    },
    {
      title: 'Understanding Zakat Eligibility',
      category: 'Fiqh',
      excerpt: 'Who qualifies to receive Zakat, explained simply and responsibly.',
      image: '/z6.webp',
    },
    {
      title: "Da'wah With Wisdom",
      category: "Da'wah",
      excerpt: 'Reflections on the Prophetic approach to sharing Islam with others.',
      image: '/img4.png',
    },
  ];

  galleryImages: GalleryImage[] = [
    { url: '/h5.webp', caption: 'Community Outreach', category: "Da'wah" },
    { url: '/z6.webp', caption: 'Zakat Distribution Day', category: 'Zakat' },
    { url: '/h3.webp', caption: 'Ramadan Food Packing', category: 'Charity' },
    { url: '/y7.jpg', caption: 'Orphan Sponsorship Visit', category: 'Orphans' },
  ];

  quickLinks = [
    { label: 'Our Projects', path: '/projects' },
    { label: 'Donate', path: '/donate' },
    { label: 'Zakat', path: '/zakat' },
    { label: 'Events', path: '/events' },
    { label: 'Resources', path: '/resources' },
    { label: 'About Us', path: '/about' },
  ];

  contact = {
    address: '123 Example Road, London, E1 6AN',
    phone: '+44 20 0000 0000',
    email: 'info@alfiqhlondon.org.uk',
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
