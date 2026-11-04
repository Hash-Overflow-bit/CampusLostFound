import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { ACCESS } from "./routePolicy";

const Home = lazy(() => import("../componenets/herosection/Herosection"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const UpdatePassword = lazy(() => import("../pages/UpdatePassword"));
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
const NotFound = lazy(() => import("../pages/NotFound"));

const Placeholder = ({ children }) => <main>{children}</main>;
const GuestOnly = ({ children }) => <ProtectedRoute access={ACCESS.GUEST_ONLY}>{children}</ProtectedRoute>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
      <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
      {/* Recovery links establish a temporary authenticated session, so this route must not be guest-only. */}
      <Route path="/update-password" element={<UpdatePassword />} />
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
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
