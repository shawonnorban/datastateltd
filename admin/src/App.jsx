import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/lib/auth.jsx';
import Layout from '@/components/layout.jsx';
import Login from '@/pages/login.jsx';
import Dashboard from '@/pages/dashboard.jsx';
import Settings from '@/pages/settings.jsx';
import Sections from '@/pages/sections.jsx';
import SectionEdit from '@/pages/section-edit.jsx';
import PagesSeo from '@/pages/pages-seo.jsx';
import Hosting from '@/pages/hosting.jsx';
import Memberships from '@/pages/memberships.jsx';
import Applications from '@/pages/applications.jsx';
import Inquiries from '@/pages/inquiries.jsx';

export default function App() {
  const { user, ready } = useAuth();
  if (!ready) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (!user) return <Login />;
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="sections" element={<Sections />} />
        <Route path="sections/:id" element={<SectionEdit />} />
        <Route path="pages" element={<PagesSeo />} />
        <Route path="hosting" element={<Hosting />} />
        <Route path="memberships" element={<Memberships />} />
        <Route path="applications" element={<Applications />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
