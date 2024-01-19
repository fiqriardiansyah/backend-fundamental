const SongHandler = require("./handler.js");
const routes = require("./routes.js");

const songPlugin = {
    name: 'song',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const songHandler = new SongHandler(service, validator);
        server.route(routes(songHandler));
    },
};

module.exports = songPlugin;