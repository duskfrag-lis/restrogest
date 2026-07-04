import restaurantInfoRepository from "./restaurant_info.reporisoty";

export interface UpdateRestaurantInfoDTO {

    name?: string;
    description?: string;
    address?: string; 
    phone?: string;
    email?: string;
    schedule?: object;
    social_links?: object;
}

const restaurantInfoService = {

    async getInfo() {

        const info = await restaurantInfoRepository.find();

        if (!info) throw { status: 404, message: 'Información del restaurante no configurada' };

        return info;
    },

    async updatedInfo(data: UpdateRestaurantInfoDTO) {

        if (data.name !== undefined && data.name.trim().length === 0) {
            throw { status: 400, message: 'El nombre no puede estar vacío' };
        }

        if (data.email !== undefined && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            throw { status: 400, message: 'El formato de correo electrónico no es válido'};
        }

        return await restaurantInfoRepository.update(data);
    },
};

export default restaurantInfoService;