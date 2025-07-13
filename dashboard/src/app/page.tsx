'use client';
import React, { useEffect, useCallback } from 'react';

// Data for UI components
const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#dashboards', label: 'Dashboards' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

const heroStats = [
    { icon: 'fa-store', value: '500+', label: 'Active Stores' },
    { icon: 'fa-box', value: '1M+', label: 'Products Managed' },
    { icon: 'fa-server', value: '99.9%', label: 'Uptime' },
];

const features = [
  {
    icon: 'fa-chart-bar',
    title: 'Advanced Analytics',
    description: 'Real-time business insights with interactive charts, KPI tracking, and performance metrics to drive data-driven decisions.',
    color: 'blue',
  },
  {
    icon: 'fa-boxes',
    title: 'Inventory Management',
    description: 'Smart inventory tracking with low-stock alerts, automated reordering, and category-based optimization.',
    color: 'blue',
    popular: true,
  },
  {
    icon: 'fa-route',
    title: 'Delivery Optimization',
    description: 'AI-powered route planning, real-time tracking, and fleet management for efficient last-mile delivery.',
    color: 'yellow',
  },
  {
    icon: 'fa-users',
    title: 'Multi-Role Dashboard',
    description: 'Tailored interfaces for customers, suppliers, and store managers with role-specific features and permissions.',
    color: 'blue',
  },
  {
    icon: 'fa-brain',
    title: 'AI-Powered Forecasting',
    description: 'Machine learning algorithms for demand prediction, supply optimization, and trend analysis.',
    color: 'yellow',
  },
  {
    icon: 'fa-mobile-alt',
    title: 'Mobile-First Design',
    description: 'Responsive design that works seamlessly across desktop, tablet, and mobile devices for on-the-go management.',
    color: 'blue',
  },
];

const dashboards = [
  {
    title: 'Customer Dashboard',
    description: 'Seamless shopping experience',
    icon: 'fa-shopping-cart',
    color: 'blue',
    features: [
      { icon: 'fa-search', text: 'Product Discovery & Search' },
      { icon: 'fa-shopping-bag', text: 'Smart Shopping Cart' },
      { icon: 'fa-credit-card', text: 'Secure Checkout Process' },
      { icon: 'fa-truck', text: 'Order Tracking' },
      { icon: 'fa-comments', text: 'AI Chat Support' },
    ],
  },
  {
    title: 'Supplier Dashboard',
    description: 'Streamlined supply management',
    icon: 'fa-industry',
    color: 'yellow',
    features: [
      { icon: 'fa-plus-circle', text: 'Product Management' },
      { icon: 'fa-clipboard-list', text: 'Order Processing' },
      { icon: 'fa-map-marked-alt', text: 'Supply Route Optimization' },
      { icon: 'fa-bell', text: 'Smart Alerts & Notifications' },
      { icon: 'fa-handshake', text: 'Store Communication' },
    ],
  },
  {
    title: 'Store Dashboard',
    description: 'Complete store operations',
    icon: 'fa-store',
    color: 'blue',
    features: [
      { icon: 'fa-chart-line', text: 'Business Insights & Analytics' },
      { icon: 'fa-warehouse', text: 'Inventory Management' },
      { icon: 'fa-shipping-fast', text: 'Fleet & Delivery Tracking' },
      { icon: 'fa-chart-line', text: 'Demand Forecasting' },
      { icon: 'fa-cogs', text: 'Supplier Coordination' },
    ],
  },
];

const performanceStats = [
    { icon: 'fa-server', value: '99.9%', label: 'Uptime Reliability' },
    { icon: 'fa-chart-line', value: '35%', label: 'Cost Reduction' },
    { icon: 'fa-shipping-fast', value: '50%', label: 'Faster Delivery' },
    { icon: 'fa-clock', value: '24/7', label: 'Real-time Monitoring' },
];

const footerLinks = [
    {
        title: 'Quick Links',
        icon: 'fa-link',
        links: [
            { href: '#features', label: 'Features', icon: 'fa-chevron-right' },
            { href: '#dashboards', label: 'Dashboards', icon: 'fa-chevron-right' },
            { href: 'dashboard/', label: 'Launch App', icon: 'fa-chevron-right' },
            { href: '#about', label: 'About', icon: 'fa-chevron-right' },
        ],
    },
    {
        title: 'Support',
        icon: 'fa-life-ring',
        links: [
            { href: '#', label: 'Documentation', icon: 'fa-book' },
            { href: '#', label: 'API Reference', icon: 'fa-code' },
            { href: '#', label: 'Help Center', icon: 'fa-question-circle' },
            { href: '#', label: 'Contact Support', icon: 'fa-headset' },
        ],
    },
    {
        title: 'Connect',
        icon: 'fa-globe',
        links: [
            { href: '#', label: 'GitHub', icon: 'fa-github' },
            { href: '#', label: 'LinkedIn', icon: 'fa-linkedin' },
            { href: '#', label: 'Twitter', icon: 'fa-twitter' },
            { href: '#', label: 'Email', icon: 'fa-envelope' },
        ],
    },
];

const socialLinks = [
    { href: '#', icon: 'fab fa-github' },
    { href: '#', icon: 'fab fa-linkedin' },
    { href: '#', icon: 'fab fa-twitter' },
    { href: '#', icon: 'fas fa-envelope' },
];

interface ObserverOptions {
  threshold: number;
  rootMargin: string;
}

export default function Home() {
  const animateCounter = useCallback((element: HTMLElement, target: number): void => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      const displayValue = Math.floor(current);
      const targetString = target.toString();

      if (targetString.includes('%')) {
        element.textContent = `${displayValue}%`;
      } else if (targetString.includes('/')) {
        element.textContent = targetString;
      } else {
        element.textContent = displayValue.toString();
      }
    }, 20);
  }, []);

  const handleSmoothScroll = useCallback((e: Event): void => {
    e.preventDefault();
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute('href');
    if (href) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, []);

  const handleScroll = useCallback((): void => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content') as HTMLElement;
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, []);

  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    const observerOptions: ObserverOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statItems = entry.target.querySelectorAll('.stat-number');
          statItems.forEach(item => {
            const text = (item as HTMLElement).textContent || '';
            const number = parseFloat(text);
            if (!isNaN(number)) {
              (item as HTMLElement).textContent = '0';
              animateCounter(item as HTMLElement, number);
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll);
      });
      observer.disconnect();
      statsObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleSmoothScroll, handleScroll, animateCounter]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 transition-all duration-300">
        <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <i className="fas fa-chart-line text-3xl text-blue-600" aria-hidden="true"></i>
            <span className="text-xl font-bold text-gray-900">Walmart FlowState</span>
          </div>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <li key={link.href}>
                <a href={link.href} className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a href="dashboard/" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <span>Launch Dashboard</span>
            <i className="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </nav>
      </header>

      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-yellow-400 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 opacity-20">
            <i className="fas fa-cogs text-white text-9xl animate-spin-slow" aria-hidden="true"></i>
          </div>
          <div className="absolute top-3/5 right-1/4 w-48 h-48 opacity-20">
            <i className="fas fa-chart-network text-white text-6xl animate-pulse" aria-hidden="true"></i>
          </div>
          <div className="absolute bottom-1/4 left-3/4 w-36 h-36 opacity-20">
            <i className="fas fa-shipping-fast text-white text-5xl animate-bounce" aria-hidden="true"></i>
          </div>
        </div>

        <div className="hero-content relative z-10 text-center text-white max-w-4xl px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium mb-8">
            <i className="fas fa-robot text-yellow-300 text-lg" aria-hidden="true"></i>
            <span>AI-Powered Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Walmart FlowState
          </h1>

          <p className="text-xl md:text-2xl font-semibold mb-4 opacity-90">
            Intelligent Supply Chain Management & Retail Optimization Platform
          </p>

          <p className="text-lg md:text-xl opacity-80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Revolutionize your retail operations with AI-powered insights, real-time tracking, and seamless integration across suppliers, stores, and customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="dashboard/" className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <i className="fas fa-rocket" aria-hidden="true"></i>
              <span>Get Started</span>
            </a>
            <a href="#features" className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300">
              <span>Learn More</span>
              <i className="fas fa-chevron-down" aria-hidden="true"></i>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12">
            {heroStats.map(stat => (
                <div key={stat.label} className="text-center">
                    <div className="mb-2">
                        <i className={`fas ${stat.icon} text-2xl text-blue-200 mb-2`} aria-hidden="true"></i>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-4">
              <i className="fas fa-star" aria-hidden="true"></i>
              <span>Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Supply Chain Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to optimize your retail operations in one powerful platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(feature => (
              <div key={feature.title} className={`animate-on-scroll group bg-white p-8 rounded-2xl shadow-lg border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${feature.popular ? 'bg-blue-50 border-2 border-blue-200' : 'border-gray-100'}`}>
                {feature.popular && (
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <i className={`fas ${feature.icon} text-6xl text-${feature.color}-600 mb-4`} aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-center">{feature.description}</p>
                <div className={`flex items-center justify-center gap-2 text-${feature.color}-600 font-semibold cursor-pointer group-hover:gap-3 transition-all`}>
                  <span>Learn more</span>
                  <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50" id="dashboards">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-4">
              <i className="fas fa-desktop" aria-hidden="true"></i>
              <span>Dashboards</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Integrated Dashboard Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized interfaces designed for different user roles and business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dashboards.map(dashboard => (
              <div key={dashboard.title} className="animate-on-scroll bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="p-8 text-center border-b border-gray-100">
                  <i className={`fas ${dashboard.icon} text-6xl text-${dashboard.color}-600 mb-4`} aria-hidden="true"></i>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{dashboard.title}</h3>
                  <p className="text-gray-600">{dashboard.description}</p>
                </div>
                <div className="p-8">
                  <ul className="space-y-4">
                    {dashboard.features.map(feature => (
                      <li key={feature.text} className="flex items-center gap-3">
                        <i className={`fas ${feature.icon} text-${dashboard.color}-600`} aria-hidden="true"></i>
                        <span className="text-gray-700">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section py-24 bg-gradient-to-br from-blue-500 via-blue-600 to-yellow-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <i className="fas fa-chart-line text-white text-8xl animate-pulse" aria-hidden="true"></i>
          </div>
          <div className="absolute top-20 right-20">
            <i className="fas fa-cogs text-white text-6xl animate-spin-slow" aria-hidden="true"></i>
          </div>
          <div className="absolute bottom-20 left-20">
            <i className="fas fa-shipping-fast text-white text-7xl animate-bounce" aria-hidden="true"></i>
          </div>
          <div className="absolute bottom-10 right-10">
            <i className="fas fa-store text-white text-5xl animate-pulse" aria-hidden="true"></i>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-semibold mb-4">
              <i className="fas fa-trophy" aria-hidden="true"></i>
              <span>Performance</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Platform Performance
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Real-time metrics showcasing the power of FlowState
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {performanceStats.map(stat => (
                <div key={stat.label} className="animate-on-scroll text-center">
                    <i className={`fas ${stat.icon} text-5xl text-white mb-4`} aria-hidden="true"></i>
                    <div className="stat-number text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-white/80">{stat.label}</div>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="animate-on-scroll">
            <i className="fas fa-rocket text-6xl text-blue-600 mb-6" aria-hidden="true"></i>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join the future of retail operations with Walmart FlowState
            </p>
            <a href="dashboard/" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
              <span>Start Your Journey</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16" id="contact">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-chart-line text-3xl text-blue-600" aria-hidden="true"></i>
                <h3 className="text-xl font-bold">Walmart FlowState</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Revolutionizing supply chain management through intelligent automation and data-driven insights.
              </p>
              <div className="flex gap-4">
                {socialLinks.map(link => (
                    <a key={link.icon} href={link.href} className="text-2xl text-gray-400 hover:text-blue-400 transition-colors">
                        <i className={link.icon} aria-hidden="true"></i>
                    </a>
                ))}
              </div>
            </div>

            {footerLinks.map(section => (
                <div key={section.title}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <i className={`fas ${section.icon}`} aria-hidden="true"></i>
                        {section.title}
                    </h3>
                    <ul className="space-y-2">
                        {section.links.map(link => (
                            <li key={link.label}>
                                <a href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    <i className={`fas ${link.icon} text-xs`} aria-hidden="true"></i>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 flex items-center justify-center gap-2">
              <i className="fas fa-copyright" aria-hidden="true"></i>
              2024 Walmart FlowState. Built for Walmart Sparkathon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};