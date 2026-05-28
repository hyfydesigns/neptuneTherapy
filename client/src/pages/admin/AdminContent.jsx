import { useState } from 'react';
import { Save, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useContent } from '../../context/ContentContext';
import api from '../../lib/api';

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

function SaveBtn({ loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors mt-5"
    >
      <Save size={15} />
      {loading ? 'Saving...' : 'Save Changes'}
    </button>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50 ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
      {msg}
    </div>
  );
}

export default function AdminContent() {
  const { content, updateSection } = useContent();
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const save = async (section, data) => {
    setSaving(section);
    try {
      await api.put(`/content/${section}`, data);
      updateSection(section, data);
      showToast('Saved successfully!');
    } catch {
      showToast('Save failed. Please try again.', 'error');
    } finally {
      setSaving(null);
    }
  };

  // ---- Hero ----
  const [hero, setHero] = useState(content.hero || {});

  // ---- About ----
  const [about, setAbout] = useState(content.about || {});

  // ---- Services ----
  const [services, setServices] = useState(content.services || {});

  const updateServiceItem = (i, field, val) => {
    const items = [...(services.items || [])];
    items[i] = { ...items[i], [field]: val };
    setServices(p => ({ ...p, items }));
  };
  const addServiceItem = () => setServices(p => ({ ...p, items: [...(p.items || []), { title: '', description: '', icon: 'activity' }] }));
  const removeServiceItem = i => setServices(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

  // ---- Employment ----
  const [employment, setEmployment] = useState(content.employment || {});

  // ---- Contact ----
  const [contactData, setContactData] = useState(content.contact || {});

  // ---- Footer ----
  const [footer, setFooter] = useState(content.footer || {});

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
        <p className="text-gray-500 text-sm mt-1">Edit every section of your public website</p>
      </div>

      <div className="space-y-4 max-w-3xl">

        {/* HERO */}
        <Section title="Hero Section" defaultOpen>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Main Tagline</label>
              <textarea rows={2} className={inputCls} value={hero.tagline || ''} onChange={e => setHero(p => ({ ...p, tagline: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input className={inputCls} value={hero.subtitle || ''} onChange={e => setHero(p => ({ ...p, subtitle: e.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Primary Button Text</label>
                <input className={inputCls} value={hero.ctaText || ''} onChange={e => setHero(p => ({ ...p, ctaText: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Primary Button Link</label>
                <input className={inputCls} value={hero.ctaLink || ''} onChange={e => setHero(p => ({ ...p, ctaLink: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Secondary Button Text</label>
                <input className={inputCls} value={hero.secondaryCtaText || ''} onChange={e => setHero(p => ({ ...p, secondaryCtaText: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Secondary Button Link</label>
                <input className={inputCls} value={hero.secondaryCtaLink || ''} onChange={e => setHero(p => ({ ...p, secondaryCtaLink: e.target.value }))} />
              </div>
            </div>
          </div>
          <SaveBtn loading={saving === 'hero'} onClick={() => save('hero', hero)} />
        </Section>

        {/* ABOUT */}
        <Section title="About Section">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Mission Statement</label>
              <input className={inputCls} value={about.mission || ''} onChange={e => setAbout(p => ({ ...p, mission: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Mission Detail (paragraph)</label>
              <textarea rows={4} className={inputCls} value={about.missionDetail || ''} onChange={e => setAbout(p => ({ ...p, missionDetail: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Core Values</label>
              <div className="space-y-3">
                {(about.values || []).map((val, i) => (
                  <div key={i} className="grid sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
                    <input
                      className={inputCls}
                      placeholder="Value title"
                      value={val.title}
                      onChange={e => {
                        const values = [...about.values];
                        values[i] = { ...values[i], title: e.target.value };
                        setAbout(p => ({ ...p, values }));
                      }}
                    />
                    <input
                      className={`${inputCls} sm:col-span-2`}
                      placeholder="Description"
                      value={val.description}
                      onChange={e => {
                        const values = [...about.values];
                        values[i] = { ...values[i], description: e.target.value };
                        setAbout(p => ({ ...p, values }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <SaveBtn loading={saving === 'about'} onClick={() => save('about', about)} />
        </Section>

        {/* SERVICES */}
        <Section title="Services Section">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Section Heading</label>
                <input className={inputCls} value={services.heading || ''} onChange={e => setServices(p => ({ ...p, heading: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Subheading</label>
                <input className={inputCls} value={services.subheading || ''} onChange={e => setServices(p => ({ ...p, subheading: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Services</label>
              <div className="space-y-3">
                {(services.items || []).map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex gap-3">
                      <input className={inputCls} placeholder="Service title" value={item.title} onChange={e => updateServiceItem(i, 'title', e.target.value)} />
                      <select className={`${inputCls} w-36`} value={item.icon} onChange={e => updateServiceItem(i, 'icon', e.target.value)}>
                        {['home','activity','hand','mic','monitor','file-text'].map(ic => <option key={ic}>{ic}</option>)}
                      </select>
                      <button onClick={() => removeServiceItem(i)} className="p-2 text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <textarea rows={2} className={inputCls} placeholder="Description" value={item.description} onChange={e => updateServiceItem(i, 'description', e.target.value)} />
                  </div>
                ))}
                <button onClick={addServiceItem} className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-800">
                  <Plus size={16} /> Add Service
                </button>
              </div>
            </div>
          </div>
          <SaveBtn loading={saving === 'services'} onClick={() => save('services', services)} />
        </Section>

        {/* EMPLOYMENT */}
        <Section title="Employment / Join Our Team Section">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Heading</label>
                <input className={inputCls} value={employment.heading || ''} onChange={e => setEmployment(p => ({ ...p, heading: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Subheading</label>
                <input className={inputCls} value={employment.subheading || ''} onChange={e => setEmployment(p => ({ ...p, subheading: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea rows={3} className={inputCls} value={employment.description || ''} onChange={e => setEmployment(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Compensation Rates</label>
              {(employment.compensation || []).map((c, i) => (
                <div key={i} className="grid sm:grid-cols-2 gap-3 mb-2">
                  <input className={inputCls} placeholder="Role" value={c.role} onChange={e => { const a = [...employment.compensation]; a[i]={...a[i],role:e.target.value}; setEmployment(p=>({...p,compensation:a})); }} />
                  <input className={inputCls} placeholder="Rate" value={c.rate} onChange={e => { const a = [...employment.compensation]; a[i]={...a[i],rate:e.target.value}; setEmployment(p=>({...p,compensation:a})); }} />
                </div>
              ))}
            </div>
            <div>
              <label className={labelCls}>Perks (one per line)</label>
              <textarea rows={5} className={inputCls}
                value={(employment.perks || []).join('\n')}
                onChange={e => setEmployment(p => ({ ...p, perks: e.target.value.split('\n') }))}
              />
            </div>
            <div>
              <label className={labelCls}>Requirements (one per line)</label>
              <textarea rows={5} className={inputCls}
                value={(employment.requirements || []).join('\n')}
                onChange={e => setEmployment(p => ({ ...p, requirements: e.target.value.split('\n') }))}
              />
            </div>
          </div>
          <SaveBtn loading={saving === 'employment'} onClick={() => save('employment', employment)} />
        </Section>

        {/* CONTACT */}
        <Section title="Contact Information">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ['heading', 'Page Heading'],
              ['subheading', 'Page Subheading'],
              ['phone', 'Primary Phone'],
              ['phone2', 'Secondary Phone'],
              ['email', 'Email Address'],
              ['address', 'Address / Location'],
            ].map(([field, label]) => (
              <div key={field}>
                <label className={labelCls}>{label}</label>
                <input className={inputCls} value={contactData[field] || ''} onChange={e => setContactData(p => ({ ...p, [field]: e.target.value }))} />
              </div>
            ))}
          </div>
          <SaveBtn loading={saving === 'contact'} onClick={() => save('contact', contactData)} />
        </Section>

        {/* FOOTER */}
        <Section title="Footer">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Copyright Text</label>
              <input className={inputCls} value={footer.copyright || ''} onChange={e => setFooter(p => ({ ...p, copyright: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Tagline</label>
              <input className={inputCls} value={footer.tagline || ''} onChange={e => setFooter(p => ({ ...p, tagline: e.target.value }))} />
            </div>
          </div>
          <SaveBtn loading={saving === 'footer'} onClick={() => save('footer', footer)} />
        </Section>

      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </AdminLayout>
  );
}
