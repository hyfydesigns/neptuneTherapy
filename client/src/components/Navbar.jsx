import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { content } = useContent();
  const contact = content.contact || {};

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/apply', label: 'Apply Now' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-gray-900 text-lg leading-tight">
              Neptune<br />
              <span className="text-blue-700 text-xs font-semibold tracking-wide uppercase">Therapy</span>
            </span>
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
