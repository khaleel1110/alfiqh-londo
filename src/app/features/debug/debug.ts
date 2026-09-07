import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';

interface MadrasaProgramme {
  number: string;
  title: string;
  audience: string;
  description: string;
  icon: string;
  topics: string[];
}

interface MadrasaSubject {
  title: string;
  description: string;
  icon: string;
}

interface LearningStep {
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-debug',
  imports: [NgForOf, RouterLink],
  templateUrl: './debug.html',
  styleUrl: './debug.scss',
})
export class Debug {
  orgName = 'Al-Fiqh Nigerian Islamic Trust';

  programmes: MadrasaProgramme[] = [
    {
      number: '01',
      title: 'Qur’an & Tajweed',
      audience: 'Children & Adults',
      icon: 'ai-book',
      description:
        'Structured Qur’an learning focused on reading, recitation, Tajweed and memorisation.',
      topics: ['Qur’an Reading', 'Tajweed', 'Memorisation'],
    },

    {
      number: '02',
      title: 'Islamic Studies',
      audience: 'Children & Young People',
      icon: 'ai-star',
      description:
        'A broad introduction to Islamic beliefs, worship, manners, history and everyday Muslim life.',
      topics: ['Aqeedah', 'Fiqh', 'Seerah'],
    },

    {
      number: '03',
      title: 'Arabic Language',
      audience: 'All Levels',
      icon: 'ai-book',
      description:
        'Arabic language instruction supporting students in understanding Islamic texts and developing useful language skills.',
      topics: ['Reading', 'Vocabulary', 'Language'],
    },

    {
      number: '04',
      title: 'Weekend Islamiyya',
      audience: 'Children & Young People',
      icon: 'ai-users',
      description:
        'Structured weekend Islamic school activities providing children and young people with consistent Islamic learning.',
      topics: ['Islamic Education', 'Character', 'Community'],
    },

    {
      number: '05',
      title: 'Youth Development',
      audience: 'Young People',
      icon: 'ai-users',
      description:
        'Educational and mentoring activities helping young people develop confidence, skills and leadership qualities.',
      topics: ['Mentoring', 'Skills', 'Leadership'],
    },

    {
      number: '06',
      title: 'Online Learning',
      audience: 'Flexible Learning',
      icon: 'ai-globe',
      description:
        'Distance and online learning opportunities allowing students to continue their Islamic education beyond physical classes.',
      topics: ['Online Classes', 'Distance Learning', 'Resources'],
    },
  ];

  subjects: MadrasaSubject[] = [
    {
      title: 'Qur’an',
      description: 'Developing confident Qur’an reading, recitation and memorisation.',
      icon: 'ai-book',
    },
    {
      title: 'Tajweed',
      description:
        'Learning the principles required for accurate and beautiful Qur’anic recitation.',
      icon: 'ai-star',
    },
    {
      title: 'Islamic Studies',
      description: 'Exploring Islamic beliefs, worship, manners, history and practical guidance.',
      icon: 'ai-moon',
    },
    {
      title: 'Arabic',
      description: 'Building Arabic language skills to support Islamic learning and understanding.',
      icon: 'ai-book',
    },
    {
      title: 'Seerah',
      description: 'Learning from the life and example of the Prophet Muhammad ﷺ.',
      icon: 'ai-heart',
    },
    {
      title: 'Character & Adab',
      description: 'Encouraging good manners, responsibility, sincerity and respectful conduct.',
      icon: 'ai-users',
    },
  ];

  learningJourney: LearningStep[] = [
    {
      title: 'Learn',
      description: 'Build a strong foundation in Qur’an, Islamic knowledge and Arabic.',
    },
    {
      title: 'Understand',
      description: 'Go beyond memorisation by developing understanding of what is being learned.',
    },
    {
      title: 'Practise',
      description: 'Connect Islamic knowledge with worship, manners and everyday life.',
    },
    {
      title: 'Grow',
      description:
        'Develop confidence, good character and a sense of responsibility towards the community.',
    },
  ];

  youthPoints: string[] = [
    'Positive Islamic identity and confidence',
    'Good character, manners and responsibility',
    'Mentoring and personal development',
    'Leadership and practical skills',
    'A stronger connection with the Muslim community',
  ];

  faqs: FaqItem[] = [
    {
      question: 'What is Al-Fiqh Madrasa?',
      answer:
        'Al-Fiqh Madrasa is an Islamic education programme providing structured learning in Qur’an, Tajweed, Arabic and broader Islamic studies for children, young people and adults.',
      open: false,
    },
    {
      question: 'Who can attend the Madrasa?',
      answer:
        'The educational programmes are intended to serve different age groups, including children, young people and adults. Specific age groups and class availability may vary by programme.',
      open: false,
    },
    {
      question: 'What subjects are taught?',
      answer:
        'The programme may include Qur’an memorisation and Tajweed, Islamic studies, Arabic language, weekend Islamic school activities and youth development programmes.',
      open: false,
    },
    {
      question: 'Are Qur’an memorisation classes available?',
      answer:
        'Qur’an memorisation and Tajweed classes are specifically included among the Trust’s educational programmes.',
      open: false,
    },
    {
      question: 'Are there weekend Islamic school classes?',
      answer:
        'Yes. Weekend Islamic school activities for children and young people are included within the Trust’s educational programme framework.',
      open: false,
    },
    {
      question: 'Who teaches the Madrasa programmes?',
      answer:
        'The Trust’s educational programmes are intended to be delivered by suitably qualified teachers or scholars.',
      open: false,
    },
    {
      question: 'How does Al-Fiqh approach safeguarding?',
      answer:
        'Programmes involving children are intended to follow appropriate safeguarding arrangements, including suitable checks and safeguarding training for people involved in delivering children’s education.',
      open: false,
    },
  ];

  toggleFaq(faq: FaqItem): void {
    faq.open = !faq.open;
  }
}
