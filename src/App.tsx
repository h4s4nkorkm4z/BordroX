import "./App.css";

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon">B</div>
          <div>
            <h1>BordroX</h1>
            <p>Personel Takip</p>
          </div>
        </div>

        <nav>
          <button className="active">Özet</button>
          <button>Personel</button>
          <button>Bordro</button>
          <button>Ödemeler</button>
          <button>Raporlar</button>
          <button>Ayarlar</button>
        </nav>
      </aside>

      <main className="content">
        <header>
          <div>
            <span>01 — Özet</span>
            <h2>Dashboard</h2>
            <p>Personel, maaş ve ödeme durumlarını takip edin.</p>
          </div>

          <button className="newButton">+ Yeni Personel</button>
        </header>

        <section className="cards">
          <div className="card">
            <p>Toplam Personel</p>
            <strong>0</strong>
          </div>
          <div className="card">
            <p>Bu Ay Maaş</p>
            <strong>₺0,00</strong>
          </div>
          <div className="card">
            <p>Ödenen</p>
            <strong>₺0,00</strong>
          </div>
          <div className="card">
            <p>Kalan</p>
            <strong>₺0,00</strong>
          </div>
        </section>

        <section className="panel">
          <h3>Son Hareketler</h3>
          <p>Henüz kayıt bulunmuyor.</p>
        </section>
      </main>
    </div>
  );
}

export default App;