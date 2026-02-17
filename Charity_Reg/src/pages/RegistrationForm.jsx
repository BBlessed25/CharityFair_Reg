import { useState, useEffect, useRef, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const SECTION_IDS = ['header', 'form'];
/** Viewport vertical position used to decide active section (0.25 = 25% from top). */
const ACTIVE_ANCHOR = 0.25;

const EVENT_DETAILS = [
  { icon: '📍', label: 'Venue', value: 'Gospel Pillars Church Toronto, 2220 Midland Ave, Unit 106BR, Toronto, ON M1P 3E6' },
  { icon: '🗓️', label: 'Date', value: 'Sunday, 22nd February 2026' },
  { icon: '🕙', label: 'Time', value: '10:00 AM (EST)' },
];

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  email: '',
  location: '',
  gender: '',
  age: '',
  memberOrVisitor: '',
  welfareUpdates: '',
};

export default function RegistrationForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [activeSection, setActiveSection] = useState('header');
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const rafRef = useRef(null);

  const updateActiveSectionFromScroll = useCallback(() => {
    const anchorY = window.innerHeight * ACTIVE_ANCHOR;
    let next = null;
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= anchorY && rect.bottom >= anchorY) {
        next = id;
        break;
      }
    }
    if (next === null) {
      const headerEl = document.getElementById('header');
      const formEl = document.getElementById('form');
      if (headerEl && formEl) {
        const headerTop = headerEl.getBoundingClientRect().top;
        const formTop = formEl.getBoundingClientRect().top;
        next = Math.abs(headerTop - anchorY) <= Math.abs(formTop - anchorY) ? 'header' : 'form';
      }
    }
    setActiveSection((prev) => (next !== null ? next : prev));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateActiveSectionFromScroll();
        rafRef.current = null;
      });
    };
    updateActiveSectionFromScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateActiveSectionFromScroll]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const required = ['fullName', 'phone', 'email', 'location', 'gender', 'age', 'memberOrVisitor', 'welfareUpdates'];
    for (const key of required) {
      if (!String(form[key] ?? '').trim()) {
        toast.error(`Please fill in ${key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}`);
        document.getElementById(key)?.focus?.();
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/.netlify/functions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        toast.error(data.error || 'Registration failed. Please try again.');
        return;
      }
      toast.success('Registration submitted successfully. We look forward to seeing you!');
      setForm(INITIAL_FORM);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setForm(INITIAL_FORM);
    toast('Form cleared.');
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white dark:from-gray-900 dark:to-gray-900">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      {/* Sticky nav - section detection */}
      <nav className="sticky top-0 z-50 glass no-print border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-center gap-4">
          {SECTION_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className={cn(
                'capitalize text-sm font-medium px-4 py-2 rounded-lg transition-colors',
                activeSection === id
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300'
              )}
            >
              {id === 'header' ? 'Event info' : 'Registration form'}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-16">
        {/* Header section */}
        <section
          id="header"
          className="scroll-mt-20 animate-fade-in opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <Card className="overflow-visible">
            <CardHeader className="text-center">
              <img
                src="/logo.jpeg"
                alt="Gospel Pillars"
                className="mx-auto w-24 h-24 rounded-full object-cover shadow-medium border-2 border-brand-100 dark:border-brand-800"
              />
              <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Charity Fair Registration Form
              </h1>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                On Sunday 22nd February 2026, Gospel Pillars Church Toronto will be giving out{' '}
                <strong>free groceries, food items and clothing.</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Kindly register to receive yours by completing the form below.
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">Please Note;</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Registration closes on Friday, 20th February 2026 at 6:00pm EST.</strong>
                </li>
                <li>
                  <strong>Items will be given only to those who are physically present.</strong>
                </li>
              </ul>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="space-y-3">
                {EVENT_DETAILS.map(({ icon, label, value }) => (
                  <p key={label} className="flex gap-2 text-gray-700 dark:text-gray-300">
                    <span aria-hidden>{icon}</span>
                    <span>
                      <strong>{label}:</strong> {value}
                    </span>
                  </p>
                ))}
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">* Indicates required question</p>
            </CardContent>
          </Card>
        </section>

        {/* Form section */}
        <section
          id="form"
          className="mt-8 scroll-mt-20 animate-slide-up opacity-0"
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {[
              { id: 'fullName', label: 'Full Name', type: 'text', required: true },
              { id: 'phone', label: 'Phone number', type: 'tel', required: true },
              { id: 'email', label: 'Email Address', type: 'email', required: true },
              { id: 'location', label: 'Location (City or Area)', type: 'text', required: true },
            ].map(({ id, label, type, required }) => (
              <Card key={id} className="p-5">
                <label htmlFor={id} className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={id}
                  type={type}
                  value={form[id]}
                  onChange={(e) => update(id, e.target.value)}
                  placeholder="Your answer"
                  className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-gray-600 focus:border-brand-500 focus:ring-0 py-2 text-gray-900 dark:text-white placeholder-gray-400 form-input rounded-none"
                  required={required}
                />
              </Card>
            ))}

            <Card className="p-5">
              <span className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Gender <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2">
                {['Male', 'Female'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={opt}
                      checked={form.gender === opt}
                      onChange={() => update('gender', opt)}
                      className="text-brand-600 border-gray-300 focus:ring-brand-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                  </label>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <label htmlFor="age" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                id="age"
                type="text"
                inputMode="numeric"
                value={form.age}
                onChange={(e) => update('age', e.target.value)}
                placeholder="Your answer"
                className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-gray-600 focus:border-brand-500 focus:ring-0 py-2 text-gray-900 dark:text-white placeholder-gray-400 form-input rounded-none"
                required
              />
            </Card>

            <Card className="p-5">
              <span className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Are you a Member or Visitor <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2">
                {['Member', 'Visitor'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="memberOrVisitor"
                      value={opt}
                      checked={form.memberOrVisitor === opt}
                      onChange={() => update('memberOrVisitor', opt)}
                      className="text-brand-600 border-gray-300 focus:ring-brand-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                  </label>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <span className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Would you like to receive updates about future welfare programs? <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2">
                {[
                  'Yes, Please notify me by text (SMS)',
                  'Yes, Please notify me by email',
                  "No, I don't want to be notified",
                ].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="welfareUpdates"
                      value={opt}
                      checked={form.welfareUpdates === opt}
                      onChange={() => update('welfareUpdates', opt)}
                      className="text-brand-600 border-gray-300 focus:ring-brand-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                  </label>
                ))}
              </div>
            </Card>

            <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit'}
              </Button>
              <button
                type="button"
                onClick={handleClear}
                className="text-brand-600 dark:text-brand-400 hover:underline font-medium text-sm"
              >
                Clear form
              </button>
            </CardFooter>
          </form>
        </section>
      </main>
    </div>
  );
}
