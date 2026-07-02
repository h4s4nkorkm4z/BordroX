import { useState } from "react";
import type { Personnel } from "../types/personnel";

type Props = {
  personnel: Personnel[];
  setPersonnel: React.Dispatch<React.SetStateAction<Personnel[]>>;
};

export default function PersonnelPage({ personnel, setPersonnel }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

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
  }

  function deletePersonnel(id: number) {
    const confirmDelete = window.confirm("Bu personeli silmek istiyor musun?");
    if (!confirmDelete) return;

    setPersonnel((prev) => prev.filter((person) => person.id !== id));
  }

  return (
    <>
      <header>
        <div>
          <span>02 — Personeller</span>
          <h2>Personel</h2>
          <p>Tüm çalışanları buradan yönetin.</p>
        </div>

        <button className="newButton" onClick={() => setModalOpen(true)}>
          + Yeni Personel
        </button>
      </header>

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
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.position}</td>
                  <td>{p.phone}</td>
                  <td>₺{p.salary.toLocaleString("tr-TR")}</td>
                  <td>
                    <button className="dangerButton" onClick={() => deletePersonnel(p.id)}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {modalOpen && (
        <div className="modalBackdrop">
          <form className="modal" onSubmit={addPersonnel}>
            <h3>Yeni Personel</h3>

            <input name="name" placeholder="Ad Soyad" required />
            <input name="position" placeholder="Pozisyon" required />
            <input name="phone" placeholder="Telefon" />
            <input name="salary" type="number" placeholder="Aylık Maaş" required />

            <div className="modalActions">
              <button type="button" onClick={() => setModalOpen(false)}>
                İptal
              </button>
              <button type="submit">Kaydet</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}