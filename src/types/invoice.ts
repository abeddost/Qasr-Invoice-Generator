export interface InvoiceData {
  bestellnummer: string;
  kundendaten: {
    name: string;
    strasse: string;
    plz: string;
    ort: string;
    telefonnummer: string;
    email: string;
  };
  datum: string;
  modell: string;
  farbe: string;
  kategorien: string;
  sonderWuensche: {
    text: string;
    photo1: File | null;
    photo1Notes: string;
    photo2: File | null;
    photo2Notes: string;
    photo3: File | null;
    photo3Notes: string;
    photo4: File | null;
    photo4Notes: string;
  };
  lieferdatum: string;
  anzahlung: number | string;
  gesamtpreis: number | string;
  versandoption: string;
  zahlungsart: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
}