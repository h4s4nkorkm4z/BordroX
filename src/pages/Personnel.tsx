import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Personnel } from "../types/personnel";
import PersonnelToolbar from "../components/personnel/PersonnelToolbar";

type Props = {
  personnel: Personnel[];
  setPersonnel: React.Dispatch<React.SetStateAction<Personnel[]>>;
  reloadPersonnel: () => Promise<void>;
};

export default function PersonnelPage({ personnel, reloadPersonnel }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Personnel | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);
  const [search, setSearch] = useState("");

  const filteredPersonnel = personnel.filter((p) => {
    const keyword = search.toLowerCase();

    return (
      p.name.toLowerCase().includes(keyword) ||
      p.position.toLowerCase().includes(keyword) ||
      (p.phone ?? "").toLowerCase().includes(keyword) ||
      (p.email ?? "").toLowerCase().includes(keyword)
    );
  });

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
      email: String(form.get("email")),
      nationalId: String(form.get("nationalId")),
      iban: String(form.get("iban")),
      hireDate: String(form.get("hireDate")),
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
    if (!window.confirm("Bu personeli silmek istiyor musun?")) return;

    await window.bordroxAPI.personnel.delete(id);
    setSelectedPerson(null);
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
<PersonnelToolbar
  search={search}
  setSearch={setSearch}
  onCreate={openCreateModal}
/>
      <section className="panel">
        {filteredPersonnel.length === 0 ? (
          <p>Personel bulunamadı.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Pozisyon</th>
                <th>Telefon</th>
                <th>E-posta</th>
                <th>Maaş</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>

            <tbody>
              {filteredPersonnel.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.position}</td>
                  <td>{p.phone}</td>
                  <td>{p.email}</td>
                  <td>₺{p.salary.toLocaleString("tr-TR")}</td>
                  <td>
                    <span className="statusBadge">Aktif</span>
                  </td>
                  <td>
                    <div className="rowActions">
  <button
    className="iconButton"
    title="Görüntüle"
    onClick={() => setSelectedPerson(p)}
  >
    <Eye size={17} />
  </button>

  <button
    className="iconButton edit"
    title="Düzenle"
    onClick={() => openEditModal(p)}
  >
    <Pencil size={17} />
  </button>

  <button
    className="iconButton delete"
    title="Sil"
    onClick={() => deletePersonnel(p.id)}
  >
    <Trash2 size={17} />
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
        <div className="detailPanel">
          <div className="detailHeader">
            <div>
              <h3>{selectedPerson.name}</h3>
              <p>{selectedPerson.position}</p>
            </div>

            <button onClick={() => setSelectedPerson(null)}>Kapat</button>
          </div>

          <div className="detailGrid">
            <div>
              <span>Telefon</span>
              <strong>{selectedPerson.phone || "-"}</strong>
            </div>

            <div>
              <span>E-posta</span>
              <strong>{selectedPerson.email || "-"}</strong>
            </div>

            <div>
              <span>TC Kimlik</span>
              <strong>{selectedPerson.nationalId || "-"}</strong>
            </div>

            <div>
              <span>IBAN</span>
              <strong>{selectedPerson.iban || "-"}</strong>
            </div>

            <div>
              <span>İşe Giriş</span>
              <strong>{selectedPerson.hireDate || "-"}</strong>
            </div>

            <div>
              <span>Maaş</span>
              <strong>₺{selectedPerson.salary.toLocaleString("tr-TR")}</strong>
            </div>
          </div>

          <div className="detailNotes">
            <span>Notlar</span>
            <p>{selectedPerson.notes || "Not bulunmuyor."}</p>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="modalBackdrop">
          <form className="modal" onSubmit={savePersonnel}>
            <h3>{editingPerson ? "Personel Düzenle" : "Yeni Personel"}</h3>

            <input name="name" placeholder="Ad Soyad" defaultValue={editingPerson?.name ?? ""} required />
            <input name="position" placeholder="Pozisyon" defaultValue={editingPerson?.position ?? ""} required />
            <input name="phone" placeholder="Telefon" defaultValue={editingPerson?.phone ?? ""} />
            <input name="email" placeholder="E-posta" defaultValue={editingPerson?.email ?? ""} />
            <input name="nationalId" placeholder="TC Kimlik No" defaultValue={editingPerson?.nationalId ?? ""} />
            <input name="iban" placeholder="IBAN" defaultValue={editingPerson?.iban ?? ""} />
            <input name="hireDate" type="date" defaultValue={editingPerson?.hireDate ?? ""} />
            <input name="salary" type="number" placeholder="Aylık Maaş" defaultValue={editingPerson?.salary ?? ""} required />
            <textarea name="notes" placeholder="Notlar" defaultValue={editingPerson?.notes ?? ""} />

            <div className="modalActions">
              <button type="button" onClick={() => setModalOpen(false)}>
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