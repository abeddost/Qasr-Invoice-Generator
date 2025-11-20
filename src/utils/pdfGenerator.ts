import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { InvoiceData, CompanyInfo } from '../types/invoice';

export const generatePDF = async (data: InvoiceData, companyInfo: CompanyInfo): Promise<void> => {
  try {
    const element = document.getElementById('invoice-preview');
    if (!element) {
      throw new Error('Invoice preview element not found');
    }

    // Temporarily adjust all images (including logo and photos) for PDF generation
    const images = element.querySelectorAll('img');
    const originalStyles: { element: HTMLImageElement; style: string }[] = [];
    
    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      originalStyles.push({ element: htmlImg, style: htmlImg.style.cssText });
      
      // Handle logo differently from photos
      if (htmlImg.src.includes('qasr_3d_gold')) {
        // Logo styling for PDF
        htmlImg.style.width = '48px';
        htmlImg.style.height = '48px';
        htmlImg.style.objectFit = 'contain';
        htmlImg.style.display = 'inline-block';
      } else {
        // Photo styling for PDF - use natural dimensions with max constraint
        const naturalWidth = htmlImg.naturalWidth;
        const naturalHeight = htmlImg.naturalHeight;
        
        if (naturalWidth && naturalHeight) {
          // Maintain aspect ratio, fit within 600px width
          const maxWidth = 600;
          const aspectRatio = naturalHeight / naturalWidth;
          htmlImg.style.width = `${Math.min(naturalWidth, maxWidth)}px`;
          htmlImg.style.height = `${Math.min(naturalWidth, maxWidth) * aspectRatio}px`;
        } else {
          // Fallback if natural dimensions not available
          htmlImg.style.width = '600px';
          htmlImg.style.height = 'auto';
        }
        
        htmlImg.style.objectFit = 'contain';
        htmlImg.style.display = 'block';
        htmlImg.style.margin = '0 auto 8px auto';
      }
    });

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 1.5,  // Reduced from 2 to 1.5 (still high quality but smaller)
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      onclone: (clonedDoc) => {
        // Ensure all images are loaded in the cloned document
        const clonedImages = clonedDoc.querySelectorAll('img');
        clonedImages.forEach((img) => {
          const htmlImg = img as HTMLImageElement;
          if (htmlImg.src.includes('qasr_3d_gold')) {
            htmlImg.style.width = '48px';
            htmlImg.style.height = '48px';
            htmlImg.style.objectFit = 'contain';
          }
        });
      }
    });

    // Restore original image styles
    originalStyles.forEach(({ element, style }) => {
      element.style.cssText = style;
    });

    // Use JPEG with 0.90 quality instead of PNG (huge file size reduction)
    const imgData = canvas.toDataURL('image/jpeg', 0.90);
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename with order number and date
    const filename = `${data.bestellnummer || 'Rechnung'}.pdf`;
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('PDF-Erstellung fehlgeschlagen');
  }
};