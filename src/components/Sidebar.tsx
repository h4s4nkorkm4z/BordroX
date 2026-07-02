import type { Page } from "../types/personnel";

type Props = {
  page: Page;
  setPage: (page: Page) => void;
};

export default function Sidebar({ page, setPage }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandIcon">B</div>
        <div>
          <h1>BordroX</h1>
          <p>Personel Takip</p>
        </div>
      </div>

      <nav>
        <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>Özet</button>
        <button className={page === "personnel" ? "active" : ""} onClick={() => setPage("personnel")}>Personel</button>
        <button className={page === "payroll" ? "active" : ""} onClick={() => setPage("payroll")}>Bordro</button>
        <button>Ödemeler</button>
        <button className={page === "reports" ? "active" : ""} onClick={() => setPage("reports")}>Raporlar</button>
      </nav>
    </aside>
  );
}
