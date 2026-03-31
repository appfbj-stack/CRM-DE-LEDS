import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { APP_DESCRIPTION, APP_NAME, THEME_COLOR } from "./config";
import { FunnelPage } from "./pages/FunnelPage";
import { HomePage } from "./pages/HomePage";
import { LeadDetailPage } from "./pages/LeadDetailPage";
import { NewLeadPage } from "./pages/NewLeadPage";

export default function App() {
  useEffect(() => {
    document.title = APP_NAME;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", APP_DESCRIPTION);
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", THEME_COLOR);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/novo" element={<NewLeadPage />} />
      <Route path="/lead/:id" element={<LeadDetailPage />} />
      <Route path="/funil" element={<FunnelPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
