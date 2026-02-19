import { useState, useEffect, useRef, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const SECTION_IDS = ['header', 'form'];
/** Viewport vertical position used to decide active section (0.25 = 25% from top). */
const ACTIVE_ANCHOR = 0.25;

function VenueIcon({ className = 'w-5 h-5 shrink-0' }) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      aria-hidden
    >
      <path
        fill="#FD003A"
        d="M256,0C156.698,0,76,80.7,76,180c0,33.6,9.302,66.301,27.001,94.501l140.797,230.414 c2.402,3.9,6.002,6.301,10.203,6.901c5.698,0.899,12.001-1.5,15.3-7.2l141.2-232.516C427.299,244.501,436,212.401,436,180 C436,80.7,355.302,0,256,0z M256,270c-50.398,0-90-40.8-90-90c0-49.501,40.499-90,90-90s90,40.499,90,90 C346,228.9,306.999,270,256,270z"
      />
      <path
        fill="#E50027"
        d="M256,0v90c49.501,0,90,40.499,90,90c0,48.9-39.001,90-90,90v241.991 c5.119,0.119,10.383-2.335,13.3-7.375L410.5,272.1c16.799-27.599,25.5-59.699,25.5-92.1C436,80.7,355.302,0,256,0z"
      />
    </svg>
  );
}

function DateIcon({ className = 'w-5 h-5 shrink-0' }) {
  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path fill="#eae8e8" d="m455.667 53.932h-48.039v-21.452c0-10.923-11.5-19.48-26.17-19.48-14.691 0-26.2 8.557-26.2 19.48v21.452h-73.058v-21.452c0-10.923-11.51-19.48-26.2-19.48s-26.2 8.557-26.2 19.48v21.452h-73.032v-21.452c0-10.923-11.507-19.48-26.2-19.48s-26.2 8.557-26.2 19.48v21.452h-48.007a31.817 31.817 0 0 0 -31.782 31.781v381.505a31.819 31.819 0 0 0 31.782 31.782h399.306a31.8 31.8 0 0 0 31.754-31.782v-381.505a31.8 31.8 0 0 0 -31.754-31.781zm-84.407-21.332c.49-1.05 4.17-3.6 10.2-3.6 6.012 0 9.682 2.554 10.17 3.6v21.332h-20.37zm-125.46.009c.5-1.053 4.184-3.609 10.2-3.609s9.7 2.556 10.2 3.609v21.323h-20.4zm-125.43 0c.5-1.053 4.183-3.609 10.2-3.609s9.7 2.556 10.2 3.609v21.323h-20.4z" />
      <path fill="#484868" d="m238.12 205.162v35.914a8 8 0 0 1 -8 8h-40.7a8 8 0 0 1 -8-8v-35.914a8 8 0 0 1 8-8h40.7a8 8 0 0 1 8 8zm84.464-8h-40.7a8 8 0 0 0 -8 8v35.914a8 8 0 0 0 8 8h40.7a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8zm-184.9 87.871h-40.732a8 8 0 0 0 -8 8v35.914a8 8 0 0 0 8 8h40.733a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8zm92.435 0h-40.7a8 8 0 0 0 -8 8v35.914a8 8 0 0 0 8 8h40.7a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -7.999-8zm92.464 0h-40.7a8 8 0 0 0 -8 8v35.914a8 8 0 0 0 8 8h40.7a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -7.999-8zm-184.9 87.9h-40.731a8 8 0 0 0 -8 8v35.885a8 8 0 0 0 8 8h40.733a8 8 0 0 0 8-8v-35.884a8 8 0 0 0 -8-8zm92.435 0h-40.7a8 8 0 0 0 -8 8v35.885a8 8 0 0 0 8 8h40.7a8 8 0 0 0 8-8v-35.884a8 8 0 0 0 -7.998-8zm-92.433-175.771h-40.733a8 8 0 0 0 -8 8v35.914a8 8 0 0 0 8 8h40.733a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8zm277.363 87.871h-40.7a8 8 0 0 0 -8 8v35.914a8 8 0 0 0 8 8h40.7a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8zm-92.464 87.9h-40.7a8 8 0 0 0 -8 8v35.885a8 8 0 0 0 8 8h40.7a8 8 0 0 0 8-8v-35.884a8 8 0 0 0 -8-8z" />
      <g fill="#3d3d54">
        <path d="m137.685 197.162h-10a8 8 0 0 1 8 8v35.914a8 8 0 0 1 -8 8h10a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8z" />
        <path d="m230.12 372.934h-10a8 8 0 0 1 8 8v35.885a8 8 0 0 1 -8 8h10a8 8 0 0 0 8-8v-35.885a8 8 0 0 0 -8-8z" />
        <path d="m230.12 285.033h-10a8 8 0 0 1 8 8v35.914a8 8 0 0 1 -8 8h10a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8z" />
        <path d="m137.685 372.934h-10a8 8 0 0 1 8 8v35.885a8 8 0 0 1 -8 8h10a8 8 0 0 0 8-8v-35.885a8 8 0 0 0 -8-8z" />
        <path d="m137.685 285.033h-10a8 8 0 0 1 8 8v35.914a8 8 0 0 1 -8 8h10a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8z" />
        <path d="m322.584 372.934h-10a8 8 0 0 1 8 8v35.885a8 8 0 0 1 -8 8h10a8 8 0 0 0 8-8v-35.885a8 8 0 0 0 -8-8z" />
        <path d="m322.584 197.162h-10a8 8 0 0 1 8 8v35.914a8 8 0 0 1 -8 8h10a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8z" />
        <path d="m230.12 197.162h-10a8 8 0 0 1 8 8v35.914a8 8 0 0 1 -8 8h10a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8z" />
        <path d="m415.048 285.033h-10a8 8 0 0 1 8 8v35.914a8 8 0 0 1 -8 8h10a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8z" />
        <path d="m322.584 285.033h-10a8 8 0 0 1 8 8v35.914a8 8 0 0 1 -8 8h10a8 8 0 0 0 8-8v-35.914a8 8 0 0 0 -8-8z" />
      </g>
      <path fill="#d22e2e" d="m389.649 246.78a8 8 0 0 1 -5.632-2.318l-16.44-16.3a8 8 0 0 1 11.265-11.362l10.3 10.208 20.939-24.721a8 8 0 0 1 12.209 10.342l-26.532 31.322a8 8 0 0 1 -5.758 2.821c-.119.005-.235.008-.351.008z" />
      <path fill="#d1c9c9" d="m417.446 473.242a8 8 0 0 1 -5.658 2.345h-355.427a31.819 31.819 0 0 1 -31.782-31.782v23.413a31.819 31.819 0 0 0 31.782 31.782h399.306a31.8 31.8 0 0 0 31.754-31.782v-67.293a8 8 0 0 1 -2.342 5.655z" />
      <path fill="#bcb3b3" d="m487.421 399.925v-1.049h-60.48a16 16 0 0 0 -16 16v60.711h.847a8 8 0 0 0 5.658-2.345l67.633-67.662a8 8 0 0 0 2.342-5.655z" />
      <path fill="#d22e2e" d="m455.667 53.932h-84.407v30.282c.47 1.05 4.138 3.619 10.2 3.619a8 8 0 0 1 0 16c-14.691 0-26.2-8.569-26.2-19.509v-30.392h-109.46v30.276c.478 1.054 4.151 3.625 10.2 3.625a8 8 0 0 1 0 16c-14.691 0-26.2-8.569-26.2-19.509v-30.392h-109.428v30.276c.478 1.054 4.151 3.625 10.2 3.625a8 8 0 0 1 0 16c-14.69 0-26.2-8.569-26.2-19.509v-30.392h-48.011a31.817 31.817 0 0 0 -31.782 31.781v68.207h462.842v-68.207a31.8 31.8 0 0 0 -31.754-31.781z" />
      <path fill="#d1c9c9" d="m24.579 153.92h462.842v12.492h-462.842z" />
      <path fill="#484868" d="m264 95.833a8 8 0 0 1 -8 8c-14.691 0-26.2-8.569-26.2-19.509v-51.844c0-10.923 11.509-19.48 26.2-19.48s26.2 8.557 26.2 19.48v21.452h-16v-21.323c-.5-1.053-4.185-3.609-10.2-3.609s-9.7 2.556-10.2 3.609v51.6c.478 1.054 4.151 3.625 10.2 3.625a8 8 0 0 1 8 7.999zm-133.43-8c-6.047 0-9.72-2.571-10.2-3.625v-51.6c.5-1.053 4.183-3.609 10.2-3.609s9.7 2.556 10.2 3.609v21.324h16v-21.452c0-10.923-11.507-19.48-26.2-19.48s-26.2 8.557-26.2 19.48v51.844c0 10.94 11.508 19.509 26.2 19.509a8 8 0 0 0 0-16zm250.888 0c-6.06 0-9.728-2.569-10.2-3.619v-51.614c.49-1.05 4.17-3.6 10.2-3.6 6.012 0 9.682 2.554 10.17 3.6v21.332h16v-21.452c0-10.923-11.5-19.48-26.17-19.48-14.691 0-26.2 8.557-26.2 19.48v51.844c0 10.94 11.507 19.509 26.2 19.509a8 8 0 0 0 0-16z" />
      <path fill="#ad1e1e" d="m130.62 80.834a14.926 14.926 0 0 0 -9.949 3.8c1.068 1.194 4.553 3.2 9.9 3.2a8 8 0 0 1 0 16 33.375 33.375 0 0 1 -14.062-2.966 14.992 14.992 0 1 0 14.111-20.034z" />
      <path fill="#ad1e1e" d="m256 80.834a14.925 14.925 0 0 0 -9.921 3.771c1.039 1.191 4.535 3.228 9.921 3.228a8 8 0 0 1 0 16 33.362 33.362 0 0 1 -14.123-2.994 14.992 14.992 0 1 0 14.123-20z" />
      <path fill="#ad1e1e" d="m381.444 80.834a14.921 14.921 0 0 0 -9.916 3.767c1.023 1.186 4.519 3.232 9.93 3.232a8 8 0 0 1 0 16 33.357 33.357 0 0 1 -14.14-3 14.992 14.992 0 1 0 14.126-20z" />
    </svg>
  );
}

function TimeIcon({ className = 'w-5 h-5 shrink-0' }) {
  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <g>
        <g>
          <path fill="#ff5876" d="m512 256c0-3.11-.056-6.208-.165-9.291-4.891-137.081-117.56-246.709-255.835-246.709s-250.944 109.628-255.834 246.709c-.11 3.083-.166 6.181-.166 9.291 0 141.385 131.502 246.71 256 246.71 126.754 0 256-105.325 256-246.71z" />
          <path fill="#e6485d" d="m256 493.419c-138.273 0-250.922-109.631-255.814-246.71-.111 3.086-.186 6.179-.186 9.291 0 141.385 114.615 256 256 256s256-114.615 256-256c0-3.112-.075-6.205-.185-9.29-4.893 137.079-117.542 246.709-255.815 246.709z" />
          <path fill="#e4eef9" d="m469.419 246.709c-4.864-113.667-98.554-204.327-213.419-204.327s-208.555 90.66-213.419 204.327c-.132 3.081-.001 209.321 213.419 209.321s213.551-206.24 213.419-209.321z" />
          <path fill="#d5e0f2" d="m256 451.037c-114.864 0-208.539-90.662-213.405-204.328-.132 3.082-.213 6.176-.213 9.29 0 117.978 95.64 213.618 213.618 213.618s213.618-95.639 213.618-213.617c0-3.114-.082-6.209-.213-9.29-4.866 113.666-98.541 204.327-213.405 204.327z" />
          <path fill="#405b6c" d="m333.595 181.05c-6.089-6.005-15.893-5.938-21.897.15l-36.334 36.837 3.651 17.537 16.972 5.654 37.759-38.281c6.004-6.088 5.937-15.892-.151-21.897z" />
          <path fill="#405b6c" d="m234.082 219.447-82.402-73.432c-6.385-5.69-16.172-5.126-21.861 1.259-5.689 6.384-5.126 16.172 1.259 21.861l84.025 74.878 17.509-5.84z" />
          <path fill="#86dcff" d="m365.636 355.837c-1.758 0-3.524-.595-4.976-1.814l-98.073-82.378c-3.273-2.75-3.699-7.634-.949-10.907 2.75-3.275 7.633-3.7 10.908-.949l98.073 82.379c3.273 2.75 3.699 7.634.949 10.907-1.531 1.823-3.724 2.762-5.932 2.762z" />
          <path fill="#2d4456" d="m215.103 244.013 14.46 12.886 18.57-6.31-1.007-19.519-13.043-11.623c-9.075 5.453-15.944 14.19-18.98 24.566z" />
          <path fill="#2d4456" d="m275.363 218.038-12.294 12.464v24.466h19.366l13.552-13.739c-3.724-10.076-11.151-18.349-20.624-23.191z" />
          <path fill="#ff5876" d="m280.783 246.708c-3.762-10.03-13.439-17.169-24.783-17.169s-21.021 7.139-24.783 17.169c-1.084 2.891-.072 26.462 24.783 26.462s25.867-23.571 24.783-26.462z" />
          <path fill="#e6485d" d="m256 263.88c-11.344 0-21.017-7.14-24.779-17.17-1.085 2.891-1.682 6.02-1.682 9.29 0 14.614 11.847 26.46 26.46 26.46 14.614 0 26.46-11.847 26.46-26.46 0-3.27-.597-6.399-1.681-9.29-3.761 10.029-13.434 17.17-24.778 17.17z" />
        </g>
        <g fill="#405b6c">
          <path d="m263.757 93.573v-24.027c0-4.284-3.473-7.757-7.757-7.757s-7.757 3.473-7.757 7.757v24.027c0 4.284 3.472 7.757 7.757 7.757s7.757-3.473 7.757-7.757z" />
          <path d="m248.243 418.427v24.027c0 4.284 3.472 7.757 7.757 7.757s7.757-3.473 7.757-7.757v-24.027c0-4.284-3.473-7.757-7.757-7.757s-7.757 3.473-7.757 7.757z" />
          <path d="m442.454 263.757c4.285 0 7.757-3.473 7.757-7.757s-3.473-7.757-7.757-7.757h-24.027c-4.284 0-7.757 3.473-7.757 7.757s3.473 7.757 7.757 7.757z" />
          <path d="m69.546 248.243c-4.285 0-7.757 3.473-7.757 7.757s3.472 7.757 7.757 7.757h24.027c4.285 0 7.757-3.473 7.757-7.757s-3.473-7.757-7.757-7.757z" />
        </g>
      </g>
    </svg>
  );
}

const EVENT_DETAILS = [
  { icon: <VenueIcon />, label: 'Venue', value: 'Gospel Pillars Church Toronto, 2220 Midland Ave, Unit 106BR, Toronto, ON M1P 3E6' },
  { icon: <DateIcon />, label: 'Date', value: 'Sunday, 22nd February 2026' },
  { icon: <TimeIcon />, label: 'Time', value: '10:00 AM (EST)' },
];

const JACKET_SIZES = ['XXL', 'XL', 'L', 'M', 'S', 'XS'];

const WELFARE_OPTS = [
  'Yes, Please notify me by text (SMS)',
  'Yes, Please notify me by email',
  "No, I don't want to be notified",
];

const FORM_STEPS = [
  { id: 'memberOrVisitor', label: 'Are you a Member or Visitor', type: 'radio', options: ['Member', 'Visitor'] },
  { id: 'fullName', label: 'Full Name', type: 'text' },
  { id: 'phone', label: 'Phone number', type: 'tel' },
  { id: 'email', label: 'Email Address', type: 'email' },
  { id: 'location', label: 'Location (City or Area)', type: 'text' },
  { id: 'gender', label: 'Gender', type: 'radio', options: ['Male', 'Female'] },
  { id: 'age', label: 'Age (18 & Above)', type: 'text', inputMode: 'numeric' },
  { id: 'jacketSize', label: 'Jacket size', type: 'select', options: JACKET_SIZES },
  { id: 'welfareUpdates', label: 'Would you like to receive updates about future welfare programs?', type: 'radio', options: WELFARE_OPTS },
];

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  email: '',
  location: '',
  gender: '',
  age: '',
  jacketSize: '',
  memberOrVisitor: '',
  welfareUpdates: '',
};

export default function RegistrationForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [activeSection, setActiveSection] = useState('header');
  const [submitting, setSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [stepError, setStepError] = useState(null);
  const formRef = useRef(null);
  const rafRef = useRef(null);

  const totalSteps = FORM_STEPS.length;
  const isFirstStep = formStep === 0;
  const isLastStep = formStep === totalSteps - 1;
  const currentStepConfig = FORM_STEPS[formStep];

  const goNext = () => {
    setStepError(null);
    if (currentStepConfig.id === 'age') {
      const ageNum = parseInt(String(form.age ?? '').trim(), 10);
      if (isNaN(ageNum) || ageNum < 18) {
        setStepError('Please age must be at least 18');
        return;
      }
    }
    if (formStep < totalSteps - 1) setFormStep((s) => s + 1);
  };
  const goBack = () => {
    setStepError(null);
    if (formStep > 0) setFormStep((s) => s - 1);
  };

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
    if (form.memberOrVisitor === 'Member') {
      toast.error('Kindly reach out to your pastor for a separate link');
      return false;
    }
    const required = ['fullName', 'phone', 'email', 'location', 'gender', 'age', 'jacketSize', 'memberOrVisitor', 'welfareUpdates'];
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
    const ageNum = parseInt(form.age.trim(), 10);
    if (isNaN(ageNum) || ageNum < 18) {
      toast.error('Please age must be at least 18');
      document.getElementById('age')?.focus?.();
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
      let data = {};
      try {
        const raw = await res.text();
        if (raw && raw.trim()) data = JSON.parse(raw);
      } catch {
        data = {};
      }
      if (!res.ok || data.ok === false) {
        const msg = data.error || (res.status ? `Registration failed (${res.status}). Please try again.` : 'Registration failed. Please try again.');
        const friendlyMsg = /google script|GOOGLE_SCRIPT|not configured|not fully set up|unexpected response/i.test(msg)
          ? 'Registration is being set up. Please try again later or contact Gospel Pillars Church.'
          : msg;
        toast.error(friendlyMsg);
        return;
      }
      toast.success('Registration submitted successfully. We look forward to seeing you!');
      setForm(INITIAL_FORM);
      setFormStep(0);
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

      {/* Sticky nav - logo left, section buttons right */}
      <nav className="sticky top-0 z-50 glass no-print border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <a href="#header" className="shrink-0" aria-label="Gospel Pillars home">
            <img
              src="/logo2.jpeg"
              alt="Gospel Pillars"
              className="h-10 w-10 rounded-full object-cover border border-gray-200/80 dark:border-gray-600"
            />
          </a>
          <div className="flex items-center gap-2">
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
                src="/logo1.jpeg"
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
                <strong>50 Free Spring Jackets & Accessories</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Kindly register to receive yours by completing the form below.
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">Please Note;</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>The items will be given to the first 50 adult persons to register.</strong>
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
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Question {formStep + 1} of {totalSteps}
            </p>
            <Card className="p-6 min-h-[200px] flex flex-col">
              <label className="block text-base font-semibold text-gray-900 dark:text-white mb-4">
                {currentStepConfig.label} <span className="text-red-500">*</span>
              </label>

              {currentStepConfig.type === 'radio' && (
                <div className="space-y-3 flex-1">
                  {currentStepConfig.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20">
                      <input
                        type="radio"
                        name={currentStepConfig.id}
                        value={opt}
                        checked={form[currentStepConfig.id] === opt}
                        onChange={() => {
                          update(currentStepConfig.id, opt);
                          if (currentStepConfig.id === 'memberOrVisitor') {
                            if (opt === 'Member') {
                              setStepError('Kindly reach out to your pastor for a separate link');
                              return;
                            }
                            setStepError(null);
                          }
                          if (!isLastStep) goNext();
                        }}
                        className="text-brand-600 border-gray-300 focus:ring-brand-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentStepConfig.type === 'select' && (
                <select
                  id={currentStepConfig.id}
                  value={form[currentStepConfig.id]}
                  onChange={(e) => {
                    update(currentStepConfig.id, e.target.value);
                    if (!isLastStep) goNext();
                  }}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:border-brand-500 focus:ring-0 py-3 text-gray-900 dark:text-white form-select rounded-none text-base"
                >
                  <option value="">Select option</option>
                  {currentStepConfig.options.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              )}

              {(currentStepConfig.type === 'text' || currentStepConfig.type === 'tel' || currentStepConfig.type === 'email') && (
                <div className="flex-1 flex flex-col gap-4">
                  <input
                    id={currentStepConfig.id}
                    type={currentStepConfig.type}
                    inputMode={currentStepConfig.inputMode || 'text'}
                    value={form[currentStepConfig.id]}
                    onChange={(e) => {
                      update(currentStepConfig.id, e.target.value);
                      if (currentStepConfig.id === 'age') setStepError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (String(form[currentStepConfig.id] ?? '').trim()) goNext();
                      }
                    }}
                    placeholder="Your answer"
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:border-brand-500 focus:ring-0 py-3 text-gray-900 dark:text-white placeholder-gray-400 form-input rounded-none text-base"
                    autoFocus
                  />
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={!String(form[currentStepConfig.id] ?? '').trim()}
                    size="lg"
                  >
                    Next
                  </Button>
                </div>
              )}
              {stepError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-4 text-left" role="alert">
                  {stepError}
                </p>
              )}
            </Card>

            <CardFooter className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                {!isFirstStep && (
                  <Button type="button" variant="outline" size="lg" onClick={goBack}>
                    Back
                  </Button>
                )}
                {isLastStep && (
                  <Button type="submit" size="lg" disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit'}
                  </Button>
                )}
              </div>
              <button
                type="button"
                onClick={() => { setForm(INITIAL_FORM); setFormStep(0); toast('Form cleared.'); }}
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
