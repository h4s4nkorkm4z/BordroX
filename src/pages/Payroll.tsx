import { useEffect, useMemo, useState } from "react";
import type { Personnel } from "../types/personnel";

type Props = {
  personnel: Personnel[];
};
type PayrollRecord = {
  id: string;
  personnelId: number;
  personnelName: string;
  department?: string | null;
  month: string;
  year: string;
  workedDays: string;
  netSalary: number;
  extraPayment: number;
  advancePayment: number;
  totalPayment: number;
  createdAt: string;
};

const monthNames: Record<string, string> = {
  "1": "Ocak",
  "2": "Şubat",
  "3": "Mart",
  "4": "Nisan",
  "5": "Mayıs",
  "6": "Haziran",
  "7": "Temmuz",
  "8": "Ağustos",
  "9": "Eylül",
  "10": "Ekim",
  "11": "Kasım",
  "12": "Aralık",
};
function formatCurrency(value: number) {
  return value.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  });
}

function calculatePayroll(grossSalary: number) {
  const gross = Number(grossSalary || 0);

  const sgkWorker = gross * 0.14;
  const unemploymentWorker = gross * 0.01;

  // Şimdilik tahmini hesap.
  // Sonraki adımda kümülatif gelir vergisi ve asgari ücret istisnası eklenecek.
  const incomeTax = gross * 0.15;
  const stampTax = gross * 0.00759;

  const totalDeduction =
    sgkWorker + unemploymentWorker + incomeTax + stampTax;

  const netSalary = gross - totalDeduction;

  return {
    gross,
    sgkWorker,
    unemploymentWorker,
    incomeTax,
    stampTax,
    totalDeduction,
    netSalary,
  };
}

export default function PayrollPage({ personnel }: Props) {
  const [selectedPersonnelId, setSelectedPersonnelId] = useState("");
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [workedDays, setWorkedDays] = useState("30");
  const [netSalary, setNetSalary] = useState("");
  const [extraPayment, setExtraPayment] = useState("");
  const [advancePayment, setAdvancePayment] = useState("");
  const [savedPayrolls, setSavedPayrolls] = useState<PayrollRecord[]>([]);

  const selectedPersonnel = useMemo(() => {
    return personnel.find((person) => String(person.id) === selectedPersonnelId);
  }, [personnel, selectedPersonnelId]);
useEffect(() => {
  const storedPayrolls = localStorage.getItem("bordrox-payrolls");

  if (storedPayrolls) {
    setSavedPayrolls(JSON.parse(storedPayrolls));
  }
}, []);
function savePayroll() {
  if (!selectedPersonnel) {
    alert("Lütfen personel seçin.");
    return;
  }

  if (!month || !year) {
    alert("Lütfen ay ve yıl seçin.");
    return;
  }

  const record: PayrollRecord = {
    id: crypto.randomUUID(),
    personnelId: selectedPersonnel.id,
    personnelName: selectedPersonnel.name,
    department: selectedPersonnel.department,
    month,
    year,
    workedDays: workedDays || "0",
    netSalary: Number(netSalary || 0),
    extraPayment: Number(extraPayment || 0),
    advancePayment: Number(advancePayment || 0),
    totalPayment,
    createdAt: new Date().toISOString(),
  };

  setSavedPayrolls((current) => [record, ...current]);

  setSelectedPersonnelId("");
  setWorkedDays("30");
  setNetSalary("");
  setExtraPayment("");
  setAdvancePayment("");
}
useEffect(() => {
  localStorage.setItem("bordrox-payrolls", JSON.stringify(savedPayrolls));
}, [savedPayrolls]);
  const totalGross = personnel.reduce((sum, person) => {
    return sum + Number(person.salary || 0);
  }, 0);

  const totalNet = personnel.reduce((sum, person) => {
    return sum + calculatePayroll(person.salary).netSalary;
  }, 0);

  const totalDeduction = totalGross - totalNet;

  const totalPayment =
    Number(netSalary || 0) +
    Number(extraPayment || 0) -
    Number(advancePayment || 0);

  function selectPersonnel(personId: string) {
    setSelectedPersonnelId(personId);

    const foundPerson = personnel.find((person) => String(person.id) === personId);

    if (foundPerson) {
      const payroll = calculatePayroll(foundPerson.salary);
      setNetSalary(String(Math.round(payroll.netSalary)));
    } else {
      setNetSalary("");
    }
  }

  return (
    <>
      <header>
        <div>
          <span>03 — Bordro</span>
          <h2>Bordro</h2>
          <p>Personel maaş bordrolarını buradan hazırlayın.</p>
        </div>

        <button className="newButton">+ Yeni Bordro Dönemi</button>
      </header>

      <section className="statsGrid payrollStats">
        <div className="statCard">
          <span>Personel Sayısı</span>
          <strong>{personnel.length}</strong>
          <small>Bordroya dahil personel</small>
        </div>

        <div className="statCard">
          <span>Toplam Brüt</span>
          <strong>{formatCurrency(totalGross)}</strong>
          <small>Aylık toplam brüt maaş</small>
        </div>

        <div className="statCard">
          <span>Toplam Kesinti</span>
          <strong>{formatCurrency(totalDeduction)}</strong>
          <small>SGK + vergi tahmini</small>
        </div>

        <div className="statCard">
          <span>Toplam Net</span>
          <strong>{formatCurrency(totalNet)}</strong>
          <small>Tahmini ödenecek net</small>
        </div>
      </section>

      <section className="panel payrollPanel">
        <div className="sectionTitleRow">
          <div>
            <h3>Bordro Oluştur</h3>
            <p>Personel, ay, yıl ve ödeme bilgilerini girin.</p>
          </div>
        </div>

        <div className="payrollGrid">
          <div className="payrollCard">
            <label>Personel Seç</label>

            <select
              value={selectedPersonnelId}
              onChange={(event) => selectPersonnel(event.target.value)}
            >
              <option value="">Personel seçin</option>

              {personnel.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div className="payrollCard">
            <label>Ay</label>

            <select value={month} onChange={(event) => setMonth(event.target.value)}>
              <option value="1">Ocak</option>
              <option value="2">Şubat</option>
              <option value="3">Mart</option>
              <option value="4">Nisan</option>
              <option value="5">Mayıs</option>
              <option value="6">Haziran</option>
              <option value="7">Temmuz</option>
              <option value="8">Ağustos</option>
              <option value="9">Eylül</option>
              <option value="10">Ekim</option>
              <option value="11">Kasım</option>
              <option value="12">Aralık</option>
            </select>
          </div>

          <div className="payrollCard">
            <label>Yıl</label>

            <input
              type="number"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
          </div>

          <div className="payrollCard">
            <label>Çalışılan Gün</label>

            <input
              type="number"
              value={workedDays}
              onChange={(event) => setWorkedDays(event.target.value)}
            />
          </div>

          <div className="payrollCard">
            <label>Net Maaş</label>

            <input
              type="number"
              value={netSalary}
              onChange={(event) => setNetSalary(event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="payrollCard">
            <label>Ek Ödeme</label>

            <input
              type="number"
              value={extraPayment}
              onChange={(event) => setExtraPayment(event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="payrollCard">
            <label>Personel Avansı</label>

            <input
              type="number"
              value={advancePayment}
              onChange={(event) => setAdvancePayment(event.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="payrollSummary">
          <div>
            <span>Seçili Personel</span>
            <strong>{selectedPersonnel?.name || "-"}</strong>
          </div>

          <div>
            <span>Ay / Yıl</span>
            <strong>
              {month} / {year}
            </strong>
          </div>

          <div>
            <span>Çalışılan Gün</span>
            <strong>{workedDays || "0"} Gün</strong>
          </div>

          <div>
            <span>Net Maaş</span>
            <strong>{formatCurrency(Number(netSalary || 0))}</strong>
          </div>

          <div>
            <span>Ek Ödeme</span>
            <strong>{formatCurrency(Number(extraPayment || 0))}</strong>
          </div>

          <div>
            <span>Avans</span>
            <strong>{formatCurrency(Number(advancePayment || 0))}</strong>
          </div>

          <div className="payrollTotal">
            <span>Ödenecek Toplam</span>
            <strong>{formatCurrency(totalPayment)}</strong>
          </div>
        </div>

        <div className="payrollActions">
          <button type="button" onClick={savePayroll}>
  Bordro Kaydet
</button>
        </div>
      </section>
<section className="panel savedPayrollPanel">
  <div className="sectionTitleRow">
    <div>
      <h3>Kaydedilen Bordrolar</h3>
      <p>Bu bilgisayarda geçici olarak saklanan bordro kayıtları.</p>
    </div>
  </div>

  {savedPayrolls.length === 0 ? (
    <div className="emptyState">
      <h3>Henüz kayıtlı bordro yok</h3>
      <p>Yukarıdaki formdan personel seçip bordro kaydedin.</p>
    </div>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Personel</th>
          <th>Dönem</th>
          <th>Çalışılan Gün</th>
          <th>Net Maaş</th>
          <th>Ek Ödeme</th>
          <th>Avans</th>
          <th>Ödenecek</th>
          <th>Kayıt Tarihi</th>
        </tr>
      </thead>

      <tbody>
        {savedPayrolls.map((record) => (
          <tr key={record.id}>
            <td>
              <div className="personNameCell">
                <div className="personAvatar">
                  {record.personnelName
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="personInfo">
                  <strong>{record.personnelName}</strong>
                  <small>{record.department || "-"}</small>
                </div>
              </div>
            </td>

            <td>
              {monthNames[record.month]} {record.year}
            </td>
            <td>{record.workedDays} Gün</td>
            <td>{formatCurrency(record.netSalary)}</td>
            <td>{formatCurrency(record.extraPayment)}</td>
            <td>{formatCurrency(record.advancePayment)}</td>
            <td>
              <strong>{formatCurrency(record.totalPayment)}</strong>
            </td>
            <td>
              {new Date(record.createdAt).toLocaleDateString("tr-TR")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>
      <section className="panel">
        <div className="sectionTitleRow">
          <div>
            <h3>Aylık Bordro Listesi</h3>
            <p>Personel maaşlarına göre otomatik tahmini bordro görünümü.</p>
          </div>

          <div className="reportActions">
            <button>PDF</button>
            <button>Excel</button>
            <button>Yazdır</button>
          </div>
        </div>

        {personnel.length === 0 ? (
          <div className="emptyState">
            <h3>Henüz personel yok</h3>
            <p>Bordro oluşturmak için önce personel ekleyin.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Personel</th>
                <th>Departman</th>
                <th>Brüt Maaş</th>
                <th>SGK İşçi</th>
                <th>İşsizlik</th>
                <th>Gelir Vergisi</th>
                <th>Damga Vergisi</th>
                <th>Net Ödeme</th>
              </tr>
            </thead>

            <tbody>
              {personnel.map((person) => {
                const payroll = calculatePayroll(person.salary);

                return (
                  <tr key={person.id}>
                    <td>
                      <div className="personNameCell">
                        <div className="personAvatar">
                          {person.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="personInfo">
                          <strong>{person.name}</strong>
                          <small>{person.position}</small>
                        </div>
                      </div>
                    </td>

                    <td>{person.department || "-"}</td>
                    <td>{formatCurrency(payroll.gross)}</td>
                    <td>{formatCurrency(payroll.sgkWorker)}</td>
                    <td>{formatCurrency(payroll.unemploymentWorker)}</td>
                    <td>{formatCurrency(payroll.incomeTax)}</td>
                    <td>{formatCurrency(payroll.stampTax)}</td>
                    <td>
                      <strong>{formatCurrency(payroll.netSalary)}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}