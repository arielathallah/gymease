import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// 1. CSV EXPORTER
export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return;
  
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) =>
        keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k].toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator)
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 2. EXCEL EXPORTER
export function exportToExcel(filename: string, sheetName: string, rows: Record<string, any>[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Report');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// 3. PDF EXPORTER
export function exportToPDF(filename: string, title: string, headers: string[], rows: (string | number)[][]) {
  const doc = new jsPDF();
  
  // Add Header Branding
  doc.setFontSize(20);
  doc.setTextColor(225, 29, 72); // Brand Rose color #e11d48
  doc.text('GymEase Indonesia', 14, 20);

  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85);
  doc.text(title, 14, 28);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated Date: ${new Date().toLocaleString('id-ID')}`, 14, 34);

  // AutoTable
  autoTable(doc, {
    startY: 40,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [225, 29, 72], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  doc.save(`${filename}.pdf`);
}
