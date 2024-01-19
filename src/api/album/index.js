const AlbumHandler = require('./handler.js');
const routes = require('./routes.js');

const albumPlugin = {
    name: 'album',
    version: '1.0.0',
    register: async (server, { service, validator, songService }) => {
        const albumHandler = new AlbumHandler(service, validator, songService);
        server.route(routes(albumHandler));
    },
};

module.exports = albumPlugin;