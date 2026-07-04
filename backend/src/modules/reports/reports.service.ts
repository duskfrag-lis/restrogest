import reportsRepository from "./reports.repository";

const reportsService = {

    validateDateRange(startDate: string, endDate: string) {

        if (!startDate || !endDate) {
            throw { status: 400, message: 'Las fechas de inicio y fin son obligatorias'};
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw { status: 400, message: 'Fechas inválidas'};
        }

        if (start > end) {
            throw { status: 400, message: 'La fecha de inicio no puede ser posterior a la fecha de fin'};
        }

        return { start, end};
    },

    async getSalesReport(startDate: string, endDate: string) {

        this.validateDateRange(startDate, endDate);

        const rows = await reportsRepository.getSalesByDateRange(startDate, endDate);

        const totalSales = rows.reduce((sum, r) => sum + Number(r.total_sales), 0);
        const totalOrders = rows.reduce((sum, r) => sum + Number(r.total_orders), 0);

        return {
            period: { start: startDate, end: endDate},
            daily: rows,
            total_sales: totalSales,
            total_orders: totalOrders
        };
    },

    async getOrdersByStatusReport(startDate: string, endDate: string) {

        this.validateDateRange(startDate, endDate);

        const rows = await reportsRepository.getOrdersByStatus(startDate, endDate);

        return {
            period: { start: startDate, end: endDate },
            statuses: rows
        };
    },

    async getTopSellingProductsReport(startDate: string, endDate: string, limit?: number) {

        this.validateDateRange(startDate, endDate);

        const rows = await reportsRepository.getTopSellingProducts(startDate, endDate, limit || 10);
        return {
            period: { start: startDate, end: endDate},
            products: rows
        };
    },

    async getInventoryStatusReport() {

        const rows = await reportsRepository.getCurrentInventoryStatus();

        const lowStock = rows.filter(r => r.is_low_stock);
        const expired = rows.filter(r => r.is_expired);
        const expiresSoon = rows.filter(r => r.expires_soon);

        return {
            items: rows,
            alerts: { low_stock: lowStock, expired, expires_soon: expiresSoon}
        };
    },
};

export default reportsService;