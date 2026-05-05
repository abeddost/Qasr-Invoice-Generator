import { supabase } from '../lib/supabase';
import type { InvoiceData } from '../types/invoice';

const BUCKET = 'invoice-photos';

const emptyToNull = (value: string) => (value.trim() === '' ? null : value);
const numberOrNull = (value: number | string) => (value === '' ? null : Number(value));

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
  const invoicePayload = {
    bestellnummer: data.bestellnummer,
    datum: data.datum,
    modell: data.modell,
    farbe: data.farbe,
    kategorien: emptyToNull(data.kategorien ?? ''),
    versandoption: data.versandoption,
    zahlungsart: data.zahlungsart,
    lieferdatum: data.lieferdatum,
    anzahlung: numberOrNull(data.anzahlung),
    gesamtpreis: numberOrNull(data.gesamtpreis),
    kundendaten_name: data.kundendaten.name,
    kundendaten_strasse: data.kundendaten.strasse,
    kundendaten_plz: data.kundendaten.plz,
    kundendaten_ort: data.kundendaten.ort,
    kundendaten_telefonnummer: data.kundendaten.telefonnummer,
    kundendaten_email: emptyToNull(data.kundendaten.email),
    sonderwuensche_text: emptyToNull(data.sonderWuensche.text),
    photo1_notes: emptyToNull(data.sonderWuensche.photo1Notes),
    photo2_notes: emptyToNull(data.sonderWuensche.photo2Notes),
    photo3_notes: emptyToNull(data.sonderWuensche.photo3Notes),
    photo4_notes: emptyToNull(data.sonderWuensche.photo4Notes),
    photo5_notes: emptyToNull(data.sonderWuensche.photo5Notes),
    photo6_notes: emptyToNull(data.sonderWuensche.photo6Notes),
  };

  const { error: insertError } = await supabase
    .from('invoices')
    .insert(invoicePayload);

  if (insertError) throw new Error(`Datenbank-Fehler: ${insertError.message}`);

  const photos = [
    data.sonderWuensche.photo1,
    data.sonderWuensche.photo2,
    data.sonderWuensche.photo3,
    data.sonderWuensche.photo4,
    data.sonderWuensche.photo5,
    data.sonderWuensche.photo6,
  ];

  const uploadResults = await Promise.allSettled(
    photos.map((photo, i) =>
      photo ? uploadPhoto(photo, data.bestellnummer, i + 1) : Promise.resolve(null)
    )
  );

  const photoUpdates = uploadResults.reduce<Record<string, string>>((updates, result, i) => {
    if (result.status === 'fulfilled' && result.value) {
      updates[`photo${i + 1}_url`] = result.value;
    } else if (result.status === 'rejected') {
      console.error(`Foto ${i + 1} Upload fehlgeschlagen:`, result.reason);
    }
    return updates;
  }, {});

  if (Object.keys(photoUpdates).length === 0) return;

  const { error: updateError } = await supabase
    .from('invoices')
    .update(photoUpdates)
    .eq('bestellnummer', data.bestellnummer);

  if (updateError) {
    console.error(`Foto-URLs konnten nicht gespeichert werden: ${updateError.message}`);
  }
}
