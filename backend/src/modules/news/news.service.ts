import newsRepository from "./news.repository";

export interface CreateNewsDTO {
    author_id: string;
    title: string;
    body: string;
}

export interface UpdateNewsDTO {
    title?: string;
    body?: string;
}

const newsService = {

    async getPublicNews() {
        return await newsRepository.findAllPublished();
    },

    async getPublicNewsById(id: string) {

        const news = await newsRepository.findPublishedById(id);

        if (!news) throw { status: 404, message: 'Noticia no encontrada' };
        return news;
    },

    async getAllNews() {
        return await newsRepository.findAll();
    },

    async create(data: CreateNewsDTO) {
        
        if (!data.title || data.title.trim().length === 0) {
            throw { status: 400, message: 'El título es obligatorio' };
        }

        if (data.title.length > 255) {
            throw { status: 400, message: 'El título no puede exceder los 255 caracteres' };
        }

        if (!data.body || data.body.trim().length === 0) {
            throw { status: 400, message: 'El contenido de la noticia es obligatorio'};
        }

        return await newsRepository.create({
            author_id: data.author_id,
            title: data.title.trim(),
            body: data.body.trim(),
        });
    },

    async update(id: string, data: UpdateNewsDTO) {

        const news = await newsRepository.findById(id);

        if (!news) throw { status: 404, message: 'Noticia no encontrada'};

        if (data.title && data.title.length > 255) {
            throw { status: 400, message: 'El título no puede exceder los 255 caracteres' };
        }

        return await newsRepository.update(id, {
            title: data.title?.trim(),
            body: data.body?.trim(),
        });
    },

    async publish(id: string) {

        const news = await newsRepository.findById(id);

        if (!news) throw { status: 404, message: 'Noticia no encontrada'};

        if (news.is_published) {
            throw { status: 400, message: 'Esta noticia ya está publicada' };
        }

        return await newsRepository.publish(id);
    },

    async unpublish(id: string) {

        const news = await newsRepository.findById(id);

        if (!news) throw { status: 404, message: 'Noticia no encontrada' };

        if (!news.is_published) {
            throw { status: 400, message: 'Esta noticia ya está despublicada'};
        }

        return await newsRepository.unpublish(id);
    },

};

export default newsService;