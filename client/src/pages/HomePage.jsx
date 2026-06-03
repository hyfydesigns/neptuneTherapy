import { Link } from 'react-router-dom';
import { Home, Activity, Hand, Mic, Monitor, FileText, CheckCircle, DollarSign, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import Animate from '../components/Animate';
import SERVICES from '../data/servicesData';

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Neptune Therapy',
  description: 'Neptune Therapy is a home health agency staffing service connecting Physical Therapists, Occupational Therapists, and Speech-Language Pathologists with patients across Texas.',
  url: 'https://neptunetherapy.com',
  logo: 'https://neptunetherapy.com/images/nurse-patient.jpg',
  telephone: '(346) 630-0084',
  email: 'neptunehc.resources@yahoo.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Houston',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  areaServed: {
    '@type': 'State',
    name: 'Texas',
  },
  serviceType: [
    'Physical Therapy',
    'Occupational Therapy',
    'Speech-Language Pathology',
    'Home Health Care',
    'Telehealth',
  ],
  priceRange: '$$',
  openingHours: 'Mo-Fr 09:00-17:00',
};

const ICON_MAP = {
  home: Home, activity: Activity, hand: Hand, mic: Mic, monitor: Monitor, 'file-text': FileText,
};

const CARD_GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-violet-600 to-purple-900',
  'from-amber-400 to-orange-500',
  'from-blue-600 to-violet-700',
  'from-orange-500 to-amber-600',
  'from-purple-700 to-blue-600',
];

function ServiceIcon({ name }) {
  const Icon = ICON_MAP[name] || Activity;
  return <Icon size={30} className="text-white" />;
}

export default function HomePage() {
  const { content, loading } = useContent();
  if (loading) return <PageSkeleton />;

  const hero = content.hero || {};
  const services = content.services || {};
  const employment = content.employment || {};

  return (
    <>
      <SEO
        path="/"
        description="Neptune Therapy connects licensed Physical Therapists (PT), Occupational Therapists (OT), and Speech-Language Pathologists (SLP) with home health patients across Texas. Flexible schedule, competitive pay, independent contractor roles."
      />
      <JsonLd data={LOCAL_BUSINESS_SCHEMA} />

      {/* Hero — split layout with photo */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[600px]">
            {/* Text */}
            <div className="py-20 lg:py-28 lg:pr-12">
              <span className="hero-badge inline-block bg-blue-600/60 text-blue-100 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                Home Health Agency Staffing
              </span>
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-tight mb-6">
                {hero.tagline || 'A Determination to make A Difference in Health Care Delivery'}
              </h1>
              <p className="hero-sub text-xl text-blue-100 mb-10 leading-relaxed">
                {hero.subtitle || 'Home Health Agency Staffing Services across Texas'}
              </p>
              <div className="hero-ctas flex flex-wrap gap-4">
                <Link
                  to={hero.ctaLink || '/apply'}
                  className="bg-white text-blue-800 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
                >
                  {hero.ctaText || 'Apply Now'}
                </Link>
                <Link
                  to={hero.secondaryCtaLink || '/about'}
                  className="border border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm"
                >
                  {hero.secondaryCtaText || 'Learn More'}
                </Link>
              </div>
            </div>

            {/* Photo */}
            <div className="hero-photo hidden lg:block relative h-full self-stretch">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent z-10" />
              <img
                src="/images/nurse-patient.jpg"
                alt="Nurse helping a patient"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {services.heading || 'Our Services'}
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              {services.subheading || 'Comprehensive Home Health Solutions'}
            </p>
          </Animate>
          <Animate stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services.items || []).map((item, i) => {
              const serviceData = SERVICES.find(s => s.title === item.title);
              const slug = serviceData?.slug;
              return (
                <Link
                  key={i}
                  to={slug ? `/services/${slug}` : '#'}
                  className="anim-fade-up group bg-white hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform`}>
                    <ServiceIcon name={item.icon} />
                  </div>
                  <h3 className="text-lg card-title mb-2">{item.title}</h3>
                  <p className="card-body mb-4">{item.description}</p>
                  <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-semibold group-hover:gap-2 transition-all mt-auto">
                    Learn more <ArrowRight size={12} />
                  </span>
                </Link>
              );
            })}
          </Animate>
        </div>
      </section>

      {/* How We Work — photo banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <img
          src="/images/therapist-notes.jpg"
          alt="Therapist taking notes during a home visit"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Animate type="fade-left" className="max-w-2xl">
            <span className="inline-block bg-blue-500/30 text-blue-200 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              Our Approach
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">
              Care Delivered Where It Matters Most
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Every patient is unique. Our therapists conduct thorough in-home assessments, build individualized treatment plans, and track progress with every visit — delivering consistent, compassionate care without the patient ever leaving home.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Learn About Our Mission <ArrowRight size={16} />
            </Link>
          </Animate>
        </div>
      </section>

      {/* Employment — with photo */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Photo + heading */}
            <Animate type="fade-left">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Join Our Network</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
                {employment.heading || 'Join Our Team'}
              </h2>
              <p className="text-lg text-blue-700 font-medium mb-4">
                {employment.subheading || 'Flexible. Independent. Rewarding.'}
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {employment.description}
              </p>

              {/* Photo */}
              <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
                <img
                  src="/images/therapy-session.jpg"
                  alt="Therapist in a session with a patient"
                  className="w-full h-64 object-cover object-center"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm"
                >
                  Apply Now <ArrowRight size={15} />
                </Link>
                <Link
                  to="/careers"
                  className="inline-flex items-center gap-2 border border-blue-200 text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
                >
                  Learn More
                </Link>
              </div>
            </Animate>

            <Animate type="fade-right" className="lg:pt-14">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <DollarSign size={20} className="text-amber-600" />
                  </div>
                  <h3 className="text-lg card-title">Competitive Compensation</h3>
                </div>
                <p className="card-body">
                  We offer some of the best per-visit rates in Texas home health — with quarterly bonuses, referral incentives, and a flexible independent contractor structure that puts you in control.
                </p>
                <ul className="space-y-2">
                  {(employment.perks || []).slice(0, 3).map((perk, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-gray-900">
                      <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/careers"
                  className="inline-flex items-center gap-2 text-blue-700 font-semibold text-sm hover:gap-3 transition-all"
                >
                  See full compensation & benefits <ArrowRight size={14} />
                </Link>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to make a difference?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join our growing network of independent therapists across Texas.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/apply"
              className="bg-white text-blue-800 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              Submit Your Application
            </Link>
            <Link
              to="/contact"
              className="border border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[600px] bg-blue-200" />
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4" />
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );
}
