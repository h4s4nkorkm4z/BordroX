import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import PersonnelPage from "./pages/Personnel";
import ReportsPage from "./pages/Reports";
import type { Page, Personnel } from "./types/personnel";

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [personnel, setPersonnel] = useState<Personnel[]>([]);

  async function loadPersonnel() {
    const data = await window.bordroxAPI.personnel.list();
    setPersonnel(data);
  }

  useEffect(() => {
    loadPersonnel();
  }, []);

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />

      <main className="content">
        {page === "dashboard" && <Dashboard personnel={personnel} />}

        {page === "personnel" && (
          <PersonnelPage
            personnel={personnel}
            setPersonnel={setPersonnel}
            reloadPersonnel={loadPersonnel}
          />
        )}

        {page === "reports" && <ReportsPage personnel={personnel} />}
      </main>
    </div>
  );
}

export default App;