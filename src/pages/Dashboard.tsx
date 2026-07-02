import type { Personnel } from "../types/personnel";

type Props = {
  personnel: Personnel[];
};

export default function Dashboard({ personnel }: Props) {
  const totalSalary = personnel.reduce((sum, p) => sum + p.salary, 0);

  return (
    <>
      <header>
        <div>
          <span>01 — Özet</span>
          <h2>Dashboard</h2>
          <p>Personel, maaş ve ödeme durumlarını takip edin.</p>
        </div>
      </header>

      <section className="cards">
        <div className="card"><p>Toplam Personel</p><strong>{personnel.length}</strong></div>
        <div className="card"><p>Bu Ay Maaş</p><strong>₺{totalSalary.toLocaleString("tr-TR")}</strong></div>
        <div className="card"><p>Ödenen</p><strong>₺0,00</strong></div>
        <div className="card"><p>Kalan</p><strong>₺{totalSalary.toLocaleString("tr-TR")}</strong></div>
      </section>

      <section className="panel">
        <h3>Son Hareketler</h3>
        <p>Henüz kayıt bulunmuyor.</p>
      </section>
    </>
  );
}