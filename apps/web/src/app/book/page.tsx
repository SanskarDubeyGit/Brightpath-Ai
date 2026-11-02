'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Calendar, Mail, Phone, User, Building2, HelpCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  serviceType: z.enum(['WEB_DEV', 'MOBILE_APP', 'E_COMMERCE', 'ERP', 'SCALING', 'CONSULTING']),
  message: z.string().min(10, 'Please tell us more about your project'),
  consent: z.boolean().refine((val) => val === true, 'You must consent to data processing'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const serviceOptions = [
  { value: 'WEB_DEV', label: 'Web Development' },
  { value: 'MOBILE_APP', label: 'Mobile App Development' },
  { value: 'E_COMMERCE', label: 'E-Commerce' },
  { value: 'ERP', label: 'ERP Solutions' },
  { value: 'SCALING', label: 'System Scaling' },
  { value: 'CONSULTING', label: 'General Consultation' },
];

export default function BookPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      // In production, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Consultation Booked</h1>
            <p className="text-slate-400 mb-8">
              Thank you! We\'ve received your booking request. Our team will contact you within 24 hours to confirm your appointment.
            </p>
            <Link href="/" className="text-sky-400 hover:text-sky-300 transition-colors">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <div className="max-w-md">
              <Card>
                <CardHeader>
                  <CardTitle>Book a Consultation</CardTitle>
                  <CardDescription>
                    Schedule a free 30-minute consultation to discuss your project needs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Full Name
                        </label>
                        <input
                          {...register('fullName')}
                          type="text"
                          placeholder="John Doe"
                          className={cn(
                            'glass-input w-full',
                            errors.fullName && 'border-red-500'
                          )}
                        />
                        {errors.fullName && (
                          <p className="text-xs text-red-400">{errors.fullName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Email
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="john@company.com"
                          className={cn(
                            'glass-input w-full',
                            errors.email && 'border-red-500'
                          )}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-400">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">
                        Company (optional)
                      </label>
                        <input
                          {...register('company')}
                          type="text"
                          placeholder="Acme Corp"
                          className="glass-input w-full"
                        />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">
                        Service Type
                      </label>
                      <select
                        {...register('serviceType')}
                        className="glass-input w-full"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">
                        Tell us about your project
                      </label>
                      <textarea
                        {...register('message')}
                        rows={4}
                        placeholder="What are you looking to build? Any timeline or budget considerations?"
                        className="glass-input w-full"
                      />
                      {errors.message && (
                        <p className="text-xs text-red-400">{errors.message.message}</p>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      <input
                        {...register('consent')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-500"
                      />
                      <label className="text-sm text-slate-400 leading-relaxed">
                        I consent to my data being processed in accordance with the{' '}
                        <a href="/privacy" className="text-sky-400 hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                    {errors.consent && (
                      <p className="text-xs text-red-400">{errors.consent.message}</p>
                    )}
                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Sending...' : 'Book Consultation'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-10">
                <h3 className="text-lg font-semibold text-white mb-6">What to Expect</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-sky-400">
                        {step}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-300">
                          {step === 1 ? 'Initial Call' : step === 2 ? 'Proposal' : 'Kickoff'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {step === 1
                            ? '30-minute discovery call to understand your needs.'
                            : step === 2
                            ? 'Custom proposal with timeline and pricing.'
                            : 'Project kickoff and team introduction.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="text-center p-6">
                  <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center mx-auto mb-4 text-sky-400">
                    {i === 1 ? <Calendar size={20} /> : i === 2 ? <Mail size={20} /> : <Phone size={20} />}
                  </div>
                  <h5 className="font-semibold text-white">{i === 1 ? 'Select Time' : i === 2 ? 'Confirm Details' : 'Join Call'}</h5>
                  <p className="text-xs text-slate-400 mt-2">
                    {i === 1 ? 'Choose from available slots' : i === 2 ? 'Fill in your details' : 'Video call link provided'}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}