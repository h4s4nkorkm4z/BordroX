import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Personnel } from "../types/personnel";

type Props = {
  personnel: Personnel[];
};

export default function ReportsPage({ personnel }: Props) {
  function createPersonnelPdf() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("BordroX", 14, 18);

    doc.setFontSize(12);
    doc.text("Personel Listesi", 14, 28);
    doc.text(`Toplam Personel: ${personnel.length}`, 14, 36);

    autoTable(doc, {
      startY: 45,
      head: [["Ad Soyad", "Pozisyon", "Departman", "Telefon", "Maaş"]],
      body: personnel.map((p) => [
        p.name,
        p.position,
        p.department || "-",
        p.phone || "-",
        `${p.salary.toLocaleString("tr-TR")} TL`,
      ]),
    });

    doc.save("bordrox-personel-listesi.pdf");
  }

  function exportPersonnelExcel() {
    const data = personnel.map((p) => ({
      "Ad Soyad": p.name,
      Pozisyon: p.position,
      Departman: p.department || "",
      Telefon: p.phone || "",
      "E-posta": p.email || "",
      "T.C. Kimlik No": p.nationalId || "",
      IBAN: p.iban || "",
      Maaş: p.salary,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Personeller");
    XLSX.writeFile(workbook, "bordrox-personeller.xlsx");
  }

  function printPage() {
    window.print();
  }

  return (
    <>
      <header>
        <div>
          <span>03 — Raporlar</span>
          <h2>Raporlar</h2>
          <p>Personel verilerini dışa aktarın ve yazdırın.</p>
        </div>
      </header>

      <section className="cards">
        <div className="card">
          <h3>Personel Listesi</h3>
          <p>Tüm personelleri PDF veya Excel olarak dışa aktarın.</p>

          <div className="rowActions">
            <button className="newButton" onClick={createPersonnelPdf}>
              PDF Oluştur
            </button>

            <button className="editButton" onClick={exportPersonnelExcel}>
              Excel Oluştur
            </button>

            <button className="editButton" onClick={printPage}>
              Yazdır
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Özet</h3>
          <p>Toplam personel sayısı ve kayıt durumu.</p>
          <strong>{personnel.length} Personel</strong>
        </div>
      </section>

      <section className="panel">
        <div className="panelTitle">
          <div>
            <h3>Personel Rapor Önizleme</h3>
            <p>PDF ve Excel çıktısında yer alacak liste.</p>
          </div>
        </div>

        {personnel.length === 0 ? (
          <p>Henüz raporlanacak personel yok.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Pozisyon</th>
                <th>Departman</th>
                <th>Telefon</th>
                <th>Maaş</th>
              </tr>
            </thead>

            <tbody>
              {personnel.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.position}</td>
                  <td>{p.department || "-"}</td>
                  <td>{p.phone || "-"}</td>
                  <td>₺{p.salary.toLocaleString("tr-TR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}