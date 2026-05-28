import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import api from '../lib/api';
import SEO from '../components/SEO';

export default function ContactPage() {
  const { content } = useContent();
  const contact = content.contact || {};

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/contact', form);
      setStatus({ type: 'success', msg: data.message });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.error || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Neptune Therapy. Call (346) 630-0084 or email neptunehc.resources@yahoo.com. We serve physical therapists, occupational therapists, and speech-language pathologists across Texas."
        path="/contact"
      />

      {/* Header */}
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <img
          src="/images/therapy-session.jpg"
          alt="Therapist in session"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {contact.heading || 'Get in Touch'}
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto">
            {contact.subheading || "Ready to take the next step? We'd love to hear from you."}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-6">
                {contact.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">Phone</p>
                      <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-blue-700">{contact.phone}</a>
                      {contact.phone2 && (
                        <><br /><a href={`tel:${contact.phone2}`} className="text-gray-600 hover:text-blue-700">{contact.phone2}</a></>
                      )}
                    </div>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">Email</p>
                      <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-blue-700">{contact.email}</a>
                    </div>
                  </div>
                )}
                {contact.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">Location</p>
                      <p className="text-gray-600">{contact.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-10 p-6 bg-blue-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-2">Looking to apply?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  If you're a licensed PT, OT, or SLP interested in joining our network, fill out our full application form.
                </p>
                <a
                  href="/apply"
                  className="inline-block bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Go to Application Form
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
              {status && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {status.msg}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
                >
                  <Send size={16} />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
