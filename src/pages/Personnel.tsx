import { useState } from "react";
import type { Personnel } from "../types/personnel";

type Props = {
  personnel: Personnel[];
  setPersonnel: React.Dispatch<React.SetStateAction<Personnel[]>>;
  reloadPersonnel: () => Promise<void>;
};

export default function PersonnelPage({ personnel, reloadPersonnel }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  async function addPersonnel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    await window.bordroxAPI.personnel.create({
      name: String(form.get("name")),
      position: String(form.get("position")),
      phone: String(form.get("phone")),
      salary: Number(form.get("salary")),
    });

    setModalOpen(false);
    await reloadPersonnel();
  }

  async function deletePersonnel(id: number) {
    const confirmDelete = window.confirm("Bu personeli silmek istiyor musun?");
    if (!confirmDelete) return;

    await window.bordroxAPI.personnel.delete(id);
    await reloadPersonnel();
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
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>

            <tbody>
              {personnel.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="personNameCell">
                      <div className="personAvatar">
                        {p.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="personInfo">
                        <strong>{p.name}</strong>
                        <small>{p.position}</small>
                      </div>
                    </div>
                  </td>

                  <td>{p.position}</td>
                  <td>{p.phone || "-"}</td>
                  <td>₺{p.salary.toLocaleString("tr-TR")}</td>
                  <td>
                    <span className="statusBadge">Aktif</span>
                  </td>
                  <td>
                    <button
                      className="dangerButton"
                      onClick={() => deletePersonnel(p.id)}
                    >
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
            <input
              name="salary"
              type="number"
              placeholder="Aylık Maaş"
              required
            />

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