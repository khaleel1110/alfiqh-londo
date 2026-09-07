import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Home } from '../home/home';

interface WorkArea {
  title: string;
  description: string;
  icon: string;
  link: string;
  queryParams?: Record<string, string>;
}

interface CoreValue {
  title: string;
  description: string;
  icon: string;
}

interface ImpactHighlight {
  value: string;
  label: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, Home],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutPage {
  orgName = 'Al-Fiqh Nigerian Islamic Trust';

  // Drawn directly from the Preamble and Clause 3 (Charitable Objects)
  // of the Constitution and Trust Deed.
  missionStatement =
    'To promote authentic Islamic knowledge, relieve poverty and hardship, and turn Islamic values — charity, compassion and service — into projects with real, measurable impact across the UK and Nigeria.';

  visionStatement =
    'A community where Islamic knowledge and compassionate action work hand in hand — turning belief into visible, lasting good for families, orphans and communities in London and beyond.';

  // "Our Work" — per the Trust's Objects (Clause 3) and Educational
  // Programmes (Clause 17). Distinct from the homepage's "What We Do"
  // grid, this leads with Knowledge and links it to the Madrasa page.
  workAreas: WorkArea[] = [
    {
      title: 'Knowledge & Madrasa',
      description: "Qur'an, Tajweed, Arabic and Islamic studies, made accessible to everyone.",
      icon: 'ai-book',
      link: '/madarasa',
    },
    {
      title: "Da'wah",
      description: 'Sharing Islamic knowledge and encouraging positive engagement.',
      icon: 'ai-mic',
      link: '/projects',
      queryParams: { category: 'dawah' },
    },
    {
      title: 'Charity & Poverty Relief',
      description: 'Supporting people facing hardship with food and emergency aid.',
      icon: 'ai-hand-heart',
      link: '/projects',
      queryParams: { category: 'charity' },
    },
    {
      title: 'Zakāt & Sadaqah',
      description: 'Facilitating responsible, transparent Zakāt and Sadaqah distribution.',
      icon: 'ai-percent',
      link: '/projects',
      queryParams: { category: 'zakat' },
    },
    {
      title: 'Orphans',
      description: 'Supporting vulnerable children with sponsorship and welfare, in the UK and Nigeria.',
      icon: 'ai-users',
      link: '/projects',
      queryParams: { category: 'orphans' },
    },
    {
      title: 'Humanitarian Relief',
      description: 'Disaster relief, refugee support and emergency assistance where it is needed most.',
      icon: 'ai-globe',
      link: '/projects',
      queryParams: { category: 'relief' },
    },
  ];

  // "How We Work" — reflects the trustees' duties and governance
  // commitments under Clauses 3.2, 9, 14 and 19.2 of the Deed.
  approach = [
    {
      title: 'Community-Led',
      description:
        'Projects are shaped by the people they serve, not designed in isolation from them.',
    },
    {
      title: 'Transparent',
      description:
        'Every project shows its target, what\u2019s been raised, and where funds go — restricted funds, including Zakāt, are separately accounted for.',
    },
    {
      title: 'Sustainable',
      description:
        'We favour lasting change — education and sponsorship over one-off handouts wherever possible.',
    },
    {
      title: 'Rooted in Knowledge',
      description:
        'Every initiative is grounded in authentic Islamic teaching and guided by qualified scholarship.',
    },
  ];

  coreValues: CoreValue[] = [
    {
      title: 'Knowledge',
      description: 'Seeking and sharing authentic Islamic understanding.',
      icon: 'ai-book',
    },
    {
      title: 'Sincerity',
      description: 'Acting for the sake of Allah, before recognition or reward.',
      icon: 'ai-heart',
    },
    {
      title: 'Compassion',
      description: 'Meeting people\u2019s hardship with mercy, not judgement.',
      icon: 'ai-hand-heart',
    },
    {
      title: 'Service',
      description: 'Putting the needs of the community before our own convenience.',
      icon: 'ai-users',
    },
    {
      title: 'Integrity',
      description: 'Doing what\u2019s right even when no one is watching.',
      icon: 'ai-shield',
    },
    {
      title: 'Community',
      description: 'Stronger together — no project succeeds alone, in London or Nigeria.',
      icon: 'ai-globe',
    },
    {
      title: 'Excellence',
      description: 'Doing every project as if it were an act of worship — because it is.',
      icon: 'ai-star',
    },
  ];

  // Mirrors the homepage impact statistics for consistency across pages.
  impactHighlights: ImpactHighlight[] = [
    { value: '1,250+', label: 'Families Supported' },
    { value: '320+', label: 'Orphans Supported' },
    { value: '450+', label: "Madrasa & Qur'an Students" },
    { value: '85+', label: 'Scholarships & Bursaries Awarded' },
  ];
}
