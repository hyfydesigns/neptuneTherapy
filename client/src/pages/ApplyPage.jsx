import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import api from '../lib/api';
import SEO from '../components/SEO';

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const INITIAL = {
  first_name: '', last_name: '', email: '', phone: '',
  address: '', city: '', state: 'TX', zip: '',
  id_type: 'Driver\'s License', position: '', years_experience: '', qualification: '',
  coverage_area: '', ref1_name: '', ref1_contact: '', ref2_name: '', ref2_contact: '',
};

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';

export default function ApplyPage() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/applications', form);
      setStatus({ type: 'success', msg: data.message });
      setForm(INITIAL);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.error || 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (status?.type === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
          <p className="text-gray-600 mb-8">{status.msg}</p>
          <a href="/" className="inline-block bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Apply Now — Join Our Team"
        description="Apply to join Neptune Therapy's network of independent therapists in Texas. Open positions for Physical Therapists (PT), Occupational Therapists (OT), and Speech-Language Pathologists (SLP). Earn $70–$100 per visit with a flexible schedule."
        path="/apply"
      />

      <section className="relative overflow-hidden bg-blue-950 text-white">
        <img
          src="/images/nurse-patient.jpg"
          alt="Healthcare professional with patient"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Employment Application</h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto">
            Join our network of independent therapists across Texas. Fill out the form below to get started.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {status?.type === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="First Name" required>
                  <input name="first_name" value={form.first_name} onChange={set} required className={inputCls} placeholder="First name" />
                </Field>
                <Field label="Last Name" required>
                  <input name="last_name" value={form.last_name} onChange={set} required className={inputCls} placeholder="Last name" />
                </Field>
                <Field label="Email Address" required>
                  <input name="email" type="email" value={form.email} onChange={set} required className={inputCls} placeholder="you@email.com" />
                </Field>
                <Field label="Phone Number" required>
                  <input name="phone" value={form.phone} onChange={set} required className={inputCls} placeholder="(555) 000-0000" />
                </Field>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Address</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Field label="Street Address">
                    <input name="address" value={form.address} onChange={set} className={inputCls} placeholder="123 Main St" />
                  </Field>
                </div>
                <Field label="City">
                  <input name="city" value={form.city} onChange={set} className={inputCls} placeholder="City" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="State">
                    <select name="state" value={form.state} onChange={set} className={inputCls}>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="ZIP">
                    <input name="zip" value={form.zip} onChange={set} className={inputCls} placeholder="12345" />
                  </Field>
                </div>
              </div>
            </div>

            {/* Professional */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Professional Information</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Form of Identification">
                  <select name="id_type" value={form.id_type} onChange={set} className={inputCls}>
                    <option>Driver's License</option>
                    <option>State ID</option>
                    <option>Passport</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Position / Discipline" required>
                  <select name="position" value={form.position} onChange={set} required className={inputCls}>
                    <option value="">Select position...</option>
                    <option>Physical Therapist (PT)</option>
                    <option>Physical Therapist Assistant (PTA)</option>
                    <option>Occupational Therapist (OT)</option>
                    <option>Occupational Therapy Assistant (COTA)</option>
                    <option>Speech-Language Pathologist (SLP)</option>
                  </select>
                </Field>
                <Field label="Years of Experience">
                  <select name="years_experience" value={form.years_experience} onChange={set} className={inputCls}>
                    <option value="">Select...</option>
                    <option>Less than 1 year</option>
                    <option>1–2 years</option>
                    <option>3–5 years</option>
                    <option>6–10 years</option>
                    <option>10+ years</option>
                  </select>
                </Field>
                <Field label="Highest Qualification">
                  <select name="qualification" value={form.qualification} onChange={set} className={inputCls}>
                    <option value="">Select...</option>
                    <option>Associate's Degree</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>Doctorate (DPT/OTD/PhD)</option>
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Area of Coverage (Zip Codes)">
                    <input
                      name="coverage_area"
                      value={form.coverage_area}
                      onChange={set}
                      className={inputCls}
                      placeholder="e.g. 77001, 77002, 77003"
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* References */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">References</h2>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 text-sm font-semibold text-gray-700">Reference 1</div>
                  <Field label="Name">
                    <input name="ref1_name" value={form.ref1_name} onChange={set} className={inputCls} placeholder="Full name" />
                  </Field>
                  <Field label="Phone / Email">
                    <input name="ref1_contact" value={form.ref1_contact} onChange={set} className={inputCls} placeholder="Contact info" />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 text-sm font-semibold text-gray-700">Reference 2</div>
                  <Field label="Name">
                    <input name="ref2_name" value={form.ref2_name} onChange={set} className={inputCls} placeholder="Full name" />
                  </Field>
                  <Field label="Phone / Email">
                    <input name="ref2_contact" value={form.ref2_contact} onChange={set} className={inputCls} placeholder="Contact info" />
                  </Field>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-colors text-base"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
