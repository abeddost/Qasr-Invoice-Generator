import React from 'react';
import { MapPin, Phone, Euro, Calendar, Package, Palette, Tag } from 'lucide-react';
import type { InvoiceData, CompanyInfo } from '../types/invoice';

interface InvoicePreviewProps {
  data: InvoiceData;
  companyInfo: CompanyInfo;
}

export default function InvoicePreview({ data, companyInfo }: InvoicePreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const formatCurrencyValue = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return formatCurrency(numAmount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 min-h-[600px]" id="invoice-preview">
      {/* Company Header */}
      <div className="border-b-2 border-blue-600 pb-8 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-700 mb-3">{companyInfo.name}</h1>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {companyInfo.address}
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {companyInfo.phone}
              </div>
            </div>
          </div>
      </div>

      {/* Invoice Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rechnungsdetails</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Package className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium">Bestellnummer:</span>
              <span className="ml-2 text-gray-900">{data.bestellnummer || 'Noch nicht eingegeben'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium">Datum:</span>
              <span className="ml-2 text-gray-900">{formatDate(data.datum) || 'Noch nicht eingegeben'}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Kundendaten</h2>
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <div className="font-medium text-gray-900 mb-2">{data.kundendaten.name || 'Name noch nicht eingegeben'}</div>
            <div className="text-gray-600 mb-1">{data.kundendaten.strasse || 'Straße noch nicht eingegeben'}</div>
            <div className="text-gray-600 mb-2">
              {data.kundendaten.plz || 'PLZ'} {data.kundendaten.ort || 'Ort noch nicht eingegeben'}
            </div>
            <div className="text-gray-600 mb-1">{data.kundendaten.telefonnummer || 'Telefon noch nicht eingegeben'}</div>
            {data.kundendaten.email && (
              <div className="text-gray-600">{data.kundendaten.email}</div>
            )}
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Produktinformationen</h2>
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-700">Modell</div>
                <div className="text-gray-900">{data.modell || 'Noch nicht eingegeben'}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-700">Farbe</div>
                <div className="text-gray-900">{data.farbe || 'Noch nicht eingegeben'}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Tag className="w-5 h-5 mr-2 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-700">Kategorien</div>
                <div className="text-gray-900">{data.kategorien || 'Noch nicht eingegeben'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Versandoptionen */}
      {data.versandoption && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Versandoptionen</h2>
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></div>
              <span className="text-lg font-medium text-indigo-900">{data.versandoption}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sonderwünsche */}
      {(data.sonderWuensche.text || data.sonderWuensche.photo1 || data.sonderWuensche.photo2 || data.sonderWuensche.photo3 || data.sonderWuensche.photo4 || data.sonderWuensche.photo5 || data.sonderWuensche.photo6) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sonderwünsche</h2>
          <div className="bg-emerald-50 rounded-lg p-6">
            {data.sonderWuensche.text && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Notizen:</h3>
                <p className="text-gray-900 whitespace-pre-line">{data.sonderWuensche.text}</p>
              </div>
            )}
            
            {(data.sonderWuensche.photo1 || data.sonderWuensche.photo2 || data.sonderWuensche.photo3 || data.sonderWuensche.photo4 || data.sonderWuensche.photo5 || data.sonderWuensche.photo6) && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Bilder:</h3>
                <div className="space-y-4">
                  {data.sonderWuensche.photo1 && (
                    <div>
                      <img 
                        src={URL.createObjectURL(data.sonderWuensche.photo1)} 
                        alt="Sonderwunsch Foto 1" 
                        className="w-full h-64 object-cover rounded-lg border shadow-sm"
                      />
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Foto 1</p>
                        {data.sonderWuensche.photo1Notes && (
                          <p className="text-sm text-gray-600 mt-1">{data.sonderWuensche.photo1Notes}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {data.sonderWuensche.photo2 && (
                    <div>
                      <img 
                        src={URL.createObjectURL(data.sonderWuensche.photo2)} 
                        alt="Sonderwunsch Foto 2" 
                        className="w-full h-64 object-cover rounded-lg border shadow-sm"
                      />
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Foto 2</p>
                        {data.sonderWuensche.photo2Notes && (
                          <p className="text-sm text-gray-600 mt-1">{data.sonderWuensche.photo2Notes}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {data.sonderWuensche.photo3 && (
                    <div>
                      <img 
                        src={URL.createObjectURL(data.sonderWuensche.photo3)} 
                        alt="Sonderwunsch Foto 3" 
                        className="w-full h-64 object-cover rounded-lg border shadow-sm"
                      />
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Foto 3</p>
                        {data.sonderWuensche.photo3Notes && (
                          <p className="text-sm text-gray-600 mt-1">{data.sonderWuensche.photo3Notes}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {data.sonderWuensche.photo4 && (
                    <div>
                      <img 
                        src={URL.createObjectURL(data.sonderWuensche.photo4)} 
                        alt="Sonderwunsch Foto 4" 
                        className="w-full h-64 object-cover rounded-lg border shadow-sm"
                      />
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Foto 4</p>
                        {data.sonderWuensche.photo4Notes && (
                          <p className="text-sm text-gray-600 mt-1">{data.sonderWuensche.photo4Notes}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {data.sonderWuensche.photo5 && (
                    <div>
                      <img 
                        src={URL.createObjectURL(data.sonderWuensche.photo5)} 
                        alt="Sonderwunsch Foto 5" 
                        className="w-full h-64 object-cover rounded-lg border shadow-sm"
                      />
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Foto 5</p>
                        {data.sonderWuensche.photo5Notes && (
                          <p className="text-sm text-gray-600 mt-1">{data.sonderWuensche.photo5Notes}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {data.sonderWuensche.photo6 && (
                    <div>
                      <img 
                        src={URL.createObjectURL(data.sonderWuensche.photo6)} 
                        alt="Sonderwunsch Foto 6" 
                        className="w-full h-64 object-cover rounded-lg border shadow-sm"
                      />
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Foto 6</p>
                        {data.sonderWuensche.photo6Notes && (
                          <p className="text-sm text-gray-600 mt-1">{data.sonderWuensche.photo6Notes}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment and Delivery */}
      <div className="border-t pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-orange-50 rounded-lg p-6">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Lieferdatum</h3>
            </div>
            <p className="text-lg font-bold text-orange-700">{formatDate(data.lieferdatum) || 'Noch nicht eingegeben'}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-2">
              <Euro className="w-5 h-5 mr-2 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Anzahlung</h3>
            </div>
            <p className="text-lg font-bold text-blue-700">{formatCurrencyValue(data.anzahlung)}</p>
          </div>

          <div className="bg-emerald-50 rounded-lg p-6 border-2 border-emerald-200">
            <div className="flex items-center mb-2">
              <Euro className="w-5 h-5 mr-2 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">Gesamtpreis</h3>
            </div>
            <p className="text-xl font-bold text-emerald-700">{formatCurrencyValue(data.gesamtpreis)}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center mb-2">
              <Euro className="w-5 h-5 mr-2 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Zahlungsart</h3>
            </div>
            <p className="text-lg font-bold text-purple-700">{data.zahlungsart || 'Noch nicht gewählt'}</p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <p>Restbetrag: {formatCurrencyValue((typeof data.gesamtpreis === 'string' ? parseFloat(data.gesamtpreis) || 0 : data.gesamtpreis) - (typeof data.anzahlung === 'string' ? parseFloat(data.anzahlung) || 0 : data.anzahlung))}</p>
        </div>

        {/* Return and Cancellation Terms */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Rückgabe-, Stornierungs-, Gewährleistungs- und Lieferbedingungen
          </h2>
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <div className="space-y-4 text-sm text-gray-700 text-justify">
              {/* Stornierung */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Stornierung:</h3>
                <div className="space-y-2 pl-5">
                  <p>
                    Bestellungen können innerhalb von 24 Stunden nach
                    <br />
                    Auftragserteilung kostenlos storniert werden.
                  </p>
                  <p>
                    Nach Ablauf von 24 Stunden bis vor der Lieferung fällt
                    <br />
                    eine Stornogebühr von 20 % des Kaufpreises an.
                  </p>
                </div>
              </div>

              {/* Rückgabe */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Rückgabe:</h3>
                <div className="space-y-2 pl-5">
                  <p>
                    Nach Lieferung sind Rückgaben nur bei Mängeln oder
                    <br />
                    Schäden möglich.
                  </p>
                  <p>
                    Sonderanfertigungen oder speziell bestellte Waren sind
                    <br />
                    von Rückgabe und Stornierung ausgeschlossen.
                  </p>
                </div>
              </div>

              {/* Gewährleistung */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Gewährleistung:</h3>
                <div className="space-y-2 pl-5">
                  <p>
                    Für alle Möbelstücke gilt eine 2-jährige gesetzliche
                    <br />
                    Gewährleistung auf Herstellungsfehler und
                    <br />
                    Materialmängel ab Lieferdatum.
                  </p>
                  <p>
                    Von der Gewährleistung ausgeschlossen sind normale
                    <br />
                    Abnutzung, unsachgemäße Nutzung sowie elektronische
                    <br />
                    Geräte – für diese wird keine Gewährleistung oder
                    <br />
                    Garantie übernommen.
                  </p>
                </div>
              </div>

              {/* Lieferung */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Lieferung:</h3>
                <div className="space-y-2 pl-5">
                  <p>
                    Wir bemühen uns, alle Bestellungen pünktlich und
                    <br />
                    zuverlässig zu liefern.
                  </p>
                  <p>
                    Bitte beachten Sie jedoch, dass es in seltenen Fällen
                    <br />
                    zu Verzögerungen kommen kann, die außerhalb unseres
                    <br />
                    Einflussbereichs liegen – z. B. durch Zollabfertigung,
                    <br />
                    Transportprobleme oder unvorhersehbare Ereignisse.
                    <br />
                    In solchen Fällen übernehmen wir keine Haftung für
                    <br />
                    Lieferverzögerungen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
