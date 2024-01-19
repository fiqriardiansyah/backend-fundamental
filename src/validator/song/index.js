const ClientError = require("../../exceptions/ClientError.js");
const { songPayloadSchema } = require("./schema.js");

const validatorSong = {
    validateSongPayload: (payload) => {
        const validationResult = songPayloadSchema.validate(payload);
        if(validationResult.error) {
            throw new ClientError(validationResult.error.message);
        }
    }
}

module.exports =  validatorSong;