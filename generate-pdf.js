/**
 * Script untuk mengkonversi laporan HTML ke PDF
 *
 * Cara menggunakan:
 * 1. Install puppeteer: npm install puppeteer
 * 2. Jalankan script: node generate-pdf.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  console.log('Memulai proses konversi HTML ke PDF...');

  const htmlPath = path.join(__dirname, 'laporan-pengembangan.html');
  const pdfPath = path.join(__dirname, 'Laporan-Pengembangan-E-Purchasing.pdf');

  // Cek apakah file HTML ada
  if (!fs.existsSync(htmlPath)) {
    console.error('Error: File laporan-pengembangan.html tidak ditemukan!');
    process.exit(1);
  }

  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log('Browser launched successfully');

    const page = await browser.newPage();

    // Load HTML file
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    console.log('HTML content loaded');

    // Generate PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      displayHeaderFooter: false,
      preferCSSPageSize: true
    });

    console.log(`✓ PDF berhasil dibuat: ${pdfPath}`);

  } catch (error) {
    console.error('Error saat membuat PDF:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Jalankan fungsi
generatePDF().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
