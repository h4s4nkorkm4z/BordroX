import {
  BadgeDollarSign,
  Building2,
  Users,
  Wallet,
} from "lucide-react";
import type { Personnel } from "../types/personnel";

type Props = {
  personnel: Personnel[];
};

export default function Dashboard({ personnel }: Props) {
  const totalSalary = personnel.reduce((sum, p) => sum + p.salary, 0);

  const averageSalary =
    personnel.length > 0 ? Math.round(totalSalary / personnel.length) : 0;

  const departmentCount = new Set(
    personnel.map((p) => p.department).filter(Boolean)
  ).size;

  const latestPersonnel = personnel.slice(0, 5);

  const departmentStats = [...new Set(
    personnel
      .map((p) => p.department)
      .filter((department): department is string => Boolean(department))
  )].map((department) => ({
    department,
    count: personnel.filter((p) => p.department === department).length,
  }));

  const cards = [
    { title: "Toplam Personel", value: personnel.length, icon: Users },
    {
      title: "Departman Sayısı",
      value: departmentCount,
      icon: Building2,
    },
    {
      title: "Ortalama Maaş",
      value: `₺${averageSalary.toLocaleString("tr-TR")}`,
      icon: Wallet,
    },
    {
      title: "Toplam Maaş",
      value: `₺${totalSalary.toLocaleString("tr-TR")}`,
      icon: BadgeDollarSign,
    },
  ];

  return (
    <>
      <header>
        <div>
          <span>01 — Dashboard</span>
          <h2>Dashboard</h2>
          <p>Personel yönetim sistemine genel bakış.</p>
        </div>
      </header>

      <section className="cards">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="card metricCard" key={card.title}>
              <div className="metricIcon">
                <Icon size={22} />
              </div>

              <div>
                <p>{card.title}</p>
                <strong>{card.value}</strong>
              </div>
            </div>
          );
        })}
      </section>

      <section className="panel">
        <div className="panelTitle">
          <div>
            <h3>Son Eklenen Personeller</h3>
            <p>Son 5 personel kaydı</p>
          </div>
        </div>

        {latestPersonnel.length === 0 ? (
          <p>Henüz personel eklenmemiş.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Pozisyon</th>
                <th>Departman</th>
                <th>Telefon</th>
                <th>Maaş</th>
              </tr>
            </thead>

            <tbody>
              {latestPersonnel.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.position}</td>
                  <td>{person.department || "-"}</td>
                  <td>{person.phone || "-"}</td>
                  <td>₺{person.salary.toLocaleString("tr-TR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="panel">
        <div className="panelTitle">
          <div>
            <h3>Departman Dağılımı</h3>
            <p>Departmanlara göre personel sayısı</p>
          </div>
        </div>

        {departmentStats.length === 0 ? (
          <p>Henüz departman bilgisi bulunmuyor.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Departman</th>
                <th>Personel Sayısı</th>
              </tr>
            </thead>

            <tbody>
              {departmentStats.map((item) => (
                <tr key={item.department}>
                  <td>{item.department}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}