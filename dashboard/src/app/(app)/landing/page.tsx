'use client';

import React, { useEffect, useCallback } from 'react';


// Type definitions for better type safety
interface ObserverOptions {
  threshold: number;
  rootMargin: string;
}

interface StatElement extends HTMLElement {
  textContent: string | null;
}

const Page: React.FC = () => {
  // Enhanced counter animation with proper typing
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

  // Smooth scrolling handler with proper typing
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

  // Scroll handler for parallax effect
  const handleScroll = useCallback((): void => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content') as HTMLElement;
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, []);

  useEffect(() => {
    // Smooth scrolling for navigation links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    // Enhanced animation on scroll
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

    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });

    // Enhanced counter animation for stats
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

    // Add parallax effect to hero section
    window.addEventListener('scroll', handleScroll);

    // Cleanup function
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 transition-all duration-300">
        <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <i className="fas fa-chart-line text-3xl text-blue-600" aria-hidden="true"></i>
            <span className="text-xl font-bold text-gray-900">Walmart FlowState</span>
          </div>
          
          <ul className="hidden md:flex items-center gap-8">
            <li><a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">Features</a></li>
            <li><a href="#dashboards" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">Dashboards</a></li>
            <li><a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">About</a></li>
            <li><a href="#contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">Contact</a></li>
          </ul>
          
          <a href="dashboard/" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <span>Launch Dashboard</span>
            <i className="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
        {/* Animated Background Shapes */}
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
            <div className="text-center">
              <div className="mb-2">
                <i className="fas fa-store text-2xl text-blue-200 mb-2" aria-hidden="true"></i>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">500+</div>
              <div className="text-sm opacity-80">Active Stores</div>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <i className="fas fa-box text-2xl text-blue-200 mb-2" aria-hidden="true"></i>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">1M+</div>
              <div className="text-sm opacity-80">Products Managed</div>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <i className="fas fa-server text-2xl text-blue-200 mb-2" aria-hidden="true"></i>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">99.9%</div>
              <div className="text-sm opacity-80">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
            {/* Feature Cards with Icons */}
            <div className="animate-on-scroll group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-center mb-6">
                <i className="fas fa-chart-bar text-6xl text-blue-600 mb-4" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Advanced Analytics</h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-center">
                Real-time business insights with interactive charts, KPI tracking, and performance metrics to drive data-driven decisions.
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold cursor-pointer group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </div>
            </div>

            <div className="animate-on-scroll group bg-white p-8 rounded-2xl shadow-lg  hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative">
             
              <div className="text-center mb-6">
                <i className="fas fa-boxes text-6xl text-blue-600 mb-4" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Inventory Management</h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-center">
                Smart inventory tracking with low-stock alerts, automated reordering, and category-based optimization.
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold cursor-pointer group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </div>
            </div>

            <div className="animate-on-scroll group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-center mb-6">
                <i className="fas fa-route text-6xl text-purple-600 mb-4" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Delivery Optimization</h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-center">
                AI-powered route planning, real-time tracking, and fleet management for efficient last-mile delivery.
              </p>
              <div className="flex items-center justify-center gap-2 text-purple-600 font-semibold cursor-pointer group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </div>
            </div>

            <div className="animate-on-scroll group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-center mb-6">
                <i className="fas fa-users text-6xl text-green-600 mb-4" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Multi-Role Dashboard</h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-center">
                Tailored interfaces for customers, suppliers, and store managers with role-specific features and permissions.
              </p>
              <div className="flex items-center justify-center gap-2 text-green-600 font-semibold cursor-pointer group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </div>
            </div>

            <div className="animate-on-scroll group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-center mb-6">
                <i className="fas fa-brain text-6xl text-orange-600 mb-4" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">AI-Powered Forecasting</h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-center">
                Machine learning algorithms for demand prediction, supply optimization, and trend analysis.
              </p>
              <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold cursor-pointer group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </div>
            </div>

            <div className="animate-on-scroll group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-center mb-6">
                <i className="fas fa-mobile-alt text-6xl text-indigo-600 mb-4" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Mobile-First Design</h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-center">
                Responsive design that works seamlessly across desktop, tablet, and mobile devices for on-the-go management.
              </p>
              <div className="flex items-center justify-center gap-2 text-indigo-600 font-semibold cursor-pointer group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
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
            {/* Customer Dashboard */}
            <div className="animate-on-scroll bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="p-8 text-center border-b border-gray-100">
                <i className="fas fa-shopping-cart text-6xl text-blue-600 mb-4" aria-hidden="true"></i>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Dashboard</h3>
                <p className="text-gray-600">Seamless shopping experience</p>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <i className="fas fa-search text-blue-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Product Discovery & Search</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-shopping-bag text-blue-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Smart Shopping Cart</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-credit-card text-blue-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Secure Checkout Process</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-truck text-blue-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Order Tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-comments text-blue-600" aria-hidden="true"></i>
                    <span className="text-gray-700">AI Chat Support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Supplier Dashboard */}
            <div className="animate-on-scroll bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="p-8 text-center border-b border-gray-100">
                <i className="fas fa-industry text-6xl text-purple-600 mb-4" aria-hidden="true"></i>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Supplier Dashboard</h3>
                <p className="text-gray-600">Streamlined supply management</p>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <i className="fas fa-plus-circle text-purple-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Product Management</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-clipboard-list text-purple-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Order Processing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-map-marked-alt text-purple-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Supply Route Optimization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-bell text-purple-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Smart Alerts & Notifications</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-handshake text-purple-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Store Communication</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Store Dashboard */}
            <div className="animate-on-scroll bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="p-8 text-center border-b border-gray-100">
                <i className="fas fa-store text-6xl text-cyan-600 mb-4" aria-hidden="true"></i>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Store Dashboard</h3>
                <p className="text-gray-600">Complete store operations</p>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <i className="fas fa-chart-line text-cyan-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Business Insights & Analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-warehouse text-cyan-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Inventory Management</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-shipping-fast text-cyan-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Fleet & Delivery Tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-chart-line text-cyan-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Demand Forecasting</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-cogs text-cyan-600" aria-hidden="true"></i>
                    <span className="text-gray-700">Supplier Coordination</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        {/* Background Icon Elements */}
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
            <div className="animate-on-scroll text-center">
              <i className="fas fa-server text-5xl text-white mb-4" aria-hidden="true"></i>
              <div className="stat-number text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/80">Uptime Reliability</div>
            </div>
            <div className="animate-on-scroll text-center">
              <i className="fas fa-chart-line text-5xl text-white mb-4" aria-hidden="true"></i>
              <div className="stat-number text-4xl md:text-5xl font-bold text-white mb-2">35%</div>
              <div className="text-white/80">Cost Reduction</div>
            </div>
            <div className="animate-on-scroll text-center">
              <i className="fas fa-shipping-fast text-5xl text-white mb-4" aria-hidden="true"></i>
              <div className="stat-number text-4xl md:text-5xl font-bold text-white mb-2">50%</div>
              <div className="text-white/80">Faster Delivery</div>
            </div>
            <div className="animate-on-scroll text-center">
              <i className="fas fa-clock text-5xl text-white mb-4" aria-hidden="true"></i>
              <div className="stat-number text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">Real-time Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
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
                <a href="#" className="text-2xl text-gray-400 hover:text-blue-400 transition-colors">
                  <i className="fab fa-github" aria-hidden="true"></i>
                </a>
                <a href="#" className="text-2xl text-gray-400 hover:text-blue-400 transition-colors">
                  <i className="fab fa-linkedin" aria-hidden="true"></i>
                </a>
                <a href="#" className="text-2xl text-gray-400 hover:text-blue-400 transition-colors">
                  <i className="fab fa-twitter" aria-hidden="true"></i>
                </a>
                <a href="#" className="text-2xl text-gray-400 hover:text-blue-400 transition-colors">
                  <i className="fas fa-envelope" aria-hidden="true"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-link" aria-hidden="true"></i>
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-xs" aria-hidden="true"></i>Features</a></li>
                <li><a href="#dashboards" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-xs" aria-hidden="true"></i>Dashboards</a></li>
                <li><a href="dashboard/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-xs" aria-hidden="true"></i>Launch App</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-xs" aria-hidden="true"></i>About</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-life-ring" aria-hidden="true"></i>
                Support
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-book text-xs" aria-hidden="true"></i>Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-code text-xs" aria-hidden="true"></i>API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-question-circle text-xs" aria-hidden="true"></i>Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-headset text-xs" aria-hidden="true"></i>Contact Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-globe" aria-hidden="true"></i>
                Connect
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fab fa-github text-xs" aria-hidden="true"></i>GitHub</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fab fa-linkedin text-xs" aria-hidden="true"></i>LinkedIn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fab fa-twitter text-xs" aria-hidden="true"></i>Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-envelope text-xs" aria-hidden="true"></i>Email</a></li>
              </ul>
            </div>
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

export default Page;
