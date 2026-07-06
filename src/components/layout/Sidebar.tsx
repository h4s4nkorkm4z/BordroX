import {
  CreditCard,
  FileText,
  Home,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import type { Page } from "../../types/personnel";

type Props = {
  page: Page;
  setPage: (page: Page) => void;
};

const menu = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "personnel", label: "Personeller", icon: Users },
  { key: "payroll", label: "Bordro", icon: CreditCard },
  { key: "reports", label: "Raporlar", icon: FileText },
] as const;

export default function Sidebar({ page, setPage }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img
          src="/bordrox-icon.png"
          alt="BordroX"
          className="brandLogoIcon"
        />

        <div className="brandText">
          <h1>BordroX</h1>
          <p>Personel Yönetim Sistemi</p>
        </div>
      </div>

      <nav className="menuList">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
  
              key={item.key}
              className={page === item.key ? "active menuButton" : "menuButton"}
              onClick={() => setPage(item.key)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="sidebarProfile">
        <div className="avatar">
          <UserRound size={18} />
        </div>
        <div>
          <strong>Hasan</strong>
          <span>Yönetici</span>
        </div>
      </div>

      <div className="sidebarSettings">
        <Settings size={16} />
        <span>Ayarlar</span>
      </div>
    </aside>
  );
}