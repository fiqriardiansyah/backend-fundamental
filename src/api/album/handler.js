const autoBind = require('auto-bind');
const Utils = require('../../utils/index.js');

class AlbumHandler {
    constructor(service, validator, songService) {
        this._service = service;
        this._validator = validator;
        this._songService = songService;
        autoBind(this);
    }

    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const albumId = await this._service.addAlbum(request.payload);

        const response = h.response({
            status: 'success',
            data: {
                albumId,
            },
        });
        response.code(201);
        return response;
    }

    async getAlbumByIdHandler(request, h) {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        const songs = await this._songService.getSongByAlbumId(id);

        return {
            status: 'success',
            data: {
              album: {
                ...album,
                songs: songs.map((song) => Utils.restructSong(song)),
              }
            },
        };
    }

    async deleteAlbumByIdHandler(request, h) {
        const { id } = request.params;
        await this._service.deleteAlbum(id);

        return {
            status: 'success',
            message: 'Berhasil menghapus album'
        }
    }

    async putAlbumByIdHandler(request, h) {
        const { id } = request.params;
        this._validator.validateAlbumPayload(request.payload);
        await this._service.updateAlbum(id, request.payload);

        return {
            status: 'success',
            message: 'Berhasil mengubah album'
        };
    }
}

module.exports =  AlbumHandler;