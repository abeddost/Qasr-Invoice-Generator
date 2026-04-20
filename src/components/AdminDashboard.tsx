import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, RefreshCw, ChevronDown, ChevronUp, X, Euro, Package, Truck, CreditCard, Banknote, Image, LogOut, Trash2 } from 'lucide-react';

interface Invoice {
  id: string;
  created_at: string;
  bestellnummer: string;
  datum: string;
  modell: string;
  farbe: string;
  kategorien: string | null;
  versandoption: string;
  zahlungsart: string;
  lieferdatum: string;
  anzahlung: number | null;
  gesamtpreis: number | null;
  kundendaten_name: string;
  kundendaten_strasse: string;
  kundendaten_plz: string;
  kundendaten_ort: string;
  kundendaten_telefonnummer: string;
  kundendaten_email: string | null;
  sonderwuensche_text: string | null;
  photo1_url: string | null;
  photo1_notes: string | null;
  photo2_url: string | null;
  photo2_notes: string | null;
  photo3_url: string | null;
  photo3_notes: string | null;
  photo4_url: string | null;
  photo4_notes: string | null;
  photo5_url: string | null;
  photo5_notes: string | null;
  photo6_url: string | null;
  photo6_notes: string | null;
}

const fmt = (n: number | null) =>
  n != null ? `€ ${n.toLocaleString('de-DE', { minimumFractionDigits: 2 })}` : '—';

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

interface Props {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setInvoices(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase();
    return (
      inv.bestellnummer.toLowerCase().includes(q) ||
      inv.kundendaten_name.toLowerCase().includes(q) ||
      inv.modell.toLowerCase().includes(q) ||
      inv.farbe.toLowerCase().includes(q) ||
      inv.kundendaten_ort.toLowerCase().includes(q)
    );
  });

  const totalRevenue = invoices.reduce((s, i) => s + (i.gesamtpreis ?? 0), 0);
  const totalAnzahlung = invoices.reduce((s, i) => s + (i.anzahlung ?? 0), 0);

  const deleteInvoice = async (id: string) => {
    if (!window.confirm('Rechnung wirklich löschen?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      alert(`Fehler: ${error.message}`);
    } else {
      setInvoices(prev => prev.filter(i => i.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
    setDeletingId(null);
  };

  const photos = (inv: Invoice) =>
    [1, 2, 3, 4, 5, 6].flatMap(n => {
      const url = inv[`photo${n}_url` as keyof Invoice] as string | null;
      const notes = inv[`photo${n}_notes` as keyof Invoice] as string | null;
      return url ? [{ url, notes, n }] : [];
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxUrl}
            alt="Foto"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-500 mt-1">Alle Rechnungen im Überblick</p>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); onLogout(); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Abmelden
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Rechnungen gesamt</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{invoices.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Gesamtumsatz</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{fmt(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Anzahlungen gesamt</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{fmt(totalAnzahlung)}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Suchen nach Name, Bestellnr., Modell..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Fehler: {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">Lade Daten...</div>
        ) : filtered.length === 0 ? (
          <div className="flex justify-center py-20 text-gray-400">
            {search ? 'Keine Ergebnisse gefunden.' : 'Noch keine Rechnungen vorhanden.'}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(inv => {
              const expanded = expandedId === inv.id;
              const invPhotos = photos(inv);
              return (
                <div
                  key={inv.id}
                  className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Row header */}
                  <button
                    className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(expanded ? null : inv.id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-4 min-w-0">
                        <div>
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            #{inv.bestellnummer}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{inv.kundendaten_name}</p>
                          <p className="text-xs text-gray-500">{inv.modell} · {inv.farbe}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right hidden sm:block">
                          <p className="font-semibold text-emerald-700">{fmt(inv.gesamtpreis)}</p>
                          <p className="text-xs text-gray-500">Anzahlung: {fmt(inv.anzahlung)}</p>
                        </div>
                        <div className="text-right hidden md:block">
                          <p className="text-gray-700">{fmtDate(inv.datum)}</p>
                          <p className="text-xs text-gray-500">Lieferung: {fmtDate(inv.lieferdatum)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {inv.zahlungsart === 'Bar' ? (
                            <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                              <Banknote className="w-3 h-3" /> Bar
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                              <CreditCard className="w-3 h-3" /> Karte
                            </span>
                          )}
                          {invPhotos.length > 0 && (
                            <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              <Image className="w-3 h-3" /> {invPhotos.length}
                            </span>
                          )}
                        </div>
                        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); deleteInvoice(inv.id); }}
                    disabled={deletingId === inv.id}
                    className="absolute top-4 right-10 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                    title="Rechnung löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Expanded detail */}
                  {expanded && (
                    <div className="border-t border-gray-100 px-5 py-5 bg-gray-50 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {/* Customer */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kundendaten</h4>
                          <p className="font-medium text-gray-900">{inv.kundendaten_name}</p>
                          <p className="text-sm text-gray-600">{inv.kundendaten_strasse}</p>
                          <p className="text-sm text-gray-600">{inv.kundendaten_plz} {inv.kundendaten_ort}</p>
                          <p className="text-sm text-gray-600 mt-1">📞 {inv.kundendaten_telefonnummer}</p>
                          {inv.kundendaten_email && (
                            <p className="text-sm text-gray-600">✉️ {inv.kundendaten_email}</p>
                          )}
                        </div>

                        {/* Product */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Produkt</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span>{inv.modell}</span>
                          </div>
                          <p className="text-sm text-gray-600">Farbe: {inv.farbe}</p>
                          {inv.kategorien && <p className="text-sm text-gray-600">Kategorie: {inv.kategorien}</p>}
                          <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                            <Truck className="w-4 h-4 text-gray-400" />
                            <span>{inv.versandoption}</span>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preise & Zahlung</h4>
                          <div className="flex items-center gap-2 mb-1">
                            <Euro className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">Gesamtpreis: <span className="font-semibold text-emerald-700">{fmt(inv.gesamtpreis)}</span></span>
                          </div>
                          <p className="text-sm text-gray-600">Anzahlung: {fmt(inv.anzahlung)}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Zahlung: {inv.zahlungsart === 'Bar' ? '💵 Bar' : '💳 Kreditkarte'}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">Bestelldatum: {fmtDate(inv.datum)}</p>
                          <p className="text-sm text-gray-600">Lieferdatum: {fmtDate(inv.lieferdatum)}</p>
                        </div>
                      </div>

                      {/* Special requests */}
                      {inv.sonderwuensche_text && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sonderwünsche</h4>
                          <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2">
                            {inv.sonderwuensche_text}
                          </p>
                        </div>
                      )}

                      {/* Photos */}
                      {invPhotos.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Fotos ({invPhotos.length})
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                            {invPhotos.map(({ url, notes, n }) => (
                              <div key={n} className="group">
                                <button
                                  onClick={() => setLightboxUrl(url)}
                                  className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <img
                                    src={url}
                                    alt={`Foto ${n}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </button>
                                {notes && (
                                  <p className="text-xs text-gray-500 mt-1 truncate" title={notes}>{notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-400">
                        Eingegangen: {new Date(inv.created_at).toLocaleString('de-DE')}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
