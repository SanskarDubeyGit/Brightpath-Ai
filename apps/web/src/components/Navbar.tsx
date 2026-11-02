'use client';

import * as React from 'react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, Linkedin, PlaySquare, Menu, X, ChevronRight } from 'lucide-react';

const ANNOUNCEMENT_TEXT = 'Now accepting orders from the USA, Europe & Asia Pacific';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Case Studies', href: '#case-studies' },
  { name: 'Team', href: '#team' },
  { name: 'Contact', href: '#contact' },
];

const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/brajkishore-dubey-84099a42/', icon: Linkedin, external: true },
  { name: 'YouTube', href: '[YOUR YOUTUBE URL]', icon: PlaySquare, external: true },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-140px 0% -70% 0%',
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

    document.querySelectorAll('section[id]').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (href: string, external: boolean = false) => {
      if (external) {
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      }
      setIsOpen(false);
      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = 132; // announcement strip (28px) + navbar (64px) + buffer
        const targetPosition =
          element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    },
    []
  );

  return (
    <>
      {/* Announcement strip */}
      <div className="announcement">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-7">
          {ANNOUNCEMENT_TEXT}
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`sticky top-[28px] z-40 bg-white/95 backdrop-blur-md border-b border-brand-cream/50 transition-all duration-300 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-brand-lime flex items-center justify-center text-brand-dark shadow-lg shadow-brand-lime/25">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <Link href="#home" onClick={(e) => handleNavClick('#home')} className="text-xl font-heading font-bold tracking-tight text-brand-dark">
                Brightpath Ai
              </Link>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.href)}
                  className={`nav-link ${activeSection === link.href ? 'bg-brand-dark/5 text-brand-lime' : ''}`}
                  aria-current={activeSection === link.href ? 'page' : undefined}
                >
                  {link.name}
                </a>
              ))}
              <a
                href={socialLinks[1].href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="nav-link flex items-center gap-1"
              >
                <PlaySquare size={14} /> YouTube
              </a>
            </div>

            {/* Actions + mobile toggle */}
            <div className="flex items-center gap-3">
              <a
                href="#contact"
                onClick={(e) => handleNavClick('#contact')}
                className="btn-primary text-xs md:text-sm px-4 py-2"
              >
                Book a Consultation
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-xl text-brand-dark hover:bg-brand-dark/5 transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-brand-cream/50">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.href)}
                  className={`block px-4 py-3 rounded-xl text-brand-dark font-medium transition-colors ${
                    activeSection === link.href ? 'bg-brand-dark/5 text-brand-lime' : ''
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href={socialLinks[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 rounded-xl text-brand-dark font-medium transition-colors flex items-center gap-2"
              >
                <PlaySquare size={16} /> YouTube
              </a>
              <div className="pt-4 border-t border-brand-cream/50">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick('#contact')}
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