import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

const reportsExport = {

    async toExcel(title: string, columns: { header: string; key: string; width?: number }[], data: any[]): Promise<Buffer> {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(title);

        sheet.columns = columns;
        sheet.getRow(1).font = { bold: true };

        data.forEach(row => sheet.addRow(row));

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer as unknown as Buffer;
    },

    toPDF(title: string, columns: { header: string; key: string }[], data: any[]): Promise<Buffer> {

        return new Promise((resolve, reject) => {

            const doc = new PDFDocument({ margin: 40 });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            doc.fontSize(18).text(title, { align : 'center' });
            doc.moveDown();

            const startX = 40;
            let y = doc.y;
            const colWidth = (doc.page.width - 80) / columns.length;

            doc.fontSize(10).font('Helvetica-Bold');
            columns.forEach((col, i) => {
                doc.text(col.header, startX + i * colWidth, y, { width: colWidth});
            });

            doc.moveDown();
            doc.font('Helvetica');

            data.forEach((row) => {

                y = doc.y;

                if (y > doc.page.height - 60) {

                    doc.addPage();
                    y = doc.y;
                }

                columns.forEach((col, i) => {
                    doc.text(String(row[col.key] ?? ''), startX + i * colWidth, y, { width: colWidth});
                });

                doc.moveDown();
            });

            doc.end();
        });
    },
};

export default reportsExport;