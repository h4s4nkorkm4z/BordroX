import { useState } from "react";
import type { Personnel } from "../types/personnel";

type Props = {
  personnel: Personnel[];
  setPersonnel: React.Dispatch<React.SetStateAction<Personnel[]>>;
  reloadPersonnel: () => Promise<void>;
};

export default function PersonnelPage({ personnel, reloadPersonnel }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Personnel | null>(null);

  function openCreateModal() {
    setEditingPerson(null);
    setModalOpen(true);
  }

  function openEditModal(person: Personnel) {
    setEditingPerson(person);
    setModalOpen(true);
  }

  async function savePersonnel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const data = {
      name: String(form.get("name")),
      position: String(form.get("position")),
      phone: String(form.get("phone")),
      salary: Number(form.get("salary")),
    };

    if (editingPerson) {
      await window.bordroxAPI.personnel.update(editingPerson.id, data);
    } else {
      await window.bordroxAPI.personnel.create(data);
    }

    setModalOpen(false);
    setEditingPerson(null);
    await reloadPersonnel();
  }

  async function deletePersonnel(id: number) {
    const person = personnel.find((p) => p.id === id);

    const confirmDelete = window.confirm(
      `"${person?.name}" adlı personeli silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz.`
    );

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

        <button className="newButton" onClick={openCreateModal}>
          + Yeni Personel
        </button>
      </header>

      <section className="panel">
        {personnel.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "70px 20px",
              color: "#94a3b8",
            }}
          >
            <h3>Henüz personel bulunmuyor</h3>
            <p>
              İlk personelinizi eklemek için
              <br />
              sağ üstteki <strong>+ Yeni Personel</strong> butonunu kullanın.
            </p>
          </div>
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
                  <td>
                    <div className="personNameCell">
                      <div className="personAvatar">
                        {p.name
                          .split(" ")
                          .map((w) => w[0])
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
                    <div className="rowActions">
                      <button
                        className="editButton"
                        onClick={() => openEditModal(p)}
                      >
                        Düzenle
                      </button>

                      <button
                        className="dangerButton"
                        onClick={() => deletePersonnel(p.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {modalOpen && (
        <div className="modalBackdrop">
          <form className="modal" onSubmit={savePersonnel}>
            <h3>{editingPerson ? "Personel Düzenle" : "Yeni Personel"}</h3>

            <input
              name="name"
              placeholder="Ad Soyad"
              defaultValue={editingPerson?.name ?? ""}
              required
            />

            <input
              name="position"
              placeholder="Pozisyon"
              defaultValue={editingPerson?.position ?? ""}
              required
            />

            <input
              name="phone"
              placeholder="Telefon"
              defaultValue={editingPerson?.phone ?? ""}
            />

            <input
              name="salary"
              type="number"
              placeholder="Aylık Maaş"
              defaultValue={editingPerson?.salary ?? ""}
              required
            />

            <div className="modalActions">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditingPerson(null);
                }}
              >
                İptal
              </button>

              <button type="submit">
                {editingPerson ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}