const dotenv = require('dotenv')
const Hapi = require('@hapi/hapi')
const albumPlugin = require('./api/album/index.js')
const songPlugin = require('./api/song/index.js')
const AlbumService = require('./service/postgres/album.js')
const SongService = require('./service/postgres/song.js')
const albumValidator = require('./validator/album/index.js')
const songValidator = require('./validator/song/index.js')
const ClientError = require('./exceptions/ClientError.js')

dotenv.config();

const init = async () => {
    const albumService = new AlbumService();
    const songService = new SongService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if(response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        return h.continue
    })

    await server.register([
        {
            plugin: albumPlugin,
            options: {
                service: albumService,
                validator: albumValidator,
                songService: songService,
            }
        },
        {
            plugin: songPlugin,
            options: {
                service: songService,
                validator: songValidator
            }
        }
    ])

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
