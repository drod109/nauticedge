import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  tax: number;
  amount: number;
}

interface Invoice {
  invoice_number: string;
  client_name: string;
  client_email: string;
 client_phone?: string;
 client_address?: string;
  issue_date: string;
  due_date: string;
  items: InvoiceItem[];
  notes?: string;
  amount: number;
  logo_url?: string;
 company_info?: {
   name: string;
   address_line1: string;
   address_line2?: string;
   city: string;
   state: string;
   postal_code: string;
   country: string;
   tax_id: string;
 };
}

export const generateInvoicePDF = async (invoice: Invoice) => {
  // Create new PDF document with company branding
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Add logo if available
  if (invoice.logo_url) {
    try {
      const img = new Image();
      img.src = invoice.logo_url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      doc.addImage(img, 'PNG', 20, 20, 40, 40, undefined, 'FAST');
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }
  
  // Add INVOICE header
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80);
  doc.text('INVOICE', 170, 30, { align: 'right' });

  // Add company information if available
  if (invoice.company_info) {
    doc.setFontSize(12);
    doc.setTextColor(52, 73, 94);
    const startY = invoice.logo_url ? 70 : 40;
    doc.text('From:', 20, startY);
    doc.text(invoice.company_info.name, 20, startY + 7);
    doc.setFontSize(10);
    doc.text(invoice.company_info.address_line1, 20, startY + 13);
    if (invoice.company_info.address_line2) {
      doc.text(invoice.company_info.address_line2, 20, startY + 18);
    }
    doc.text(`${invoice.company_info.city}, ${invoice.company_info.state} ${invoice.company_info.postal_code}`, 20, startY + 23);
    doc.text(invoice.company_info.country, 20, startY + 28);
    doc.text(`Tax ID: ${invoice.company_info.tax_id}`, 20, startY + 33);
  }
  
  // Add invoice details on the right
  doc.setFontSize(10);
  doc.setTextColor(52, 73, 94);
  
  const rightColumnX = 120;
  doc.text(`Invoice No: ${invoice.invoice_number}`, rightColumnX, 40);
  doc.text(`Invoice Date: ${format(new Date(invoice.issue_date), 'MMM dd, yyyy')}`, rightColumnX, 45);
  doc.text(`Due Date: ${format(new Date(invoice.due_date), 'MMM dd, yyyy')}`, rightColumnX, 50);
  
  // Client information
  doc.text('Bill To:', 20, 90);
  doc.setFontSize(12);
  doc.text(invoice.client_name, 20, 97);
  doc.setFontSize(10);
  doc.text(invoice.client_email, 20, 103);
  if (invoice.client_phone) {
    doc.text(invoice.client_phone, 20, 108);
  }
  if (invoice.client_address) {
    const addressLines = doc.splitTextToSize(invoice.client_address, 80);
    addressLines.forEach((line: string, index: number) => {
      doc.text(line, 20, 113 + (index * 5));
    });
  }
  
  // Items table
  const tableColumn = ['Description', 'Qty', 'Rate', 'Tax %', 'Amount'];
  const tableRows = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    `$${item.rate.toFixed(2)}`,
    `${item.tax}%`,
    `$${item.amount.toFixed(2)}`
  ]);
  
  // Add items table
  (doc as any).autoTable({
    startY: 130,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: 255,
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' }
    }
  });
  
  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = invoice.items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.rate;
    return sum + (itemSubtotal * item.tax / 100);
  }, 0);
  const total = subtotal + tax;
  
  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, finalY + 10);
  doc.text(`Tax: $${tax.toFixed(2)}`, 140, finalY + 16);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: $${total.toFixed(2)}`, 140, finalY + 24);
  
  // Add notes if any
  if (invoice.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Notes:', 20, finalY + 40);
    doc.setTextColor(128, 128, 128);
    const splitNotes = doc.splitTextToSize(invoice.notes, 170);
    doc.text(splitNotes, 20, finalY + 46);
  }
  
  // Save the PDF
  doc.save(`Invoice-${invoice.invoice_number}.pdf`);
};