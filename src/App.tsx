import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { supabase } from './lib/supabase';
import { generatePDF } from './utils/pdfGenerator';
import { submitToSupabase } from './utils/supabaseSubmission';
import type { InvoiceData, CompanyInfo } from './types/invoice';

const ADMIN_PATH = '/admin420';

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
    photo4Notes: '',
    photo5: null,
    photo5Notes: '',
    photo6: null,
    photo6Notes: ''
  },
  lieferdatum: '',
  anzahlung: '',
  gesamtpreis: '',
  versandoption: '',
  zahlungsart: ''
};

const companyInfo: CompanyInfo = {
  name: 'Aria Möbelhaus',
  address: 'Wiesbadener Landstraße 18, 65203 Wiesbaden',
  phone: '004917642552752'
};

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return pathname;
}

export default function App() {
  const pathname = usePathname();
  const isAdminRoute = pathname === ADMIN_PATH;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Check existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
      setAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await generatePDF(invoiceData, companyInfo);
      await submitToSupabase(invoiceData);
      showNotification('success', 'Rechnung gespeichert und PDF heruntergeladen.');
      setInvoiceData(initialData);
    } catch (error) {
      console.error('Error processing invoice:', error);
      showNotification('error', 'Fehler beim Verarbeiten der Rechnung. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin route — show login or dashboard, no main header/footer
  if (isAdminRoute) {
    if (!authChecked) return null;
    if (!isAuthenticated) {
      return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }
    return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
  }

  // Public invoice form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{companyInfo.name}</h1>
            <p className="text-sm text-gray-600">{companyInfo.address}</p>
            <p className="text-sm text-gray-600">{companyInfo.phone}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InvoiceForm
          data={invoiceData}
          onDataChange={setInvoiceData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
          <InvoicePreview data={invoiceData} companyInfo={companyInfo} />
        </div>
      </main>

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
