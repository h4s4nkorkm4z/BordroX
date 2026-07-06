import { useEffect, useMemo, useState } from "react";
import type { PayrollRecord, Personnel } from "../types/personnel";

type Props = {
  personnel: Personnel[];
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

function calculateEntitlement(
  salary: number,
  workedDays: number,
  extraEntitlement: number,
  advancePayment: number
) {
  const safeSalary = Number(salary || 0);
  const safeWorkedDays = Math.min(Math.max(Number(workedDays || 0), 0), 30);
  const safeExtraEntitlement = Number(extraEntitlement || 0);
  const safeAdvancePayment = Number(advancePayment || 0);

  const dailySalary = safeSalary / 30;
  const workedDayAmount = dailySalary * safeWorkedDays;
  const totalEntitlement = workedDayAmount + safeExtraEntitlement;
  const totalPayment = totalEntitlement - safeAdvancePayment;

  return {
    salary: safeSalary,
    workedDayAmount,
    extraEntitlement: safeExtraEntitlement,
    totalEntitlement,
    advancePayment: safeAdvancePayment,
    totalPayment,
  };
}

export default function PayrollPage({ personnel }: Props) {
  const [selectedPersonnelId, setSelectedPersonnelId] = useState("");
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [workedDays, setWorkedDays] = useState("30");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [extraEntitlement, setExtraEntitlement] = useState("");
  const [advancePayment, setAdvancePayment] = useState("");
  const [savedPayrolls, setSavedPayrolls] = useState<PayrollRecord[]>([]);

  const selectedPersonnel = useMemo(() => {
    return personnel.find((person) => String(person.id) === selectedPersonnelId);
  }, [personnel, selectedPersonnelId]);

  const currentCalculation = calculateEntitlement(
    Number(salaryAmount || 0),
    Number(workedDays || 0),
    Number(extraEntitlement || 0),
    Number(advancePayment || 0)
  );

  const totalSavedPayment = savedPayrolls.reduce((sum, record) => {
    return sum + Number(record.totalPayment || 0);
  }, 0);

  const totalSavedAdvance = savedPayrolls.reduce((sum, record) => {
    return sum + Number(record.advancePayment || 0);
  }, 0);

  const totalPersonnelSalary = personnel.reduce((sum, person) => {
    return sum + Number(person.salary || 0);
  }, 0);

  async function loadPayrolls() {
    const data = await window.bordroxAPI.payroll.list();
    setSavedPayrolls(data);
  }

  useEffect(() => {
    loadPayrolls();
  }, []);

  function selectPersonnel(personId: string) {
    setSelectedPersonnelId(personId);

    const foundPerson = personnel.find((person) => String(person.id) === personId);

    if (foundPerson) {
      setSalaryAmount(String(foundPerson.salary ?? ""));
    } else {
      setSalaryAmount("");
    }
  }

  async function savePayroll() {
    if (!selectedPersonnel) {
      alert("Lütfen personel seçin.");
      return;
    }

    if (!month || !year) {
      alert("Lütfen ay ve yıl seçin.");
      return;
    }

    await window.bordroxAPI.payroll.create({
      personnelId: selectedPersonnel.id,
      personnelName: selectedPersonnel.name,
      department: selectedPersonnel.department,
      month,
      year,
      workedDays: workedDays || "0",

      // Veritabanında eski alan adı netSalary olarak duruyor.
      // Uygulamada bunu "Maaş" olarak kullanıyoruz.
      netSalary: Number(salaryAmount || 0),

      // Veritabanında eski alan adı extraPayment olarak duruyor.
      // Uygulamada bunu "Ek Hakediş" olarak gösteriyoruz.
      extraPayment: Number(extraEntitlement || 0),

      advancePayment: Number(advancePayment || 0),
      totalPayment: currentCalculation.totalPayment,
    });

    await loadPayrolls();

    setSelectedPersonnelId("");
    setWorkedDays("30");
    setSalaryAmount("");
    setExtraEntitlement("");
    setAdvancePayment("");
  }

  async function deletePayroll(id: number) {
    const confirmed = confirm("Bu hakediş kaydını silmek istiyor musunuz?");

    if (!confirmed) {
      return;
    }

    await window.bordroxAPI.payroll.delete(id);
    await loadPayrolls();
  }

  return (
    <>
      <header>
        <div>
          <span>03 — Bordro</span>
          <h2>Maaş ve Hakediş Takibi</h2>
          <p>Personel maaşlarını, hakedişlerini ve avanslarını buradan takip edin.</p>
        </div>

        <button className="newButton">+ Yeni Hakediş</button>
      </header>

      <section className="statsGrid payrollStats">
        <div className="statCard">
          <span>Personel Sayısı</span>
          <strong>{personnel.length}</strong>
          <small>Kayıtlı personel</small>
        </div>

        <div className="statCard">
          <span>Toplam Maaş</span>
          <strong>{formatCurrency(totalPersonnelSalary)}</strong>
          <small>Personel kartlarındaki maaş toplamı</small>
        </div>

        <div className="statCard">
          <span>Toplam Avans</span>
          <strong>{formatCurrency(totalSavedAdvance)}</strong>
          <small>Kaydedilen avans toplamı</small>
        </div>

        <div className="statCard">
          <span>Toplam Ödenecek</span>
          <strong>{formatCurrency(totalSavedPayment)}</strong>
          <small>Kaydedilen hakediş toplamı</small>
        </div>
      </section>

      <section className="panel payrollPanel">
        <div className="sectionTitleRow">
          <div>
            <h3>Hakediş Oluştur</h3>
            <p>Personel, dönem, maaş, ek hakediş ve avans bilgilerini girin.</p>
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
              min="0"
              max="30"
              value={workedDays}
              onChange={(event) => setWorkedDays(event.target.value)}
            />
          </div>

          <div className="payrollCard">
            <label>Maaş</label>

            <input
              type="number"
              value={salaryAmount}
              onChange={(event) => setSalaryAmount(event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="payrollCard">
            <label>Ek Hakediş</label>

            <input
              type="number"
              value={extraEntitlement}
              onChange={(event) => setExtraEntitlement(event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="payrollCard">
            <label>Avans</label>

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
            <span>Dönem</span>
            <strong>
              {monthNames[month]} / {year}
            </strong>
          </div>

          <div>
            <span>Çalışılan Gün</span>
            <strong>{workedDays || "0"} Gün</strong>
          </div>

          <div>
            <span>Maaş</span>
            <strong>{formatCurrency(Number(salaryAmount || 0))}</strong>
          </div>

          <div>
            <span>Günlük Hakediş</span>
            <strong>{formatCurrency(currentCalculation.workedDayAmount)}</strong>
          </div>

          <div>
            <span>Ek Hakediş</span>
            <strong>{formatCurrency(Number(extraEntitlement || 0))}</strong>
          </div>

          <div>
            <span>Avans</span>
            <strong>{formatCurrency(Number(advancePayment || 0))}</strong>
          </div>

          <div className="payrollTotal">
            <span>Ödenecek Tutar</span>
            <strong>{formatCurrency(currentCalculation.totalPayment)}</strong>
          </div>
        </div>

        <div className="payrollActions">
          <button type="button" onClick={savePayroll}>
            Hakediş Kaydet
          </button>
        </div>
      </section>

      <section className="panel savedPayrollPanel">
        <div className="sectionTitleRow">
          <div>
            <h3>Kaydedilen Hakedişler</h3>
            <p>Veritabanına kaydedilen maaş, hakediş ve avans kayıtları.</p>
          </div>
        </div>

        {savedPayrolls.length === 0 ? (
          <div className="emptyState">
            <h3>Henüz kayıt yok</h3>
            <p>Yukarıdaki formdan personel seçip hakediş kaydedin.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Personel</th>
                <th>Dönem</th>
                <th>Çalışılan Gün</th>
                <th>Maaş</th>
                <th>Ek Hakediş</th>
                <th>Avans</th>
                <th>Ödenecek</th>
                <th>Kayıt Tarihi</th>
                <th>İşlem</th>
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
                    {record.createdAt
                      ? new Date(record.createdAt).toLocaleDateString("tr-TR")
                      : "-"}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="tableActionButton danger"
                      onClick={() => deletePayroll(record.id)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}