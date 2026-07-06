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
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [salarySort, setSalarySort] = useState("");
  const [formError, setFormError] = useState("");
  const departments = Array.from(
  new Set(
    personnel
      .map((p) => p.department)
      .filter((department): department is string => Boolean(department))
  )
);

const positions = Array.from(
  new Set(
    personnel
      .map((p) => p.position)
      .filter((position): position is string => Boolean(position))
  )
);


  function openCreateModal() {
  setFormError("");
  setEditingPerson(null);
  setModalOpen(true);
}

  function openEditModal(person: Personnel) {
  setFormError("");
  setEditingPerson(person);
  setModalOpen(true);
}

  async function savePersonnel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
const nationalId = String(form.get("nationalId"));
const email = String(form.get("email"));
const iban = String(form.get("iban"));

if (nationalId && !/^\d{11}$/.test(nationalId)) {
  setFormError("T.C. Kimlik No 11 haneli olmalıdır.");
  return;
}

if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  setFormError("Geçerli bir e-posta adresi girin.");
  return;
}

if (iban && iban.length > 0 && iban.replace(/\s/g, "").length < 15) {
  setFormError("IBAN çok kısa görünüyor.");
  return;
}
    const data = {
      name: String(form.get("name")),
      position: String(form.get("position")),
      department: String(form.get("department")),
      phone: String(form.get("phone")),
      email,
      nationalId,
      birthDate: String(form.get("birthDate")),
      hireDate: String(form.get("hireDate")),
      iban,
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
    setFormError("");
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
  const totalPersonnel = personnel.length;

const averageSalary =
  personnel.length > 0
    ? personnel.reduce((sum, p) => sum + p.salary, 0) / personnel.length
    : 0;

const totalDepartments = departments.length;

const totalPositions = positions.length;
  const filteredPersonnel = personnel
  
  .filter((p) => {
    const text =
      `${p.name} ${p.position} ${p.department ?? ""} ${p.phone ?? ""}`
        .toLowerCase();

    const searchMatch = text.includes(search.toLowerCase());

    const departmentMatch =
      !departmentFilter ||
      p.department === departmentFilter;

    const positionMatch =
      !positionFilter ||
      p.position === positionFilter;
      

    return (
      searchMatch &&
      departmentMatch &&
      positionMatch
    );
  })
  .sort((a, b) => {
    if (salarySort === "asc") {
      return a.salary - b.salary;
    }

    if (salarySort === "desc") {
      return b.salary - a.salary;
    }

    return 0;
  });

return (
  <>
  {formError && (
  <div className="formToast">
    <div className="formToastIcon">⚠</div>

    <div className="formToastContent">
      <strong>Doğrulama Hatası</strong>
      <span>{formError}</span>
    </div>

    <button
      type="button"
      className="formToastClose"
      onClick={() => setFormError("")}
    >
      ✕
    </button>
  </div>
)}
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
  <div className="personnelToolbar modernToolbar">
    <div className="searchBox">
      <span>🔍</span>

      <input
        type="text"
        placeholder="Personel ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <button type="button" onClick={() => setSearch("")}>
          ×
        </button>
      )}
    </div>

    <div className="filterToolbar">
      <select
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
      >
        <option value="">Tüm Departmanlar</option>
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>

      <select
        value={positionFilter}
        onChange={(e) => setPositionFilter(e.target.value)}
      >
        <option value="">Tüm Pozisyonlar</option>
        {positions.map((position) => (
          <option key={position} value={position}>
            {position}
          </option>
        ))}
      </select>

      <select
        value={salarySort}
        onChange={(e) => setSalarySort(e.target.value)}
      >
        <option value="">Maaş Sıralama</option>
        <option value="asc">Maaş Artan</option>
        <option value="desc">Maaş Azalan</option>
      </select>

      <button
        type="button"
        onClick={() => {
          setSearch("");
          setDepartmentFilter("");
          setPositionFilter("");
          setSalarySort("");
        }}
      >
        Temizle
      </button>
    </div>
  </div>
<div className="personnelStats">
  <div className="statCard">
    <span>👥</span>
    <div>
      <strong>{totalPersonnel}</strong>
      <small>Toplam Personel</small>
    </div>
  </div>

  <div className="statCard">
    <span>💰</span>
    <div>
      <strong>₺{averageSalary.toLocaleString("tr-TR")}</strong>
      <small>Ortalama Maaş</small>
    </div>
  </div>

  <div className="statCard">
    <span>🏢</span>
    <div>
      <strong>{totalDepartments}</strong>
      <small>Departman</small>
    </div>
  </div>

  <div className="statCard">
    <span>📋</span>
    <div>
      <strong>{totalPositions}</strong>
      <small>Pozisyon</small>
    </div>
  </div>
</div>
  {filteredPersonnel.length === 0 ? (
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
              
              {filteredPersonnel.map((p) => (
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
  <section className="detailPanel modernDetailPanel">
    <div className="modernDetailHeader">
      <div className="detailTitleRow">
        <div className="detailIcon">👤</div>

        <div>
          <h3>Personel Detayı</h3>
          <p>Personel bilgilerini görüntüleyin ve yönetin.</p>
        </div>
      </div>

      <button onClick={() => setSelectedPerson(null)}>×</button>
    </div>

    <div className="profileSummary">
      <div className="profileAvatar">
        {selectedPerson.name.slice(0, 1).toUpperCase()}
      </div>

      <div className="profileMain">
        <h2>{selectedPerson.name}</h2>
        <span>{selectedPerson.position}</span>
      </div>

      <div className="summaryItem">
        <small>Departman</small>
        <strong>{selectedPerson.department || "-"}</strong>
      </div>

      <div className="summaryItem">
        <small>Telefon</small>
        <strong>{selectedPerson.phone || "-"}</strong>
      </div>

      <div className="summaryItem">
        <small>E-posta</small>
        <strong>{selectedPerson.email || "-"}</strong>
      </div>
    </div>

    <div className="modernDetailGrid">
      <div className="modernInfoCard">
        <h4>Kişisel Bilgiler</h4>

        <div className="infoRow">
          <span>Ad Soyad</span>
          <strong>{selectedPerson.name}</strong>
        </div>

        <div className="infoRow">
          <span>T.C. Kimlik No</span>
          <strong>{selectedPerson.nationalId || "-"}</strong>
        </div>

        <div className="infoRow">
          <span>Doğum Tarihi</span>
          <strong>{selectedPerson.birthDate || "-"}</strong>
        </div>

        <div className="infoRow">
          <span>Acil Durum Kişisi</span>
          <strong>{selectedPerson.emergencyName || "-"}</strong>
        </div>

        <div className="infoRow">
          <span>Acil Durum Telefonu</span>
          <strong>{selectedPerson.emergencyPhone || "-"}</strong>
        </div>
      </div>

      <div className="modernInfoCard">
        <h4>İş Bilgileri</h4>

        <div className="infoRow">
          <span>Pozisyon</span>
          <strong>{selectedPerson.position}</strong>
        </div>

        <div className="infoRow">
          <span>Departman</span>
          <strong>{selectedPerson.department || "-"}</strong>
        </div>

        <div className="infoRow">
          <span>İşe Giriş Tarihi</span>
          <strong>{selectedPerson.hireDate || "-"}</strong>
        </div>

        <div className="infoRow">
          <span>Maaş</span>
          <strong>₺{selectedPerson.salary.toLocaleString("tr-TR")}</strong>
        </div>

        <div className="infoRow">
          <span>IBAN</span>
          <strong>{selectedPerson.iban || "-"}</strong>
        </div>
      </div>

      <div className="modernInfoCard">
        <h4>İletişim Bilgileri</h4>

        <div className="infoRow">
          <span>Telefon</span>
          <strong>{selectedPerson.phone || "-"}</strong>
        </div>

        <div className="infoRow">
          <span>E-posta</span>
          <strong>{selectedPerson.email || "-"}</strong>
        </div>
      </div>

      <div className="modernInfoCard">
        <h4>Diğer Bilgiler</h4>

        <div className="infoRow">
          <span>Adres</span>
          <strong>{selectedPerson.address || "Adres bulunmuyor."}</strong>
        </div>

        <div className="infoRow">
          <span>Notlar</span>
          <strong>{selectedPerson.notes || "Not bulunmuyor."}</strong>
        </div>
      </div>
    </div>

    <div className="detailFooter">
      <button onClick={() => setSelectedPerson(null)}>Kapat</button>

      <div>
        <button
          className="editButton"
          onClick={() => openEditModal(selectedPerson)}
        >
          Düzenle
        </button>

        <button
          className="dangerButton"
          onClick={() => deletePersonnel(selectedPerson.id)}
        >
          Sil
        </button>
      </div>
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
                setFormError("");
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