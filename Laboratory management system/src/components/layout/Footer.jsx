import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Shield,
  Users,
  Award,
  Globe,
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  const [isMounted, setIsMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const footerSections = [
    {
      title: 'Product',
      items: [
        { label: 'Features', href: '#features' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analytics', href: '#analytics' },
        { label: 'Reports', href: '#reports' }
      ]
    },
    {
      title: 'Company',
      items: [
        { label: 'About Us', href: '#about' },
        { label: 'Careers', href: '#careers' },
        { label: 'Blog', href: '#blog' },
        { label: 'Press', href: '#press' }
      ]
    },
    {
      title: 'Resources',
      items: [
        { label: 'Documentation', href: '#docs' },
        { label: 'API Reference', href: '#api' },
        { label: 'Support', href: '#contact' },
        { label: 'Status', href: '#status' }
      ]
    },
    {
      title: 'Legal',
      items: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'HIPAA Compliance', href: '#hipaa' },
        { label: 'Security', href: '#security' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Laboratories' },
    { icon: Shield, value: '99.9%', label: 'Uptime' },
    { icon: Award, value: 'HIPAA', label: 'Compliant' },
    { icon: Globe, value: '50+', label: 'Countries' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <footer className="relative bg-gray-950 text-gray-300 overflow-hidden border-t border-gray-900">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[50%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary-900/5 blur-3xl" />
        <div className="absolute -bottom-[50%] -right-[20%] w-[70%] h-[70%] rounded-full bg-primary-900/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top Section: Brand & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 border-b border-gray-800/50 pb-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0 w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center border border-primary-500/20">
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 animate-spin border-2 border-primary-500 border-t-transparent rounded-full" />
                  </div>
                )}
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=120&q=80"
                  alt="Linos Logo"
                  className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                    } ${imageError ? 'hidden' : ''}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                {imageError && <Shield className="w-5 h-5 text-primary-500" />}
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Linos LMS</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Advanced Laboratory Management System designed for modern healthcare facilities.
              Streamlining operations with precision and care.
            </p>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center gap-1 group"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Stats & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary-500/60" />
                  <span className="font-medium text-gray-300">{stat.value}</span>
                  <span className="hidden sm:inline text-gray-600">•</span>
                  <span className="hidden sm:inline">{stat.label}</span>
                </div>
              );
            })}
          </div>
          <div className="text-center md:text-right">
            © {new Date().getFullYear()} Linos LMS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}