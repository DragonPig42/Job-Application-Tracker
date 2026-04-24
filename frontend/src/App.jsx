import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ApplicationDetail from "./pages/ApplicationDetail.jsx";
import ApplicationFormPage from "./pages/ApplicationFormPage.jsx";
import ApplicationsPage from "./pages/ApplicationsPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-mist text-ink">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* React Router swaps the page component based on the current URL. */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/new" element={<ApplicationFormPage />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
          <Route path="/applications/:id/edit" element={<ApplicationFormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
