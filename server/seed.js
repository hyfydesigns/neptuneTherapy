require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');

const defaultContent = {
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
      'Neptune Therapy is a collaborative network of freelance Physical Therapists (PTs), Occupational Therapists (OTs), and Speech-Language Pathologists (SLPs) providing in-home therapy services across Texas. We are redefining what it means to deliver care—putting autonomy, compassion, and human connection at the heart of therapy.',
    values: [
      { title: 'Autonomy', description: 'You decide your schedule, your caseload, your flow.' },
      { title: 'Compassion', description: 'Patient-centered care that prioritizes quality one-on-one connection.' },
      { title: 'Community', description: 'A network of professionals who support and uplift each other.' },
      { title: 'Excellence', description: 'Commitment to the highest standards in healthcare delivery.' },
    ],
  },
  services: {
    heading: 'Our Services',
    subheading: 'Comprehensive Home Health Solutions',
    items: [
      {
        title: 'Home Health Care',
        description: 'Skilled nursing and therapy services delivered directly in the patient\'s home for optimal comfort and recovery.',
        icon: 'home',
      },
      {
        title: 'Physical Therapy',
        description: 'Tailored rehabilitation programs to restore mobility, strength, and function for patients recovering from injury or surgery.',
        icon: 'activity',
      },
      {
        title: 'Occupational Therapy',
        description: 'Helping patients regain independence in daily activities through adaptive strategies and therapeutic interventions.',
        icon: 'hand',
      },
      {
        title: 'Speech-Language Pathology',
        description: 'Assessment and treatment of communication, swallowing, and cognitive-linguistic disorders.',
        icon: 'mic',
      },
      {
        title: 'Telehealth & Remote Monitoring',
        description: 'Modern virtual care options that connect patients to therapists from the comfort of home.',
        icon: 'monitor',
      },
      {
        title: 'Electronic Health Records',
        description: 'Seamless, secure digital documentation to ensure continuity of care across all providers.',
        icon: 'file-text',
      },
    ],
  },
  employment: {
    heading: 'Join Our Team',
    subheading: 'Flexible. Independent. Rewarding.',
    description:
      'Neptune Therapy is looking for passionate Physical Therapists (PT), Occupational Therapists (OT), and Speech-Language Pathologists (SLP) to join our growing network of independent contractors in Texas.',
    compensation: [
      { role: 'PT / OT', rate: '$70–$90 per 60-minute visit' },
      { role: 'Speech Therapist (SLP)', rate: '$85–$100 per 60-minute visit' },
      { role: 'PTA / COTA', rate: '$50–$70 per 60-minute visit' },
    ],
    perks: [
      'Quarterly performance & loyalty bonuses',
      'Referral bonus per licensed hire',
      'Flexible schedule — you set your own hours',
      'Choose your own caseload and coverage area',
      'Be part of a supportive professional community',
    ],
    requirements: [
      'Valid Texas state license (PT, OT, or SLP)',
      'Current CPR certification',
      'Valid driver\'s license & auto insurance',
      'TB test or chest X-ray',
      'Diploma or transcript copy',
    ],
  },
  contact: {
    heading: 'Get in Touch',
    subheading: 'Ready to take the next step? We\'d love to hear from you.',
    phone: '(346) 630-0084',
    phone2: '(713) 393-7839',
    email: 'neptunehc.resources@yahoo.com',
    address: 'Houston, Texas',
  },
  footer: {
    copyright: '© 2024 Neptune Therapy. All Rights Reserved.',
    tagline: 'Caring for Life, Every Step of the Way',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Apply Now', href: '/apply' },
    ],
  },
};

const insertContent = db.prepare(
  'INSERT OR REPLACE INTO site_content (section, content, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
);

for (const [section, content] of Object.entries(defaultContent)) {
  insertContent.run(section, JSON.stringify(content));
}

const adminEmail = process.env.ADMIN_EMAIL || 'admin@neptunetherapy.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234!';
const hash = bcrypt.hashSync(adminPassword, 12);

db.prepare('INSERT OR IGNORE INTO admin_users (email, password_hash) VALUES (?, ?)').run(adminEmail, hash);

console.log('Database seeded successfully.');
console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
