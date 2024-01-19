const autoBind = require("auto-bind");
const Utils = require("../../utils/index.js");

class SongHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        autoBind(this);
    }

    async postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const songId = await this._service.addSong(request.payload);

        const response = h.response({
            status: 'success',
            data: {
                songId,
            }
        })

        response.code(201);
        return response;
    }

    async getSongsHandler(request, h) {
        const { title, performer } = request.query;
        const songs = await this._service.getAllSong({ title, performer });

        return {
            status: 'success',
            data: {
                songs: songs?.map((song) => Utils.restructSong(song))
            }
        }
    }

    async getSongByIdHandler(request, h) {
        const { id } = request.params;
        const song = await this._service.getSongById(id);

        return {
            status: 'success',
            data: {
                song,
            }
        }
    }

    async putSongByIdHandler(request, h) {
        const { id } = request.params;
        this._validator.validateSongPayload(request.payload);
        await this._service.updateSong(id, request.payload);

        return {
            status: "success",
            message: 'Berhasil mengubah lagu',
        };
    }

    async deleteSongByIdHandler(request, h) {
        const { id } = request.params;
        await this._service.deleteSong(id);

        return {
            status: 'success',
            message: 'Berhasil menghapus lagu',
        };
    }
}

module.exports =  SongHandler;