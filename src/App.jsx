import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import ServicePage from './pages/ServicePage';
import Contact from './pages/Contact';
import Products from './pages/Products';

// SaaS Application Components
import AdminLayout from './layouts/AdminLayout';
import AdminHub from './pages/admin/AdminHub';
import Login from './pages/admin/Login';
import Heatmaps from './pages/admin/Heatmaps';
import SeoDashboard from './pages/admin/SeoDashboard';
import RankTracker from './pages/admin/RankTracker';
import EmailDashboard from './pages/admin/EmailDashboard';
import ContentStudio from './pages/admin/ContentStudio';
import Billing from './pages/admin/Billing';
import SocialDashboard from './pages/admin/SocialDashboard';
import GhostEditor from './pages/admin/GhostEditor';
import IntegrationsDashboard from './pages/admin/IntegrationsDashboard';
import SecurityCenter from './pages/admin/SecurityCenter';
import SystemLogs from './pages/admin/SystemLogs';
import LiquidUI from './pages/admin/LiquidUI';
import GlobalConstraints from './pages/admin/GlobalConstraints';
import PlatformGuide from './pages/PlatformGuide';
import ClientManagement from './pages/admin/ClientManagement';
import ReputationDashboard from './pages/admin/ReputationDashboard';
import KnowledgeGraphSync from './pages/admin/KnowledgeGraphSync';
import UserManagement from './pages/admin/UserManagement';
import ActionCenter from './pages/admin/ActionCenter';
import SettingsHub from './pages/admin/SettingsHub';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';

// Layout Wrapper for the public agency site
const PublicLayout = ({ children }) => (
  <>
    <Navigation />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <Routes>
      {/* Public Marketing Site Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/services/:id" element={<PublicLayout><ServicePage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/platform-guide" element={<PublicLayout><PlatformGuide /></PublicLayout>} />
      <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
      
      {/* SaaS Authentication */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/super-admin" element={<SuperAdminDashboard />} />
      
      {/* Secure SaaS Nexus App Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHub />} />
        {/* Sub-modules */}
        <Route path="clients" element={<ClientManagement />} />
        <Route path="seo" element={<SeoDashboard />} />
        <Route path="rank-tracker" element={<RankTracker />} />
        <Route path="heatmaps" element={<Heatmaps />} />
        <Route path="email" element={<EmailDashboard />} />
        <Route path="content" element={<ContentStudio />} />
        <Route path="social" element={<SocialDashboard />} />
        <Route path="ghost-editor" element={<GhostEditor />} />
        <Route path="liquid-ui" element={<LiquidUI />} />
        <Route path="constraints" element={<GlobalConstraints />} />
        <Route path="integrations" element={<IntegrationsDashboard />} />
        <Route path="security" element={<SecurityCenter />} />
        <Route path="system-logs" element={<SystemLogs />} />
        <Route path="billing" element={<Billing />} />
        <Route path="reputation" element={<ReputationDashboard />} />
        <Route path="directory-sync" element={<KnowledgeGraphSync />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="action-center" element={<ActionCenter />} />
        <Route path="settings" element={<SettingsHub />} />
      </Route>
    </Routes>
  );
}

export default App;
