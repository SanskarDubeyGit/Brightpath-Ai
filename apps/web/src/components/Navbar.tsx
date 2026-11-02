'use client';

import * as React from 'react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Mail, Linkedin, PlaySquare, Phone, ChevronRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Case Studies', href: '#case-studies' },
  { name: 'Contact', href: '#contact' },
];

const socialLinks = [
  { name: 'YouTube', href: 'https://youtube.com/@brightpathai', icon: PlaySquare, external: true },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/brightpath-ai', icon: Linkedin, external: true },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0% -60% 0%',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            setActiveSection('#' + id);
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string, external: boolean = false) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brand-dark text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-7">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1">
              <Mail size={12} />
              <a href="mailto:[YOUR EMAIL]" className="hover:text-brand-lime transition-colors">
                [YOUR EMAIL]
              </a>
            </span>
            <span className="flex items-center gap-1">
              <Phone size={12} />
              <a href="tel:[YOUR PHONE NUMBER]" className="hover:text-brand-lime transition-colors">
                [YOUR PHONE NUMBER]
              </a>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:text-brand-lime transition-colors flex items-center gap-1"
              >
                <s.icon size={12} />
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        ref={navRef}
        className={`sticky top-[7px] z-40 bg-white/95 backdrop-blur-md border-b border-brand-cream/50 transition-all duration-300 ${
          isOpen ? 'bg-white' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-brand-lime flex items-center justify-center text-brand-dark shadow-lg shadow-brand-lime/25">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <Link href="#home" className="text-xl font-heading font-bold tracking-tight text-brand-dark">
                Brightpath Ai
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`nav-link ${activeSection === link.href ? 'active' : ''}`}
                  aria-current={activeSection === link.href ? 'page' : undefined}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="#book">Book a Consultation</Link>
              </Button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-xl text-brand-dark hover:bg-brand-dark/5 transition-colors"
                aria-label="Open menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-brand-cream/50">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`block px-4 py-3 rounded-xl text-brand-dark font-medium transition-colors ${
                    activeSection === link.href ? 'bg-brand-dark/5 text-brand-lime' : ''
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-brand-cream/50">
                <a
                  href="#book"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#book');
                  }}
                  className="block px-4 py-3 text-center rounded-xl bg-brand-lime text-brand-dark font-semibold hover:bg-brand-limeDark transition-colors"
                >
                  Book a Consultation
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'button';
    const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    const variants = {
      primary: 'bg-brand-lime text-brand-dark hover:bg-brand-limeDark hover:scale-105 active:scale-95',
      outline: 'border border-brand-dark/20 bg-transparent text-brand-dark hover:bg-brand-dark/5',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <Comp
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';