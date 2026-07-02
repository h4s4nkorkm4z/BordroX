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

  return (
    <>
      <header>
        <div>
          <span>02 — Personeller</span>
          <h2>Personel</h2>
          <p>Tüm çalýþanlarý buradan yönetin.</p>
        </div>

        <button className="newButton" onClick={() => setModalOpen(true)}>+ Yeni Personel</button>
      </header>

      <section className="panel">
        {personnel.length === 0 ? (
          <p>Henüz personel eklenmemiþ.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Pozisyon</th>
                <th>Telefon</th>
                <th>Maaþ</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.position}</td>
                  <td>{p.phone}</td>
                  <td>?{p.salary.toLocaleString("tr-TR")}</td>
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
            <input name="salary" type="number" placeholder="Aylýk Maaþ" required />

            <div className="modalActions">
              <button type="button" onClick={() => setModalOpen(false)}>Ýptal</button>
              <button type="submit">Kaydet</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
