const ClientError = require("../../exceptions/ClientError.js");
const { albumPayloadSchema } = require("./schema.js");

const validatorAlbum = {
    validateAlbumPayload: (payload) => {
        const validationResult = albumPayloadSchema.validate(payload);
        if(validationResult.error) {
            throw new ClientError(validationResult.error.message);
        }
    }
}

module.exports =  validatorAlbum;