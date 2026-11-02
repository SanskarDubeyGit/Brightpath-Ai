import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ArrowRight, Mail, Linkedin, PlaySquare, Phone, MapPin, ChevronRight } from 'lucide-react';
import { teamMembers } from '@/lib/team';

const services = [
  {
    title: 'Web Development',
    description: 'Modern, SEO-optimized websites built for speed and scale.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'lime',
  },
  {
    title: 'Mobile Apps',
    description: 'Cross-platform mobile applications for iOS and Android.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'dark',
  },
  {
    title: 'E-Commerce',
    description: 'Online stores with payment integration and inventory management.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'white',
  },
  {
    title: 'ERP Solutions',
    description: 'Enterprise resource planning tailored to your business workflows.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'white',
  },
  {
    title: 'System Scaling',
    description: 'Infrastructure that grows with you — performance and auto-scaling.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'white',
  },
  {
    title: 'Compliance & Security',
    description: 'GDPR/CCPA compliant, AES-256 encryption, and audit logging.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'white',
  },
];

const caseStudies = [
  {
    title: 'E-Commerce Platform for Local Retailer',
    result: '2.3x sales increase in 6 months',
  },
  {
    title: 'MVP for US Startup',
    result: 'Launched in 8 weeks, seed funded',
  },
  {
    title: 'ERP System for European Logistics',
    result: '40% reduction in processing time',
  },
];

const skillTags = ['Web', 'Apps', 'ERP', 'Security', 'Cloud'];

const stats = [
  { label: 'Projects Delivered', value: '50+' },
  { label: 'Average Rating', value: '4.9' },
  { label: 'Years Experience', value: '8+' },
];

// SVG illustration for hero (clean, no external image dependency)
const HeroIllustration = () => (
  <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#04302B" />
        <stop offset="100%" stopColor="#0B5B49" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" rx="40" fill="url(#heroGrad)" />
    <!-- Laptop -->
    <rect x="280" y="180" width="260" height="180" rx="12" fill="#ffffff" />
    <rect x="300" y="200" width="220" height="120" rx="4" fill="#ECEBDD" />
    <rect x="340" y="240" width="140" height="60" rx="2" fill="#B6F06B" />
    <rect x="340" y="320" width="120" height="4" fill="#0B5B49" />
    <!-- Person left -->
    <circle cx="180" cy="320" r="40" fill="#04302B" />
    <rect x="150" y="340" width="60" height="120" rx="4" fill="#0B5B49" />
    <!-- Person right -->
    <circle cx="580" cy="320" r="40" fill="#0B5B49" />
    <rect x="550" y="340" width="60" height="120" rx="4" fill="#04302B" />
    <!-- Decorative circles -->
    <circle cx="100" cy="100" r="60" fill="#B6F06B" opacity="0.1" />
    <circle cx="700" cy="500" r="80" fill="#B6F06B" opacity="0.1" />
    <circle cx="150" cy="450" r="40" fill="#0B5B49" opacity="0.2" />
  </svg>
);

// SVG placeholder for case studies
const CaseStudyIllustration = ({ title }: { title: string }) => (
  <svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="250" rx="12" fill="#ECEBDD" />
    <rect x="40" y="40" width="120" height="40" rx="4" fill="#04302B" opacity="0.3" />
    <rect x="40" y="100" width="200" height="8" rx="4" fill="#0B5B49" opacity="0.3" />
    <rect x="40" y="120" width="140" height="8" rx="4" fill="#0B5B49" opacity="0.3" />
    <rect x="240" y="160" width="100" height="8" rx="4" fill="#B6F06B" opacity="0.5" />
    <text x="200" y="140" fontFamily="Inter, sans-serif" fontSize="14" fill="#04302B" textAnchor="middle">{title}</text>
  </svg>
);

export default function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('idle');
    setFormError('');

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-dark">
      <Navbar />

      <main className="flex-1 relative overflow-hidden">
        {/* Hero Section */}
        <section id="home" className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <div className="badge-rating flex items-center gap-1 w-fit">
                  <span className="w-2 h-2 rounded-full bg-brand-dark"></span>
                  4.9 ★ Client Rating
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-tight mb-4">
                  IT Consulting That Scales<span className="block text-brand-lime">With Your Vision</span>
                </h1>
                <p className="text-lg text-brand-dark/70 max-w-xl leading-relaxed mb-6 text-balance">
                  We help startups and local businesses in the USA, Europe, and Asia Pacific launch
                  fast, modern MVPs and scale securely. From first line of code to production
                  deployment — we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#contact" className="btn-primary w-full sm:w-auto">
                    Book a Consultation <ArrowRight size={18} />
                  </a>
                  <a href="tel:+1999999999" className="btn-outline w-full sm:w-auto flex items-center justify-center gap-2 text-center">
                    <Phone size={18} />
                    +1999999999
                  </a>
                </div>
              </div>

              <div className="order-1 lg:order-2 relative group">
                <div className="relative w-full h-[500px] flex items-center justify-center">
                  <HeroIllustration />
                  <div className="absolute -right-4 -bottom-4 bg-brand-lime text-brand-dark px-4 py-2 rounded-2xl font-bold text-sm shadow-lg shadow-brand-lime/30 z-20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-dark"></span>
                    4.9 ★
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section bg-brand-cream">
          <div className="page-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="badge-rating inline-block">Who we are</div>
                <h2 className="text-3xl font-heading font-bold mb-4">Built for startups and growing businesses</h2>
                <p className="text-brand-dark/70 text-lg leading-relaxed mb-6">
                  We partner with ambitious founders and local business owners across the United
                  States, Europe, and Asia Pacific to turn ideas into production-ready software.
                  Whether you need your first MVP or a secure enterprise platform, our team
                  delivers with speed, clarity, and craft.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {stats.map((stat) => (
                    <div key={stat.label} className="glass-card p-4">
                      <p className="text-2xl font-heading font-bold text-brand-dark">{stat.value}</p>
                      <p className="text-xs text-brand-dark/60 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillTags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full border border-brand-forest/30 bg-white text-brand-dark text-xs font-medium hover:bg-brand-dark/5 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-[300px] h-[300px] rounded-2xl bg-brand-dark/5 flex items-center justify-center border border-brand-forest/20 shadow-lg shadow-brand-dark/10">
                      <div className="w-24 h-24 rounded-full bg-brand-lime flex items-center justify-center text-brand-dark text-2xl font-bold">
                        BD
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-brand-lime flex items-center justify-center text-brand-dark shadow-lg">
                      SD
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-3xl p-4 shadow-xl border border-brand-cream flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-lime/20 flex items-center justify-center text-brand-dark">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-dark">Brightpath Ai Team</p>
                    <p className="text-xs text-brand-dark/60">US & Europe based</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section">
          <div className="page-container">
            <div className="section-head">
              <div className="badge-rating">What we build</div>
              <h2>Services</h2>
              <p>Everything you need to digitize and grow your business.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service, i) => {
                const isLime = i === 0;
                const isDark = i === 1;
                const baseClasses =
                  'rounded-3xl p-8 transition-all duration-300 border border-brand-cream/50 hover:shadow-xl shadow-brand-dark/5 group flex flex-col';
                const cardClasses =
                  isLime
                    ? `${baseClasses} bg-brand-lime text-brand-dark border-brand-lime/30`
                    : isDark
                      ? `${baseClasses} bg-brand-dark text-white border-brand-dark`
                      : `${baseClasses} bg-white`;

                return (
                  <div key={i} className={cardClasses}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                      isLime ? 'bg-brand-dark' : isDark ? 'bg-brand-lime' : 'bg-brand-cream'
                    }`}>
                    {service.icon}
                    </div>
                    <h3 className="font-heading font-semibold text-brand-dark mb-3 group-hover:text-brand-lime transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-brand-dark/60 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-brand-dark">Explore more</span>
                      <ChevronRight size={16} className="text-brand-dark" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section id="case-studies" className="section bg-brand-cream">
          <div className="page-container">
            <div className="section-head">
              <div className="badge-rating">Our work</div>
              <h2>Case Studies</h2>
              <p>Real results for real businesses.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {caseStudies.map((study) => (
                <div key={study.title} className="glass-card overflow-hidden flex flex-col">
                  <div className="h-[250px] bg-brand-cream flex items-center justify-center relative overflow-hidden">
                    <CaseStudyIllustration title={study.title} />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-heading font-semibold text-brand-dark mb-2">{study.title}</h3>
                    <p className="text-brand-dark/60 text-sm mb-4">{study.result}</p>
                    <a href="#" className="flex items-center gap-1 text-brand-lime font-semibold text-sm hover:underline">
                      Read more <ChevronRight size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="section">
          <div className="page-container">
            <div className="section-head">
              <div className="badge-rating">Meet our team</div>
              <h2>The people behind Brightpath Ai</h2>
              <p>Experienced professionals dedicated to building secure, modern software.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div key={member.name} className="glass-card p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-lime flex items-center justify-center text-brand-dark text-2xl font-bold mx-auto mb-4 shadow-lg shadow-brand-lime/20">
                    {member.initials}
                  </div>
                  <h3 className="font-heading font-semibold text-brand-dark mb-1">{member.name}</h3>
                  <p className="text-brand-lime text-sm font-medium mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-brand-dark/60 text-xs mb-4">{member.bio}</p>
                  )}
                  {member.hasLinkedIn && member.linkedIn ? (
                    <a href={member.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-dark text-sm font-medium hover:text-brand-lime transition-colors">
                      LinkedIn <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 2.487-1.55 4.616-1.55 4.237 0 5.018 3.716 5.018 7.962v8.391zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.018H3.555V9h3.562v11.431zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.21 24 24 23.227 24 22.272V1.729C24 .774 23.21 0 22.225 0zM12 2.04c2.614 0 4.742 2.114 4.742 4.722 0 2.6-2.128 4.722-4.742 4.722-2.614 0-4.742-2.122-4.742-4.722C7.258 4.154 9.386 2.04 12 2.04z" /></svg>
                    </a>
                  ) : (
                    <p className="text-brand-dark/40 text-xs italic mb-4">Placeholder member — replace with real photo</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Booking Section */}
        <section id="contact" className="section">
          <div className="page-container">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="badge-rating inline-block">Get in touch</div>
                <h2 className="text-3xl font-heading font-bold mb-4">Book a Consultation</h2>
                <p className="text-brand-dark/60 text-lg leading-relaxed mb-6">
                  Have a project in mind? Let\'s talk about how we can help you build it.
                  Fill out the form and we\'ll respond within one business day.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-lime/20 flex items-center justify-center text-brand-dark flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark">Phone</p>
                      <a href="tel:+1999999999" className="text-brand-lime hover:underline">
                        +1999999999
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-lime/20 flex items-center justify-center text-brand-dark flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark">Email</p>
                      <a href="mailto:brightpathai@gmail.com" className="text-brand-lime hover:underline">
                        brightpathai@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 md:p-12">
                <form id="consultationForm" onSubmit={handleSubmit} className="space-y-4">
                  {formStatus === 'success' && (
                    <div className="p-4 bg-brand-lime/10 border border-brand-lime/20 rounded-xl text-brand-dark text-sm font-medium">
                      Thank you! We\'ve received your message and will contact you within one business day.
                    </div>
                  )}
                  {formError && (
                    <div className="p-4 bg-red-50/50 border border-red-500/20 rounded-xl text-red-800 text-sm font-medium">
                      {formError}
                    </div>
                  )}
                  {!formStatus && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-brand-dark">Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            placeholder="John Doe"
                            className="glass-input w-full"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-brand-dark">Email</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="john@company.com"
                            className="glass-input w-full"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-dark">Company</label>
                        <input
                          type="text"
                          name="company"
                          placeholder="Acme Corp"
                          className="glass-input w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-dark">Service Type</label>
                        <select name="serviceType" className="glass-input w-full">
                          <option value="">Select a service</option>
                          {services.map((s) => (
                            <option key={s.title} value={s.title}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-dark">Message</label>
                        <textarea
                          name="message"
                          rows={4}
                          placeholder="Tell us about your project"
                          className="glass-input w-full"
                          required
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-brand-forest/30 mt-auto">
        <div className="page-container py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-brand-lime flex items-center justify-center text-brand-dark">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg font-heading font-bold text-white">Brightpath Ai</span>
              </div>
              <p className="text-brand-dark/40 text-sm leading-relaxed max-w-xs">
                Helping startups and local businesses in the USA, Europe, and Asia Pacific build
                secure, modern software — fast.
              </p>
              <div className="mt-6 flex gap-4">
                <a
                  href="https://www.linkedin.com/in/brajkishore-dubey-84099a42/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-brand-dark/50 flex items-center justify-center text-brand-dark/60 hover:text-brand-lime hover:bg-brand-dark/30 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="[YOUR YOUTUBE URL]"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-brand-dark/50 flex items-center justify-center text-brand-dark/60 hover:text-brand-lime hover:bg-brand-dark/30 transition-colors"
                >
                  <PlaySquare size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-brand-dark/40 hover:text-brand-lime transition-colors text-sm">Home</a></li>
                <li><a href="#about" className="text-brand-dark/40 hover:text-brand-lime transition-colors text-sm">About</a></li>
                <li><a href="#services" className="text-brand-dark/40 hover:text-brand-lime transition-colors text-sm">Services</a></li>
                <li><a href="#case-studies" className="text-brand-dark/40 hover:text-brand-lime transition-colors text-sm">Case Studies</a></li>
                <li><a href="#team" className="text-brand-dark/40 hover:text-brand-lime transition-colors text-sm">Team</a></li>
                <li><a href="#contact" className="text-brand-dark/40 hover:text-brand-lime transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-6">Services</h4>
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s.title}>
                    <a href="#services" className="text-brand-dark/40 hover:text-brand-lime transition-colors text-sm">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone size={16} className="text-brand-lime mt-0.5" />
                  <div>
                    <p className="text-sm text-brand-dark/40">Phone</p>
                    <a href="tel:+1999999999" className="text-sm font-medium text-white hover:text-brand-lime transition-colors">
                      +1999999999
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-brand-lime mt-0.5" />
                  <div>
                    <p className="text-sm text-brand-dark/40">Email</p>
                    <a href="mailto:brightpathai@gmail.com" className="text-sm font-medium text-white hover:text-brand-lime transition-colors">
                      brightpathai@gmail.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-brand-forest/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-brand-dark/50">
              © {new Date().getFullYear()} Brightpath Ai IT Consulting & Services. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs">
              <a href="#" className="text-brand-dark/40 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-brand-dark/40 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-brand-dark/40 hover:text-white transition-colors">GDPR</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}