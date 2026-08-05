import reviewsRepository from "./reviews.repository";

export interface CreateReviewDTO {
    user_id: string;
    rating: number;
    comment?: string;
}

const reviewsService = {

    async getPublicReviews() {

        const [reviews, summary]: [any[], { average: number; total: number }] = await Promise.all([
            reviewsRepository.findAllVisible(),
            reviewsRepository.getAverageRating(),
        ]);

        return {
            reviews, average_rating: summary.average, total_reviews: summary.total
        };
    },

    async getAllReviews() {
        return await reviewsRepository.findAll();
    },

    async getMyReviews(userId: string) {
        return await reviewsRepository.findByUserId(userId);
    },

    async create(data: CreateReviewDTO) {

        if (data.rating === undefined || data.rating === null) {
            throw { status: 400, message: 'La calificación es obligatoria' };
        }

        if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
            throw { status: 400, message: 'La calificación debe ser un número entero entre 1 y 5' };
        }

        const isEligible = await reviewsRepository.hasCompletedDeliveryOrder(data.user_id);

        if (!isEligible) {
            throw { status: 403, message: 'Solo puedes dejar una reseña si has completado al menos un pedido a domicilio con nosotros. ¡Esperamos verte pronto!'};
        }

        return await reviewsRepository.create(data);
    },

    async setVisibility(id: string, isVisible: boolean) {

        const review = await reviewsRepository.findById(id);

        if (!review) throw { status: 404, message: 'Reseña no encontrada' };

        return await reviewsRepository.setVisibility(id, isVisible);
    },

    async checkEligibility(userId: string) {

        const hasCompletedOrder = await reviewsRepository.hasCompletedDeliveryOrder(userId)
        return { hasCompletedOrder };
    }
};

export default reviewsService;