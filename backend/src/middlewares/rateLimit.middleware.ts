import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
    standardHeaders: true,
    legacyHeaders: false,

});

export const strictRateLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
    standardHeaders: true,
    legacyHeaders: false,

})