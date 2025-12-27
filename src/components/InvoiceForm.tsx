import React, { useState, useEffect } from 'react';
import { Upload, Calendar, Euro, Package, Palette, Tag } from 'lucide-react';
import type { InvoiceData } from '../types/invoice';

interface InvoiceFormProps {
  data: InvoiceData;
  onDataChange: (data: InvoiceData) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function InvoiceForm({ data, onDataChange, onSubmit, isSubmitting }: InvoiceFormProps) {
  const [photo1Preview, setPhoto1Preview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);
  const [photo3Preview, setPhoto3Preview] = useState<string | null>(null);
  const [photo4Preview, setPhoto4Preview] = useState<string | null>(null);
  const [photo5Preview, setPhoto5Preview] = useState<string | null>(null);
  const [photo6Preview, setPhoto6Preview] = useState<string | null>(null);

  useEffect(() => {
    if (data.sonderWuensche.photo1) {
      const url = URL.createObjectURL(data.sonderWuensche.photo1);
      setPhoto1Preview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhoto1Preview(null);
    }
  }, [data.sonderWuensche.photo1]);

  useEffect(() => {
    if (data.sonderWuensche.photo2) {
      const url = URL.createObjectURL(data.sonderWuensche.photo2);
      setPhoto2Preview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhoto2Preview(null);
    }
  }, [data.sonderWuensche.photo2]);

  useEffect(() => {
    if (data.sonderWuensche.photo3) {
      const url = URL.createObjectURL(data.sonderWuensche.photo3);
      setPhoto3Preview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhoto3Preview(null);
    }
  }, [data.sonderWuensche.photo3]);

  useEffect(() => {
    if (data.sonderWuensche.photo4) {
      const url = URL.createObjectURL(data.sonderWuensche.photo4);
      setPhoto4Preview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhoto4Preview(null);
    }
  }, [data.sonderWuensche.photo4]);

  useEffect(() => {
    if (data.sonderWuensche.photo5) {
      const url = URL.createObjectURL(data.sonderWuensche.photo5);
      setPhoto5Preview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhoto5Preview(null);
    }
  }, [data.sonderWuensche.photo5]);

  useEffect(() => {
    if (data.sonderWuensche.photo6) {
      const url = URL.createObjectURL(data.sonderWuensche.photo6);
      setPhoto6Preview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhoto6Preview(null);
    }
  }, [data.sonderWuensche.photo6]);

  const handleInputChange = (field: string, value: string | number) => {
    const keys = field.split('.');
    const newData = { ...data };
    
    if (keys.length === 1) {
      (newData as any)[keys[0]] = value;
    } else if (keys.length === 2) {
      (newData as any)[keys[0]][keys[1]] = value;
    } else if (keys.length === 3) {
      (newData as any)[keys[0]][keys[1]][keys[2]] = value;
    }
    
    onDataChange(newData);
  };

  const handleFileChange = (fileNumber: 1 | 2 | 3 | 4 | 5 | 6, file: File | null) => {
    const newData = { ...data };
    if (fileNumber === 1) {
      newData.sonderWuensche.photo1 = file;
    } else if (fileNumber === 2) {
      newData.sonderWuensche.photo2 = file;
    } else if (fileNumber === 3) {
      newData.sonderWuensche.photo3 = file;
    } else if (fileNumber === 4) {
      newData.sonderWuensche.photo4 = file;
    } else if (fileNumber === 5) {
      newData.sonderWuensche.photo5 = file;
    } else {
      newData.sonderWuensche.photo6 = file;
    }
    onDataChange(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.versandoption) {
      alert('Bitte wählen Sie eine Versandoption.');
      return;
    }
    onSubmit();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rechnung erstellen</h1>
        <p className="text-gray-600">Füllen Sie alle Felder aus, um eine professionelle Rechnung zu generieren</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bestellnummer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Package className="inline w-4 h-4 mr-1" />
              Bestellnummer *
            </label>
            <input
              type="text"
              value={data.bestellnummer}
              onChange={(e) => handleInputChange('bestellnummer', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="2025-09-SH-001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Datum *
            </label>
            <input
              type="date"
              value={data.datum}
              onChange={(e) => handleInputChange('datum', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Kundendaten */}
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Kundendaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={data.kundendaten.name}
                onChange={(e) => handleInputChange('kundendaten.name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Max Mustermann"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefonnummer *</label>
              <input
                type="tel"
                value={data.kundendaten.telefonnummer}
                onChange={(e) => handleInputChange('kundendaten.telefonnummer', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0123 456789"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Straße *</label>
              <input
                type="text"
                value={data.kundendaten.strasse}
                onChange={(e) => handleInputChange('kundendaten.strasse', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Musterstraße 123"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">PLZ *</label>
              <input
                type="text"
                value={data.kundendaten.plz}
                onChange={(e) => handleInputChange('kundendaten.plz', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="12345"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ort *</label>
              <input
                type="text"
                value={data.kundendaten.ort}
                onChange={(e) => handleInputChange('kundendaten.ort', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Musterstadt"
                required
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-Mail</label>
              <input
                type="email"
                value={data.kundendaten.email}
                onChange={(e) => handleInputChange('kundendaten.email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="kunde@email.de"
              />
            </div>
          </div>
        </div>

        {/* Produktdaten */}
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Produktdaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Package className="inline w-4 h-4 mr-1" />
                Modell *
              </label>
              <input
                type="text"
                value={data.modell}
                onChange={(e) => handleInputChange('modell', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Sofa Premium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Palette className="inline w-4 h-4 mr-1" />
                Farbe *
              </label>
              <input
                type="text"
                value={data.farbe}
                onChange={(e) => handleInputChange('farbe', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Dunkelblau"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Kategorien
              </label>
              <input
                type="text"
                value={data.kategorien}
                onChange={(e) => handleInputChange('kategorien', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Wohnzimmer, Polstermöbel"
              />
            </div>
          </div>
        </div>

        {/* Versandoptionen */}
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Versandoptionen</h2>
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="depot"
                  name="versandoption"
                  value="Versand aus Depot"
                  checked={data.versandoption === 'Versand aus Depot'}
                  onChange={(e) => handleInputChange('versandoption', e.target.value)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
                  required
                />
                <label htmlFor="depot" className="ml-3 text-sm font-medium text-gray-900">
                  Versand aus Depot
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="turkey"
                  name="versandoption"
                  value="Versand aus Türkei"
                  checked={data.versandoption === 'Versand aus Türkei'}
                  onChange={(e) => handleInputChange('versandoption', e.target.value)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
                  required
                />
                <label htmlFor="turkey" className="ml-3 text-sm font-medium text-gray-900">
                  Versand aus Türkei
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sonderwünsche */}
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sonderwünsche</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notizen</label>
            <textarea
              value={data.sonderWuensche.text}
              onChange={(e) => handleInputChange('sonderWuensche.text', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Spezielle Wünsche, Anmerkungen oder Änderungen..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Upload className="inline w-4 h-4 mr-1" />
                Foto 1 (JPG/PNG)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(1, e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notizen zu Foto 1</label>
                <textarea
                  value={data.sonderWuensche.photo1Notes}
                  onChange={(e) => handleInputChange('sonderWuensche.photo1Notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Beschreibung oder Anmerkungen zu diesem Foto..."
                />
              </div>
              {photo1Preview && (
                <div className="mt-4">
                  <img src={photo1Preview} alt="Foto 1 Vorschau" className="w-full h-48 object-cover rounded-lg border shadow-sm" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Upload className="inline w-4 h-4 mr-1" />
                Foto 2 (JPG/PNG)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(2, e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notizen zu Foto 2</label>
                <textarea
                  value={data.sonderWuensche.photo2Notes}
                  onChange={(e) => handleInputChange('sonderWuensche.photo2Notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Beschreibung oder Anmerkungen zu diesem Foto..."
                />
              </div>
              {photo2Preview && (
                <div className="mt-4">
                  <img src={photo2Preview} alt="Foto 2 Vorschau" className="w-full h-48 object-cover rounded-lg border shadow-sm" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Upload className="inline w-4 h-4 mr-1" />
                Foto 3 (JPG/PNG)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(3, e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notizen zu Foto 3</label>
                <textarea
                  value={data.sonderWuensche.photo3Notes}
                  onChange={(e) => handleInputChange('sonderWuensche.photo3Notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Beschreibung oder Anmerkungen zu diesem Foto..."
                />
              </div>
              {photo3Preview && (
                <div className="mt-4">
                  <img src={photo3Preview} alt="Foto 3 Vorschau" className="w-full h-48 object-cover rounded-lg border shadow-sm" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Upload className="inline w-4 h-4 mr-1" />
                Foto 4 (JPG/PNG)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(4, e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notizen zu Foto 4</label>
                <textarea
                  value={data.sonderWuensche.photo4Notes}
                  onChange={(e) => handleInputChange('sonderWuensche.photo4Notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Beschreibung oder Anmerkungen zu diesem Foto..."
                />
              </div>
              {photo4Preview && (
                <div className="mt-4">
                  <img src={photo4Preview} alt="Foto 4 Vorschau" className="w-full h-48 object-cover rounded-lg border shadow-sm" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Upload className="inline w-4 h-4 mr-1" />
                Foto 5 (JPG/PNG)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(5, e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notizen zu Foto 5</label>
                <textarea
                  value={data.sonderWuensche.photo5Notes}
                  onChange={(e) => handleInputChange('sonderWuensche.photo5Notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Beschreibung oder Anmerkungen zu diesem Foto..."
                />
              </div>
              {photo5Preview && (
                <div className="mt-4">
                  <img src={photo5Preview} alt="Foto 5 Vorschau" className="w-full h-48 object-cover rounded-lg border shadow-sm" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Upload className="inline w-4 h-4 mr-1" />
                Foto 6 (JPG/PNG)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(6, e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notizen zu Foto 6</label>
                <textarea
                  value={data.sonderWuensche.photo6Notes}
                  onChange={(e) => handleInputChange('sonderWuensche.photo6Notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Beschreibung oder Anmerkungen zu diesem Foto..."
                />
              </div>
              {photo6Preview && (
                <div className="mt-4">
                  <img src={photo6Preview} alt="Foto 6 Vorschau" className="w-full h-48 object-cover rounded-lg border shadow-sm" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preise und Lieferung */}
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preise und Lieferung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Lieferdatum *
              </label>
              <input
                type="date"
                value={data.lieferdatum}
                onChange={(e) => handleInputChange('lieferdatum', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Euro className="inline w-4 h-4 mr-1" />
                Anzahlung (€) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={data.anzahlung === '' ? '' : data.anzahlung}
                onChange={(e) => handleInputChange('anzahlung', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Betrag eingeben"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Euro className="inline w-4 h-4 mr-1" />
                Gesamtpreis (€) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={data.gesamtpreis === '' ? '' : data.gesamtpreis}
                onChange={(e) => handleInputChange('gesamtpreis', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Betrag eingeben"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Euro className="inline w-4 h-4 mr-1" />
                Zahlungsart *
              </label>
              <select
                value={data.zahlungsart}
                onChange={(e) => handleInputChange('zahlungsart', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Bitte wählen</option>
                <option value="Bar">Bar (Barzahlung)</option>
                <option value="Kreditkarte">Kreditkarte</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="border-t pt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? 'Verarbeitung...' : 'Rechnung erstellen und senden'}
          </button>
        </div>
      </form>
    </div>
  );
}