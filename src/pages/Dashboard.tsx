import type { Personnel } from "../types/personnel";

type Props = {
  personnel: Personnel[];
};

export default function Dashboard({ personnel }: Props) {
  const totalSalary = personnel.reduce((sum, p) => sum + p.salary, 0);
  const latestPersonnel = personnel.slice(0, 5);

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
        <div className="card">
          <p>Toplam Personel</p>
          <strong>{personnel.length}</strong>
        </div>

        <div className="card">
          <p>Toplam Maaş</p>
          <strong>₺{totalSalary.toLocaleString("tr-TR")}</strong>
        </div>

        <div className="card">
          <p>Aktif Personel</p>
          <strong>{personnel.length}</strong>
        </div>

        <div className="card">
          <p>Eksik Evrak</p>
          <strong>0</strong>
        </div>
      </section>

      <section className="panel">
        <h3>Son Eklenen Personeller</h3>

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