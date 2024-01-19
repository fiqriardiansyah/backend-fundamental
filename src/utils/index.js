const Utils = {
    restructSong(song){
        return {
            id: song.id,
            title: song.title,
            performer: song.performer
        }
    }
}

module.exports =  Utils;