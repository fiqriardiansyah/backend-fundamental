const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError.js");
const InvariantError = require('../../exceptions/InvarianError.js');
const { Pool } = require("pg");

class SongService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong(song) {
        const id = nanoid(16);

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, song.title, song.year, song.genre, song.performer, song?.duration, song?.albumId]
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAllSong({ title, performer }) {
        let query = 'SELECT * FROM songs';
        if(title && performer) {
            query = query + ` WHERE title ILIKE '%${title}%' AND performer ILIKE '%${performer}%'`
        } else if(title) {
            query = query + ` WHERE title ILIKE '%${title}%'`;
        } else if(performer) {
            query = query + ` WHERE performer ILIKE '%${performer}%'`;
        }

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getSongByAlbumId(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE albumId = $1',
            values: [id],
        }

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        return result.rows[0]
    }

    async updateSong(id, payload) {

        const query = {
            text: 'UPDATE songs SET title = $2, year = $3, genre = $4, performer = $5, duration = $6, albumid = $7 WHERE id = $1 RETURNING id',
            values: [id, payload?.title, payload?.year, payload?.genre, payload?.performer, payload?.duration, payload?.albumId],
        }

        await this.getSongById(id);

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }
    }

    async deleteSong(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
        }
    }
}

module.exports =  SongService