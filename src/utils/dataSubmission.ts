import type { InvoiceData } from '../types/invoice';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzGeMYQBOZxhX5yUVpFpEYmYmTJzCX-CIpOZRkIOl5pNwIPvfNvdptbDvP-DRaybOir/exec';

export const submitToGoogleAppsScript = async (data: InvoiceData): Promise<void> => {
  try {
    const formData = new FormData();

    // Add text fields
    formData.append('Bestellnummer', data.bestellnummer);
    formData.append('Kundendaten_Name', data.kundendaten.name);
    formData.append('Kundendaten_Strasse', data.kundendaten.strasse);
    formData.append('Kundendaten_PLZ', data.kundendaten.plz);
    formData.append('Kundendaten_Ort', data.kundendaten.ort);
    formData.append('Kundendaten_Telefonnummer', data.kundendaten.telefonnummer);
    formData.append('Kundendaten_Email', data.kundendaten.email);
    formData.append('Datum', data.datum);
    formData.append('Modell', data.modell);
    formData.append('Farbe', data.farbe);
    if (typeof data.kategorien === 'string' && data.kategorien.trim() !== '') {
      formData.append('Kategorien', data.kategorien);
    }
    formData.append('Sonderwuensche_Text', data.sonderWuensche.text);
    formData.append('Lieferdatum', data.lieferdatum);
    formData.append('Anzahlung', data.anzahlung.toString());
    formData.append('Gesamtpreis', data.gesamtpreis.toString());
    formData.append('Versandoption', data.versandoption);
    formData.append('Zahlungsart', data.zahlungsart);

    // Add photos if they exist
    if (data.sonderWuensche.photo1) {
      formData.append('Sonderwuensche_Photo1', data.sonderWuensche.photo1);
    }
    formData.append('Sonderwuensche_Photo1Notes', data.sonderWuensche.photo1Notes);
    
    if (data.sonderWuensche.photo2) {
      formData.append('Sonderwuensche_Photo2', data.sonderWuensche.photo2);
    }
    formData.append('Sonderwuensche_Photo2Notes', data.sonderWuensche.photo2Notes);
    
    if (data.sonderWuensche.photo3) {
      formData.append('Sonderwuensche_Photo3', data.sonderWuensche.photo3);
    }
    formData.append('Sonderwuensche_Photo3Notes', data.sonderWuensche.photo3Notes);
    
    if (data.sonderWuensche.photo4) {
      formData.append('Sonderwuensche_Photo4', data.sonderWuensche.photo4);
    }
    formData.append('Sonderwuensche_Photo4Notes', data.sonderWuensche.photo4Notes);
    
    if (data.sonderWuensche.photo5) {
      formData.append('Sonderwuensche_Photo5', data.sonderWuensche.photo5);
    }
    formData.append('Sonderwuensche_Photo5Notes', data.sonderWuensche.photo5Notes);
    
    if (data.sonderWuensche.photo6) {
      formData.append('Sonderwuensche_Photo6', data.sonderWuensche.photo6);
    }
    formData.append('Sonderwuensche_Photo6Notes', data.sonderWuensche.photo6Notes);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Google Apps Script requires this
    });

    // Note: With no-cors mode, we can't read the response
    // The request will succeed if it reaches the server
    console.log('Data submitted to Google Apps Script');
  } catch (error) {
    console.error('Error submitting data to Google Apps Script:', error);
    throw new Error('Datenübertragung fehlgeschlagen');
  }
};