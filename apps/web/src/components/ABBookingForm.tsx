'use client';

import { useState } from 'react';
import { getBookingFormVariant, trackBookingFormInteraction, trackBookingConversion } from '@/lib/ab-testing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const serviceOptions = [
  { value: 'WEB_DEV', label: 'Web Development' },
  { value: 'MOBILE_APP', label: 'Mobile App Development' },
  { value: 'E_COMMERCE', label: 'E-Commerce' },
  { value: 'ERP', label: 'ERP Solutions' },
  { value: 'SCALING', label: 'System Scaling' },
  { value: 'CONSULTING', label: 'General Consultation' },
];

interface BookingFormVariantProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Single-step booking form variant (A/B test control group)
 * All fields on one page, simpler layout
 */
export function BookingFormSingleStep({ onSubmit, isSubmitting }: BookingFormVariantProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    serviceType: 'WEB_DEV',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackBookingFormInteraction('single_step', 'form_complete');
    await onSubmit(formData);
  };

  return (
    <Card className="p-8 md:p-12">
      <CardHeader>
        <CardTitle>Book a Consultation</CardTitle>
        <CardDescription>
          Schedule a free 30-minute consultation to discuss your project needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className="glass-input w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="email"
                placeholder="john@company.com"
                className="glass-input w-full"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Company (optional)</label>
            <input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Acme Corp"
              className="glass-input w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Service Type</label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
              className="glass-input w-full"
            >
              {serviceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Tell us about your project</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              placeholder="What are you looking to build?"
              className="glass-input w-full"
              required
            />
          </div>
          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full btn-primary">
            {isSubmitting ? 'Sending...' : 'Book Consultation'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-slate-500">
          We'll contact you within 24 hours to confirm your appointment.
        </p>
      </CardFooter>
    </Card>
  );
}

/**
 * Multi-step booking form variant (A/B test treatment group)
 * Fields split across multiple steps with progress indicator
 */
export function BookingFormMultiStep({ onSubmit, isSubmitting }: BookingFormVariantProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    serviceType: 'WEB_DEV',
    message: '',
  });

  const totalSteps = 3;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackBookingFormInteraction('multi_step', 'form_complete');
    await onSubmit(formData);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Full Name</label>
        <input
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="John Doe"
          className="glass-input w-full"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Email</label>
        <input
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          type="email"
          placeholder="john@company.com"
          className="glass-input w-full"
          required
        />
      </div>
      <Button onClick={nextStep} disabled={!formData.fullName || !formData.email} className="btn-primary">
        Next
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Company (optional)</label>
        <input
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Acme Corp"
          className="glass-input w-full"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Service Type</label>
        <select
          value={formData.serviceType}
          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
          className="glass-input w-full"
        >
          {serviceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <Button onClick={prevStep} variant="outline">Back</Button>
        <Button onClick={nextStep} className="btn-primary">Next</Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Tell us about your project</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          placeholder="What are you looking to build?"
          className="glass-input w-full"
          required
        />
      </div>
      <div className="flex justify-between">
        <Button onClick={prevStep} variant="outline">Back</Button>
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Sending...' : 'Book Consultation'}
        </Button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return renderStep1();
    }
  };

  return (
    <Card className="p-8 md:p-12">
      <CardHeader>
        <CardTitle>Book a Consultation</CardTitle>
        <CardDescription>
          Schedule a free 30-minute consultation to discuss your project needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-sky-500' : 'bg-slate-700'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-slate-500">
          Step {step} of {totalSteps} &bull; We'll contact you within 24 hours.
        </p>
      </CardFooter>
    </Card>
  );
}

/**
 * A/B Test Booking Form wrapper
 * Automatically selects variant based on PostHog feature flag
 */
export function ABBookingForm({ onSubmit, isSubmitting }: BookingFormVariantProps) {
  const variant = getBookingFormVariant();

  // Track form start
  const [tracked, setTracked] = useState(false);
  if (!tracked) {
    trackBookingFormInteraction(variant, 'form_start');
    setTracked(true);
  }

  return (
    <div className="max-w-md">
      {variant === 'multi_step' ? (
        <BookingFormMultiStep onSubmit={async (data) => {
          await onSubmit(data);
          trackBookingConversion('multi_step', {
            clientId: data.email, // Using email as client identifier for MVP
            slotId: '', // Would be set by slot selection
            serviceType: data.serviceType,
          });
        }} isSubmitting={isSubmitting} />
      ) : (
        <BookingFormSingleStep onSubmit={async (data) => {
          await onSubmit(data);
          trackBookingConversion('single_step', {
            clientId: data.email,
            slotId: '',
            serviceType: data.serviceType,
          });
        }} isSubmitting={isSubmitting} />
      )}
    </div>
  );
}