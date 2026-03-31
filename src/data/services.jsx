import React from 'react';
import { Target, MonitorSmartphone, Layers, Code2, Mail, Bot, LineChart, Palette, Database, LayoutDashboard, BarChart3, Boxes, Fingerprint, Server, ShoppingCart } from 'lucide-react';

export const servicesData = [
  {
    id: 'digital-marketing',
    icon: <Target size={32} color="var(--color-purple-main)" />,
    title: 'Digital Marketing',
    description: 'Data-driven campaigns, SEO, and persuasive strategies designed to maximize your ROI and dominate local Las Vegas markets.',
    colorHover: 'rgba(147, 51, 234, 0.15)'
  },
  {
    id: 'seo-geo-optimization',
    icon: <LineChart size={32} color="var(--color-green-dark)" />,
    title: 'SEO & GEO Optimization',
    description: 'Master traditional Google ranks and Generative Engine queries (ChatGPT, Perplexity) with advanced schema markup and AI-targeted phrasing.',
    colorHover: 'rgba(4, 120, 87, 0.15)'
  },
  {
    id: 'custom-websites',
    icon: <Code2 size={32} color="var(--color-blue-main)" />,
    title: 'Custom Websites',
    description: 'No templates. We build high-performance, fully custom web applications with proprietary backends for ultimate scalability.',
    colorHover: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 'ai-integration',
    icon: <Bot size={32} color="var(--color-purple-dark)" />,
    title: 'AI Integration & Automation',
    description: 'Integrate LLMs, custom GPTs, and machine learning pipelines into your distinct workflows to automate operations instantly.',
    colorHover: 'rgba(107, 33, 168, 0.15)'
  },
  {
    id: 'app-development',
    icon: <MonitorSmartphone size={32} color="var(--color-green-main)" />,
    title: 'App Development',
    description: 'Sleek, responsive mobile and web applications engineered to solve complex business problems with intuitive user experiences.',
    colorHover: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'software-solutions',
    icon: <Layers size={32} color="var(--color-blue-dark)" />,
    title: 'Software Solutions',
    description: 'Enterprise-grade custom software built from scratch. We architect resilient systems explicitly tailored to your operational needs.',
    colorHover: 'rgba(29, 78, 216, 0.15)'
  },
  {
    id: 'brand-identity',
    icon: <Palette size={32} color="var(--color-purple-main)" />,
    title: 'Brand Identity & UX/UI',
    description: 'Pixel-perfect, high-converting interfaces and cohesive brand aesthetics utilizing proven persuasive digital psychology.',
    colorHover: 'rgba(147, 51, 234, 0.15)'
  },
  {
    id: 'email-marketing',
    icon: <Mail size={32} color="var(--color-green-dark)" />,
    title: 'Email Marketing',
    description: 'Targeted, high-conversion email sequences designed to engage your audience and drive consistent, measurable revenue growth.',
    colorHover: 'rgba(4, 120, 87, 0.15)'
  },
  {
    id: 'database-modernization',
    icon: <Database size={32} color="var(--color-blue-main)" />,
    title: 'Legacy DB Modernization',
    description: 'We salvage and modernize outdated, slow databases, transforming them into lightning-fast, highly secure API backends.',
    colorHover: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 'enterprise-dashboards',
    icon: <LayoutDashboard size={32} color="var(--color-purple-main)" />,
    title: 'Enterprise Dashboards',
    description: 'Hyper-efficient, secure back-office software and custom SaaS portals engineered for extreme data volume and ease of use.',
    colorHover: 'rgba(147, 51, 234, 0.15)'
  },
  {
    id: 'data-analytics-engines',
    icon: <BarChart3 size={32} color="var(--color-green-main)" />,
    title: 'Data & Analytics Engines',
    description: 'Proprietary reporting suites that pull millions of rows of your specific operational data into actionable, real-time dashboards.',
    colorHover: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'advanced-inventory-systems',
    icon: <Boxes size={32} color="var(--color-blue-dark)" />,
    title: 'Advanced Inventory Systems',
    description: 'If you manage physical stock, vendors, or complex supply chains, we can digitize and automate your entire logistical workflow.',
    colorHover: 'rgba(30, 58, 138, 0.15)'
  },
  {
    id: 'identity-management',
    icon: <Fingerprint size={32} color="var(--color-purple-dark)" />,
    title: 'Identity & Access Management',
    description: 'Forward-thinking, military-grade identity systems including Role-Based logic, SSO, and biometric architecture.',
    colorHover: 'rgba(88, 28, 135, 0.15)'
  },
  {
    id: 'bare-metal-deployment',
    icon: <Server size={32} color="var(--color-green-dark)" />,
    title: 'Bare-Metal Deployment',
    description: 'We deploy complex Node.js/Next.js clusters directly to highly-optimized Virtual Private Servers rather than slow, shared hosts.',
    colorHover: 'rgba(4, 120, 87, 0.15)'
  },
  {
    id: 'cms-ecommerce-systems',
    icon: <ShoppingCart size={32} color="var(--color-blue-main)" />,
    title: 'CMS & E-Commerce Systems',
    description: 'Bespoke Shopify and custom Headless WordPress architectures giving you powerful content and sales engines without the bloat.',
    colorHover: 'rgba(59, 130, 246, 0.15)'
  }
];

// Note: Re-exporting Services component from earlier, but moving the array to an export so the individual pages can grab the data.
