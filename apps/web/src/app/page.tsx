import Link from 'next/link';
import { ArrowRight, CheckCircle, Layers, Smartphone, ShieldCheck, Code2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const features = [
    {
      title: 'Web Development',
      description: 'Modern, SEO-optimized websites built with Next.js and Tailwind CSS. Fast loading on any device.',
      icon: Code2,
    },
    {
      title: 'Mobile Apps',
      description: 'Cross-platform mobile applications for iOS and Android. Native performance with shared codebase.',
      icon: Smartphone,
    },
    {
      title: 'E-Commerce',
      description: 'Online stores with payment integration, inventory management, and local payment methods.',
      icon: Layers,
    },
    {
      title: 'ERP Solutions',
      description: 'Enterprise resource planning systems tailored to your business processes and workflows.',
      icon: Layers,
    },
    {
      title: 'System Scaling',
      description: 'Scale your infrastructure to handle growth. Performance optimization and auto-scaling.',
      icon: ShieldCheck,
    },
    {
      title: 'Compliance & Security',
      description: 'GDPR/CCPA compliant systems with JWT auth, AES-256 encryption, and audit logging.',
      icon: CheckCircle,
    },
  ];

  const testimonials = [
    {
      quote: 'The team transformed our local shop into a thriving online store. Sales doubled in 3 months.',
      author: 'Rajesh Kumar',
      role: 'Owner, Textile Shop — Jaipur, India',
    },
    {
      quote: 'Fast MVP delivery exactly when we needed it. Investors loved the prototype.',
      author: 'Sarah Chen',
      role: 'Founder, Tech Startup — San Francisco, USA',
    },
    {
      quote: 'Enterprise-grade security and compliance. Exactly what our European clients require.',
      author: 'Marcus Weber',
      role: 'CTO, Logistics Company — Berlin, Germany',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium mb-8">
              <span className="relative flex h-2 w-2 rounded-full">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Now accepting clients in India, USA & Europe
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              IT Consulting That Scales<span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                With Your Vision
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              From local shops in India to enterprise teams in Europe, we build secure, modern software — fast.
              Web development, mobile apps, e-commerce, ERP, and system scaling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/book">
                  Book a Consultation <ArrowRight size={20} className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white/5 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to digitize and scale your business.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="group hover:border-sky-500/50 transition-colors">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-sky-400 mb-4">
                      <feature.icon size={20} />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-12">Trusted by Growing Businesses</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <Card key={i} className="p-8">
                  <div className="text-sky-400 mb-4">
                    {"\""}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-white">{t.author}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto glass-card p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to start your project?</h2>
            <p className="text-slate-300 mb-8">
              Book a free 30-minute consultation. We\'ll discuss your goals, timeline, and how we can help.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link href="/book">Book a Consultation</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-slate-950 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-sky-500 flex items-center justify-center text-white">
                <Rocket size={16} />
              </div>
              <span className="text-sm font-semibold text-white">Brightpath Ai</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Brightpath Ai IT Consulting & Services. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/gdpr" className="text-xs text-slate-500 hover:text-white transition-colors">
                GDPR
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}