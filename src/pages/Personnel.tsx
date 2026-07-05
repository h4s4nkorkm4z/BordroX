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
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);

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
      department: String(form.get("department")),
      phone: String(form.get("phone")),
      email: String(form.get("email")),
      nationalId: String(form.get("nationalId")),
      birthDate: String(form.get("birthDate")),
      hireDate: String(form.get("hireDate")),
      iban: String(form.get("iban")),
      address: String(form.get("address")),
      emergencyName: String(form.get("emergencyName")),
      emergencyPhone: String(form.get("emergencyPhone")),
      notes: String(form.get("notes")),
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

    if (selectedPerson?.id === id) {
      setSelectedPerson(null);
    }

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
                <th>Departman</th>
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
                  <td>{p.department || "-"}</td>
                  <td>{p.phone || "-"}</td>
                  <td>₺{p.salary.toLocaleString("tr-TR")}</td>

                  <td>
                    <div className="rowActions">
                      <button
                        className="editButton"
                        onClick={() => setSelectedPerson(p)}
                      >
                        Görüntüle
                      </button>

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

      {selectedPerson && (
        <section className="detailPanel">
          <div className="detailHeader">
            <div>
              <h3>{selectedPerson.name}</h3>
              <p>{selectedPerson.position}</p>
            </div>

            <button onClick={() => setSelectedPerson(null)}>Kapat</button>
          </div>

          <div className="detailGrid">
            <div>
              <span>Ad Soyad</span>
              <strong>{selectedPerson.name}</strong>
            </div>

            <div>
              <span>Pozisyon</span>
              <strong>{selectedPerson.position}</strong>
            </div>

            <div>
              <span>Departman</span>
              <strong>{selectedPerson.department || "-"}</strong>
            </div>

            <div>
              <span>Telefon</span>
              <strong>{selectedPerson.phone || "-"}</strong>
            </div>

            <div>
              <span>E-posta</span>
              <strong>{selectedPerson.email || "-"}</strong>
            </div>

            <div>
              <span>T.C. Kimlik No</span>
              <strong>{selectedPerson.nationalId || "-"}</strong>
            </div>

            <div>
              <span>Doğum Tarihi</span>
              <strong>{selectedPerson.birthDate || "-"}</strong>
            </div>

            <div>
              <span>İşe Giriş Tarihi</span>
              <strong>{selectedPerson.hireDate || "-"}</strong>
            </div>

            <div>
              <span>Maaş</span>
              <strong>₺{selectedPerson.salary.toLocaleString("tr-TR")}</strong>
            </div>

            <div>
              <span>IBAN</span>
              <strong>{selectedPerson.iban || "-"}</strong>
            </div>

            <div>
              <span>Acil Durum Kişisi</span>
              <strong>{selectedPerson.emergencyName || "-"}</strong>
            </div>

            <div>
              <span>Acil Durum Telefonu</span>
              <strong>{selectedPerson.emergencyPhone || "-"}</strong>
            </div>
          </div>

          <div className="detailNotes">
            <span>Adres</span>
            <p>{selectedPerson.address || "Adres bulunmuyor."}</p>
          </div>

          <div className="detailNotes">
            <span>Notlar</span>
            <p>{selectedPerson.notes || "Not bulunmuyor."}</p>
          </div>
        </section>
      )}

      {modalOpen && (
        <div className="modalBackdrop">
          <form className="modal personnelModal" onSubmit={savePersonnel}>
            <h3>{editingPerson ? "Personel Düzenle" : "Yeni Personel"}</h3>

            <div className="formGrid">
              <input
                name="name"
                placeholder="Ad Soyad *"
                defaultValue={editingPerson?.name ?? ""}
                required
              />

              <input
                name="position"
                placeholder="Pozisyon *"
                defaultValue={editingPerson?.position ?? ""}
                required
              />

              <input
                name="department"
                placeholder="Departman"
                defaultValue={editingPerson?.department ?? ""}
              />

              <input
                name="phone"
                placeholder="Telefon"
                defaultValue={editingPerson?.phone ?? ""}
              />

              <input
                name="email"
                placeholder="E-posta"
                defaultValue={editingPerson?.email ?? ""}
              />

              <input
                name="nationalId"
                placeholder="T.C. Kimlik No"
                defaultValue={editingPerson?.nationalId ?? ""}
              />

              <input
                name="birthDate"
                type="date"
                placeholder="Doğum Tarihi"
                defaultValue={editingPerson?.birthDate ?? ""}
              />

              <input
                name="hireDate"
                type="date"
                placeholder="İşe Giriş Tarihi"
                defaultValue={editingPerson?.hireDate ?? ""}
              />

              <input
                name="iban"
                placeholder="IBAN"
                defaultValue={editingPerson?.iban ?? ""}
              />

              <input
                name="salary"
                type="number"
                placeholder="Aylık Maaş *"
                defaultValue={editingPerson?.salary ?? ""}
                required
              />

              <input
                name="emergencyName"
                placeholder="Acil Durum Kişisi"
                defaultValue={editingPerson?.emergencyName ?? ""}
              />

              <input
                name="emergencyPhone"
                placeholder="Acil Durum Telefonu"
                defaultValue={editingPerson?.emergencyPhone ?? ""}
              />
            </div>

            <textarea
              name="address"
              placeholder="Adres"
              defaultValue={editingPerson?.address ?? ""}
            />

            <textarea
              name="notes"
              placeholder="Notlar"
              defaultValue={editingPerson?.notes ?? ""}
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