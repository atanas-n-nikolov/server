import i18next from '../i18n.js';

export default async function getError(error) {
    if (error.statusCode) {
        return {
            message: error.message || i18next.t('unexpectedError'),
            statusCode: error.statusCode,
        };
    }

    switch (error.name) {
        case 'ValidationError':
            return {
                message: Object.values(error.errors)[0]?.message || i18next.t('validationError'),
                statusCode: 400,
            };
        case 'CastError':
            return {
                message: i18next.t('invalidDataFormat'),
                statusCode: 400,
            };
        case 'MongoError':
            return {
                message: i18next.t('databaseError'),
                statusCode: 500,
            };
        case 'NotFound':
            return {
                message: i18next.t('resourceNotFound'),
                statusCode: 404,
            };
        default:
            return {
                message: error.message || i18next.t('unexpectedError'),
                statusCode: 500,
            };
    }
}

