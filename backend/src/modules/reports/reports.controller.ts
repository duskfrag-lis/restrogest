import { Request, Response } from "express";
import reportsService from "./reports.service";
import reportsExport from "../../config/reports.export";

const reportsController = {

    async getSalesReport(req: Request, res: Response) {

        try {

            const { start_date, end_date, format } = req.query as { start_date: string; end_date: string; format?: string};

            const report = await reportsService.getSalesReport(start_date, end_date);

            if (format === 'excel') {

                const buffer = await reportsExport.toExcel(
                    'Reporte de Ventas',
                    [
                        { header: 'Fecha', key: 'date', width: 15 },
                        { header: 'Pedidos', key: 'total_orders', width: 12 },
                        { header: 'Ventas', key: 'total_sales', width: 15 },
                    ],

                    report.daily
                );

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachemt; filename="reporte-ventas.xlsx"');

                return res.send(buffer);
            }

            if (format === 'pdf') {

                const buffer = await reportsExport.toPDF(
                    'Reporte de Ventas',
                    [
                        { header: 'Fecha', key: 'date' },
                        { header: 'Pedidos', key: 'total_orders' },
                        { header: 'Ventas', key: 'total_sales' },
                    ],

                    report.daily
                );

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="reporte-ventas.pdf"');

                return res.send(buffer);
            }

            return res.status(200).json({ report });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getOrdersByStatusReport(req: Request, res: Response) {

        try {

            const { start_date, end_date, format } = req.query as { start_date: string; end_date: string; format?: string };

            const report = await reportsService.getOrdersByStatusReport(start_date, end_date);

            if (format === 'excel') {

                const buffer = await reportsExport.toExcel(
                    'Pedidos por Estado',
                    [
                        { header: 'Estado', key: 'status', width: 20 },
                        { header: 'Total', key: 'total', width: 12 },
                    ],
                    report.statuses
                );

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="pedidos-por-estado.xlsx"');
                return res.send(buffer);
            }

            if (format === 'pdf') {

                const buffer = await reportsExport.toPDF(
                    'Pedidos por Estado',
                    [
                        { header: 'Estado', key: 'status' },
                        { header: 'Total', key: 'total' },
                    ],
                    report.statuses
                );

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="pedidos-por-estado.pdf"');
                return res.send(buffer);
            }

            return res.status(200).json({ report });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getTopSellingProductsReport(req: Request, res: Response) {

        try {

            const { start_date, end_date, limit, format } = req.query as { start_date: string; end_date: string; limit?: string; format?: string };

            const report = await reportsService.getTopSellingProductsReport(start_date, end_date, limit ? parseInt(limit) : undefined);

            if (format === 'excel') {

                const buffer = await reportsExport.toExcel(
                    'Productos Más Vendidos',
                    [
                        { header: 'Producto', key: 'name', width: 25 },
                        { header: 'Cantidad', key: 'total_quantity', width: 12 },
                        { header: 'Ingresos', key: 'total_revenue', width: 15 },
                    ],
                    report.products
                );

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="productos-mas-vendidos.xlsx"');
                return res.send(buffer);
            }

            if (format === 'pdf') {

                const buffer = await reportsExport.toPDF(
                    'Productos Más Vendidos',
                    [
                        { header: 'Producto', key: 'name' },
                        { header: 'Cantidad', key: 'total_quantity' },
                        { header: 'Ingresos', key: 'total_revenue' },
                    ],
                    report.products
                );

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="productos-mas-vendidos.pdf"');
                return res.send(buffer);
            }

            return res.status(200).json({ report });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getInventoryStatusReport(req: Request, res: Response) {

        try {

            const { format } = req.query as { format?: string };

            const report = await reportsService.getInventoryStatusReport();

            if (format === 'excel') {

                const buffer = await reportsExport.toExcel(
                    'Estado de Inventario',
                    [
                        { header: 'Ítem', key: 'name', width: 25 },
                        { header: 'Cantidad', key: 'quantity', width: 12 },
                        { header: 'Unidad', key: 'unit', width: 10 },
                        { header: 'Umbral Mínimo', key: 'min_threshold', width: 15 },
                        { header: 'Bajo Stock', key: 'is_low_stock', width: 12 },
                        { header: 'Vencido', key: 'is_expired', width: 12 },
                    ],
                    report.items
                );

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="estado-inventario.xlsx"');
                return res.send(buffer);
            }

            if (format === 'pdf') {

                const buffer = await reportsExport.toPDF(
                    'Estado de Inventario',
                    [
                        { header: 'Ítem', key: 'name' },
                        { header: 'Cantidad', key: 'quantity' },
                        { header: 'Bajo Stock', key: 'is_low_stock' },
                        { header: 'Vencido', key: 'is_expired' },
                    ],
                    report.items
                );

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="estado-inventario.pdf"');
                return res.send(buffer);
            }

            return res.status(200).json({ report });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },
};

export default reportsController;