/**
 * Script untuk membuat laporan pengembangan dalam format Word (.docx)
 *
 * Cara menggunakan:
 * 1. Pastikan docx sudah terinstal: npm install docx
 * 2. Jalankan script: node generate-doc.js
 */

const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, UnderlineType } = require('docx');
const fs = require('fs');
const path = require('path');

async function generateWordDocument() {
  console.log('Memulai pembuatan dokumen Word...');

  // Helper functions
  const createHeading = (text, level = HeadingLevel.HEADING_1) => {
    return new Paragraph({
      text: text,
      heading: level,
      spacing: { before: 400, after: 200 },
    });
  };

  const createParagraph = (text, options = {}) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          ...options,
        }),
      ],
      spacing: { before: 100, after: 100 },
      alignment: options.alignment || AlignmentType.LEFT,
    });
  };

  const createBulletPoint = (text) => {
    return new Paragraph({
      text: text,
      bullet: { level: 0 },
      spacing: { before: 50, after: 50 },
    });
  };

  const createNumberedPoint = (text, level = 0) => {
    return new Paragraph({
      text: text,
      numbering: { reference: 'default-numbering', level: level },
      spacing: { before: 50, after: 50 },
    });
  };

  const createInfoBox = (title, content) => {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            color: '1e40af',
          }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: content,
        spacing: { before: 100, after: 100 },
        indent: { left: 360 },
      }),
    ];
  };

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: 'LAPORAN PENGEMBANGAN APLIKASI',
                bold: true,
                size: 32,
                color: '1e40af',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'SISTEM E-PURCHASING',
                bold: true,
                size: 32,
                color: '1e40af',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Versi 0.1.0',
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'Oktober 2025',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // 1. RINGKASAN EKSEKUTIF
          createHeading('1. RINGKASAN EKSEKUTIF', HeadingLevel.HEADING_1),
          createParagraph(
            'Aplikasi E-Purchasing adalah sistem informasi berbasis web yang dikembangkan untuk mengelola proses pengadaan barang dan jasa secara elektronik. Aplikasi ini dirancang untuk meningkatkan efisiensi, transparansi, dan akuntabilitas dalam proses pengadaan dari tahap perencanaan hingga pelaksanaan dan pengawasan.'
          ),

          // 2. INFORMASI PROYEK
          createHeading('2. INFORMASI PROYEK', HeadingLevel.HEADING_1),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Aspek', bold: true })],
                    shading: { fill: 'f1f5f9' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Deskripsi', bold: true })],
                    shading: { fill: 'f1f5f9' },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Nama Aplikasi')] }),
                  new TableCell({ children: [new Paragraph('E-Purchasing System (Proc750)')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Versi')] }),
                  new TableCell({ children: [new Paragraph('0.1.0')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Tipe Aplikasi')] }),
                  new TableCell({ children: [new Paragraph('Web Application (Progressive Web App)')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Framework Utama')] }),
                  new TableCell({ children: [new Paragraph('Next.js 15.5.3 (React 19.1.0)')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Bahasa Pemrograman')] }),
                  new TableCell({ children: [new Paragraph('TypeScript 5.x')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Arsitektur')] }),
                  new TableCell({ children: [new Paragraph('Client-Server dengan REST API')] }),
                ],
              }),
            ],
          }),

          // 3. TEKNOLOGI YANG DIGUNAKAN
          createHeading('3. TEKNOLOGI YANG DIGUNAKAN', HeadingLevel.HEADING_1),
          createHeading('3.1 Frontend Technologies', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Teknologi', bold: true })], shading: { fill: 'f1f5f9' } }),
                  new TableCell({ children: [new Paragraph({ text: 'Versi', bold: true })], shading: { fill: 'f1f5f9' } }),
                  new TableCell({ children: [new Paragraph({ text: 'Fungsi', bold: true })], shading: { fill: 'f1f5f9' } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Next.js')] }),
                  new TableCell({ children: [new Paragraph('15.5.3')] }),
                  new TableCell({ children: [new Paragraph('Framework React untuk SSR dan Routing')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('React')] }),
                  new TableCell({ children: [new Paragraph('19.1.0')] }),
                  new TableCell({ children: [new Paragraph('Library untuk membangun user interface')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('TypeScript')] }),
                  new TableCell({ children: [new Paragraph('5.x')] }),
                  new TableCell({ children: [new Paragraph('Superset JavaScript dengan type safety')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Tailwind CSS')] }),
                  new TableCell({ children: [new Paragraph('4.x')] }),
                  new TableCell({ children: [new Paragraph('Utility-first CSS framework untuk styling')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Radix UI')] }),
                  new TableCell({ children: [new Paragraph('Latest')] }),
                  new TableCell({ children: [new Paragraph('Komponen UI accessible dan customizable')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Lucide React')] }),
                  new TableCell({ children: [new Paragraph('0.544.0')] }),
                  new TableCell({ children: [new Paragraph('Icon library')] }),
                ],
              }),
            ],
          }),

          createHeading('3.2 State Management & Data Handling', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Teknologi', bold: true })], shading: { fill: 'f1f5f9' } }),
                  new TableCell({ children: [new Paragraph({ text: 'Versi', bold: true })], shading: { fill: 'f1f5f9' } }),
                  new TableCell({ children: [new Paragraph({ text: 'Fungsi', bold: true })], shading: { fill: 'f1f5f9' } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('TanStack Table')] }),
                  new TableCell({ children: [new Paragraph('8.21.3')] }),
                  new TableCell({ children: [new Paragraph('Headless table library untuk data tables')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('React Hook Form')] }),
                  new TableCell({ children: [new Paragraph('7.62.0')] }),
                  new TableCell({ children: [new Paragraph('Form validation dan state management')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Axios')] }),
                  new TableCell({ children: [new Paragraph('1.12.2')] }),
                  new TableCell({ children: [new Paragraph('HTTP client untuk API requests')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('JWT Decode')] }),
                  new TableCell({ children: [new Paragraph('4.0.0')] }),
                  new TableCell({ children: [new Paragraph('Dekode JSON Web Tokens untuk autentikasi')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Cookies Next')] }),
                  new TableCell({ children: [new Paragraph('6.1.0')] }),
                  new TableCell({ children: [new Paragraph('Cookie management untuk session handling')] }),
                ],
              }),
            ],
          }),

          createHeading('3.3 Data Visualization & Media', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Teknologi', bold: true })], shading: { fill: 'f1f5f9' } }),
                  new TableCell({ children: [new Paragraph({ text: 'Versi', bold: true })], shading: { fill: 'f1f5f9' } }),
                  new TableCell({ children: [new Paragraph({ text: 'Fungsi', bold: true })], shading: { fill: 'f1f5f9' } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Chart.js')] }),
                  new TableCell({ children: [new Paragraph('4.5.0')] }),
                  new TableCell({ children: [new Paragraph('Library untuk visualisasi data dalam bentuk grafik')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('React Chartjs 2')] }),
                  new TableCell({ children: [new Paragraph('5.3.0')] }),
                  new TableCell({ children: [new Paragraph('React wrapper untuk Chart.js')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('HLS.js')] }),
                  new TableCell({ children: [new Paragraph('1.6.13')] }),
                  new TableCell({ children: [new Paragraph('HTTP Live Streaming untuk CCTV monitoring')] }),
                ],
              }),
            ],
          }),

          // 4. FITUR DAN MODUL APLIKASI
          createHeading('4. FITUR DAN MODUL APLIKASI', HeadingLevel.HEADING_1),

          createHeading('4.1 Modul Autentikasi', HeadingLevel.HEADING_2),
          createBulletPoint('Login untuk Admin'),
          createBulletPoint('Login untuk Operator'),
          createBulletPoint('Session management dengan JWT'),
          createBulletPoint('Cookie-based authentication'),
          createBulletPoint('Role-based access control'),

          createHeading('4.2 Modul Dashboard', HeadingLevel.HEADING_2),
          createBulletPoint('Dashboard overview dengan statistik real-time'),
          createBulletPoint('Visualisasi data dengan grafik (Chart.js)'),
          createBulletPoint('Detail dashboard per item'),
          createBulletPoint('Tabel data perencanaan'),
          createBulletPoint('Monitoring sebaran pengadaan'),

          createHeading('4.3 Modul Kegiatan Pengadaan - Perencanaan', HeadingLevel.HEADING_2),
          createBulletPoint('Daftar perencanaan pengadaan'),
          createBulletPoint('Tambah perencanaan baru'),
          createBulletPoint('Edit perencanaan existing'),
          createBulletPoint('Data table dengan sorting dan filtering'),
          createBulletPoint('Form input perencanaan dengan validasi'),
          createBulletPoint('Identifikasi pagu anggaran'),

          createHeading('4.4 Modul Kegiatan Pengadaan - Pelaksanaan', HeadingLevel.HEADING_2),
          createBulletPoint('Daftar pelaksanaan pengadaan'),
          createBulletPoint('Tambah pelaksanaan baru'),
          createBulletPoint('Detail pelaksanaan (barang/jasa)'),
          createBulletPoint('Detail pelaksanaan pembangunan'),
          createBulletPoint('Data table renovasi dan pembangunan'),
          createBulletPoint('Laporan mingguan pelaksanaan'),

          createHeading('4.5 Modul Pengawasan', HeadingLevel.HEADING_2),
          createBulletPoint('Form pengawasan proyek'),
          createBulletPoint('CCTV monitoring real-time dengan HLS streaming'),
          createBulletPoint('Live stream monitoring pelaksanaan'),
          createBulletPoint('Data real-time pengawasan'),

          createHeading('4.6 Fitur Umum', HeadingLevel.HEADING_2),
          createBulletPoint('Dark mode support (next-themes)'),
          createBulletPoint('Responsive design untuk mobile dan desktop'),
          createBulletPoint('Export data ke Excel'),
          createBulletPoint('Dropdown selection Satuan Kerja (Satdik)'),
          createBulletPoint('Alert dan notifikasi (Sonner)'),
          createBulletPoint('Dialog dan modal components'),
          createBulletPoint('Accordion untuk navigasi'),
          createBulletPoint('Badge dan status indicators'),

          // 5. ARSITEKTUR SISTEM
          createHeading('5. ARSITEKTUR SISTEM', HeadingLevel.HEADING_1),

          createHeading('5.1 Struktur Folder', HeadingLevel.HEADING_2),
          createParagraph('Aplikasi menggunakan struktur folder Next.js 15 dengan App Router:', { bold: true }),
          createParagraph('src/app/ - Next.js App Router dengan halaman autentikasi, dashboard, dan modul pengadaan'),
          createParagraph('src/component/ - Reusable components (card, chart, form, table, sidebar, dll)'),
          createParagraph('src/components/ui/ - Shadcn UI components (button, dialog, input, select, dll)'),

          createHeading('5.2 Arsitektur Aplikasi', HeadingLevel.HEADING_2),
          new Paragraph({
            children: [new TextRun({ text: 'Client-Side:', bold: true })],
            spacing: { before: 200, after: 100 },
          }),
          createBulletPoint('Next.js 15 dengan App Router untuk routing dan SSR'),
          createBulletPoint('React 19 untuk UI components'),
          createBulletPoint('TypeScript untuk type safety'),
          createBulletPoint('Tailwind CSS untuk styling'),

          new Paragraph({
            children: [new TextRun({ text: 'Server-Side:', bold: true })],
            spacing: { before: 200, after: 100 },
          }),
          createBulletPoint('Next.js API Routes sebagai middleware/proxy'),
          createBulletPoint('Axios untuk komunikasi dengan backend API'),
          createBulletPoint('JWT untuk autentikasi dan otorisasi'),

          new Paragraph({
            children: [new TextRun({ text: 'State Management:', bold: true })],
            spacing: { before: 200, after: 100 },
          }),
          createBulletPoint('React hooks (useState, useEffect)'),
          createBulletPoint('Cookies untuk session management'),
          createBulletPoint('React Hook Form untuk form state'),

          // 6. ALUR KERJA APLIKASI
          createHeading('6. ALUR KERJA APLIKASI', HeadingLevel.HEADING_1),

          createHeading('6.1 Alur Autentikasi', HeadingLevel.HEADING_2),
          createNumberedPoint('User membuka halaman login (admin atau operator)'),
          createNumberedPoint('User memasukkan credentials'),
          createNumberedPoint('Sistem memvalidasi credentials melalui API'),
          createNumberedPoint('Backend mengembalikan JWT token jika valid'),
          createNumberedPoint('Token disimpan dalam cookies'),
          createNumberedPoint('User diarahkan ke dashboard'),
          createNumberedPoint('Setiap request dilengkapi dengan JWT token untuk otorisasi'),

          createHeading('6.2 Alur Perencanaan Pengadaan', HeadingLevel.HEADING_2),
          createNumberedPoint('User mengakses menu Kegiatan Pengadaan > Perencanaan'),
          createNumberedPoint('Sistem menampilkan tabel data perencanaan'),
          createNumberedPoint('User dapat menambah perencanaan baru melalui form'),
          createNumberedPoint('Form validasi menggunakan React Hook Form'),
          createNumberedPoint('Data dikirim ke backend API melalui Axios'),
          createNumberedPoint('Sistem memberikan feedback sukses/error'),
          createNumberedPoint('Tabel data direfresh otomatis'),
          createNumberedPoint('User dapat edit/view detail perencanaan existing'),

          // 7. FITUR KEAMANAN
          createHeading('7. FITUR KEAMANAN', HeadingLevel.HEADING_1),
          createBulletPoint('JWT-based authentication untuk secure session management'),
          createBulletPoint('Cookie-based token storage dengan HttpOnly flag'),
          createBulletPoint('Role-based access control (Admin vs Operator)'),
          createBulletPoint('Form validation pada client dan server side'),
          createBulletPoint('TypeScript untuk type safety dan mencegah runtime errors'),
          createBulletPoint('Proxy API route untuk menyembunyikan backend endpoint'),
          createBulletPoint('HTTPS ready untuk production deployment'),

          // 8. PERFORMA DAN OPTIMASI
          createHeading('8. PERFORMA DAN OPTIMASI', HeadingLevel.HEADING_1),
          createBulletPoint('Turbopack: Build tool Next.js untuk faster development dan build times'),
          createBulletPoint('Server-Side Rendering (SSR): Faster initial page load'),
          createBulletPoint('Code Splitting: Automatic code splitting dengan Next.js App Router'),
          createBulletPoint('Image Optimization: Built-in Next.js image optimization'),
          createBulletPoint('Font Optimization: next/font untuk optimized font loading'),
          createBulletPoint('Lazy Loading: Components loaded on demand'),
          createBulletPoint('Responsive Design: Mobile-first approach dengan Tailwind CSS'),

          // 9. DEPLOYMENT DAN BUILD
          createHeading('9. DEPLOYMENT DAN BUILD', HeadingLevel.HEADING_1),
          createHeading('9.1 Scripts Available', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Command', bold: true })], shading: { fill: 'f1f5f9' } }),
                  new TableCell({ children: [new Paragraph({ text: 'Fungsi', bold: true })], shading: { fill: 'f1f5f9' } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('npm run dev')] }),
                  new TableCell({ children: [new Paragraph('Menjalankan development server dengan Turbopack')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('npm run build')] }),
                  new TableCell({ children: [new Paragraph('Build production-ready application')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('npm start')] }),
                  new TableCell({ children: [new Paragraph('Menjalankan production server')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('npm run lint')] }),
                  new TableCell({ children: [new Paragraph('Menjalankan ESLint untuk code quality check')] }),
                ],
              }),
            ],
          }),

          // 10. ROADMAP PENGEMBANGAN
          createHeading('10. ROADMAP PENGEMBANGAN', HeadingLevel.HEADING_1),

          createHeading('10.1 Fase 1 (Current - v0.1.0)', HeadingLevel.HEADING_2),
          createBulletPoint('Modul autentikasi Admin dan Operator'),
          createBulletPoint('Dashboard dengan visualisasi data'),
          createBulletPoint('Modul Perencanaan Pengadaan (CRUD)'),
          createBulletPoint('Modul Pelaksanaan Pengadaan'),
          createBulletPoint('CCTV Monitoring'),
          createBulletPoint('Export data ke Excel'),

          createHeading('10.2 Fase 2 (Planned - v0.2.0)', HeadingLevel.HEADING_2),
          createBulletPoint('Modul pelaporan dan analytics advanced'),
          createBulletPoint('Notifikasi real-time untuk stakeholders'),
          createBulletPoint('Integration dengan sistem e-budgeting'),
          createBulletPoint('Mobile app companion'),
          createBulletPoint('Advanced search dan filtering'),
          createBulletPoint('Document management system'),

          createHeading('10.3 Fase 3 (Future - v1.0.0)', HeadingLevel.HEADING_2),
          createBulletPoint('AI-powered recommendation untuk pengadaan'),
          createBulletPoint('Blockchain integration untuk transparency'),
          createBulletPoint('Multi-language support'),
          createBulletPoint('Advanced analytics dashboard dengan predictive analysis'),
          createBulletPoint('Integration dengan sistem pihak ketiga (e-katalog, LPSE)'),
          createBulletPoint('Audit trail yang comprehensive'),

          // 11. KESIMPULAN
          createHeading('11. KESIMPULAN', HeadingLevel.HEADING_1),
          createParagraph(
            'Aplikasi E-Purchasing telah berhasil dikembangkan menggunakan teknologi modern dan best practices dalam web development. Dengan framework Next.js 15 dan React 19, aplikasi ini menawarkan performa tinggi, user experience yang baik, dan maintainability yang optimal.'
          ),
          createParagraph(
            'Sistem ini mencakup seluruh siklus pengadaan dari perencanaan, pelaksanaan, hingga pengawasan dengan fitur-fitur pendukung seperti real-time monitoring, data visualization, dan export capabilities. Arsitektur yang modular memungkinkan pengembangan dan penambahan fitur secara berkelanjutan.'
          ),
          createParagraph(
            'Dengan teknologi yang digunakan dan roadmap yang terstruktur, aplikasi E-Purchasing siap untuk dikembangkan lebih lanjut sesuai dengan kebutuhan organisasi yang terus berkembang.'
          ),

          // 12. REKOMENDASI
          createHeading('12. REKOMENDASI', HeadingLevel.HEADING_1),
          createBulletPoint('Implementasi unit testing dan integration testing untuk quality assurance'),
          createBulletPoint('Setup CI/CD pipeline untuk automated deployment'),
          createBulletPoint('Implementasi monitoring dan logging system (Sentry, LogRocket)'),
          createBulletPoint('Performance monitoring dengan Lighthouse CI'),
          createBulletPoint('Regular security audit dan penetration testing'),
          createBulletPoint('Dokumentasi API yang comprehensive dengan Swagger/OpenAPI'),
          createBulletPoint('User training dan dokumentasi penggunaan aplikasi'),

          // Footer
          new Paragraph({
            text: '',
            spacing: { before: 600 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Laporan Pengembangan Aplikasi E-Purchasing',
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
          }),
          new Paragraph({
            text: '© 2024 E-Purchasing System (Proc750) - Version 0.1.0',
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'Dokumen ini dibuat secara otomatis berdasarkan analisis kode sumber aplikasi',
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
        ],
      },
    ],
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    },
  });

  // Save document
  const outputPath = path.join(__dirname, 'Laporan-Pengembangan-E-Purchasing.docx');

  try {
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
    console.log(`✓ Dokumen Word berhasil dibuat: ${outputPath}`);
  } catch (error) {
    console.error('Error saat menyimpan dokumen:', error);
    process.exit(1);
  }
}

// Jalankan fungsi
generateWordDocument().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
