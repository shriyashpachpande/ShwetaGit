// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Toaster, toast } from "react-hot-toast";

// CSS
import "./App.css";
import "./index.css";

// Components & Pages
import Discription from "./components/Discription";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Services from "./components/Services";
import Analyzer from "./components/Analyzer";
import MultiReportingPage from "./features/multi-reporting/MultiReportingPage";
import ChatBot from "./components/ChatBot";
import ChatBox from "./components/ChatBox";
import BotLayout from "./components/BotLayout";
import Pricing from "./pages/Pricing";
import Diagnoscan from "./components/Diagnoscan";
import AnalyticsPage from "./pages/Analytics/index.jsx";
import Contact from "./components/Contact.jsx";
import adminVideo from "./assets/admin.mp4";
import BlurNavbar from "./components/BlurNavbar.jsx";
import AllInOne from "./components/AllInOne.jsx";
import IntelligentClauseAnalysis from "./components/IntelligentClauseAnalysis.jsx";
import Benefits from "./components/Benefits.jsx";
import SchemeForm from "./components/SchemeForm.jsx";
import HoverToSpeech from "./components/HoverToSpeech";

// Doctor Appointment
import { PatientSessionProvider, usePatientSession } from "./context/PatientSessionContext";
import Layout from "./ui/Layout.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import DoctorRegister from "./pages/doctor/DoctorRegister.jsx";
import DoctorLogin from "./pages/doctor/DoctorLogin.jsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import UploadReportPage from "./pages/UploadReportPage.jsx";
import PatientLogin from "./pages/PatientLogin.jsx";
import NearbyHospitalsPage from "./pages/NearbyHospitalsPage.jsx";

// Clerk Key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// ---------------------- Helper Components ----------------------

// Admin Guard
function AdminGuard({ children }) {
  const ok = sessionStorage.getItem("adminLoggedIn") === "1";
  return ok ? children : <Navigate to="/admin/login" replace />;
}

// Admin Login Page
function AdminLoginDocBot() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = toast.loading("Checking credentials...");
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        sessionStorage.setItem("adminLoggedIn", "1");
        toast.success("Logged in as admin", { id });
        navigate("/admin", { replace: true });
      } else {
        toast.error("Invalid admin credentials", { id });
      }
    }, 600);
  };

  return (
    <div className="relative min-h-[70vh] w-full flex items-center justify-center px-4 py-30">
      <video
        className="fixed inset-0 w-screen h-screen object-cover -z-9"
        src={adminVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="fixed inset-0 bg-black/30 -z-10" />
      <div className="w-full flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl p-6 space-y-4 border-2 border-white bg-white/10 backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">Admin Login</h2>
          <div className="space-y-1">
            <label className="block mb-1 font-medium text-gray-600">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl px-4 py-2 border border-white bg-white/10 text-blue-900 placeholder-blue-800 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          <div className="space-y-1">
            <label className="block mb-1 font-medium text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-2 border border-white bg-white/10 text-blue-900 placeholder-blue-800 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-5 px-4 py-2 rounded-xl font-semibold cursor-pointer text-white bg-black/80 hover:bg-black transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

// Protected Pages
function ProtectedChatPage() {
  const { appointmentId, patientPin, logout } = usePatientSession();
  if (!appointmentId || !patientPin) return <PatientLogin />;
  return (
    <>
      <ChatPage appointmentId={appointmentId} patientPin={patientPin} />
      <button className="btn mt-4" onClick={logout}>Logout</button>
    </>
  );
}

function ProtectedReportPage() {
  const { appointmentId, patientPin, logout } = usePatientSession();
  if (!appointmentId || !patientPin) return <PatientLogin />;
  return (
    <>
      <UploadReportPage appointmentId={appointmentId} patientPin={patientPin} />
      <button className="btn mt-4" onClick={logout}>Logout</button>
    </>
  );
}

// ---------------------- MAIN APP ----------------------
function App() {
  return (
    <PatientSessionProvider>
      <ClerkProvider publishableKey={clerkPubKey}>
        <HoverToSpeech />
        <Toaster />
        <Navbar />

        {/* ✅ Routes without BrowserRouter (already in main.jsx) */}
        <Routes>
          {/* DocBot + ClauseSense */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Discription />
                <Services />
                <AllInOne />
                <IntelligentClauseAnalysis />
                <Benefits />
              </>
            }
          />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/multi-reporting" element={<MultiReportingPage />} />
          <Route
            path="/insureIQ"
            element={
              <BotLayout>
                <ChatBot />
              </BotLayout>
            }
          />
          <Route
            path="/mediGuide"
            element={
              <BotLayout>
                <ChatBox />
              </BotLayout>
            }
          />
          <Route
            path="/diagnoScan"
            element={
              <BotLayout>
                <Diagnoscan />
              </BotLayout>
            }
          />
          <Route path="/nearby-hospitals" element={<NearbyHospitalsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/schemagovt" element={<SchemeForm />} />
          <Route
            path="/pricing"
            element={
              <>
                <SignedIn>
                  <Pricing />
                </SignedIn>
                <SignedOut>
                  <div className="flex flex-col items-center justify-center h-[60vh]">
                    <SignInButton mode="modal">
                      <button className="p-3 bg-[#f5f5f5] text-black rounded">
                        Please Login to view Pricing
                      </button>
                    </SignInButton>
                  </div>
                </SignedOut>
              </>
            }
          />
          <Route path="/admin/login" element={<AdminLoginDocBot />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AnalyticsPage />
              </AdminGuard>
            }
          />

          {/* Doctor Appointment */}
          <Route element={<Layout />}>
            <Route path="/doctor/register" element={<DoctorRegister />} />
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/chat/:appointmentId" element={<ProtectedChatPage />} />
            <Route path="/upload-report/:appointmentId" element={<ProtectedReportPage />} />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <BlurNavbar />
      </ClerkProvider>
    </PatientSessionProvider>
  );
}

export default App;
