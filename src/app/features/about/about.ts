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
  orgName = 'Al-Fiqh London';

  missionStatement =
    'To promote authentic Islamic knowledge, strengthen communities and transform Islamic values into meaningful projects that benefit people.';

  visionStatement =
    'A community where Islamic knowledge and compassionate action work hand in hand — turning belief into visible, lasting good for people in London and beyond.';

  // "Our Work" — per brief section 24, distinct from the homepage's
  // "What We Do" grid (which uses the project category set). This one
  // leads with Knowledge rather than Education, and links Knowledge to
  // the Resources page rather than a project category.
  workAreas: WorkArea[] = [
    {
      title: 'Knowledge',
      description: 'Islamic education and learning, made accessible to everyone.',
      icon: 'ai-book',
      link: '/resources',
    },
    {
      title: "Da'wah",
      description: 'Sharing Islamic knowledge and encouraging positive engagement.',
      icon: 'ai-mic',
      link: '/projects',
      queryParams: { category: 'dawah' },
    },
    {
      title: 'Charity',
      description: 'Supporting people facing hardship with food and emergency aid.',
      icon: 'ai-hand-heart',
      link: '/projects',
      queryParams: { category: 'charity' },
    },
    {
      title: 'Zakat',
      description: 'Facilitating responsible, transparent Zakat distribution.',
      icon: 'ai-percent',
      link: '/projects',
      queryParams: { category: 'zakat' },
    },
    {
      title: 'Orphans',
      description: 'Supporting vulnerable children with sponsorship and welfare.',
      icon: 'ai-users',
      link: '/projects',
      queryParams: { category: 'orphans' },
    },
    {
      title: 'Community',
      description: 'Building a stronger, more connected Muslim community.',
      icon: 'ai-globe',
      link: '/projects',
      queryParams: { category: 'community' },
    },
  ];

  approach = [
    {
      title: 'Community-Led',
      description:
        'Projects are shaped by the people they serve, not designed in isolation from them.',
    },
    {
      title: 'Transparent',
      description:
        'Every project shows its target, what\u2019s been raised, and where funds go — see our Transparency page.',
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
      description: 'Stronger together — no project succeeds alone.',
      icon: 'ai-globe',
    },
    {
      title: 'Excellence',
      description: 'Doing every project as if it were an act of worship — because it is.',
      icon: 'ai-star',
    },
  ];

  impactHighlights: ImpactHighlight[] = [
    { value: '1,250+', label: 'Families Supported' },
    { value: '320+', label: 'Orphans Supported' },
    { value: '25+', label: 'Community Projects' },
    { value: '850+', label: "Reached Through Da'wah" },
  ];
}
