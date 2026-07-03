import { FileWarning, Users, Wallet, UserCheck } from "lucide-react";
import type { Personnel } from "../types/personnel";

type Props = {
  personnel: Personnel[];
};

export default function Dashboard({ personnel }: Props) {
  const totalSalary = personnel.reduce((sum, p) => sum + p.salary, 0);
  const latestPersonnel = personnel.slice(0, 5);

  const cards = [
    { title: "Toplam Personel", value: personnel.length, icon: Users },
    { title: "Toplam Maaş", value: `₺${totalSalary.toLocaleString("tr-TR")}`, icon: Wallet },
    { title: "Aktif Personel", value: personnel.length, icon: UserCheck },
    { title: "Eksik Evrak", value: 0, icon: FileWarning },
  ];

  return (
    <>
      <header>
        <div>
          <span>01 — Dashboard</span>
          <h2>Personel Özeti</h2>
          <p>İşletmedeki personel durumunu sade şekilde takip edin.</p>
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
            <p>En son oluşturulan 5 personel kaydı.</p>
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
                <th>Telefon</th>
                <th>Maaş</th>
              </tr>
            </thead>

            <tbody>
              {latestPersonnel.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.position}</td>
                  <td>{person.phone}</td>
                  <td>₺{person.salary.toLocaleString("tr-TR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}