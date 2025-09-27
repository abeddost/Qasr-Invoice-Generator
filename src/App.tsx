import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { generatePDF } from './utils/pdfGenerator';
import { submitToGoogleAppsScript } from './utils/dataSubmission';
import type { InvoiceData, CompanyInfo } from './types/invoice';

const initialData: InvoiceData = {
  bestellnummer: '',
  kundendaten: {
    name: '',
    strasse: '',
    plz: '',
    ort: '',
    telefonnummer: '',
    email: ''
  },
  datum: new Date().toISOString().split('T')[0],
  modell: '',
  farbe: '',
  kategorien: '',
  sonderWuensche: {
    text: '',
    photo1: null,
    photo1Notes: '',
    photo2: null,
    photo2Notes: '',
    photo3: null,
    photo3Notes: '',
    photo4: null,
    photo4Notes: ''
  },
  lieferdatum: '',
  anzahlung: '',
  gesamtpreis: '',
  versandoption: '',
  zahlungsart: ''
};

const companyInfo: CompanyInfo = {
  name: 'QASR Möbelhaus',
  address: 'Industriestr. 17, 65474 Bischofsheim',
  phone: '0176 1621 03 43'
};

export default function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate and download PDF
      await generatePDF(invoiceData, companyInfo);
      
      // Submit data to Google Apps Script
      await submitToGoogleAppsScript(invoiceData);
      
      showNotification('success', 'Rechnung gespeichert und PDF heruntergeladen.');
      
      // Reset form
      setInvoiceData(initialData);
    } catch (error) {
      console.error('Error processing invoice:', error);
      showNotification('error', 'Fehler beim Verarbeiten der Rechnung. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{companyInfo.name}</h1>
              <p className="text-sm text-gray-600">Rechnungsgenerator</p>
              <p className="text-sm text-gray-600">{companyInfo.phone}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="order-2 xl:order-1">
            <InvoiceForm 
              data={invoiceData}
              onDataChange={setInvoiceData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Preview Section */}
          <div className="order-1 xl:order-2 xl:sticky xl:top-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">Live-Vorschau</h2>
              <p className="text-sm text-gray-600">Die Vorschau wird automatisch beim Ausfüllen aktualisiert</p>
            </div>
            <InvoicePreview 
              data={invoiceData}
              companyInfo={companyInfo}
            />
          </div>
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
          <div className={`flex items-center p-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 mr-2" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 {companyInfo.name}. Professionelle Rechnungserstellung.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}