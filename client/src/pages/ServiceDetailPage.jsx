import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const CARD_GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-violet-600 to-purple-900',
  'from-amber-400 to-orange-500',
  'from-blue-600 to-violet-700',
  'from-orange-500 to-amber-600',
  'from-purple-700 to-blue-600',
];
import SEO from '../components/SEO';
import Animate from '../components/Animate';
import SERVICES from '../data/servicesData';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { content } = useContent();

  const staticService = SERVICES.find(s => s.slug === slug);
  if (!staticService) return <Navigate to="/" replace />;

  // Merge static (icon, title, image, seo) with dynamic DB content
  const dbData = (content.services_detail || {})[slug] || {};
  const service = { ...staticService, ...dbData };

  const Icon = service.icon;
  const currentIndex = SERVICES.findIndex(s => s.slug === slug);
  const nextService = SERVICES[(currentIndex + 1) % SERVICES.length];

  return (
    <>
      <SEO
        title={service.seo.title}
        description={service.seo.description}
        path={`/services/${service.slug}`}
        image={`https://neptunetherapy.com${service.image}`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-blue-300 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-blue-200">Services</span>
            <ChevronRight size={14} />
            <span className="text-white">{service.title}</span>
          </nav>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Icon size={28} className="text-blue-300" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 max-w-2xl">{service.title}</h1>
          <p className="text-blue-200 text-xl max-w-2xl leading-relaxed">{service.tagline}</p>
        </div>
      </section>

      {/* Overview — split layout */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Animate type="fade-left">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-[460px] object-cover object-center"
                />
              </div>
            </Animate>
            <Animate type="fade-right">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Overview</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">What is {service.title}?</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">{service.overview}</p>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm"
              >
                Join as a Therapist <ArrowRight size={15} />
              </Link>
            </Animate>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Why In-Home?</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Benefits for Patients</h2>
          </Animate>
          <Animate stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.benefits.map((benefit, i) => (
              <div key={i} className="anim-fade-up bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} rounded-2xl flex items-center justify-center mb-5 shadow-md`}>
                  <CheckCircle size={26} className="text-white" />
                </div>
                <p className="card-body font-medium">{benefit}</p>
              </div>
            ))}
          </Animate>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Process</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">How It Works</h2>
          </Animate>
          <Animate stagger className="space-y-4">
            {service.process.map((item, i) => (
              <div key={i} className="anim-fade-up flex gap-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="card-title mb-1">{item.step}</h3>
                  <p className="card-body">{item.detail}</p>
                </div>
              </div>
            ))}
          </Animate>
        </div>
      </section>

      {/* Conditions Treated */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Animate>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Conditions We Address</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-8">Who Can Benefit?</h2>
              <ul className="space-y-3">
                {service.conditions.map((condition, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span className="text-gray-700">{condition}</span>
                  </li>
                ))}
              </ul>
            </Animate>

            {/* CTA card */}
            <Animate type="fade-right">
              <div className="bg-blue-700 rounded-3xl p-10 text-white">
                <Icon size={36} className="text-blue-300 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Are You a Licensed {service.title.split(' ')[0]} Therapist?</h3>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  Join Neptune Therapy's growing network of independent contractors delivering {service.title.toLowerCase()} services across Texas. Flexible schedule, competitive pay.
                </p>
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-2 bg-white text-blue-800 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
                >
                  Apply Now <ArrowRight size={15} />
                </Link>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* All Services nav */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Explore Other Services</h2>
          </Animate>
          <Animate stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SERVICES.map((s, i) => {
              const SIcon = s.icon;
              const isActive = s.slug === slug;
              return (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className={`anim-fade-up flex flex-col items-center text-center p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md ${
                    isActive
                      ? 'bg-blue-700 border-blue-700'
                      : 'bg-white border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                    isActive
                      ? 'bg-white/20'
                      : `bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} shadow-sm`
                  }`}>
                    <SIcon size={20} className="text-white" />
                  </div>
                  <span className={`text-xs font-semibold leading-tight ${isActive ? 'text-white' : 'text-gray-800'}`}>{s.title}</span>
                </Link>
              );
            })}
          </Animate>
        </div>
      </section>
    </>
  );
}
