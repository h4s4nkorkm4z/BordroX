import { useState } from "react";
import "./App.css";

type Page = "dashboard" | "personnel";

type Personnel = {
  id: number;
  name: string;
  position: string;
  phone: string;
  salary: number;
};

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const totalSalary = personnel.reduce((sum, p) => sum + p.salary, 0);

  function addPersonnel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const newPerson: Personnel = {
      id: Date.now(),
      name: String(form.get("name")),
      position: String(form.get("position")),
      phone: String(form.get("phone")),
      salary: Number(form.get("salary")),
    };

    setPersonnel((prev) => [...prev, newPerson]);
    setModalOpen(false);
    event.currentTarget.reset();
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon">B</div>
          <div>
            <h1>BordroX</h1>
            <p>Personel Takip</p>
          </div>
        </div>

        <nav>
          <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>
            Özet
          </button>
          <button className={page === "personnel" ? "active" : ""} onClick={() => setPage("personnel")}>
            Personel
          </button>
          <button>Bordro</button>
          <button>Ödemeler</button>
          <button>Raporlar</button>
          <button>Ayarlar</button>
        </nav>
      </aside>

      <main className="content">
        <header>
          <div>
            <span>{page === "dashboard" ? "01 — Özet" : "02 — Personel"}</span>
            <h2>{page === "dashboard" ? "Dashboard" : "Personeller"}</h2>
            <p>Personel, maaş ve ödeme durumlarını takip edin.</p>
          </div>

          <button className="newButton" onClick={() => setModalOpen(true)}>
            + Yeni Personel
          </button>
        </header>

        {page === "dashboard" && (
          <>
            <section className="cards">
              <div className="card">
                <p>Toplam Personel</p>
                <strong>{personnel.length}</strong>
              </div>
              <div className="card">
                <p>Bu Ay Maaş</p>
                <strong>₺{totalSalary.toLocaleString("tr-TR")}</strong>
              </div>
              <div className="card">
                <p>Ödenen</p>
                <strong>₺0,00</strong>
              </div>
              <div className="card">
                <p>Kalan</p>
                <strong>₺{totalSalary.toLocaleString("tr-TR")}</strong>
              </div>
            </section>

            <section className="panel">
              <h3>Son Hareketler</h3>
              <p>Henüz kayıt bulunmuyor.</p>
            </section>
          </>
        )}

        {page === "personnel" && (
          <section className="panel">
            {personnel.length === 0 ? (
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
                  {personnel.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.position}</td>
                      <td>{p.phone}</td>
                      <td>₺{p.salary.toLocaleString("tr-TR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </main>

      {modalOpen && (
        <div className="modalBackdrop">
          <form className="modal" onSubmit={addPersonnel}>
            <h3>Yeni Personel</h3>

            <input name="name" placeholder="Ad Soyad" required />
            <input name="position" placeholder="Pozisyon" required />
            <input name="phone" placeholder="Telefon" />
            <input name="salary" type="number" placeholder="Aylık Maaş" required />

            <div className="modalActions">
              <button type="button" onClick={() => setModalOpen(false)}>İptal</button>
              <button type="submit">Kaydet</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;