import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Programme {
  title: string;
  ageGroup: string;
  description: string;
  icon: string;
}

interface Level {
  stage: string;
  title: string;
  description: string;
}

interface EnrolStep {
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface TimetableRow {
  day: string;
  time: string;
  classLabel: string;
}

@Component({
  selector: 'app-madarasa',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './madarasa.html',
  styleUrl: './madarasa.scss',
})
export class MadarasaPage {
  orgName = 'Al-Fiqh London';

  // ---------- Intro ----------
  introParagraphs = [
    "Our Madrasa — also known as our Islamiyyah — is where Qur'an, Arabic and Islamic studies are taught to children and adults alike, in a structured, nurturing environment rooted in authentic knowledge.",
    'Classes run alongside our other educational programmes and are delivered by qualified teachers, with every member of staff safeguarding-trained and DBS-checked before working with children.',
  ];

  // ---------- What We Teach ----------
  programmes: Programme[] = [
    {
      title: "Qur'an Memorisation & Tajweed",
      ageGroup: 'Ages 5+',
      description: "Structured Hifz and Tajweed classes helping students read, recite and memorise the Qur'an correctly.",
      icon: 'ai-book',
    },
    {
      title: 'Arabic Language',
      ageGroup: 'All ages',
      description: 'Reading, writing and conversational Arabic taught in stages, from first letters to fluent comprehension.',
      icon: 'ai-mic',
    },
    {
      title: 'Islamic Studies',
      ageGroup: 'Ages 5+',
      description: "Aqeedah, fiqh, seerah and akhlaq taught in an age-appropriate way to build a well-rounded understanding of the deen.",
      icon: 'ai-heart',
    },
    {
      title: 'Weekend Islamic School',
      ageGroup: 'Ages 5–16',
      description: 'Our core Saturday and Sunday programme, combining Qur\u2019an, Arabic and Islamic studies in one weekly timetable.',
      icon: 'ai-globe',
    },
    {
      title: 'Youth Development & Mentoring',
      ageGroup: 'Ages 11–18',
      description: 'Mentoring, workshops and leadership sessions that support young people navigating faith and daily life.',
      icon: 'ai-users',
    },
    {
      title: 'Adult Learning Circles',
      ageGroup: 'Adults',
      description: 'Evening and weekend circles for adults returning to Arabic, Tajweed or Islamic studies at their own pace.',
      icon: 'ai-briefcase',
    },
  ];

  // ---------- Class Levels ----------
  levels: Level[] = [
    {
      stage: 'Foundation',
      title: 'Noorani Qaida & Letter Recognition',
      description: 'Arabic letters, basic Tajweed rules and foundational reading skills for our youngest students.',
    },
    {
      stage: 'Intermediate',
      title: "Qur'an Reading & Tajweed Application",
      description: "Fluent Qur'an reading with applied Tajweed, alongside core Islamic studies and Arabic grammar.",
    },
    {
      stage: 'Advanced',
      title: 'Hifz & Advanced Islamic Studies',
      description: "Qur'an memorisation, advanced Arabic and deeper study of fiqh and seerah for committed students.",
    },
  ];

  // ---------- Weekly Timetable ----------
  timetable: TimetableRow[] = [
    { day: 'Saturday', time: '10:00 AM – 1:00 PM', classLabel: "Qur'an, Tajweed & Arabic (Ages 5–16)" },
    { day: 'Sunday', time: '10:00 AM – 1:00 PM', classLabel: 'Islamic Studies & Seerah (Ages 5–16)' },
    { day: 'Sunday', time: '5:00 PM – 6:30 PM', classLabel: 'Youth Mentoring Circle (Ages 11–18)' },
    { day: 'Wednesday', time: '7:00 PM – 8:30 PM', classLabel: 'Adult Learning Circle' },
  ];

  // ---------- Safeguarding / Quality ----------
  safeguardingPoints = [
    'All teachers are suitably qualified and experienced in Islamic education.',
    'Every member of staff and volunteer undergoes an enhanced DBS check before working with children.',
    'Regular safeguarding training is refreshed at least every two years.',
    'A designated safeguarding lead oversees all child protection matters across the Madrasa.',
  ];

  // ---------- Enrolment ----------
  enrolSteps: EnrolStep[] = [
    {
      title: 'Register Your Interest',
      description: 'Fill in a short enrolment form with your details and your child\u2019s age and current level.',
    },
    {
      title: 'Placement Assessment',
      description: 'We arrange a brief, informal assessment so we can place your child in the right class and level.',
    },
    {
      title: 'Start Classes',
      description: 'Once placed, your child joins their weekly timetable and receives regular progress updates.',
    },
  ];

  // ---------- FAQ ----------
  faqs: FaqItem[] = [
    {
      question: 'What ages does the Madrasa accept?',
      answer: 'Our weekend Islamic school welcomes children from age 5, with dedicated youth and adult programmes for older students.',
    },
    {
      question: 'Do you offer weekday classes?',
      answer: 'Our core timetable runs on weekends, with an additional weekday evening circle for adult learners.',
    },
    {
      question: 'Is there a fee for classes?',
      answer: 'We keep our Madrasa accessible to all families; please get in touch for current fee and bursary information.',
    },
    {
      question: 'How do I know my child is safe?',
      answer: 'All staff and volunteers are DBS-checked and safeguarding-trained, and a designated safeguarding lead oversees the programme.',
    },
  ];
}
