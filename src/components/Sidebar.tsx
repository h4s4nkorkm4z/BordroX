import type { Page } from "../types/personnel";

type Props = {
  page: Page;
  setPage: (page: Page) => void;
};

const menu = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "personnel", label: "Personeller", icon: "👤" },
  { key: "payroll", label: "Bordro", icon: "💰" },
  { key: "reports", label: "Raporlar", icon: "📊" },
] as const;

export default function Sidebar({ page, setPage }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandIcon">BX</div>
        <div>
          <h1>BordroX</h1>
          <p>Professional HR</p>
        </div>
      </div>

      <nav className="menuList">
        {menu.map((item) => (
          <button
            key={item.key}
            className={page === item.key ? "active menuButton" : "menuButton"}
            onClick={() => setPage(item.key)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebarProfile">
        <div className="avatar">H</div>
        <div>
          <strong>Hasan</strong>
          <span>Yönetici</span>
        </div>
      </div>
    </aside>
  );
}