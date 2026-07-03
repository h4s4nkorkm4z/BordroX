import type { Personnel } from "../../types/personnel";

type Props = {
  person: Personnel;
  onClose: () => void;
};

export default function PersonnelDetail({ person, onClose }: Props) {
  return (
    <div className="detailPanel">
      <div className="detailHeader">
        <div>
          <h3>{person.name}</h3>
          <p>{person.position}</p>
        </div>

        <button onClick={onClose}>Kapat</button>
      </div>

      <div className="detailGrid">
        <div>
          <span>Telefon</span>
          <strong>{person.phone || "-"}</strong>
        </div>

        <div>
          <span>E-posta</span>
          <strong>{person.email || "-"}</strong>
        </div>

        <div>
          <span>TC Kimlik</span>
          <strong>{person.nationalId || "-"}</strong>
        </div>

        <div>
          <span>IBAN</span>
          <strong>{person.iban || "-"}</strong>
        </div>

        <div>
          <span>İşe Giriş</span>
          <strong>{person.hireDate || "-"}</strong>
        </div>

        <div>
          <span>Maaş</span>
          <strong>₺{person.salary.toLocaleString("tr-TR")}</strong>
        </div>
      </div>

      <div className="detailNotes">
        <span>Notlar</span>
        <p>{person.notes || "Not bulunmuyor."}</p>
      </div>
    </div>
  );
}