import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Personnel } from "../../types/personnel";

type Props = {
  personnel: Personnel[];
  onView: (person: Personnel) => void;
  onEdit: (person: Personnel) => void;
  onDelete: (id: number) => void;
};

export default function PersonnelTable({
  personnel,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (personnel.length === 0) {
    return <p>Personel bulunamadı.</p>;
  }

  return (
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
        {personnel.map((p) => (
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
                <button className="iconButton" title="Görüntüle" onClick={() => onView(p)}>
                  <Eye size={17} />
                </button>

                <button className="iconButton edit" title="Düzenle" onClick={() => onEdit(p)}>
                  <Pencil size={17} />
                </button>

                <button className="iconButton delete" title="Sil" onClick={() => onDelete(p.id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}