import { Link } from 'react-router-dom';
import { CheckCircle, DollarSign, Star, ArrowRight, MapPin, Clock, Users, Award } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import SEO from '../components/SEO';
import Animate from '../components/Animate';

const CARD_GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-violet-600 to-purple-900',
  'from-amber-400 to-orange-500',
  'from-orange-500 to-amber-600',
];

// Static icons for the 4 why-cards (not stored in DB)
const WHY_ICONS = [Clock, MapPin, Users, Award];

const DEFAULT_WHY_CARDS = [
  { title: 'Flexible Schedule',  desc: 'Set your own hours and manage your own caseload. Work as much or as little as fits your life.' },
  { title: 'Statewide Reach',    desc: 'Serve patients across Texas with opportunities in both urban and rural communities.' },
  { title: 'Supportive Network', desc: 'Join a community of like-minded clinicians with a dedicated admin team handling logistics.' },
  { title: 'Competitive Pay',    desc: 'Among the best per-visit rates in Texas home health, paid promptly and transparently.' },
];

export default function CareersPage() {
  const { content, loading } = useContent();
  if (loading) return <div className="h-96 animate-pulse bg-blue-50" />;

  const employment = content.employment || {};
  const whyCards   = (content.careers?.whyCards) || DEFAULT_WHY_CARDS;

  return (
    <>
      <SEO
        title="Careers | Join Neptune Therapy's Therapist Network"
        description="Join Neptune Therapy as an independent PT, OT, or SLP contractor in Texas. Competitive per-visit pay, flexible schedule, and a supportive team. Apply today."
        path="/careers"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <img
          src="/images/therapy-session.jpg"
          alt="Therapist with patient"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <span className="inline-block bg-blue-600/60 text-blue-100 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            Join Our Network
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {employment.heading || 'Join Our Team'}
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto mb-10">
            {employment.subheading || 'Flexible. Independent. Rewarding.'}
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-white text-blue-800 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Apply Now <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Why Neptune */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Why Us</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Why Therapists Choose Neptune</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              {employment.description}
            </p>
          </Animate>
          <Animate stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCards.map(({ title, desc }, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
                <div key={i} className="anim-fade-up bg-white rounded-2xl p-8 border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col items-center text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} rounded-2xl flex items-center justify-center mb-5 shadow-md`}>
                    <Icon size={30} className="text-white" />
                  </div>
                  <h3 className="card-title mb-2">{title}</h3>
                  <p className="card-body">{desc}</p>
                </div>
              );
            })}
          </Animate>
        </div>
      </section>

      {/* Compensation + Perks */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">What You Earn</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Compensation & Benefits</h2>
          </Animate>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Compensation card */}
            <Animate type="fade-left">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
                <div className="bg-gradient-to-r from-violet-700 to-purple-900 px-6 py-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign size={22} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Compensation</h3>
                </div>
                <div className="px-6 py-6 space-y-1">
                  {(employment.compensation || []).map((c, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                      <span className="text-gray-700 font-semibold">{c.role}</span>
                      <span className="text-sm font-bold text-purple-800 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">{c.rate}</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 pt-4">
                    Rates are per-visit and may vary based on location, discipline, and case complexity. Contact us for details.
                  </p>
                </div>
              </div>
            </Animate>

            {/* Perks card */}
            <Animate type="fade-right">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
                <div className="flex items-center gap-2 mb-6">
                  <Star size={20} className="text-yellow-500" />
                  <h3 className="text-xl card-title">Perks & Benefits</h3>
                </div>
                <ul className="space-y-3">
                  {(employment.perks || []).map((perk, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={17} className="text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Animate>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Who We're Looking For</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">Qualifications</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We welcome Physical Therapists (PT), Occupational Therapists (OT), and Speech-Language Pathologists (SLP) who share our passion for delivering exceptional in-home care across Texas.
              </p>
              <ul className="space-y-3">
                {(employment.requirements || []).map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </Animate>

            <Animate type="fade-right">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/nurse-patient.jpg"
                  alt="Therapist with patient"
                  className="w-full h-80 object-cover object-center"
                />
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
          <p className="text-blue-100 mb-8 text-lg">Apply today and become part of a community that puts care first.</p>
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
