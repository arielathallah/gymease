'use client';

import React from 'react';
import { FileBarChart, FileText, Download, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { exportToPDF, exportToExcel, exportToCSV } from '@/lib/export-utils';
import { formatRupiah } from '@/lib/utils';

export default function AdminReportsPage() {
  const { currentRole, adminBranchId, branches, bookings, products, gyms } = useAppStore();
  const activeBranch = branches.find((b) => b.id === adminBranchId);

  const isBranchScoped = currentRole === 'branch_admin';

  // 1. Revenue Report Data
  const revenueData = [
    { Date: '2026-07-22', Branch: 'GymEase Kemanggisan', Subtotal: 105000, Tax: 10500, Discount: 20000, Total: 95500 },
    { Date: '2026-07-21', Branch: 'GymEase BSD', Subtotal: 460000, Tax: 46000, Discount: 25000, Total: 481000 },
    { Date: '2026-07-20', Branch: 'GymEase Grogol', Subtotal: 75000, Tax: 7500, Discount: 0, Total: 82500 },
  ];

  // 2. Booking Report Data
  const bookingData = bookings.map((b) => ({
    Code: b.booking_code,
    Customer: b.user_name,
    Branch: b.branch_name,
    Gym: b.gym_name,
    Date: b.booking_date,
    Slot: b.booking_time,
    Package: b.package_name,
    ClothesSize: b.rentals.clothesSelected ? b.rentals.clothesSize : 'None',
    Total: b.grand_total,
    Status: b.status,
  }));

  // 3. Customer Report Data
  const customerData = [
    { Name: 'Budi Santoso', Email: 'budi.santoso@gmail.com', TotalBookings: 8, Role: 'user' },
    { Name: 'Siti Rahmawati', Email: 'siti.rahma@gmail.com', TotalBookings: 14, Role: 'user' },
    { Name: 'Reza Pratama', Email: 'reza.p@gmail.com', TotalBookings: 5, Role: 'user' },
  ];

  // 4. Rental Report Data
  const rentalData = [
    { Item: 'Dry-Fit Workout Clothes Set', Size: 'XS', RentedQty: 24, Revenue: 480000 },
    { Item: 'Dry-Fit Workout Clothes Set', Size: 'S', RentedQty: 45, Revenue: 900000 },
    { Item: 'Dry-Fit Workout Clothes Set', Size: 'M', RentedQty: 82, Revenue: 1640000 },
    { Item: 'Dry-Fit Workout Clothes Set', Size: 'L', RentedQty: 95, Revenue: 1900000 },
    { Item: 'Dry-Fit Workout Clothes Set', Size: 'XL', RentedQty: 38, Revenue: 760000 },
    { Item: 'Dry-Fit Workout Clothes Set', Size: 'XXL', RentedQty: 18, Revenue: 360000 },
    { Item: 'Microfiber Towel', Size: 'Standard', RentedQty: 215, Revenue: 2150000 },
  ];

  // 5. Product Report Data
  const productData = products.map((p) => ({
    Name: p.name,
    Branch: p.branch_name,
    Price: p.price,
    Stock: p.stock,
    Category: p.category_name,
  }));

  // 6. Branch Report Data
  const branchData = branches.map((b) => ({
    Code: b.code,
    Name: b.name,
    City: b.city,
    Hours: `${b.opening_hours} - ${b.closing_hours}`,
    Phone: b.phone,
    Status: b.status,
  }));

  // Helper trigger
  const triggerExport = (reportTitle: string, filename: string, jsonRows: Record<string, any>[], format: 'pdf' | 'excel' | 'csv') => {
    if (format === 'csv') {
      exportToCSV(filename, jsonRows);
    } else if (format === 'excel') {
      exportToExcel(filename, reportTitle, jsonRows);
    } else if (format === 'pdf') {
      if (jsonRows.length === 0) return;
      const headers = Object.keys(jsonRows[0]);
      const body = jsonRows.map((row) => headers.map((h) => row[h]));
      exportToPDF(filename, reportTitle, headers, body);
    }
  };

  const reportsList = [
    { title: 'Revenue Report', desc: 'Financial transactions breakdown with tax & discounts.', data: revenueData, name: 'Revenue_Report' },
    { title: 'Booking Report', desc: 'Pass reservations, dates, check-in status, and apparel rentals.', data: bookingData, name: 'Booking_Report' },
    { title: 'Customer Report', desc: 'Registered user activity, email contact info, and booking counts.', data: customerData, name: 'Customer_Report' },
    { title: 'Rental Report', desc: 'Detailed rental clothes XS-XXL size statistics & towel revenue.', data: rentalData, name: 'Rental_Report' },
    { title: 'Product Report', desc: 'Supplements and gear sales inventory status across branches.', data: productData, name: 'Product_Report' },
    { title: 'Branch Report', desc: 'National partner hub coverage, phone numbers, and coordinates.', data: branchData, name: 'Branch_Report' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant={isBranchScoped ? 'amber' : 'rose'}>
            {isBranchScoped ? `BRANCH SCOPE: ${activeBranch?.name}` : 'SUPER ADMIN EXPORT ENGINE'}
          </Badge>
          <h1 className="text-2xl font-black text-white mt-1">
            System Reports & Export Center
          </h1>
          <p className="text-xs text-slate-400">
            Generate and export instant system reports into PDF, Excel (.xlsx), and CSV files.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportsList.map((rep, idx) => (
          <Card key={idx} className="bg-slate-900 border-slate-800 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                <FileBarChart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">{rep.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{rep.desc}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Export Formats:</span>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-[10px] px-2 border-slate-700 text-rose-400 hover:bg-rose-950"
                  onClick={() => triggerExport(rep.title, rep.name, rep.data, 'pdf')}
                >
                  <FileText className="w-3 h-3 mr-1" /> PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-[10px] px-2 border-slate-700 text-emerald-400 hover:bg-emerald-950"
                  onClick={() => triggerExport(rep.title, rep.name, rep.data, 'excel')}
                >
                  <FileSpreadsheet className="w-3 h-3 mr-1" /> Excel
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-[10px] px-2 border-slate-700 text-amber-400 hover:bg-amber-950"
                  onClick={() => triggerExport(rep.title, rep.name, rep.data, 'csv')}
                >
                  <Download className="w-3 h-3 mr-1" /> CSV
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
