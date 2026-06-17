import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users, Award, CheckCircle, X } from 'lucide-react';

const CARD_GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-violet-600 to-purple-900',
  'from-amber-400 to-orange-500',
  'from-blue-600 to-violet-700',
];
import { useContent } from '../context/ContentContext';
import SEO from '../components/SEO';
import Animate from '../components/Animate';

const VALUE_ICONS = [Heart, Shield, Users, Award];

// Extended modal content keyed by value title
const VALUE_DETAILS = {
  Autonomy: {
    summary: 'Your practice, your rules. We believe the best care happens when clinicians have the freedom to work on their own terms.',
    points: [
      'Choose your own patients, schedule, and weekly caseload — no minimums, no maximums.',
      'Work as an independent contractor with full control over your day.',
      'No micromanagement. We trust your clinical expertise to deliver excellent outcomes.',
      'Cover any area across Texas that fits your lifestyle and commute preferences.',
      'Scale up or down at any time — life changes, and your workload should too.',
    ],
  },
  Compassion: {
    summary: 'Every patient is a person with a story. We recruit therapists who lead with empathy and invest in genuine human connection.',
    points: [
      'In-home care lets you meet patients in their real environment, building deeper therapeutic trust.',
      'Quality one-on-one time — no rushed clinic sessions or back-to-back assembly-line visits.',
      'We prioritize clinicians who view compassion as a clinical tool, not a soft skill.',
      'Families and caregivers are included in the care conversation, not kept at arm\'s length.',
      'Better relationships lead to better compliance, better outcomes, and more fulfilling work.',
    ],
  },
  Community: {
    summary: 'Independent work doesn\'t have to mean isolated work. Our network keeps you connected, supported, and growing.',
    points: [
      'Join a statewide network of PTs, OTs, and SLPs who actively support each other.',
      'A dedicated admin team handles credentialing, scheduling logistics, and paperwork so you focus on patients.',
      'Access shared resources, clinical guides, and documentation best practices.',
      'Regular touchpoints with the Neptune team — you\'re never just a contractor number.',
      'A culture where lifting each other up is the norm, not the exception.',
    ],
  },
  Excellence: {
    summary: 'We hold ourselves to the highest clinical and ethical standards — because our patients deserve nothing less.',
    points: [
      'We recruit only licensed, experienced clinicians (PT, OT, SLP) with proven track records.',
      'Evidence-based practice is the baseline; ongoing learning and development are encouraged.',
      'Rigorous, timely documentation ensures seamless continuity of care across providers.',
      'We maintain strict credentialing standards so every clinician in our network meets or exceeds state requirements.',
      'Excellence isn\'t a goal — it\'s the standard we start with and build from.',
    ],
  },
};

export default function AboutPage() {
  const { content, loading } = useContent();
  const [activeValue, setActiveValue] = useState(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setActiveValue(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeValue ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeValue]);

  if (loading) return <div className="h-96 animate-pulse bg-blue-50" />;

  const about = content.about || {};
  const employment = content.employment || {};

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Neptune Therapy's mission to deliver compassionate in-home therapy across Texas. We recruit licensed PT, OT, and SLP professionals as independent contractors with flexible schedules and competitive pay."
        path="/about"
        image="https://neptunetherapy.com/images/consultation.jpg"
      />

      {/* Header — with photo background */}
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <img
          src="/images/consultation.jpg"
          alt="Therapy consultation"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto">
            {about.mission || 'Caring for Life, Every Step of the Way'}
          </p>
        </div>
      </section>

      {/* Mission — split layout with photo */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <Animate type="fade-left" className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="/images/nurse-patient.jpg"
                  alt="Nurse assisting a patient"
                  className="w-full h-[460px] object-cover object-center"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 bg-blue-700 text-white rounded-2xl px-6 py-4 shadow-lg hidden sm:block">
                <p className="text-2xl font-bold">Texas</p>
                <p className="text-blue-200 text-xs font-medium">Statewide Coverage</p>
              </div>
            </Animate>

            {/* Text */}
            <Animate type="fade-right">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">{about.mission}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{about.missionDetail}</p>
            </Animate>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">What We Stand For</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Our Core Values</h2>
          </Animate>
          <Animate stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(about.values || []).map((val, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              const hasDetail = !!VALUE_DETAILS[val.title];
              return (
                <button
                  key={i}
                  onClick={() => hasDetail && setActiveValue({ ...val, index: i })}
                  className={`anim-fade-up bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col items-center w-full text-left ${hasDetail ? 'cursor-pointer' : ''}`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} rounded-2xl flex items-center justify-center mb-5 shadow-md`}>
                    <Icon size={30} className="text-white" />
                  </div>
                  <h3 className="text-lg card-title mb-2">{val.title}</h3>
                  <p className="card-body">{val.description}</p>
                  {hasDetail && (
                    <span className="mt-4 text-xs font-semibold text-blue-600 uppercase tracking-wider">Learn more →</span>
                  )}
                </button>
              );
            })}
          </Animate>
        </div>
      </section>

      {/* Qualifications — photo on right */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Who We're Looking For</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">Qualifications</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We welcome Physical Therapists (PT), Occupational Therapists (OT), and Speech-Language Pathologists (SLP)
                who share our passion for delivering exceptional in-home care across Texas.
              </p>
              <ul className="space-y-3 mb-8">
                {(employment.requirements || []).map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              {/* Roles photo */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/therapist-notes.jpg"
                  alt="Therapist documenting patient notes during a home visit"
                  className="w-full h-56 object-cover object-center"
                />
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8">
                <h3 className="text-xl card-title mb-2">Roles & Responsibilities</h3>
                <p className="text-gray-600 text-sm mb-6">As an independent contractor with Neptune Therapy, you will:</p>
                <ul className="space-y-3">
                  {[
                    'Provide in-home therapy services tailored to each patient',
                    'Develop individualized treatment plans',
                    'Collaborate with patients, families, and healthcare professionals',
                    'Maintain accurate and timely documentation',
                    'Stay current with industry best practices',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
          <p className="text-blue-100 mb-8">Apply today and become part of a community that puts care first.</p>
          <Link
            to="/apply"
            className="bg-white text-blue-800 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Apply Now
          </Link>
        </div>
      </section>

      {/* Core Value Modal */}
      {activeValue && (() => {
        const Icon = VALUE_ICONS[activeValue.index % VALUE_ICONS.length];
        const detail = VALUE_DETAILS[activeValue.title] || {};
        const gradient = CARD_GRADIENTS[activeValue.index % CARD_GRADIENTS.length];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setActiveValue(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className={`bg-gradient-to-r ${gradient} px-8 py-7 flex items-center gap-4`}>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Icon size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">Core Value</p>
                  <h3 className="text-2xl font-bold text-white">{activeValue.title}</h3>
                </div>
                <button
                  onClick={() => setActiveValue(null)}
                  className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-8 py-7">
                <p className="text-gray-700 text-base leading-relaxed mb-6">{detail.summary}</p>
                <ul className="space-y-3">
                  {(detail.points || []).map((pt, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={17} className="text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setActiveValue(null)}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
