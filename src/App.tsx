import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import PersonnelPage from "./pages/Personnel";
import PayrollPage from "./pages/Payroll";
import ReportsPage from "./pages/Reports";
import type { Page, Personnel } from "./types/personnel";

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [personnel, setPersonnel] = useState<Personnel[]>([]);

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />

      <main className="content">
        {page === "dashboard" && <Dashboard personnel={personnel} />}
        {page === "personnel" && <PersonnelPage personnel={personnel} setPersonnel={setPersonnel} />}
        {page === "payroll" && <PayrollPage />}
        {page === "reports" && <ReportsPage />}
      </main>
    </div>
  );
}

export default App;
