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
  issue_date: string;
  due_date: string;
  items: InvoiceItem[];
  notes?: string;
  amount: number;
}

export const generateInvoicePDF = async (invoice: Invoice) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Add company logo/header
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80);
  doc.text('INVOICE', 20, 20);
  
  // Add invoice details
  doc.setFontSize(10);
  doc.setTextColor(52, 73, 94);
  
  // Invoice number and dates
  doc.text(`Invoice Number: ${invoice.invoice_number}`, 20, 40);
  doc.text(`Issue Date: ${format(new Date(invoice.issue_date), 'MMM dd, yyyy')}`, 20, 45);
  doc.text(`Due Date: ${format(new Date(invoice.due_date), 'MMM dd, yyyy')}`, 20, 50);
  
  // Client information
  doc.text('Bill To:', 20, 65);
  doc.setFontSize(12);
  doc.text(invoice.client_name, 20, 72);
  doc.setFontSize(10);
  doc.text(invoice.client_email, 20, 78);
  
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
    startY: 90,
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