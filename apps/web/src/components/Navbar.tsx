'use client';

import * as React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Logo, Rocket, Zap, Code2, Users, Mail, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
              <Rocket size={24} />
            </div>
            <Link href="/" className="text-xl font-bold tracking-tight text-white">
              Brightpath Ai
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link href="/book" className="ml-4">
              <button className="btn-primary">Book a Consultation</button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="text-slate-300 hover:text-white"
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <Link href="/" className="text-xl font-bold tracking-tight text-white">
              Brightpath Ai
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white"
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>
          <div className="px-6 py-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-slate-300 hover:text-white transition-colors block"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/book">
                <button className="btn-primary w-full">Book a Consultation</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}