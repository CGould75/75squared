import React from 'react';
import { Target, MonitorSmartphone, Layers, Code2, Mail, Bot, LineChart, Palette, Database, LayoutDashboard, BarChart3, Boxes, Fingerprint, Server, ShoppingCart, Workflow, Cpu, Activity, Search, Users, Share2 } from 'lucide-react';

export const servicesData = [
  // Growth & Acquisition
  {
    id: 'digital-marketing',
    category: 'Growth & Acquisition',
    icon: <Target size={32} color="var(--color-purple-main)" />,
    title: 'Digital Marketing',
    description: 'Data-driven campaigns, SEO, and persuasive strategies designed to maximize your ROI and dominate local Las Vegas markets.',
    colorHover: 'rgba(147, 51, 234, 0.15)'
  },
  {
    id: 'social-media-automation',
    category: 'Growth & Acquisition',
    icon: <Share2 size={32} color="var(--color-blue-main)" />,
    title: 'Social Media Logistics',
    description: 'Full-scale social media management powered by our proprietary command center, automating multi-platform scheduling and trend tracking.',
    colorHover: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 'seo-geo-optimization',
    category: 'Growth & Acquisition',
    icon: <LineChart size={32} color="var(--color-green-dark)" />,
    title: 'SEO & GEO Optimization',
    description: 'Master traditional Google ranks and Generative Engine queries (ChatGPT, Perplexity) with advanced schema markup and AI-targeted phrasing.',
    colorHover: 'rgba(4, 120, 87, 0.15)'
  },
  {
    id: 'email-marketing',
    category: 'Growth & Acquisition',
    icon: <Mail size={32} color="var(--color-green-dark)" />,
    title: 'Email Marketing',
    description: 'Targeted, high-conversion email sequences designed to engage your audience and drive consistent, measurable revenue growth.',
    colorHover: 'rgba(4, 120, 87, 0.15)'
  },
  {
    id: 'brand-identity',
    category: 'Growth & Acquisition',
    icon: <Palette size={32} color="var(--color-purple-main)" />,
    title: 'Brand Identity & UX/UI',
    description: 'Pixel-perfect, high-converting interfaces and cohesive brand aesthetics utilizing proven persuasive digital psychology.',
    colorHover: 'rgba(147, 51, 234, 0.15)'
  },

  // Digital Products & Web
  {
    id: 'custom-websites',
    category: 'Digital Products & Web',
    icon: <Code2 size={32} color="var(--color-blue-main)" />,
    title: 'Custom Websites',
    description: 'No templates. We build high-performance, fully custom web applications with proprietary backends for ultimate scalability.',
    colorHover: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 'cms-ecommerce-systems',
    category: 'Digital Products & Web',
    icon: <ShoppingCart size={32} color="var(--color-blue-main)" />,
    title: 'CMS & E-Commerce Systems',
    description: 'Bespoke Shopify and custom Headless WordPress architectures giving you powerful content and sales engines without the bloat.',
    colorHover: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 'app-development',
    category: 'Digital Products & Web',
    icon: <MonitorSmartphone size={32} color="var(--color-green-main)" />,
    title: 'App Development',
    description: 'Sleek, responsive mobile and web applications engineered to solve complex business problems with intuitive user experiences.',
    colorHover: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'global-search-infrastructure',
    category: 'Digital Products & Web',
    icon: <Search size={32} color="var(--color-purple-main)" />,
    title: 'Global Search Infrastructure',
    description: 'We build enterprise-grade public search interfaces capable of instantly parsing and filtering highly structured, dense metadata.',
    colorHover: 'rgba(147, 51, 234, 0.15)'
  },

  // Data & Security Architecture
  {
    id: 'enterprise-dashboards',
    category: 'Data & Security Architecture',
    icon: <LayoutDashboard size={32} color="var(--color-purple-main)" />,
    title: 'Enterprise Dashboards',
    description: 'Hyper-efficient, secure back-office software and custom SaaS portals engineered for extreme data volume and ease of use.',
    colorHover: 'rgba(147, 51, 234, 0.15)'
  },
  {
    id: 'data-analytics-engines',
    category: 'Data & Security Architecture',
    icon: <BarChart3 size={32} color="var(--color-green-main)" />,
    title: 'Data & Analytics Engines',
    description: 'Proprietary reporting suites that pull millions of rows of your specific operational data into actionable, real-time dashboards.',
    colorHover: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'identity-management',
    category: 'Data & Security Architecture',
    icon: <Fingerprint size={32} color="var(--color-purple-dark)" />,
    title: 'Identity & Access Management',
    description: 'Forward-thinking, military-grade identity systems including Role-Based logic, SSO, and biometric architecture.',
    colorHover: 'rgba(88, 28, 135, 0.15)'
  },
  {
    id: 'observability-auditing',
    category: 'Data & Security Architecture',
    icon: <Activity size={32} color="var(--color-blue-dark)" />,
    title: 'High-Fidelity Observability & Auditing',
    description: 'For security-conscious or highly-regulated industries, we implement real-time systemic observability and unalterable audit trails.',
    colorHover: 'rgba(29, 78, 216, 0.15)'
  },

  // Advanced Enterprise Engineering
  {
    id: 'multi-tenant-saas',
    category: 'Advanced Enterprise Engineering',
    icon: <Users size={32} color="var(--color-purple-dark)" />,
    title: 'Multi-Tenant SaaS Architecture',
    description: 'We architect complex, secure Multi-Tenant SaaS applications where you manage hundreds of distinct clients from a single massive global dashboard.',
    colorHover: 'rgba(107, 33, 168, 0.15)'
  },
  {
    id: 'intelligent-automation',
    category: 'Advanced Enterprise Engineering',
    icon: <Workflow size={32} color="var(--color-green-main)" />,
    title: 'Intelligent Automation Kernels',
    description: 'We build proprietary Rules Engines that instantly automate complex human decision-making, strict operational compliance, and calculation systems.',
    colorHover: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'database-modernization',
    category: 'Advanced Enterprise Engineering',
    icon: <Database size={32} color="var(--color-blue-main)" />,
    title: 'Legacy DB Modernization',
    description: 'We salvage and modernize outdated, slow databases, transforming them into lightning-fast, highly secure API backends.',
    colorHover: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 'bare-metal-deployment',
    category: 'Advanced Enterprise Engineering',
    icon: <Server size={32} color="var(--color-green-dark)" />,
    title: 'Bare-Metal Deployment',
    description: 'We deploy complex Node.js/Next.js clusters directly to highly-optimized Virtual Private Servers rather than slow, shared hosts.',
    colorHover: 'rgba(4, 120, 87, 0.15)'
  },

  // Integrated Systems
  {
    id: 'ai-integration',
    category: 'Integrated Systems',
    icon: <Bot size={32} color="var(--color-purple-dark)" />,
    title: 'AI Integration & Automation',
    description: 'Integrate LLMs, custom GPTs, and machine learning pipelines into your distinct workflows to automate operations instantly.',
    colorHover: 'rgba(107, 33, 168, 0.15)'
  },
  {
    id: 'advanced-inventory-systems',
    category: 'Integrated Systems',
    icon: <Boxes size={32} color="var(--color-blue-dark)" />,
    title: 'Advanced Inventory Systems',
    description: 'If you manage physical stock, vendors, or complex supply chains, we can digitize and automate your entire logistical workflow.',
    colorHover: 'rgba(30, 58, 138, 0.15)'
  },
  {
    id: 'hardware-interfacing',
    category: 'Integrated Systems',
    icon: <Cpu size={32} color="var(--color-purple-main)" />,
    title: 'Hardware Interfacing',
    description: 'We connect your web applications to the physical world, engineering direct integrations with thermal printers, scanners, and local IoT hardware.',
    colorHover: 'rgba(147, 51, 234, 0.15)'
  },
  {
    id: 'software-solutions',
    category: 'Integrated Systems',
    icon: <Layers size={32} color="var(--color-blue-dark)" />,
    title: 'Software Solutions',
    description: 'Enterprise-grade custom software built from scratch. We architect resilient systems explicitly tailored to your operational needs.',
    colorHover: 'rgba(29, 78, 216, 0.15)'
  }
];
