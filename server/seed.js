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

  // ── Service Detail Pages ────────────────────────────────────────────────────
  services_detail: {
    'home-health-care': {
      tagline: 'Professional care delivered where you feel most comfortable — home.',
      overview: 'Home health care brings skilled medical and therapeutic services directly to the patient\'s residence, allowing individuals to recover, rehabilitate, and maintain their health in the familiar comfort of their own home. Neptune Therapy coordinates licensed Physical Therapists, Occupational Therapists, and Speech-Language Pathologists who work alongside physicians to create and execute individualized plans of care.',
      benefits: [
        'Recover faster in a comfortable, familiar environment',
        'Reduce hospital readmissions and ER visits',
        'Personalized one-on-one attention every visit',
        'Flexible scheduling around your daily routine',
        'Family members included in education and care planning',
        'Coordinated communication with your primary physician',
      ],
      process: [
        { step: 'Physician Referral', detail: 'Your doctor or specialist issues a referral for home health therapy services.' },
        { step: 'Initial Assessment', detail: 'A licensed therapist visits your home to evaluate your condition, environment, and goals.' },
        { step: 'Plan of Care', detail: 'A personalized treatment plan is created and coordinated with your medical team.' },
        { step: 'Regular Visits', detail: 'Your therapist visits on a scheduled basis, tracking progress and adjusting the plan as needed.' },
        { step: 'Discharge Planning', detail: 'When goals are met, your therapist prepares you and your family for continued independence.' },
      ],
      conditions: [
        'Post-surgical recovery (joint replacement, cardiac, orthopedic)',
        'Stroke and neurological rehabilitation',
        'Chronic disease management (COPD, diabetes, heart failure)',
        'Fall prevention and balance disorders',
        'Wound care and pain management',
        'Dementia and cognitive decline support',
      ],
    },
    'physical-therapy': {
      tagline: 'Restoring strength, mobility, and independence — one visit at a time.',
      overview: 'Physical Therapy (PT) focuses on restoring and improving movement, reducing pain, and rebuilding strength after injury, surgery, or illness. Our licensed Physical Therapists provide comprehensive in-home evaluations and hands-on treatment, allowing patients to achieve their rehabilitation goals without the burden of traveling to a clinic.',
      benefits: [
        'Personalized exercise programs designed for your space and equipment',
        'Manual therapy techniques including joint mobilization and soft tissue work',
        'Gait training and fall prevention strategies in your actual home environment',
        'Education on posture, body mechanics, and injury prevention',
        'Pain management through therapeutic modalities',
        'Gradual return to daily activities and hobbies',
      ],
      process: [
        { step: 'Evaluation', detail: 'A thorough assessment of strength, flexibility, balance, pain levels, and functional mobility.' },
        { step: 'Goal Setting', detail: 'Collaborate with the patient and family to define short-term and long-term recovery goals.' },
        { step: 'Treatment', detail: 'Hands-on therapy, therapeutic exercises, and functional training during each visit.' },
        { step: 'Home Program', detail: 'A written home exercise program keeps patients progressing between visits.' },
        { step: 'Progress Review', detail: 'Regular re-evaluations to measure improvement and update the plan of care.' },
      ],
      conditions: [
        'Post-operative rehabilitation (hip/knee replacement, rotator cuff, spine)',
        'Stroke and traumatic brain injury recovery',
        'Parkinson\'s disease and multiple sclerosis',
        'Chronic pain and arthritis',
        'Balance disorders and vestibular dysfunction',
        'Sports and orthopedic injuries',
      ],
    },
    'occupational-therapy': {
      tagline: 'Helping you live independently and meaningfully every day.',
      overview: 'Occupational Therapy (OT) helps individuals of all ages perform the everyday activities that matter most to them. From getting dressed in the morning to cooking a meal or returning to work, our licensed Occupational Therapists evaluate barriers and create strategies that restore independence. In-home OT is especially powerful because therapists can assess the actual environment and adapt it for maximum safety and function.',
      benefits: [
        'Home safety evaluations and adaptive equipment recommendations',
        'Retraining in activities of daily living (bathing, dressing, grooming, cooking)',
        'Cognitive rehabilitation for memory, attention, and executive function',
        'Upper extremity rehabilitation for hand, wrist, and shoulder conditions',
        'Energy conservation techniques for patients with chronic illness',
        'Caregiver training to safely assist loved ones',
      ],
      process: [
        { step: 'Occupational Profile', detail: 'Understand what daily activities matter most to the patient and what barriers exist.' },
        { step: 'Functional Assessment', detail: 'Evaluate physical, cognitive, and sensory abilities in the home environment.' },
        { step: 'Intervention', detail: 'Targeted therapy sessions using adaptive strategies, exercises, and environmental modifications.' },
        { step: 'Equipment & Modifications', detail: 'Recommend and train on assistive devices such as grab bars, reachers, and adaptive utensils.' },
        { step: 'Outcomes Review', detail: 'Measure progress against daily living goals and adjust the plan accordingly.' },
      ],
      conditions: [
        'Stroke and brain injury rehabilitation',
        'Arthritis and joint replacement recovery',
        'Neurological conditions (Parkinson\'s, MS, ALS)',
        'Cognitive decline and dementia',
        'Hand and upper extremity injuries',
        'Developmental and pediatric conditions',
      ],
    },
    'speech-language-pathology': {
      tagline: 'Reconnecting people with their voice, words, and ability to swallow safely.',
      overview: 'Speech-Language Pathology (SLP) addresses a wide range of communication and swallowing disorders. Neptune Therapy\'s licensed Speech-Language Pathologists conduct in-depth evaluations and provide evidence-based treatment for conditions that affect speech, language, cognition, voice, and swallowing — all in the patient\'s home where therapy is most natural and effective.',
      benefits: [
        'Therapy in a natural, low-stress home environment',
        'Family coaching and caregiver communication strategies',
        'Augmentative and alternative communication (AAC) support',
        'Dysphagia (swallowing) evaluation and safe-swallowing strategies',
        'Cognitive-communication rehabilitation for memory and attention',
        'Voice therapy and vocal hygiene education',
      ],
      process: [
        { step: 'Comprehensive Evaluation', detail: 'Detailed assessment of speech, language, voice, cognitive-communication, and/or swallowing function.' },
        { step: 'Diagnosis & Goals', detail: 'Identify deficits, establish baseline, and set meaningful functional communication goals.' },
        { step: 'Individualized Therapy', detail: 'Evidence-based treatment sessions targeting the patient\'s specific needs and goals.' },
        { step: 'Family Education', detail: 'Train family members and caregivers on techniques to support progress between visits.' },
        { step: 'Re-evaluation & Discharge', detail: 'Ongoing progress monitoring and transition to maintenance or home program.' },
      ],
      conditions: [
        'Aphasia (language loss after stroke or brain injury)',
        'Dysarthria and apraxia of speech',
        'Dysphagia (swallowing difficulties)',
        'Cognitive-communication disorders (TBI, dementia)',
        'Voice disorders (dysphonia, vocal nodules)',
        'Stuttering and fluency disorders',
      ],
    },
    'telehealth': {
      tagline: 'World-class therapy — no travel required.',
      overview: 'Telehealth expands access to expert therapy care for patients who face barriers to in-person visits — whether due to distance, mobility limitations, or scheduling constraints. Neptune Therapy\'s licensed therapists conduct secure video sessions for evaluation, treatment, and follow-up, while remote monitoring tools allow clinicians to track patient progress between visits.',
      benefits: [
        'Eliminate travel time and transportation barriers',
        'Access specialized therapists regardless of your location in Texas',
        'Convenient scheduling including evenings and weekends',
        'Secure, HIPAA-compliant video platform',
        'Real-time coaching and exercise guidance via video',
        'Ideal for follow-up, education, and monitoring sessions',
      ],
      process: [
        { step: 'Technology Setup', detail: 'Simple onboarding — all you need is a smartphone, tablet, or computer with a camera.' },
        { step: 'Virtual Evaluation', detail: 'Therapist conducts a thorough assessment via secure video call.' },
        { step: 'Remote Session', detail: 'Live therapy session with real-time demonstration, feedback, and instruction.' },
        { step: 'Digital Home Program', detail: 'Exercises and resources shared digitally for easy access between sessions.' },
        { step: 'Remote Check-ins', detail: 'Short video follow-ups to monitor progress, adjust programs, and answer questions.' },
      ],
      conditions: [
        'Post-acute care follow-up and maintenance',
        'Chronic disease management and education',
        'Home exercise program supervision',
        'Communication and cognitive therapy',
        'Patients in rural or underserved Texas communities',
        'Individuals with transportation or mobility challenges',
      ],
    },
    'electronic-health-records': {
      tagline: 'Seamless, secure documentation that keeps your entire care team in sync.',
      overview: 'Accurate and timely clinical documentation is the backbone of safe, coordinated healthcare. Neptune Therapy leverages modern Electronic Health Record (EHR) systems to ensure every visit note, assessment, progress report, and care plan is documented digitally, shared securely with authorised providers, and accessible when it matters most.',
      benefits: [
        'Real-time documentation completed at or shortly after each visit',
        'Secure sharing of records with physicians, specialists, and care coordinators',
        'Reduced risk of medication or treatment errors through accurate history',
        'Digital progress tracking and outcome measurement over time',
        'HIPAA-compliant storage and access controls',
        'Streamlined billing and insurance documentation',
      ],
      process: [
        { step: 'Intake & Consent', detail: 'Patient demographics, insurance, and consent for care and data sharing collected digitally.' },
        { step: 'Initial Evaluation Note', detail: 'Comprehensive evaluation documented with objective findings, diagnosis, and plan of care.' },
        { step: 'Visit Notes', detail: 'Each therapy session documented with treatment provided, patient response, and progress.' },
        { step: 'Progress Reports', detail: 'Regular summaries sent to the referring physician detailing outcomes and plan updates.' },
        { step: 'Discharge Summary', detail: 'Final documentation summarising the episode of care, goals achieved, and home program.' },
      ],
      conditions: [
        'All therapy episodes requiring documentation and billing',
        'Multi-provider care coordination',
        'Insurance authorisation and claims support',
        'Outcome measurement and quality reporting',
        'Patient portal access for personal health records',
        'Long-term chronic condition management',
      ],
    },
  },

  // ── Careers Page ────────────────────────────────────────────────────────────
  careers: {
    whyCards: [
      { title: 'Flexible Schedule',   desc: 'Set your own hours and manage your own caseload. Work as much or as little as fits your life.' },
      { title: 'Statewide Reach',     desc: 'Serve patients across Texas with opportunities in both urban and rural communities.' },
      { title: 'Supportive Network',  desc: 'Join a community of like-minded clinicians with a dedicated admin team handling logistics.' },
      { title: 'Competitive Pay',     desc: 'Among the best per-visit rates in Texas home health, paid promptly and transparently.' },
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
