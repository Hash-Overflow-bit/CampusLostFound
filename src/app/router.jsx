import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

const Home = lazy(() => import("../componenets/herosection/Herosection"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Report = lazy(() => import("../pages/Report"));
const ReportDemo = lazy(() => import("../pages/ReportDemo"));
const About = lazy(() => import("../pages/About"));
const HowItWorks = lazy(() => import("../pages/HowItWorks"));
const Blog = lazy(() => import("../pages/Blog"));
const Contact = lazy(() => import("../pages/Contact"));
const Universities = lazy(() => import("../pages/Universities"));
const UniversityDetail = lazy(() => import("../pages/UniversityDetail"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../pages/TermsOfService"));

const Placeholder = ({ children }) => <main>{children}</main>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/universities" element={<Universities />} />
      <Route path="/universities/:key" element={<UniversityDetail />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/lost" element={<Placeholder>Lost Items Page - Coming Soon</Placeholder>} />
      <Route path="/found" element={<Placeholder>Found Items Page - Coming Soon</Placeholder>} />
      <Route path="/demo" element={<ReportDemo />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Placeholder>404 - Page Not Found</Placeholder>} />
    </Routes>
  );
}
