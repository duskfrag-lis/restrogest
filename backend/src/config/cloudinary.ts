import { v2 as cloudinary } from 'cloudinary';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Faltan variables de entorno de Cloudinary');
}

cloudinary.config({

    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath: string, folder: string): Promise<string> => {

    const result = await cloudinary.uploader.upload(filePath, {
        folder: `restrogest/${folder}`,
        transformation:[

            { width: 800, height: 600, crop: 'fill' },
            { quality: 'auto', fetch_format: 'auto' },
        ],
    });

    return result.secure_url;
};

export const deleteImage = async (imageUrl: string): Promise<void> => {

    const parts = imageUrl.split('/');
    const fileWithExt = parts[parts.length - 1];
    const fileName = fileWithExt.split('.')[0];
    const folder = parts[parts.length - 2];
    const publicId = `restrogest/${folder}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);

};

export default cloudinary;