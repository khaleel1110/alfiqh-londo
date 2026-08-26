import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ImpactStat {
  title: string;
  target: number;
  suffix: string;
  icon: string;
}

@Component({
  selector: 'app-our-impact',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './our-impact.component.html',
  styleUrl: './our-impact.component.scss',
})
export class OurImpactComponent implements AfterViewInit, OnDestroy {
  @ViewChild('impactSection')
  impactSectionRef!: ElementRef<HTMLElement>;

  impactStats: ImpactStat[] = [
    {
      title: 'Families Supported',
      target: 1250,
      suffix: '+',
      icon: 'bi-people',
    },

    {
      title: 'Meals Distributed',
      target: 5000,
      suffix: '+',
      icon: 'bi-basket2-heart',
    },

    {
      title: 'Orphans Supported',
      target: 320,
      suffix: '+',
      icon: 'bi-heart',
    },

    {
      title: 'People Reached Through Da’wah',
      target: 850,
      suffix: '+',
      icon: 'bi-megaphone',
    },

    {
      title: 'Community Projects',
      target: 25,
      suffix: '+',
      icon: 'bi-buildings',
    },

    {
      title: 'Active Programmes',
      target: 12,
      suffix: '',
      icon: 'bi-grid',
    },
  ];

  counterValues = signal<number[]>(this.impactStats.map(() => 0));

  private observer?: IntersectionObserver;

  private animated = false;

  ngAfterViewInit(): void {
    if (!this.impactSectionRef?.nativeElement || typeof IntersectionObserver === 'undefined') {
      this.animateCounters();

      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);

        if (visible && !this.animated) {
          this.animated = true;

          this.animateCounters();

          this.observer?.unobserve(this.impactSectionRef.nativeElement);
        }
      },

      {
        threshold: 0.25,
      },
    );

    this.observer.observe(this.impactSectionRef.nativeElement);
  }

  private animateCounters(): void {
    const duration = 2200;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out
      const eased = 1 - Math.pow(1 - progress, 3);

      this.counterValues.set(this.impactStats.map((stat) => Math.floor(stat.target * eased)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.counterValues.set(this.impactStats.map((stat) => stat.target));
      }
    };

    requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
