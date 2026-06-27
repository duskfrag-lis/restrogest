import profileRepository from "./profile.repository";
import { uploadImage, deleteImage } from "../../config/cloudinary";
import bcrypt from "bcryptjs";
import fs from 'fs';


const profileService = {

    async getProfile(id: string) {

        const user = await profileRepository.findById(id);

        if (!user) throw { status: 404, message: 'Usuario no encontrado' };

        return user;
    },

    async updateProfile(id: string, data: {
        first_name?: string;
        last_name?: string;
        phone?: string;
    },
        filePath?: string
    ) {

        const user = await profileRepository.findById(id);

        if (!user) throw { status: 404, message: 'Usuario no encontrado' };

        let photo_url: string | undefined;

        if (filePath) {

            if (user.photo_url) {
                await deleteImage(user.photo_url).catch(() => null);
            }

            photo_url = await uploadImage(filePath, 'profiles');

            fs.unlinkSync(filePath);
        }

        const updated = await profileRepository.updateProfile(id, { ...data, photo_url });
        return updated;
    },

    async changePassword(id: string, currentPassword: string, newPassword: string) {

        const userPassword = await profileRepository.getPassword(id);
        if (!userPassword) throw { status: 404, message: 'Usuario no encontrado' };

        const isValid = await bcrypt.compare(currentPassword, userPassword.password_hash);
        if (!isValid) throw { status: 401, message: 'Contraseña actual incorrecta' };

        if (newPassword.length < 8) {
            throw { status: 400, message: 'La nueva contraseña debe tener al menos 8 caracteres.' };
        }

        const password_hash = await bcrypt.hash(newPassword, 10);

        await profileRepository.updatePassword(id, password_hash);

        return { message: 'Contraseña actualizada correctamente' };

    },

    async deleteAccount(id: string) {
        
        const user = await profileRepository.findById(id);

        if (!user) throw { status: 404, message: 'Usuario no encontrado' };

        if (user.role === 'administrador') {
            throw { status: 403, message: 'Un administrador no puede eliminar su propia cuenta' };
        }

        await profileRepository.softDelete(id);

        return { message: 'Cuenta eliminada correctamente' };
    }
};

export default profileService;