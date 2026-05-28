import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Footer() {
  const { content } = useContent();
  const footer = content.footer || {};
  const contact = content.contact || {};

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-white font-bold text-lg">Neptune Therapy</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {footer.tagline || 'Caring for Life, Every Step of the Way'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {(footer.links || []).map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              {contact.phone && (
                <li>
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400">
                    <Phone size={14} /> {contact.phone}
                  </a>
                </li>
              )}
              {contact.phone2 && (
                <li>
                  <a href={`tel:${contact.phone2}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400">
                    <Phone size={14} /> {contact.phone2}
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400">
                    <Mail size={14} /> {contact.email}
                  </a>
                </li>
              )}
              {contact.address && (
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin size={14} /> {contact.address}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
          {footer.copyright || '© 2024 Neptune Therapy. All Rights Reserved.'}
        </div>
      </div>
    </footer>
  );
}
