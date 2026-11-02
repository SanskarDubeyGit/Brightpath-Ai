import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ArrowRight, Mail, Linkedin, PlaySquare, Phone, MapPin, ChevronRight } from 'lucide-react';

const services = [
  {
    title: 'Web Development',
    description: 'Modern, SEO-optimized websites built for speed and scale.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'lime',
  },
  {
    title: 'Mobile Apps',
    description: 'Cross-platform mobile applications for iOS and Android.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'dark',
  },
  {
    title: 'E-Commerce',
    description: 'Online stores with payment integration and inventory management.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'white',
  },
  {
    title: 'ERP Solutions',
    description: 'Enterprise resource planning tailored to your business workflows.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'white',
  },
  {
    title: 'System Scaling',
    description: 'Infrastructure that grows with you — performance and auto-scaling.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'white',
  },
  {
    title: 'Compliance & Security',
    description: 'GDPR/CCPA compliant, AES-256 encryption, and audit logging.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88ca6?w=800&q=80',
    alt: 'E-commerce dashboard showing sales analytics',
  },
  {
    title: 'MVP for US Startup',
    result: 'Launched in 8 weeks, seed funded',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    alt: 'Startup team reviewing code on laptops',
  },
  {
    title: 'ERP System for European Logistics',
    result: '40% reduction in processing time',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    alt: 'Modern office dashboard on multiple monitors',
  },
];

const skillTags = ['Web', 'Apps', 'ERP', 'Security', 'Cloud'];

const stats = [
  { label: 'Projects Delivered', value: '50+' },
  { label: 'Average Rating', value: '4.9' },
  { label: 'Years Experience', value: '8+' },
];

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-dark">
      <Navbar />

      <main className="flex-1 relative overflow-hidden">
        {/* Hero Section */}
        <section id="home" className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 lg:order-1 animate-fade-in">
                <div className="badge-rating flex items-center gap-1 w-fit">
                  <span className="w-2 h-2 rounded-full bg-brand-dark"></span>
                  4.9 ★ Client Rating
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-tight mb-4">
                  IT Consulting That Scales<span className="block text-brand-lime">With Your Vision</span>
                </h1>
                <p className="text-lg text-brand-dark/70 max-w-xl leading-relaxed mb-6 text-balance">
                  We help startups and local businesses in the US and Europe launch fast,
                  modern MVPs and scale securely. From first line of code to production
                  deployment — we\'ve got you covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="#book">
                      Book a Consultation <ChevronRight size={18} />
                    </Link>
                  </Button>
                  <a href="tel:[YOUR PHONE NUMBER]" className="btn-outline w-full sm:w-auto flex items-center justify-center gap-2 text-center">
                    <Phone size={18} />
                    [YOUR PHONE NUMBER]
                  </a>
                </div>
              </div>

              <div className="order-1 lg:order-2 relative group animate-slide-up">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
                    alt="Smiling consulting team working together with laptops in modern office"
                    width={900}
                    height={700}
                    className="rounded-3xl object-cover w-full h-[500px] object-center shadow-2xl shadow-brand-dark/20 relative z-10"
                    priority
                  />
                  <div className="absolute -right-6 -bottom-6 bg-brand-lime text-brand-dark px-4 py-2 rounded-2xl font-bold text-sm shadow-lg shadow-brand-lime/30 z-20 flex items-center gap-2">
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
          <div className="max-w-7xl mx-auto page-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="flex gap-4">
                  <Image
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80"
                    alt="Developer working on laptop with code on screen"
                    width={400}
                    height={400}
                    className="rounded-2xl object-cover w-full h-[400px] object-center shadow-lg shadow-brand-dark/10"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&q=80"
                    alt="Modern office workspace with plants and natural light"
                    width={300}
                    height={300}
                    className="mt-8 rounded-2xl object-cover w-full h-[300px] object-center shadow-lg shadow-brand-dark/10 -translate-x-8"
                  />
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

              <div className="space-y-6">
                <div className="badge-rating inline-block mb-2">Who we are</div>
                <h2 className="text-3xl font-heading font-bold mb-4">Built for startups and growing businesses</h2>
                <p className="text-brand-dark/70 text-lg leading-relaxed mb-6">
                  We partner with ambitious founders and local business owners across the
                  United States and Europe to turn ideas into production-ready software.
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
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section">
          <div className="max-w-7xl mx-auto page-container">
            <div className="text-center mb-16">
              <div className="badge-rating inline-block mb-4">What we build</div>
              <h2 className="text-3xl font-heading font-bold mb-4">Services</h2>
              <p className="text-brand-dark/60 max-w-2xl mx-auto">Everything you need to digitize and grow your business.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service, i) => {
                const isLime = i === 0;
                const isDark = i === 1;
                const baseClasses =
                  'rounded-3xl p-8 transition-all duration-300 border border-brand-cream/50 hover:shadow-xl shadow-brand-dark/5 group';
                const cardClasses =
                  isLime
                    ? `${baseClasses} bg-brand-lime text-brand-dark border-brand-lime/30`
                    : isDark
                      ? `${baseClasses} bg-brand-dark text-white border-brand-dark`
                      : `${baseClasses} bg-white`;

                return (
                  <Card key={i} className={cardClasses}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                      isLime ? 'bg-brand-dark' : isDark ? 'bg-brand-lime' : 'bg-brand-cream'
                    } ${
                      isLime ? 'text-brand-dark' : isDark ? 'text-brand-dark' : 'text-brand-dark'
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
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section id="case-studies" className="section bg-brand-cream">
          <div className="max-w-7xl mx-auto page-container">
            <div className="text-center mb-16">
              <div className="badge-rating inline-block mb-4">Our work</div>
              <h2 className="text-3xl font-heading font-bold mb-4">Case Studies</h2>
              <p className="text-brand-dark/60 max-w-2xl mx-auto">Real results for real businesses.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {caseStudies.map((study) => (
                <Card key={study.title} className="overflow-hidden">
                  <Image
                    src={study.image}
                    alt={study.alt}
                    width={400}
                    height={300}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-brand-dark mb-2">{study.title}</h3>
                    <p className="text-brand-dark/60 text-sm mb-4">{study.result}</p>
                    <a href="#" className="flex items-center gap-1 text-brand-lime font-semibold text-sm hover:underline">
                      Read more <ChevronRight size={16} />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Booking Section */}
        <section id="contact" className="section">
          <div className="max-w-7xl mx-auto page-container">
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
                      <a href="tel:[YOUR PHONE NUMBER]" className="text-brand-lime hover:underline">
                        [YOUR PHONE NUMBER]
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-lime/20 flex items-center justify-center text-brand-dark flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark">Email</p>
                      <a href="mailto:[YOUR EMAIL]" className="text-brand-lime hover:underline">
                        [YOUR EMAIL]
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-lime/20 flex items-center justify-center text-brand-dark flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark">Location</p>
                      <p className="text-brand-dark/60">[YOUR CITY], [YOUR COUNTRY]</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 md:p-12">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-dark">Full Name</label>
                      <input type="text" placeholder="John Doe" className="glass-input w-full" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-dark">Email</label>
                      <input type="email" placeholder="john@company.com" className="glass-input w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-dark">Company</label>
                    <input type="text" placeholder="Acme Corp" className="glass-input w-full" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-dark">Message</label>
                    <textarea rows={4} placeholder="Tell us about your project" className="glass-input w-full"></textarea>
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-brand-forest/30 mt-auto">
        <div className="max-w-7xl mx-auto page-container py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-brand-lime flex items-center justify-center text-brand-dark">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg font-heading font-bold text-white">Brightpath Ai</span>
              </div>
              <p className="text-brand-dark/40 text-sm leading-relaxed max-w-xs">
                Helping startups and local businesses in the US and Europe build
                secure, modern software — fast.
              </p>
              <div className="mt-6 flex gap-4">
                <a
                  href="[YOUR LINKEDIN URL]"
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
                    <a href="tel:[YOUR PHONE NUMBER]" className="text-sm font-medium text-white hover:text-brand-lime transition-colors">
                      [YOUR PHONE NUMBER]
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-brand-lime mt-0.5" />
                  <div>
                    <p className="text-sm text-brand-dark/40">Email</p>
                    <a href="mailto:[YOUR EMAIL]" className="text-sm font-medium text-white hover:text-brand-lime transition-colors">
                      [YOUR EMAIL]
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

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl p-6 border border-brand-cream/50 shadow-sm transition-all duration-300 hover:shadow-xl shadow-brand-dark/5 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) {
  return (
    <button className={`inline-flex items-center justify-center gap-2 bg-brand-lime text-brand-dark px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:bg-brand-limeDark hover:scale-105 active:scale-95 ${className}`} {...props}>
      {children}
    </button>
  );
}