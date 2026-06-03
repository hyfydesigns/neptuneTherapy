import { useState } from 'react';
import { Save, ChevronDown, ChevronUp, Plus, Trash2, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useContent } from '../../context/ContentContext';
import api from '../../lib/api';

/* ── Shared UI helpers ─────────────────────────────────────────────────────── */
function Section({ title, subtitle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

const inputCls  = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
const labelCls  = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

function Field({ label, children }) {
  return <div><label className={labelCls}>{label}</label>{children}</div>;
}

function SaveBtn({ loading, onClick }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors mt-5">
      <Save size={15} />{loading ? 'Saving...' : 'Save Changes'}
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

/* ── List editors (bullets / steps) ───────────────────────────────────────── */
function StringListEditor({ value = [], onChange, placeholder = 'Item' }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input className={inputCls} value={item} placeholder={placeholder}
            onChange={e => { const a = [...value]; a[i] = e.target.value; onChange(a); }} />
          <button onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="p-2 text-red-400 hover:text-red-600 shrink-0"><Trash2 size={15} /></button>
        </div>
      ))}
      <button onClick={() => onChange([...value, ''])}
        className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:text-blue-800">
        <Plus size={15} /> Add item
      </button>
    </div>
  );
}

function StepListEditor({ value = [], onChange }) {
  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-2">
          <div className="flex gap-2 items-center">
            <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center shrink-0 font-bold">{i + 1}</span>
            <input className={inputCls} placeholder="Step name" value={item.step || ''}
              onChange={e => { const a = [...value]; a[i] = { ...a[i], step: e.target.value }; onChange(a); }} />
            <button onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="p-1.5 text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
          </div>
          <textarea rows={2} className={inputCls} placeholder="Step detail"
            value={item.detail || ''}
            onChange={e => { const a = [...value]; a[i] = { ...a[i], detail: e.target.value }; onChange(a); }} />
        </div>
      ))}
      <button onClick={() => onChange([...value, { step: '', detail: '' }])}
        className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:text-blue-800">
        <Plus size={15} /> Add step
      </button>
    </div>
  );
}

/* ── Service detail sub-editor ─────────────────────────────────────────────── */
const SERVICE_SLUGS = [
  { slug: 'home-health-care',          label: 'Home Health Care' },
  { slug: 'physical-therapy',          label: 'Physical Therapy' },
  { slug: 'occupational-therapy',      label: 'Occupational Therapy' },
  { slug: 'speech-language-pathology', label: 'Speech-Language Pathology' },
  { slug: 'telehealth',                label: 'Telehealth & Remote Monitoring' },
  { slug: 'electronic-health-records', label: 'Electronic Health Records' },
];

function ServiceDetailEditor({ data, onChange }) {
  const [active, setActive] = useState(SERVICE_SLUGS[0].slug);
  const svc = data[active] || {};
  const update = (field, val) => onChange({ ...data, [active]: { ...svc, [field]: val } });

  return (
    <div>
      {/* Service tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SERVICE_SLUGS.map(s => (
          <button key={s.slug} onClick={() => setActive(s.slug)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${active === s.slug ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="space-y-5 border border-blue-100 rounded-2xl p-5 bg-blue-50/30">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
          <ChevronRight size={13} /> Editing: {SERVICE_SLUGS.find(s => s.slug === active)?.label}
        </p>

        <Field label="Tagline (hero subtitle)">
          <input className={inputCls} value={svc.tagline || ''}
            onChange={e => update('tagline', e.target.value)} />
        </Field>

        <Field label="Overview Paragraph">
          <textarea rows={5} className={inputCls} value={svc.overview || ''}
            onChange={e => update('overview', e.target.value)} />
        </Field>

        <Field label="Benefits for Patients">
          <StringListEditor value={svc.benefits || []} placeholder="Benefit"
            onChange={val => update('benefits', val)} />
        </Field>

        <Field label="How It Works (Steps)">
          <StepListEditor value={svc.process || []}
            onChange={val => update('process', val)} />
        </Field>

        <Field label="Conditions / Who Can Benefit">
          <StringListEditor value={svc.conditions || []} placeholder="Condition"
            onChange={val => update('conditions', val)} />
        </Field>
      </div>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────────────── */
export default function AdminContent() {
  const { content, updateSection } = useContent();
  const [saving, setSaving] = useState(null);
  const [toast, setToast]   = useState(null);

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

  // ── State per section ──────────────────────────────────────────────────────
  const [hero,           setHero]           = useState(content.hero           || {});
  const [about,          setAbout]          = useState(content.about          || {});
  const [services,       setServices]       = useState(content.services       || {});
  const [employment,     setEmployment]     = useState(content.employment     || {});
  const [contactData,    setContactData]    = useState(content.contact        || {});
  const [footer,         setFooter]         = useState(content.footer         || {});
  const [servicesDetail, setServicesDetail] = useState(content.services_detail || {});
  const [careers,        setCareers]        = useState(content.careers        || {});

  const updateServiceItem = (i, field, val) => {
    const items = [...(services.items || [])];
    items[i] = { ...items[i], [field]: val };
    setServices(p => ({ ...p, items }));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
        <p className="text-gray-500 text-sm mt-1">Edit every section of your public website</p>
      </div>

      <div className="space-y-4 max-w-3xl">

        {/* ── HOME PAGE ─────────────────────────────────────────────────── */}
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 pt-2">Home Page</div>

        <Section title="Hero Section" defaultOpen>
          <div className="space-y-4">
            <Field label="Main Tagline">
              <textarea rows={2} className={inputCls} value={hero.tagline || ''} onChange={e => setHero(p => ({ ...p, tagline: e.target.value }))} />
            </Field>
            <Field label="Subtitle">
              <input className={inputCls} value={hero.subtitle || ''} onChange={e => setHero(p => ({ ...p, subtitle: e.target.value }))} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Primary Button Text">
                <input className={inputCls} value={hero.ctaText || ''} onChange={e => setHero(p => ({ ...p, ctaText: e.target.value }))} />
              </Field>
              <Field label="Primary Button Link">
                <input className={inputCls} value={hero.ctaLink || ''} onChange={e => setHero(p => ({ ...p, ctaLink: e.target.value }))} />
              </Field>
              <Field label="Secondary Button Text">
                <input className={inputCls} value={hero.secondaryCtaText || ''} onChange={e => setHero(p => ({ ...p, secondaryCtaText: e.target.value }))} />
              </Field>
              <Field label="Secondary Button Link">
                <input className={inputCls} value={hero.secondaryCtaLink || ''} onChange={e => setHero(p => ({ ...p, secondaryCtaLink: e.target.value }))} />
              </Field>
            </div>
          </div>
          <SaveBtn loading={saving === 'hero'} onClick={() => save('hero', hero)} />
        </Section>

        <Section title="Services Cards" subtitle="Heading, subheading and the 6 service card previews on the home page">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Section Heading">
                <input className={inputCls} value={services.heading || ''} onChange={e => setServices(p => ({ ...p, heading: e.target.value }))} />
              </Field>
              <Field label="Subheading">
                <input className={inputCls} value={services.subheading || ''} onChange={e => setServices(p => ({ ...p, subheading: e.target.value }))} />
              </Field>
            </div>
            <Field label="Service Cards">
              <div className="space-y-3">
                {(services.items || []).map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex gap-3">
                      <input className={inputCls} placeholder="Service title" value={item.title} onChange={e => updateServiceItem(i, 'title', e.target.value)} />
                      <select className={`${inputCls} w-36`} value={item.icon} onChange={e => updateServiceItem(i, 'icon', e.target.value)}>
                        {['home','activity','hand','mic','monitor','file-text'].map(ic => <option key={ic}>{ic}</option>)}
                      </select>
                      <button onClick={() => setServices(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }))}
                        className="p-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                    <textarea rows={2} className={inputCls} placeholder="Description" value={item.description}
                      onChange={e => updateServiceItem(i, 'description', e.target.value)} />
                  </div>
                ))}
                <button onClick={() => setServices(p => ({ ...p, items: [...(p.items || []), { title: '', description: '', icon: 'activity' }] }))}
                  className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-800">
                  <Plus size={16} /> Add Service Card
                </button>
              </div>
            </Field>
          </div>
          <SaveBtn loading={saving === 'services'} onClick={() => save('services', services)} />
        </Section>

        <Section title="Join Our Team (Home Page)" subtitle="Employment teaser on the home page">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Heading">
                <input className={inputCls} value={employment.heading || ''} onChange={e => setEmployment(p => ({ ...p, heading: e.target.value }))} />
              </Field>
              <Field label="Subheading">
                <input className={inputCls} value={employment.subheading || ''} onChange={e => setEmployment(p => ({ ...p, subheading: e.target.value }))} />
              </Field>
            </div>
            <Field label="Description">
              <textarea rows={3} className={inputCls} value={employment.description || ''} onChange={e => setEmployment(p => ({ ...p, description: e.target.value }))} />
            </Field>
          </div>
          <SaveBtn loading={saving === 'employment-home'} onClick={() => save('employment', employment)} />
        </Section>

        {/* ── ABOUT PAGE ────────────────────────────────────────────────── */}
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 pt-4">About Page</div>

        <Section title="Mission & Values">
          <div className="space-y-4">
            <Field label="Mission Statement">
              <input className={inputCls} value={about.mission || ''} onChange={e => setAbout(p => ({ ...p, mission: e.target.value }))} />
            </Field>
            <Field label="Mission Detail Paragraph">
              <textarea rows={4} className={inputCls} value={about.missionDetail || ''} onChange={e => setAbout(p => ({ ...p, missionDetail: e.target.value }))} />
            </Field>
            <Field label="Core Values">
              <div className="space-y-3">
                {(about.values || []).map((val, i) => (
                  <div key={i} className="grid sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
                    <input className={inputCls} placeholder="Value title" value={val.title}
                      onChange={e => { const values = [...about.values]; values[i] = { ...values[i], title: e.target.value }; setAbout(p => ({ ...p, values })); }} />
                    <input className={`${inputCls} sm:col-span-2`} placeholder="Description" value={val.description}
                      onChange={e => { const values = [...about.values]; values[i] = { ...values[i], description: e.target.value }; setAbout(p => ({ ...p, values })); }} />
                  </div>
                ))}
              </div>
            </Field>
          </div>
          <SaveBtn loading={saving === 'about'} onClick={() => save('about', about)} />
        </Section>

        {/* ── SERVICE DETAIL PAGES ──────────────────────────────────────── */}
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 pt-4">Service Detail Pages</div>

        <Section title="Individual Service Pages" subtitle="Edit tagline, overview, benefits, process steps, and conditions for each service">
          <ServiceDetailEditor data={servicesDetail} onChange={setServicesDetail} />
          <SaveBtn loading={saving === 'services_detail'} onClick={() => save('services_detail', servicesDetail)} />
        </Section>

        {/* ── CAREERS PAGE ──────────────────────────────────────────────── */}
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 pt-4">Careers Page</div>

        <Section title="Compensation & Requirements" subtitle="Rates, perks, and qualifications shown on the Careers page">
          <div className="space-y-4">
            <Field label="Compensation Rates">
              <div className="space-y-2">
                {(employment.compensation || []).map((c, i) => (
                  <div key={i} className="grid sm:grid-cols-2 gap-3">
                    <input className={inputCls} placeholder="Role" value={c.role}
                      onChange={e => { const a = [...employment.compensation]; a[i] = { ...a[i], role: e.target.value }; setEmployment(p => ({ ...p, compensation: a })); }} />
                    <input className={inputCls} placeholder="Rate" value={c.rate}
                      onChange={e => { const a = [...employment.compensation]; a[i] = { ...a[i], rate: e.target.value }; setEmployment(p => ({ ...p, compensation: a })); }} />
                  </div>
                ))}
              </div>
            </Field>
            <Field label="Perks (one per line)">
              <textarea rows={5} className={inputCls}
                value={(employment.perks || []).join('\n')}
                onChange={e => setEmployment(p => ({ ...p, perks: e.target.value.split('\n') }))} />
            </Field>
            <Field label="Requirements (one per line)">
              <textarea rows={5} className={inputCls}
                value={(employment.requirements || []).join('\n')}
                onChange={e => setEmployment(p => ({ ...p, requirements: e.target.value.split('\n') }))} />
            </Field>
          </div>
          <SaveBtn loading={saving === 'employment'} onClick={() => save('employment', employment)} />
        </Section>

        <Section title="Why Choose Neptune (4 Highlight Cards)" subtitle="The four cards under 'Why Therapists Choose Neptune'">
          <div className="space-y-3">
            {(careers.whyCards || []).map((card, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-2">
                <Field label={`Card ${i + 1} Title`}>
                  <input className={inputCls} value={card.title || ''}
                    onChange={e => { const a = [...careers.whyCards]; a[i] = { ...a[i], title: e.target.value }; setCareers(p => ({ ...p, whyCards: a })); }} />
                </Field>
                <Field label="Description">
                  <textarea rows={2} className={inputCls} value={card.desc || ''}
                    onChange={e => { const a = [...careers.whyCards]; a[i] = { ...a[i], desc: e.target.value }; setCareers(p => ({ ...p, whyCards: a })); }} />
                </Field>
              </div>
            ))}
          </div>
          <SaveBtn loading={saving === 'careers'} onClick={() => save('careers', careers)} />
        </Section>

        {/* ── CONTACT PAGE ──────────────────────────────────────────────── */}
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 pt-4">Contact Page</div>

        <Section title="Contact Information">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ['heading',    'Page Heading'],
              ['subheading', 'Page Subheading'],
              ['phone',      'Primary Phone'],
              ['phone2',     'Secondary Phone'],
              ['email',      'Email Address'],
              ['address',    'Address / Location'],
            ].map(([field, label]) => (
              <Field key={field} label={label}>
                <input className={inputCls} value={contactData[field] || ''} onChange={e => setContactData(p => ({ ...p, [field]: e.target.value }))} />
              </Field>
            ))}
          </div>
          <SaveBtn loading={saving === 'contact'} onClick={() => save('contact', contactData)} />
        </Section>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 pt-4">Footer</div>

        <Section title="Footer Text">
          <div className="space-y-4">
            <Field label="Copyright Text">
              <input className={inputCls} value={footer.copyright || ''} onChange={e => setFooter(p => ({ ...p, copyright: e.target.value }))} />
            </Field>
            <Field label="Tagline">
              <input className={inputCls} value={footer.tagline || ''} onChange={e => setFooter(p => ({ ...p, tagline: e.target.value }))} />
            </Field>
          </div>
          <SaveBtn loading={saving === 'footer'} onClick={() => save('footer', footer)} />
        </Section>

      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </AdminLayout>
  );
}
