import { supabase } from '../lib/supabase';
import type { InvoiceData } from '../types/invoice';

const BUCKET = 'invoice-photos';

async function uploadPhoto(
  file: File,
  bestellnummer: string,
  index: number
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${bestellnummer}/photo${index}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) throw new Error(`Foto ${index} Upload fehlgeschlagen: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function submitToSupabase(data: InvoiceData): Promise<void> {
  const photos = [
    data.sonderWuensche.photo1,
    data.sonderWuensche.photo2,
    data.sonderWuensche.photo3,
    data.sonderWuensche.photo4,
    data.sonderWuensche.photo5,
    data.sonderWuensche.photo6,
  ];

  const photoUrls = await Promise.all(
    photos.map((photo, i) =>
      photo ? uploadPhoto(photo, data.bestellnummer, i + 1) : Promise.resolve(null)
    )
  );

  const { error } = await supabase.from('invoices').insert({
    bestellnummer: data.bestellnummer,
    datum: data.datum,
    modell: data.modell,
    farbe: data.farbe,
    kategorien: data.kategorien ?? null,
    versandoption: data.versandoption,
    zahlungsart: data.zahlungsart,
    lieferdatum: data.lieferdatum,
    anzahlung: data.anzahlung === '' ? null : Number(data.anzahlung),
    gesamtpreis: data.gesamtpreis === '' ? null : Number(data.gesamtpreis),
    kundendaten_name: data.kundendaten.name,
    kundendaten_strasse: data.kundendaten.strasse,
    kundendaten_plz: data.kundendaten.plz,
    kundendaten_ort: data.kundendaten.ort,
    kundendaten_telefonnummer: data.kundendaten.telefonnummer,
    kundendaten_email: data.kundendaten.email,
    sonderwuensche_text: data.sonderWuensche.text,
    photo1_url: photoUrls[0],
    photo1_notes: data.sonderWuensche.photo1Notes,
    photo2_url: photoUrls[1],
    photo2_notes: data.sonderWuensche.photo2Notes,
    photo3_url: photoUrls[2],
    photo3_notes: data.sonderWuensche.photo3Notes,
    photo4_url: photoUrls[3],
    photo4_notes: data.sonderWuensche.photo4Notes,
    photo5_url: photoUrls[4],
    photo5_notes: data.sonderWuensche.photo5Notes,
    photo6_url: photoUrls[5],
    photo6_notes: data.sonderWuensche.photo6Notes,
  });

  if (error) throw new Error(`Datenbank-Fehler: ${error.message}`);
}
