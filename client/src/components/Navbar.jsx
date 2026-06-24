import { useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import SERVICES from '../data/servicesData';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { content } = useContent();
  const contact = content.contact || {};
  const location = useLocation();
  const closeTimer = useRef(null);

  const isServicesActive = location.pathname.startsWith('/services');

  const links = [
    { to: '/',         label: 'Home' },
    { to: '/about',    label: 'About Us' },
    { to: '/careers',  label: 'Careers' },
    { to: '/contact',  label: 'Contact Us' },
  ];

  // Keep dropdown open while moving mouse to it
  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src="/images/logo.png" alt="Neptune Therapy" className="h-16 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'}`
                }
              >
                {l.label}
              </NavLink>
            ))}

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isServicesActive ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'
                }`}
              >
                Services
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {servicesOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {SERVICES.map(s => {
                    const Icon = s.icon;
                    return (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                        onClick={() => setServicesOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                          <Icon size={15} className="text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium transition-colors">
                          {s.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Phone + CTA */}
          <div className="hidden md:flex items-center gap-4">
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-700">
                <Phone size={14} />
                {contact.phone}
              </a>
            )}
            <Link
              to="/apply"
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 px-3 rounded-lg text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`
              }
            >
              {l.label}
            </NavLink>
          ))}

          {/* Mobile services expandable */}
          <div>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium ${
                isServicesActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Services
              <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {servicesOpen && (
              <div className="mt-1 ml-3 space-y-0.5 border-l-2 border-blue-100 pl-3">
                {SERVICES.map(s => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.slug}
                      to={`/services/${s.slug}`}
                      onClick={() => { setOpen(false); setServicesOpen(false); }}
                      className="flex items-center gap-2.5 py-2 px-2 rounded-lg text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      <Icon size={14} className="text-blue-500 shrink-0" />
                      {s.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <NavLink
            to="/apply"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block py-2.5 px-3 rounded-lg text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            Apply Now
          </NavLink>

          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 py-2.5 px-3 text-sm text-gray-700">
              <Phone size={14} /> {contact.phone}
            </a>
          )}
        </div>
      )}
    </header>
  );
}
