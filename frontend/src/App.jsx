import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/Layout';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FamilyPage from './pages/FamilyPage';
import ReportsPage from './pages/ReportsPage';
import AiExplainerPage from './pages/AiExplainerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RemindersPage from './pages/RemindersPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ChatbotPage from './pages/ChatbotPage';
import EmergencyPage from './pages/EmergencyPage';
import DoctorSummaryPage from './pages/DoctorSummaryPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import LogoutPage from './pages/LogoutPage';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <AppLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/family" element={<FamilyPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/ai-explainer" element={<AiExplainerPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/reminders" element={<RemindersPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/doctor-summary" element={<DoctorSummaryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route path="/logout" element={<LogoutPage />} />
    </Routes>
  );
}
