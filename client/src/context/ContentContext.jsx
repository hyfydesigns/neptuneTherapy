import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const ContentContext = createContext(null);

const DEFAULT_CONTENT = {
  hero: {
    tagline: 'A Determination to make A Difference in Health Care Delivery',
    subtitle: 'Home Health Agency Staffing Services across Texas',
    ctaText: 'Apply Now',
    ctaLink: '/apply',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/about',
  },
  about: {
    mission: 'Caring for Life, Every Step of the Way',
    missionDetail:
      'Neptune Therapy is a collaborative network of freelance Physical Therapists (PTs), Occupational Therapists (OTs), and Speech-Language Pathologists (SLPs) providing in-home therapy services across Texas. We are redefining what it means to deliver care — putting autonomy, compassion, and human connection at the heart of therapy.',
    values: [
      { title: 'Autonomy',    description: 'You decide your schedule, your caseload, your flow.' },
      { title: 'Compassion',  description: 'Patient-centered care that prioritizes quality one-on-one connection.' },
      { title: 'Community',   description: 'A network of professionals who support and uplift each other.' },
      { title: 'Excellence',  description: 'Commitment to the highest standards in healthcare delivery.' },
    ],
  },
  services: {
    heading: 'Our Services',
    subheading: 'Comprehensive Home Health Solutions',
    items: [
      { title: 'Home Health Care',            icon: 'home',      description: 'Skilled nursing and therapy services delivered directly in the patient\'s home for optimal comfort and recovery.' },
      { title: 'Physical Therapy',            icon: 'activity',  description: 'Tailored rehabilitation programs to restore mobility, strength, and function for patients recovering from injury or surgery.' },
      { title: 'Occupational Therapy',        icon: 'hand',      description: 'Helping patients regain independence in daily activities through adaptive strategies and therapeutic interventions.' },
      { title: 'Speech-Language Pathology',   icon: 'mic',       description: 'Assessment and treatment of communication, swallowing, and cognitive-linguistic disorders.' },
      { title: 'Telehealth & Remote Monitoring', icon: 'monitor', description: 'Modern virtual care options that connect patients to therapists from the comfort of home.' },
      { title: 'Electronic Health Records',   icon: 'file-text', description: 'Seamless, secure digital documentation to ensure continuity of care across all providers.' },
    ],
  },
  employment: {
    heading: 'Join Our Team',
    subheading: 'Flexible. Independent. Rewarding.',
    description: 'We partner with licensed therapists across Texas who want to make a real difference in patients\' lives — on their own schedule, as independent contractors.',
    compensation: [
      { role: 'Physical Therapist (PT)',           rate: 'Competitive per-visit rate' },
      { role: 'Occupational Therapist (OT)',        rate: 'Competitive per-visit rate' },
      { role: 'Speech-Language Pathologist (SLP)',  rate: 'Competitive per-visit rate' },
    ],
    perks: [
      'Flexible scheduling — work when you want',
      'Independent contractor status',
      'Statewide coverage across Texas',
      'Supportive administrative team',
      'Fast credentialing process',
    ],
    requirements: [
      'Active Texas state license (PT, OT, or SLP)',
      'Minimum 1 year of clinical experience',
      'Reliable transportation for home visits',
      'Strong communication and documentation skills',
      'Passion for patient-centered care',
    ],
  },
  contact: {
    phone: '(346) 630-0084',
    email: 'neptunehc.resources@yahoo.com',
    address: 'Houston, TX',
  },
};

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/content')
      .then(r => {
        const flat = {};
        for (const [key, val] of Object.entries(r.data)) flat[key] = val.data;
        setContent(flat);
      })
      .catch(() => {
        // API unreachable — keep DEFAULT_CONTENT so the site still renders
        console.warn('Content API unavailable, using defaults.');
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (section, data) => {
    setContent(prev => ({ ...prev, [section]: data }));
  };

  return (
    <ContentContext.Provider value={{ content, loading, updateSection }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);
