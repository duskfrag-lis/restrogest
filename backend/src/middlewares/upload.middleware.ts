import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({

    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (_req, file, cb) => {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {

    const allowedType = ['image/jpeg', 'image/png', 'image/webp' ];

    if (allowedType.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes en formato JPEG, PNG o WebP'));
    }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, }, }); // 5MB maximo